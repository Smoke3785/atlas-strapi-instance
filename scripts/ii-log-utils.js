function getFormattedName(inputString, options = {}) {
  let {
    targetLength = 10,
    padWith = " ",
    padLeft = false,
    truncate = true,
    truncateWith = "...",
  } = options;

  if (inputString.length < targetLength) {
    while (inputString.length < targetLength) {
      inputString = padLeft ? padWith + inputString : inputString + padWith;
    }
  }
  if (truncate && inputString.length > targetLength) {
    inputString = inputString.slice(0, targetLength - 3) + truncateWith;
  }

  return inputString;
}

function getTimestamp(showDate = false, showMs = false) {
  var date = new Date();

  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  var msec = date.getMilliseconds();

  month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  hour = (hour < 10 ? "0" : "") + hour;
  min = (min < 10 ? "0" : "") + min;
  sec = (sec < 10 ? "0" : "") + sec;
  msec;

  if (msec) {
    msec = (msec < 10 ? "00" : "") + msec;
    msec = (msec < 100 ? "0" : "") + msec;
  }

  var str =
    date.getFullYear() +
    "-" +
    month +
    "-" +
    day +
    "_" +
    hour +
    ":" +
    min +
    ":" +
    sec;

  if (showMs) {
    str += "." + msec;
  }

  return showDate ? str : str.split("_")[1];
}

function padPrefix(prefix) {
  return prefix === "" ? " " : `  ${prefix}`;
}

module.exports = {
  getFormattedName,
  getTimestamp,
  padPrefix,
};
