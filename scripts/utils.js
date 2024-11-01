const _console = require("./ii-log").create();
const { exec } = require("child_process");

async function execute(command, _console, forceResolve = false) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      // console.error("exec", [command, error, stdout, stderr]);

      if (error || stderr) {
      }
      if (error && stderr && !forceResolve) {
        reject({ result: null, error: error || stderr });
      }
      resolve({ result: stdout, error: null });
    });
  });
}

async function sleep(ms) {
  const msRandom = Math.floor(Math.random() * ms * 2);
  return new Promise((resolve) => setTimeout(resolve, msRandom));
}

async function getNpmRegistry() {
  let _result;

  try {
    const { result, error } = await execute(`npm config get registry`);
    if (error || !result) {
      throw new Error(error);
    }
    _result = result;
  } catch (error) {
    return null;
  }
  return _result.trim();
}

async function setHeapSize(size = 2048) {
  const setHeapSizeCommand = `export NODE_OPTIONS="--max-old-space-size=${size}"`;
  const { result, error } = await execute(setHeapSizeCommand);
  if (error) {
    throw new Error(error);
  }
  return result;
}

async function getLatestVersion(packageName, registry = null) {
  const setRegistryCommand = `npm config set registry ${registry}`;
  const viewVersionCommand = `npm view ${packageName} version`;

  // console.log("setRegistryCommand", setRegistryCommand);
  // console.log("viewVersionCommand", viewVersionCommand);

  let _result;

  try {
    if (registry) {
      const { result, error } = await execute(
        setRegistryCommand,
        undefined,
        true
      );

      // console.log({ result, error });
      if (error) {
        throw new Error(error);
      }
    }

    const { result, error } = await execute(viewVersionCommand);
    // console.log("viewVersionCommand", viewVersionCommand);
    // console.log("registry", registry);
    // console.log("packageName", packageName);

    // console.log("result (version)", result);

    if (error || !result) {
      throw new Error(error);
    }
    _result = result;
  } catch (error) {
    throw new Error(error);
  }
  const static = "4.14.60";
  _console
    .nl()
    .warn(
      `Get Latest Version is currently broken. Returning static value: ${static}`
    )
    .nl();
  // return _result.trim();

  return static;
}

async function setRegistry(registry = null) {
  const setRegistryCommand = `npm config set registry ${registry}`;

  try {
    if (registry) {
      const { result, error } = await execute(
        setRegistryCommand,
        undefined,
        true
      );
      if (error) {
        throw new Error(error);
      }
    }
  } catch (error) {
    throw new Error(error);
  }

  return;
}

module.exports = {
  getLatestVersion,
  setHeapSize,
  setRegistry,
  execute,
  sleep,
};
