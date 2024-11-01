import type { Schema, Attribute } from '@strapi/strapi';

export interface LlmLlmSnippet extends Schema.Component {
  collectionName: 'components_llm_llm_snippets';
  info: {
    displayName: 'LLM Snippet';
    icon: 'alien';
  };
  attributes: {
    snippetContent: Attribute.Text;
  };
}

export interface MiscSocialMedia extends Schema.Component {
  collectionName: 'components_misc_social_medias';
  info: {
    displayName: 'Social Media';
    icon: 'manyToMany';
  };
  attributes: {
    socialMediaProvider: Attribute.String;
    socialMediaLink: Attribute.String;
    socialMediaIcon: Attribute.String &
      Attribute.CustomField<'plugin::react-icons.icon'>;
  };
}

export interface SiteConfigContactInfo extends Schema.Component {
  collectionName: 'components_site_config_contact_infos';
  info: {
    displayName: 'Contact Info';
    icon: 'phone';
  };
  attributes: {
    address: Attribute.String;
    zipCode: Attribute.String;
    city: Attribute.String;
    state: Attribute.String;
    emailAddress: Attribute.String;
    phoneNumber: Attribute.String;
    availability: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'llm.llm-snippet': LlmLlmSnippet;
      'misc.social-media': MiscSocialMedia;
      'site-config.contact-info': SiteConfigContactInfo;
    }
  }
}
