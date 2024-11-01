const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const baseDir = process.cwd();

function tab(n = 1) {
  return "  ".repeat(n) + `> `;
}

async function execute(command) {
  const start = performance.now();
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject([error, performance.now() - start]);
      }
      if (stderr) {
        reject([stderr, performance.now() - start]);
      }
      resolve([stdout, performance.now() - start]);
    });
  });
}

const start = performance.now();

function findPlugins() {
  const plugins = fs.readdirSync(path.join(baseDir, "src", "plugins"));
  return plugins.filter((plugin) => {
    const packageJson = fs.readFileSync(
      path.join(baseDir, "src", "plugins", plugin, "package.json")
    );
    const hasBuild = !!JSON.parse(packageJson)?.scripts?.build;
    if (!hasBuild) {
      console.log(tab(2) + `[Iliad] Skipping ${plugin}...`);
    }

    return hasBuild;
  });
}

// Entry
(async () => {
  console.log(`[Iliad] Running custom build script...`);
  console.log(tab() + `[Iliad] Searching for plugins...`);

  const plugins = findPlugins();

  console.log(tab() + `[Iliad] found ${plugins?.length} plugins...`);

  if (plugins?.length) {
    for await (const plugin of plugins) {
      console.log(tab(2) + `[Iliad] Building ${plugin}...`);
      const _start = performance.now();
      await execute(
        `cd src/plugins/${plugin} && npm i && npm run build && cd ../../../`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(error);
            return;
          }
          if (stderr) {
            console.error(stderr);
            return;
          }
          console.log(
            tab(3) +
              `[Iliad] ${plugin} built successfully in ${Math.round(
                performance.now() - _start
              )}ms`
          );
        }
      );
    }
  }

  // && node strapi-transplant.js && strapi build
  console.log(tab() + `[Iliad] Running transplant`);
  await execute(
    "node scripts/strapi-transplant.js",
    (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return;
      }
      if (stderr) {
        console.error(stderr);
        return;
      }
      console.log(tab() + `[Iliad] Transplant successful`);
    }
  );

  console.log(tab() + `[Iliad] Building Strapi...`);
  await execute("strapi build", (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }
    if (stderr) {
      console.error(stderr);
      return;
    }
    console.log(tab() + `[Iliad] Strapi build successful`);
  });

  console.log(
    `[Iliad] Custom build script completed in ${Math.round(
      performance.now() - start
    )}ms`
  );
})();
