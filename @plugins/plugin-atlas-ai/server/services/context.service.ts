import { Strapi } from "@strapi/strapi";

export type GetContextResponse = {
  // dynamic: Array<string>;
  // static: Array<string>;
  dynamic: any;
  static: any;
};

export default ({ strapi }: { strapi: Strapi }) => ({
  async getContext(ctx): Promise<GetContextResponse> {
    if (!strapi?.entityService) return { dynamic: [], static: [] };

    let _dynamic: string[] = [];
    let _static: string[] = [];

    const staticSnippets = await strapi.entityService.findMany(
      "api::static-llm-snippet.static-llm-snippet",
      {
        populate: {
          llmSnippet: true,
        },
      }
    );

    // strapi.log.debug(JSON.stringify({ staticSnippets }));

    const dynamicSnippets = await strapi.entityService.findMany(
      "api::llm-snippet.llm-snippet"
    );

    _dynamic = ((dynamicSnippets as any[]) || []).flatMap((snippet) => {
      return snippet?.data || [];
    });

    // @ts-ignore
    _static = ((staticSnippets?.llmSnippet as any[]) || []).flatMap(
      (snippet) => {
        return snippet?.snippetContent || [];
      }
    );

    return {
      static: _static,
      dynamic: _dynamic,
    };
  },
});
