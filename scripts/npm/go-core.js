const _console = require("../ii-log").create();
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const {
  getLatestVersion,
  setHeapSize,
  setRegistry,
  execute,
  sleep,
} = require("../utils");

const build_start = performance.now();
const base_dir = process.cwd();
const SLEEP_TIME = 500;

const NPM_REGISTRY = "https://localhost:4873";
const PACKAGE_MANAGERS = {
  yarn: {
    install: "yarn install",
    build: "yarn build",
    start: "yarn start",
  },
  npm: {
    install: "npm install",
    build: "npm run build",
    start: "npm run dev",
  },
};

const cleanDirectories = [
  "node_modules",
  ".cache",
  "dist",
  "yarn.lock",
  "package-lock.json",
];

const atlasDependencies = ["@strapi/admin"];

// =====================================================================================================================
// Build Steps
// =====================================================================================================================

// 0. Clean installation
async function cleanInstallation() {
  const _stage_start = performance.now();
  _console.lvl(1).log("Cleaning installation...");

  try {
    for (let dir of cleanDirectories) {
      const _dir = path.join(base_dir, dir);
      if (fs.existsSync(_dir)) {
        _console.lvl(2).log(`Cleaning ${dir}...`);
        fs.rmSync(_dir, { recursive: true });
        _console.lvl(3).success(`Cleaned ${dir}!`);
      } else {
        _console.lvl(2).warn(`${dir} not found. Skipping...`);
      }
    }

    _console.timestamp(_stage_start).lvl(2).success("Cleaned installation!");
  } catch (e) {
    _console.lvl(2).error("Failed to clean installation.", e);
    process.exit(1);
  } finally {
    _console.nl();
  }
}

// 1. Fetch root package.json
function fetchRootPackageJson() {
  const _stage_start = performance.now();

  _console.lvl(1).log("Fetching root package.json...");

  try {
    const _packageJson = JSON.parse(
      fs.readFileSync(path.join(base_dir, "package.json"))
    );
    _console.timestamp(_stage_start).lvl(2).success();
    return _packageJson;
  } catch (e) {
    _console
      .timestamp(_stage_start)
      .lvl(2)
      .error("Failed to fetch root package.json.", e);
    process.exit(1);
  } finally {
    _console.nl();
  }
}

// 1.1 Patch package.json

async function patchRootPackageJson(packageJson) {
  _console.lvl(1).log(`Fetching latest version of Atlas packages...`);
  let depedencies = {};
  let result;

  try {
    for (let dep of atlasDependencies) {
      let latestVersion = await getLatestVersion("@strapi/admin", NPM_REGISTRY);
      depedencies[dep] = `${latestVersion}`;
    }
  } catch (e) {
    _console
      .lvl(1)
      .error("Failed to fetch latest version of Atlas packages.", e);
    process.exit(1);
  }

  _console.lvl(1).log(`Patching root package.json...`);
  try {
    const _packageJson = { ...packageJson };

    _packageJson.overrides = {
      ...(_packageJson.overrides || {}),
      ...depedencies,
    };

    _packageJson.resolutions = {
      ...(_packageJson.resolutions || {}),
      ...depedencies,
    };

    for (let dep of atlasDependencies) {
      delete _packageJson.dependencies[dep];
    }

    fs.writeFileSync(
      path.join(base_dir, "package.json"),
      JSON.stringify(_packageJson, null, 2),
      "utf-8"
    );

    _console.lvl(2).success(`Patched root package.json!`);
    return _packageJson;
  } catch (e) {
    _console.lvl(2).error("Failed to patch root package.json.", e);
    process.exit(1);
  }
  return;
}

// 2. Find plugins
function findAtlasPlugins(overrides = {}) {
  const _stage_start = performance.now();
  _console.lvl(1).log("Searching for Atlas plugins...");
  try {
    const plugins = fs
      .readdirSync(path.join(base_dir, "src", "plugins"))
      .filter((dir) => {
        // We'll handle these later
        return !dir.includes("dependency-patched-plugins");
      });
    const atlasPlugins = plugins.map((plugin) => {
      const __stage_start = performance.now();
      _console.lvl(2).log("Found plugin:", plugin);
      _console.lvl(3).log("Reading package.json....");
      const packagePath = path.join(
        base_dir,
        "src",
        "plugins",
        plugin,
        "package.json"
      );
      const packageJson = JSON.parse(fs.readFileSync(packagePath));

      const hasBuild = !!packageJson?.scripts?.build;
      const name = packageJson?.name;

      const _plugin = {
        packagePath: packagePath,
        package: packageJson,
        hasBuild,
        name,
      };

      _console.timestamp(__stage_start).lvl(4).success();

      return _plugin;
    });
    _console
      .timestamp(_stage_start)
      .lvl(2)
      .success(`Found ${chalk.bold(atlasPlugins.length)} Atlas plugins.`);

    return atlasPlugins;
  } catch (e) {
    _console.lvl(2).error("Failed to find plugins.", e);
    process.exit(1);
  } finally {
    _console.nl();
  }
}

