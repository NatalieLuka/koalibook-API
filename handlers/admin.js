import { config } from "../util/config.js";
import db from "../util/db.js";
const { DB_TABLE_NAME_PREFIX } = config;

const data = [
  {
    user_id: "user_2kvS4TlscobKCbSy0eYO4IiAbZE",
    isbn: "9783442495467",
    title: "DEV: City of Heavenly Fire",
    author: "Cassandra Clare",
    page_count: 795,
    image:
      "https://images.thalia.media/00/-/b51c6f12cc394de2b0a534086e3325f2/city-of-heavenly-fire-taschenbuch-cassandra-clare.jpeg",
    description:
      "Jace trägt das Himmlische Feuer in sich und Sebastian verkündet den finalen Schlag gegen die irdische Welt. Um zu verhindern, dass Dämonen über die Städte herfallen, müssen Clary und Jace mit ihren Freunden in die Schattenwelt eindringen. Wird es ihnen gelingen, Sebastians finstere Pläne zu stoppen, ohne selbst Schaden zu nehmen? Als sie auf Clarys dunklen Bruder treffen, stellt er Clary vor eine schier unlösbare Aufgabe: Entweder sie kommt an seine Seite oder er vernichtet ihre Familie und Freunde, die Welt und alle Schattenjäger …  Für die Liebe müssen Opfer gebracht werden. Der sechste Band der Chroniken der Unterwelt wartet mit einem spektakulären und unerwarteten Finale für dieses gewaltige Epos auf.",
    text_snippet:
      "Um zu verhindern, dass Dämonen über die Städte herfallen, müssen Clary und Jace mit ihren Freunden in die Schattenwelt eindringen.",
  },
  {
    user_id: "user_2kvS4TlscobKCbSy0eYO4IiAbZE",
    isbn: "9783734112737",
    title: "DEV: The Ravenhood - Flock",
    author: "Kate Stewart",
    page_count: 416,
    image:
      "https://images.thalia.media/00/-/08f3f6d2d69f418ab0586a137086284e/the-ravenhood-flock-taschenbuch-kate-stewart.jpeg",
    description:
      "Der Deal ist simpel: Ein Jahr lang soll die 19-jährige Cecelia zu ihrem entfremdeten Vater nach Triple Falls ziehen und in dessen Fabrik arbeiten. Im Gegenzug erhält sie Zugang zu seinem Vermögen. Angewiesen auf das Geld, um ihrer kranken Mutter helfen zu können, willigt Cecelia ein – nichts ahnend, dass sie als Tochter des Chefs dort nicht den einfachsten Start haben wird. Doch das ändert sich, als sie Sean kennenlernt. Der attraktive Kollege macht sie mit seinen Freunden bekannt, einer Gruppe junger Männer, die alle nach ihren eigenen Regeln leben und dasselbe Raben-Tattoo tragen. Verwirrt von ihren Gefühlen für Sean, aber auch für dessen geheimnisvollen Kumpel Dominic, ist Cecelia entschlossen, das Jahr zu nutzen, um herauszufinden, was – und vor allem wen – sie wirklich will",
    text_snippet:
      "Ein Jahr lang soll die 19-jährige Cecelia zu ihrem entfremdeten Vater nach Triple Falls ziehen und in dessen Fabrik arbeiten.",
  },
  {
    user_id: "user_2kvS4TlscobKCbSy0eYO4IiAbZE",
    isbn: "9783736308077",
    title: "DEV:  Trust",
    author: "Kylie Scott",
    page_count: 416,
    image:
      "https://images.thalia.media/00/-/c58ae126b56548869d4ca19979d6ef10/trust-epub-kylie-scott.jpeg",
    description:
      "Edie Millen hatte hohe Erwartungen an ihr letztes Highschooljahr - mitten in einen Raubüberfall zu stolpern und beinahe zu sterben, gehörte allerdings nicht dazu. Von einem Moment auf den anderen ändert sich ihr Leben grundlegend. Als ihr die Blicke und das Gerede ihrer Mitschüler zu viel werden, wechselt sie kurzerhand die Schule - nicht ahnend, dass sie dort John Cole wiedersehen würde, den Jungen, der ihr an jenem Abend das Leben rettete. Die wildesten Gerüchte ranken sich um John - er sei gewalttätig und deale mit Drogen. Doch auch wenn Edie weiß, dass sie womöglich ihr Herz aufs Spiel setzt, kann und will sie nicht gegen die Gefühle ankämpfen, die John in ihr hervorruft",
    text_snippet:
      "Eigentlich wollte Edie nur ein paar Snacks für einen Filmabend kaufen und pl̲ötzlich findet sie sich in einem Überfall mit anschließender Geiselnahme wieder. Nur durch die Besonnenheit von John, einer weiteren Geisel, schafft sie es lebend da raus.",
  },
  {
    user_id: "user_2lEmnXO6hxBc59dlVQQKVtIVllt",
    isbn: "9783442495467",
    title: "City of Heavenly Fire",
    author: "Cassandra Clare",
    page_count: 795,
    image:
      "https://images.thalia.media/00/-/b51c6f12cc394de2b0a534086e3325f2/city-of-heavenly-fire-taschenbuch-cassandra-clare.jpeg",
    description:
      "Jace trägt das Himmlische Feuer in sich und Sebastian verkündet den finalen Schlag gegen die irdische Welt. Um zu verhindern, dass Dämonen über die Städte herfallen, müssen Clary und Jace mit ihren Freunden in die Schattenwelt eindringen. Wird es ihnen gelingen, Sebastians finstere Pläne zu stoppen, ohne selbst Schaden zu nehmen? Als sie auf Clarys dunklen Bruder treffen, stellt er Clary vor eine schier unlösbare Aufgabe: Entweder sie kommt an seine Seite oder er vernichtet ihre Familie und Freunde, die Welt und alle Schattenjäger …  Für die Liebe müssen Opfer gebracht werden. Der sechste Band der Chroniken der Unterwelt wartet mit einem spektakulären und unerwarteten Finale für dieses gewaltige Epos auf.",
    text_snippet:
      "Um zu verhindern, dass Dämonen über die Städte herfallen, müssen Clary und Jace mit ihren Freunden in die Schattenwelt eindringen.",
  },
  {
    user_id: "user_2lEmnXO6hxBc59dlVQQKVtIVllt",
    isbn: "9783734112737",
    title: "The Ravenhood - Flock",
    author: "Kate Stewart",
    page_count: 416,
    image:
      "https://images.thalia.media/00/-/08f3f6d2d69f418ab0586a137086284e/the-ravenhood-flock-taschenbuch-kate-stewart.jpeg",
    description:
      "Der Deal ist simpel: Ein Jahr lang soll die 19-jährige Cecelia zu ihrem entfremdeten Vater nach Triple Falls ziehen und in dessen Fabrik arbeiten. Im Gegenzug erhält sie Zugang zu seinem Vermögen. Angewiesen auf das Geld, um ihrer kranken Mutter helfen zu können, willigt Cecelia ein – nichts ahnend, dass sie als Tochter des Chefs dort nicht den einfachsten Start haben wird. Doch das ändert sich, als sie Sean kennenlernt. Der attraktive Kollege macht sie mit seinen Freunden bekannt, einer Gruppe junger Männer, die alle nach ihren eigenen Regeln leben und dasselbe Raben-Tattoo tragen. Verwirrt von ihren Gefühlen für Sean, aber auch für dessen geheimnisvollen Kumpel Dominic, ist Cecelia entschlossen, das Jahr zu nutzen, um herauszufinden, was – und vor allem wen – sie wirklich will",
    text_snippet:
      "Ein Jahr lang soll die 19-jährige Cecelia zu ihrem entfremdeten Vater nach Triple Falls ziehen und in dessen Fabrik arbeiten.",
  },
  {
    user_id: "user_2lEmnXO6hxBc59dlVQQKVtIVllt",
    isbn: "9783736308077",
    title: "Trust",
    author: "Kylie Scott",
    page_count: 416,
    image:
      "https://images.thalia.media/00/-/c58ae126b56548869d4ca19979d6ef10/trust-epub-kylie-scott.jpeg",
    description:
      "Edie Millen hatte hohe Erwartungen an ihr letztes Highschooljahr - mitten in einen Raubüberfall zu stolpern und beinahe zu sterben, gehörte allerdings nicht dazu. Von einem Moment auf den anderen ändert sich ihr Leben grundlegend. Als ihr die Blicke und das Gerede ihrer Mitschüler zu viel werden, wechselt sie kurzerhand die Schule - nicht ahnend, dass sie dort John Cole wiedersehen würde, den Jungen, der ihr an jenem Abend das Leben rettete. Die wildesten Gerüchte ranken sich um John - er sei gewalttätig und deale mit Drogen. Doch auch wenn Edie weiß, dass sie womöglich ihr Herz aufs Spiel setzt, kann und will sie nicht gegen die Gefühle ankämpfen, die John in ihr hervorruft",
    text_snippet:
      "Eigentlich wollte Edie nur ein paar Snacks für einen Filmabend kaufen und pl̲ötzlich findet sie sich in einem Überfall mit anschließender Geiselnahme wieder. Nur durch die Besonnenheit von John, einer weiteren Geisel, schafft sie es lebend da raus.",
  },
];

