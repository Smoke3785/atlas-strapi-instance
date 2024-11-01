(() => {
  const path = require("path");
  const fs = require("fs");

  const appendedComment = `// This file is generated by a script (typeSync.ts) in the associate Strapi instance. Do not modify it directly.\n`;
  const appendedDate = `// Generated on: ${new Date().toUTCString()}\n\n`;
  const frontendTypesFolder =
    "C:\\Users\\owenr\\Documents\\GitHub\\gcollective-website-next\\src\\@types";

  const typesDirectory = path.join(process.cwd(), "./types/generated");
  const typeFiles = fs.readdirSync(typesDirectory);

  const files = typeFiles.map((file) => {
    let src = path.join(process.cwd(), `./types/generated/${file}`);
    let dest = path.join(frontendTypesFolder, file);

    return { src, dest };
  });

  function copyFile({ src, dest }) {
    const destinationDir = path.dirname(dest);

    // Check if source file exists
    if (!fs.existsSync(src)) {
      console.error(`Source file does not exist: ${src}`);
      process.exit(1);
    }

    // Ensure destination directory exists or create it
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    // Read the source file, modify its content and write to the destination file
    const content = [
      appendedComment,
      appendedDate,
      fs.readFileSync(src, "utf8"),
    ].join("");

    try {
      fs.writeFileSync(dest, content);
      console.log(`File ${src} copied and modified successfully!`);
      console.log(`Copied to ${dest}\n`);
    } catch (error) {
      console.error(`Error writing to destination file: ${error}`);
      process.exit(1);
    }
  }

  files.forEach(copyFile);
})();