// 3. Find patched plugins - FUTURE
function findPatchedPlugins() {
  _console.lvl(1).warn("Patched plugins not implemented yet.").nl();

  return [];
}
// 4. Patch plugins
function patchPlugins(plugins, rootPackageJson) {
  const _stage_start = performance.now();
  _console.lvl(1).log("Patching plugin dependencies...");

  try {
    _console.lvl(2).log("Reading root package.json...");
    const overrides = rootPackageJson?.overrides;

    if (!overrides) {
      _console.lvl(2).warn("No overrides found in root package.json.");
      return;
    } else {
      _console
        .timestamp(_stage_start)
        .lvl(3)
        .success("Found overrides in root package.json.");
    }

    _console.lvl(2).log(`Patching plugins with overrides...`);

    for (let { package, packagePath, name } of plugins) {
      const __stage_start = performance.now();
      _console.lvl(3).log(`Applying patches to ${name}...`);

      let pluginOverrides = package?.overrides || {};
      package.overrides = { ...pluginOverrides, ...overrides };

      fs.writeFileSync(packagePath, JSON.stringify(package, null, 2), "utf-8");

      _console.timestamp(__stage_start).lvl(4).success(`Patched ${name}!`);
    }

    _console.timestamp(_stage_start).lvl(2).success("Patched plugins!");
  } catch (e) {
    _console.lvl(2).error("Failed to patch plugins.", e);
    process.exit(1);
  } finally {
    _console.nl();
  }
}

// 5. Install plugins
async function installPlugins(plugins) {
  const _stage_start = performance.now();
  _console.lvl(1).log("Installing plugin dependencies...");

  try {
    for (let { name } of plugins) {
      const __stage_start = performance.now();
      _console.lvl(2).log(`Installing ${name}...`);
      const pluginPath = path.join(base_dir, "src", "plugins", name);
      const { stdout, stderr } = await execute(
        `cd ${pluginPath} && ${PACKAGE_MANAGERS["npm"].install} && cd ../../../`
      );

      if (stderr) {
        _console.lvl(3).error("Failed to install plugin dependencies.", stderr);
        continue;
      }

      _console
        .timestamp(__stage_start)
        .lvl(3)
        .success(`Installed dependencies for ${name}!`);
    }

    _console
      .lvl(2)
      .timestamp(_stage_start)
      .success(
        `Installed depedencies for ${chalk.bold(plugins.length)} plugins!`
      );
  } catch (e) {
    _console.lvl(2).error("Failed to install plugins.", e);
    process.exit(1);
  } finally {
    _console.nl();
  }
}

// 6. Build plugins
async function buildPlugins(plugins) {
  const _stage_start = performance.now();
  _console.lvl(1).log("Building plugins...");

  try {
    for (let { name, hasBuild } of plugins) {
      if (!hasBuild) {
        _console.lvl(3).info(`Plugin ${name} has no build script. Skipping...`);
        continue;
      }

      const __stage_start = performance.now();
      _console.lvl(2).log(`Building ${name}...`);
      const pluginPath = path.join(base_dir, "src", "plugins", name);
      const { result, error } = await execute(
        `cd ${pluginPath} && ${PACKAGE_MANAGERS["npm"].build}`
      );

      if (error) {
        _console.lvl(3).error("Failed to build plugin.", stderr);
        continue;
      } else {
        // _console.lvl(3).log(result);
      }

      _console.timestamp(__stage_start).lvl(3).success(`Built ${name}!`);
    }

    _console
      .lvl(2)
      .timestamp(_stage_start)
      .success(`Built ${chalk.bold(plugins.length)} plugins!`);
  } catch (e) {
    _console.lvl(2).error("Failed to build plugins.", e);
    process.exit(1);
  } finally {
    _console.nl();
  }
}

