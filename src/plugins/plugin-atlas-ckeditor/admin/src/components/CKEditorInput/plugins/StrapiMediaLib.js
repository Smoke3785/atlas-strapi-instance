// const { ButtonView } = window.CKEDITOR;
// const { Plugin } = window.CKEDITOR;

import { ButtonView, Plugin } from "ckeditor5";

const mediaLibIcon =
  '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
  '<path fill-rule="evenodd" clip-rule="evenodd" d="M4.3.6a.9.9 0 100 1.8h15.311a.9.9 0 100-1.8H4.301zm17.1 3.7A1.6 1.6' +
  " 0 0123 5.9v15.5a1.6 1.6 0 01-1.6 1.6H2.6A1.601 1.601 0 011 21.4V8 5.915C1 5.03 1.716 4.3 2.6" +
  " 4.3h18.8zM5.032 19.18h14.336l-3.136-3.205-1.792 1.831-4.032-4.12-5.376 5.494zm13.44-8.697c0 " +
  '1.282-.985 2.289-2.24 2.289-1.254 0-2.24-1.007-2.24-2.29 0-1.281.986-2.288 2.24-2.288 1.255 0 2.24 1.007 2.24 2.289z">' +
  "</path></svg>";

function generateRandomString(length = 3) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

// DEFAULT SCHEMAS LIST
// https://ckeditor.com/docs/ckeditor5/33.0.0/framework/guides/deep-dive/schema.html#defining-additional-semantics
// Model == Data
// View == DOM
// Upcast == DOM -> Data
// Downcast == Data -> DOM

export class StrapiMediaLib extends Plugin {
  schemaElements = [
    "imageInline",
    "imageBlock",
    "heading1",
    "heading2",
    "heading3",
  ];

  htmlView = "data-id";
  model = "dataId";

  uid = generateRandomString();
  atomic = 0;
  toc = [];

  // _this = this;

  /**
   * Strapi function used to show media library modal.
   * Should be provided via connect method before using toggle method.
   *
   * @type {function|null}
   */
  strapiToggle = null;

  static get pluginName() {
    return "strapiMediaLib";
  }

  init() {
    this._defineSchema();
    this._defineConverters();

    const editor = this.editor;
    editor.ui.componentFactory.add("strapiMediaLib", () => {
      const button = new ButtonView();

      button.set({
        label: "Media Library",
        icon: mediaLibIcon,
        tooltip: true,
      });

      button.on("execute", this.toggle.bind(this));

      return button;
    });
  }

  connect(strapiToggle) {
    if (typeof strapiToggle !== "function") {
      throw new Error("Input parameter for toogle should be a function");
    }

    this.strapiToggle = strapiToggle;
  }

  toggle() {
    if (typeof this.strapiToggle !== "function") {
      throw new Error(
        "Strapi media library toggle function not connected. Use connect function first"
      );
    }

    this.strapiToggle();
  }

  _defineSchema() {
    const { schema } = this.editor.model;

    this.schemaElements.forEach((schemaElement) => {
      schema.extend(schemaElement, {
        allowAttributes: this.model,
      });
    });
  }

  head({ order = 0 }, ctx) {
    const key = `${ctx.uid}-${ctx.atomic}-${order}`;
    ctx.atomic += 1;

    ctx.toc.push({
      order: ctx.order,
      key,
    });

    console.log("head", {
      order,
      key,
      ctx,
    });

    return (evt, data, conversionApi) => {
      console.log("head - callback", {
        atomic: ctx.atomic,
        uid: ctx.uid,
        conversionApi,
        order,
        data,
        evt,
        key,
        ctx,
      });

      conversionApi.writer.setAttribute(ctx.model, key, data.item);
    };
  }

  _defineConverters() {
    const { conversion } = this.editor;

    // Convert asset id from model to view
    conversion.for("upcast").attributeToAttribute({
      view: {
        key: this.htmlView,
      },
      model: {
        key: this.model,
      },
    });

    // Convert asset id from view to model
    conversion.for("downcast").attributeToAttribute({
      view: this.htmlView,
      model: this.model,
    });

    // Apply asset id to all headings
    // conversion.for("dataDowncast").add((dispatcher) => {
    //   dispatcher.on("insert:heading1", this.head({ order: 1 }, this));
    //   dispatcher.on("insert:heading2", this.head({ order: 2 }, this));
    //   dispatcher.on("insert:heading3", this.head({ order: 3 }, this));
    //   dispatcher.on("insert:heading4", this.head({ order: 4 }, this));
    // });
  }
}