export async function resetDb(_, res) {
  const booksTableName = DB_TABLE_NAME_PREFIX + "books";
  const progressTableName = DB_TABLE_NAME_PREFIX + "progress";
  // create and populate books table
  try {
    await db.schema.dropTableIfExists(booksTableName);
    await db.schema.dropTableIfExists(progressTableName);
    await db.schema.createTable(booksTableName, (table) => {
      table.string("user_id");
      table.string("isbn");
      table.string("title");
      table.string("author");
      table.string("image", 2000);
      table.mediumint("page_count");
      table.string("description", 2000);
      table.string("text_snippet", 2000);
      table.primary(["user_id", "isbn"]);
    });
    for (const book of data) {
      await db(booksTableName).insert(book);
    }
    // create reading progress table
    await db.schema.createTable(progressTableName, (table) => {
      table.string("user_id");
      table.string("isbn");
      table.date("date").defaultTo(db.fn.now());
      table.mediumint("current_page");
      table.primary(["user_id", "isbn", "date"]);
    });
    await db(progressTableName)
      .insert({
        user_id: "user_2lEmnXO6hxBc59dlVQQKVtIVllt",
        isbn: "9783736308077",
        current_page: 45,
      })
      .onConflict(["user_id", "isbn", "date"])
      .merge();
    await db(progressTableName)
      .insert({
        user_id: "user_2lEmnXO6hxBc59dlVQQKVtIVllt",
        isbn: "9783736308077",
        current_page: 164,
      })
      .onConflict(["user_id", "isbn", "date"])
      .merge();
    return res.json({ msg: "db reset successful" });
  } catch (err) {
    console.error(err);
    res.json({
      msg: "db reset failed",
    });
  }
}