// 7. Install root dependencies
async function installRoot(clean = false) {
  const _stage_start = performance.now();
  _console.lvl(1).log("Installing root dependencies...");

  const installCommand = clean ? "npm install" : "yarn install";
  try {
    const { result, error } = await execute(
      "npm install",
      _console.lvl(2),
      true
    );

    if (error) {
      con;
      _console.lvl(2).error("Failed to install root dependencies.", error);
    } else {
      _console
        .lvl(2)
        .timestamp(_stage_start)
        .success("Installed root dependencies!");
    }
  } catch (e) {
    _console.lvl(2).error("Failed to install root dependencies.", e);
    process.exit(1);
  } finally {
    _console.nl();
  }
}

// 8. Build root
async function buildRoot() {
  const _stage_start = performance.now();
  _console.lvl(1).log("Building root...");

  try {
    const { result, error } = await execute("npm run build", _console.lvl(2));

    if (error) {
      _console.lvl(2).error("Failed to build root.", stderr);
    } else {
      _console.lvl(2).timestamp(_stage_start).success("Built root!");
    }
  } catch (e) {
    _console.lvl(2).error("Failed to build root.", e);
    process.exit(1);
  } finally {
    _console.nl();
  }
}

// 9. Done, start server
async function startServer() {
  _console.lvl(1).log("Starting server...");
  const { stdout, stderr } = await execute(PACKAGE_MANAGERS["npm"].start);

  if (stderr) {
    _console.lvl(2).error("Failed to start server.", stderr);
  } else {
    _console.lvl(2).timestamp(_stage_start).success("Server started!");
  }
}

// =====================================================================================================================
// Main
// =====================================================================================================================

async function initLog(clean, lite) {
  // console.log(chalk.cyanBright(`====================================`));
  _console.nl().log("Running comprehensive build process...");
  if (lite) {
    _console.log("Running in lite mode, skipping plugin setup");
  }
  console.log(chalk.cyanBright(`====================================`));

  await sleep(SLEEP_TIME);
  _console.nl();

  return;
}

async function finalLog(_stage_start) {
  console.log(chalk.cyanBright(`====================================`));
  _console.timestamp(_stage_start).lvl(1).success("Build process completed!");
  _console.timestamp(build_start).lvl(1).success(`Total build time:`).nl();
}

async function action(options) {
  await setHeapSize(4096);
  const { clean = false, lite = false, cleanOnly = false, noInstall = false } = options || {};
  const _stage_start = performance.now();
  let patchedPackageJson;
  await initLog(clean, lite);

  // Set registry
  _console.lvl(1).log(`Setting registry to ${NPM_REGISTRY}...`);
  try {
    await setRegistry(NPM_REGISTRY);
  } catch (e) {
    _console.lvl(1).error("Failed to set registry.", e);
    process.exit(1);
  }
  _console.lvl(1).success("Registry set!");

  if (clean) {
    if (!cleanOnly) {
      // Fetch root package.json
      const rootPackageJson = fetchRootPackageJson();
      await sleep(SLEEP_TIME);

      // Patch root package.json
      patchedPackageJson = await patchRootPackageJson(rootPackageJson);
      await sleep(SLEEP_TIME);
    }

    await cleanInstallation();
    await sleep(SLEEP_TIME);
  }

  if (cleanOnly) {
    await finalLog(_stage_start);
    return;
  }

  if (clean) {
    // If we're cleaning, we need to install root first
    // Because plugins may rely on root dependencies
    await installRoot(true);
  }

  if (!lite) {
    if (!clean) {
      // Fetch root package.json
      const rootPackageJson = fetchRootPackageJson();
      await sleep(SLEEP_TIME);

      // Patch root package.json
      patchedPackageJson = await patchRootPackageJson(rootPackageJson);
      await sleep(SLEEP_TIME);
    }

    // Collect plugins
    const atlasPlugins = findAtlasPlugins();
    await sleep(SLEEP_TIME);
    const patchedPlugins = findPatchedPlugins();
    await sleep(SLEEP_TIME);
    const plugins = [...atlasPlugins, ...patchedPlugins];

    // Install & build plugins
    patchPlugins(plugins, patchedPackageJson);
    await sleep(SLEEP_TIME);
    if(!noInstall) {
      await installPlugins(plugins);
      await sleep(SLEEP_TIME);
    }
    await buildPlugins(plugins);
  }

  // Install & build root
  if (!clean && !noInstall) {
    await sleep(SLEEP_TIME);
    await installRoot();
  }

  await sleep(SLEEP_TIME);
  // await buildRoot();

  await finalLog(_stage_start);
  // Done, start server
  // await sleep(SLEEP_TIME);
  // await startServer();
}

module.exports = action;
