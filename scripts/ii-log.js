const { getTimestamp, getFormattedName } = require("./ii-log-utils");
const chalk = require("chalk");

// Constants
const ILIAD_NAME = "Iliad";
const ATLAS_NAME = "ATLAS";
const DIR_CHAR = "◥";
const DIR_CHAR_ALT = "∟";
const DIR_CHAR_ALT2 = "▶";

class IliadLog {
  lastLevel = 0;
  constructor(_module = "") {
    this._module = _module;
    this.chalk = chalk;
  }

  setModule(_module) {
    this._module = _module;
    return this;
  }

  _log(type, ...args) {
    this.lastLevel = 0;
    const prefix = [
      chalk.gray(getTimestamp(false, true)),
      this.getName(),
      this.getPrefix(),
      this.getLevel(),
      this.getType(type),
    ].filter((x) => x);

    console.log(...prefix, ...args);

    return this;
  }

  log(...args) {
    return this._log("log", ...args);
  }

  info(...args) {
    return this._log("info", ...args);
  }

  warn(...args) {
    return this._log("warn", ...args);
  }

  error(...args) {
    return this._log("error", ...args);
  }

  debug(...args) {
    return this._log("debug", ...args);
  }

  timestamp(timestamp) {
    const difMs = performance.now() - timestamp;
    const seconds = (difMs / 1000).toFixed(2);

    if (seconds < 1) {
      const ms = difMs.toFixed(2);
      const stamp = `${ms}ms`;
      return this.withSuffix(stamp);
    } else {
      const stamp = `${seconds}s`;
      return this.withSuffix(stamp);
    }
  }

  getType(type) {
    const color =
      {
        log: chalk.whiteBright,
        info: chalk.blueBright,
        warn: chalk.yellowBright,
        error: chalk.redBright,
        debug: chalk.magentaBright,
      }[type] || chalk.whiteBright;

    const cfg = {
      truncate: false,
      targetLength: 6,
      padRight: true,
    };

    const _type = {
      log: "",
      error: getFormattedName("Error:", cfg),
      debug: getFormattedName("Debug:", cfg),
      warn: getFormattedName("Warn:", cfg),
      info: getFormattedName("Info:", cfg),
    }[type];

    return `${color(_type)}`;
  }

  getLevel() {
    return "";
  }

  getName() {
    // const name = chalk.cyanBright(`[${ILIAD_NAME}]`); // Iliad
    const name  = chalk.rgb(73, 69, 255)(`[ ${chalk.bold(ATLAS_NAME)} ]`); // Atlas
    return name
  }

  withSuffix(suffix) {
    if (this instanceof TempLogContext) {
      return this.setSuffx(suffix);
    }

    return new TempLogContext(this, 1).setSuffx(suffix);
  }

  lvl(level) {
    if (this instanceof TempLogContext) {
      this.level = level;
      return this;
    }

    if (level <= 0) {
      return this;
    }

    return new TempLogContext(this, level);
  }

  success(...args) {
    if (args.length === 0) {
      return this._log("log", chalk.greenBright("Success!"));
    }
    return this._log("log", chalk.greenBright(...args));
  }

  failure(...args) {
    if (args.length === 0) {
      return this._log("log", chalk.redBright("Failure!"));
    }
    return this._log("log", chalk.redBright(...args));
  }

  warning(...args) {
    if (args.length === 0) {
      return this._log("log", chalk.yellowBright("Warning!"));
    }
    return this._log("log", chalk.yellowBright(...args));
  }

  mod(_module) {
    this._module = _module;
    return this;
  }

  reset(...args) {
    return this.create(...args);
  }

  create(_module) {
    return new IliadLog(_module);
  }

  getPrefix() {
    if (this._module === "" || !this._module) {
      return "";
    }

    return `[${getFormattedName(this._module, {
      targetLength: 10,
      // padLeft: true,
    })}]`;
  }

  nl() {
    console.log();
    return this;
  }
}

module.exports = new IliadLog();

class TempLogContext extends IliadLog {
  constructor(ctx, level) {
    super(ctx._module);
    this.level = level;
    this.suffix = "";
    this.root = ctx;
  }

  // success(...args) {
  //   return this._log("success", chalk.greenBright(...args));
  // }

  getChar() {
    if (this.level === 1) {
      return DIR_CHAR_ALT2;
    }

    if (this.level >= this.root.lastLevel) {
      return DIR_CHAR_ALT;
    }

    return DIR_CHAR_ALT2;
  }

  getLevel() {
    let spacing = "";

    for (let i = 1; i < this.level; i++) {
      spacing += "  ";
    }

    return `${spacing}${this.getChar()}`;
  }

  setSuffx(suffix) {
    this.suffix = suffix;
    return this;
  }

  getSuffix() {
    if (this.suffix === "" || !this.suffix) {
      return "";
    }
    return chalk.gray(`(${this.suffix})`);
  }

  _log(type, ...args) {
    const prefix = [
      chalk.gray(getTimestamp(false, true)),
      this.getName(),
      this.getPrefix(),
      this.getLevel(),
      this.getType(type),
    ].filter((x) => x);

    console.log(...prefix, ...args, this.getSuffix());
    this.root.lastLevel = this.level;

    return this.root;
  }

  rst() {
    return this.root;
  }
}
