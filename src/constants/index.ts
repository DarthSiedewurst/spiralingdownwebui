const COLORS = [
  { value: "orange", text: "Orange" },
  { value: "green", text: "Grün" },
  { value: "yellow", text: "Gelb" },
  { value: "black", text: "Schwarz" },
  { value: "dafuq", text: "Dafuq" },
  { value: "purple", text: "Lila" },
  { value: "blue", text: "Blau" },
  { value: "aqua", text: "Aqua" },
  { value: "pink", text: "Pink" },
  { value: "brown", text: "Braun" },
  { value: "red", text: "Rot" },
  { value: "white", text: "Weiß" },
];
const RULERULES: string[] = [
  "Die Wörter Ja und Nein werden mit einem Schluck honoriert",
  "Der Linke Nachbar trinkt mit (nicht kumulativ)",
  "Das Wort 'Trink' belohnt dich mit einem Schluck",
  "Du darfst keine Gegenstände mehr von anderen Personen annehmen",
  "Bevor du würfelst, musst du das Spiel preisen",
  "Sie sind Adlige. Sie dürfen sich nurnoch vornehm ansprechen",
  "Es darf nur mit der schwachen Hand getrunken werden",
  "Benehmt euch! Keine Kraftausdrücke mehr",
  "{playerName} ist Medusa. Wer ihm in die Augen sieht, der trinkt",
  "{playerName} ist nun der Questionmaster! Jeder ihm/ihr Fragen beantwortet, muss seine Antwort der Höflichkeit halber mit den Worten 'Ja Mr. Questionmaster' beenden",
];

export default {
  COLORS: COLORS,
  RULERULES: RULERULES,
};
