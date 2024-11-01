const { exec } = require("child_process");

function tab(n = 1) {
  return "  ".repeat(n) + `> `;
}

async function execute(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        // Instead of rejecting, log the stderr output but resolve the promise
        console.error(`Warning: ${stderr}`);
      }
      resolve(stdout);
    });
  });
}

const plugins = [
  "plugin-atlas-socketio",
  "plugin-atlas-ckeditor",
  "plugin-atlas-core",
  "plugin-atlas-docs",
  "plugin-atlas-ai",
];
// npm i @notum-cz/strapi-plugin-record-locking@1.3.15

// Entry
(async () => {
  for (const plugin of plugins) {
    try {
      console.log(tab(2) + `[Iliad] Building ${plugin}...`);
      const _start = performance.now();

      // Execute the build command for each plugin
      await execute(
        `cd src/plugins/${plugin} && npm i && npm run build && cd ../../../`
      );

      console.log(
        tab(3) +
          `[Iliad] ${plugin} built successfully in ${Math.round(
            performance.now() - _start
          )}ms`
      );
    } catch (error) {
      console.error(tab(3) + `[Iliad] Failed to build ${plugin}: ${error}`);
    }
  }
})();
