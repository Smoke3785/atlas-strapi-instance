import { prefixFileUrlWithBackendUrl, useLibrary } from "@strapi/helper-plugin";
import PropTypes from "prop-types";
import React from "react";

const MediaLib = ({ isOpen, onChange, onToggle }) => {
  const { components } = useLibrary();
  const MediaLibraryDialog = components["media-library"];

  const handleSelectAssets = (files) => {
    const formattedFiles = files.map((f) => {
      console.log("handleSelectAssets", { f });

      let formatted = {
        url: prefixFileUrlWithBackendUrl(f.url),
        alt: f.alternativeText || f.name,
        mime: f.mime,
      };

      // A list of keys we want to pass from the Strapi Media Asset to the CKEditor
      for (const key of ["id", "placeholder", "width", "height"]) {
        if (f[key]) {
          formatted[key] = f[key];
        }
      }

      console.log("handleSelectAssets", { formatted });

      return formatted;
    });

    onChange(formattedFiles);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <MediaLibraryDialog
      onClose={onToggle}
      onSelectAssets={handleSelectAssets}
    />
  );
};

MediaLib.defaultProps = {
  isOpen: false,
  onChange: () => {},
  onToggle: () => {},
};

MediaLib.propTypes = {
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
};

export default MediaLib;
