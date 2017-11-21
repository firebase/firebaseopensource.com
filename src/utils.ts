export const isTesting = process.env.NODE_ENV == "test";

function isLetter(c: string) {
  return c.toLowerCase() != c.toUpperCase();
}

function isCapital(c: string) {
  return c == c.toUpperCase();
}

function splitWords(name: string) {
  var words = [];
  var currWord = "";

  for (var i = 0; i < name.length; i++) {
    var c = name[i];
    var prev = i == 0 ? "" : name[i - 1];
    var next = i == name.length - 1 ? "" : name[i + 1];

    // Word breaks are:
    //  * Non letter characters
    //  * Changes in case after the second letter
    var wordStart =
      isLetter(prev) &&
      isLetter(c) &&
      isCapital(c) &&
      !isCapital(next) &&
      i != 1;

    var exclude = !isLetter(c);
    var wordBreak = !isLetter(c) || wordStart;

    if (wordBreak && i > 0) {
      words.push(currWord);
      currWord = "";
    }

    if (!exclude) {
      currWord += c;
    }
  }

  words.push(currWord);

  return words;
}

export function pickLogoLetter(name: string) {
  var fire = /[Ff]ire(base)?(-)?/;
  var nameClean = name.replace(fire, "");
  var words = splitWords(nameClean);
  var firstLetter = words[0][0].toUpperCase();

  return firstLetter;
}
