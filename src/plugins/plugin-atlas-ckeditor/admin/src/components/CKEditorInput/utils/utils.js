/*
 *  Sanitizes the provided input by replacing certain special characters
 *  with entities.
 */

export default function sanitize(data) {
  const characters = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  };

  console.log("Sanitizing data", data);

  // Lets make a copy of the data
  let _data;

  if (!data) {
    return "null";
  }

  if (typeof data !== "string") {
    return data;
  }

  for (const char in characters) {
    const entity = characters[char];

    _data = data.replaceAll(char, entity);
  }

  return _data;
}
