import styled from "styled-components";
import { Grid } from "@strapi/design-system";

const atlasGridAttributes = {};

const AtlasGrid = styled(Grid).attrs(({ className, ...props }) => {
  return {
    className: `${className} atlasInputGrid`,
    ...atlasGridAttributes,
    ...props,
  };
})`
  padding-top: 0;
`;

export default AtlasGrid;
export { AtlasGrid };
