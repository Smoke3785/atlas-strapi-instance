import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Stack } from "@strapi/design-system/Stack";
import {
  Field,
  FieldHint,
  FieldError,
  FieldLabel,
} from "@strapi/design-system/Field";
import PropTypes from "prop-types";

import { getGlobalStyling } from "./GlobalStyling";

import Configurator from "./Configurator";
import MediaLib from "../MediaLib";

import sanitize from "./utils/utils";
import { BalloonEditor } from "ckeditor5";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const CKEditorInput = ({
  labelAction,
  description,
  attribute,
  intlLabel,
  onChange,
  disabled,
  required,
  value,
  error,
  name,
  ...props
}) => {
  // Extract configuration
  const { maxLengthCharacters: maxLength, ...options } = attribute.options;
  const configurator = new Configurator({ options, maxLength });
  const editorConfig = configurator.getEditorConfig();
  const { formatMessage } = useIntl();

  // Retrieve local theme
  const strapiTheme = localStorage.getItem("STRAPI_THEME");
  const GlobalStyling = getGlobalStyling(strapiTheme);

  // State
  const [mediaLibVisible, setMediaLibVisible] = useState(false); // Media Library Window State
  const [editorInstance, setEditorInstance] = useState(false); // Editor state
  const wordCounter = useRef(null);

  // Media Library Window Handlers
  const handleToggleMediaLib = () => setMediaLibVisible((prev) => !prev);

  const handleChangeAssets = (assets) => {
    let imageHtmlString = "";

    assets.map((asset) => {
      if (asset.mime.includes("image")) {
        let attributes = [];

        // Default
        const url = sanitize(asset.url);
        const alt = sanitize(asset.alt);

        attributes.push(`src="${url}"`);
        attributes.push(`alt="${alt}"`);

        // if (asset?.width) {
        //   attributes.push(`width="${sanitize(asset.width)}"`);
        // }

        // if (asset?.height) {
        //   attributes.push(`height="${sanitize(asset.height)}"`);
        // }

        if (asset?.placeholder) {
          attributes.push(`placeholder="${sanitize(asset.id)}"`);
        }

        if (asset?.id) {
          attributes.push(`data-strapi_id="${sanitize(asset.id)}"`);
          attributes.push(`data-id="${sanitize(asset.id)}"`);
          attributes.push(`dataId="${sanitize(asset.id)}"`);
          attributes.push(`id="${sanitize(asset.id)}"`);
        }

        let attributesString = attributes.join(" ");
        let htmlString = `<img ${attributesString} />`;

        console.log({
          attributesString,
          attributes,
          htmlString,
          asset,
        });

        imageHtmlString += htmlString;
      }
    });

    const viewFragment = editorInstance.data.processor.toView(imageHtmlString);
    const modelFragment = editorInstance.data.toModel(viewFragment);
    editorInstance.model.insertContent(modelFragment);

    console.log("dataProcessed", { viewFragment, modelFragment });

    handleToggleMediaLib();
  };

  return (
    <Field
      hint={description && formatMessage(description)}
      error={error} // GenericInput calls formatMessage and returns a string for the error
      name={name}
      id={name}
    >
      <Stack spacing={1}>
        <FieldLabel action={labelAction} required={required}>
          {formatMessage(intlLabel)}
        </FieldLabel>
        <GlobalStyling />
        <CKEditor
          // editor={BalloonBlockEditor}
          editor={BalloonEditor}
          disabled={disabled}
          data={value}
          onReady={(editor) => {
            const wordCountPlugin = editor.plugins.get("WordCount");
            const wordCountWrapper = wordCounter.current;

            wordCountWrapper.appendChild(wordCountPlugin.wordCountContainer);

            const mediaLibPlugin = editor.plugins.get("strapiMediaLib");
            mediaLibPlugin.connect(handleToggleMediaLib);

            editor.model.schema.extend("imageBlock", {
              allowAttributes: ["data-id"],
            });
            editor.model.schema.extend("imageInline", {
              allowAttributes: ["data-id"],
            });

            console.log("definitions", [
              editor.model.schema.getDefinition("imageBlock"),
              editor.model.schema.getDefinition("imageInline"),
            ]);

            setEditorInstance(editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange({ target: { name, value: data } });

            console.log({ onChange: { target: { name, value: data } } });

            const wordCountPlugin = editor.plugins.get("WordCount");
            const numberOfCharacters = wordCountPlugin.characters;

            if (numberOfCharacters > maxLength) {
              console.log("Too long");
            }
          }}
          config={editorConfig}
        />
        <div ref={wordCounter}></div>
        <FieldHint />
        <FieldError />
      </Stack>
      <MediaLib
        onToggle={handleToggleMediaLib}
        onChange={handleChangeAssets}
        isOpen={mediaLibVisible}
      />
    </Field>
  );
};

CKEditorInput.defaultProps = {
  description: null,
  labelAction: null,
  disabled: false,
  required: false,
  error: null,
  value: "",
};

CKEditorInput.propTypes = {
  intlLabel: PropTypes.object.isRequired,
  attribute: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  labelAction: PropTypes.object,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  value: PropTypes.string,
};

export default CKEditorInput;
