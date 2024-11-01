const fs = require("fs");
const path = require("path");
const start = performance.now();

const root_path = process.cwd();
console.log(`[Iliad] Running from ${root_path}`);

function fixPath(pathString) {
  const fixed = path.join(root_path, pathString);
  // console.log(`[Iliad] Fixing path: ${pathString} -> ${fixed}`);
  return fixed;
}

console.log(
  `[Iliad] Transplanting strapi patches from @strapi to node_modules/@strapi`
);

// Copy atlas.json
try {
  fs.copyFileSync("config/atlas.json", "@strapi/config/atlas.json");
} catch (error) {
  console.log(`[Iliad] Error copying atlas.json: ${error.message}`);
}

// const overwrittenModules = fs.readdirSync("@strapi");

// for (const module of overwrittenModules) {
//   console.log(`[Iliad] Deleting existing module: ${module}`);
//   fs.rmSync(`node_modules/@strapi/${module}`, { recursive: true, force: true });
// }

// Remove existing node_modules/@strapi directory
const destDir = fixPath("node_modules/@strapi");
if (fs.existsSync(destDir)) {
  // console.log(`[Iliad] Removing existing directory: ${destDir}`);
  // fs.rmSync(destDir, { recursive: true, force: true });
}
const srcDir = fixPath("@strapi");

try {
  fs.copyFileSync("config/atlas.json", "@strapi/config/atlas.json");
} catch (error) {
  console.log(`[Iliad] Error copying atlas.json: ${error.message}`);
}
try {
  // Copy the @strapi directory to node_modules/@strapi, including node_modules directories
  fs.cpSync(
    srcDir,
    destDir,
    {
      recursive: true,
      force: true,
      filter: (src, dest) => {
        return !path.relative(fixPath("@strapi"), src).includes("node_modules");
        // const relativePath = path.relative(srcDir, src);
        // const pathSegments = relativePath.split(path.sep);
        // if (pathSegments.includes("node_modules")) {
        //   return false;
        // }
        // return true;
      },
      // dereference: true,
    },
    (src, dest) => {
      return !src.includes("node_modules");

      // console.log(`[Iliad] Copied ${src} to ${dest}`);
    }
  );
} catch (error) {
  console.log(
    `[Iliad] Error copying @strapi to node_modules: ${error.message}`
  );
}

console.log(
  `[Iliad] Deleting build cache from node_modules/@strapi/admin/build and /.cache`
);

let cacheClear = [];

// Remove build cache
try {
  fs.rmSync(fixPath("node_modules/@strapi/admin/build"), {
    recursive: true,
    force: true,
  });
} catch (error) {
  cacheClear.push(
    `[Iliad] Warning: Error deleting UI build cache: ${error.message}`
  );
}

// Remove .cache
try {
  fs.rmSync(fixPath(".cache"), { recursive: true, force: true });
} catch (error) {
  cacheClear.push(`[Iliad] Warning: Error deleting .cache: ${error.message}`);
}

if (cacheClear.length > 0) {
  for (const message of cacheClear) {
    console.log(message);
  }
}

console.log(
  `[Iliad] Transplant completed in ${Math.round(performance.now() - start)}ms`
);
