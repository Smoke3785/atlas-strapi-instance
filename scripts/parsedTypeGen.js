const strapi = require("iliad-strapi-adapter");
const path = require("path");
const fs = require("fs");

const frontendTypesFolder =
  "C:\\Users\\owenr\\Documents\\GitHub\\gcollective-website-next\\src\\@types";

const typesDirectory = path.join(process.cwd(), "./types/generated");
const typeFiles = fs.readdirSync(typesDirectory);

const types = typeFiles.map((file) => `${typesDirectory}/${file}`);

console.log(types);

// strapi.StrapiUtils.generateParsedTypes(types, frontendTypesFolder);
