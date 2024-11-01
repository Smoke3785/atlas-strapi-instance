const _console = require("./ii-log");

_console.log("Hello, World!"); // 2021-09-26T20:00:00.000Z [Iliad] > Hello, World!
_console.lvl(3).log("Hello, World!"); // 2021-09-26T20:00:00.000Z [Iliad] [1] > Hello, World!

_console.mod("Test").log("Hello, World! 2 "); // 2021-09-26T20:00:00.000Z [Test] > Hello, World!
_console.mod("Test").error("Hello, World! error :( 2 "); // 2021-09-26T20:00:00.000Z [Test] > Hello, World!
_console.mod("Installation").info("Hello, World! error :( 2 "); // 2021-09-26T20:00:00.000Z [Test] > Hello, World!
_console.mod("Installation").warn("Hello, World! error :( 2 "); // 2021-09-26T20:00:00.000Z [Test] > Hello, World!

_console
  .mod("Installer")
  .log(_console.chalk.green("Successfully did the thing!"));

_console.chalk.green("Successfully did the thing!");
