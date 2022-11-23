const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
var request = require("request");
var cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");
var { parseMatchplan } = require("fussball-de-matchplan-grabber");
app.use(express.json({ extended: false }));

app.use(cors());
//Define routes

// app.get("/nextmatches", (req, res) => {
//   setInterval(function () {
//     request(
//       "https://www.fussball.de/ajax.club.next.games/-/id/00ES8GNA1O000011VV0AG08LVUPGND5I/mode/PAGE",
//       function (error, response, html) {
//         if (!error && response.statusCode == 200) {
//           var $ = cheerio.load(html);

//           fs.writeFileSync(
//             path.join(process.cwd(), "index.html"),
//             "<!DOCTYPE html><html lang='en'> <head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>Document</title>  <link rel='stylesheet' href='/css/styles.css' />  </head><body> <table>" +
//               $(".table").html() +
//               "</table></body></html>",
//             {
//               encoding: "utf-8",
//             }
//           );
//         }
//       }
//     );
//   }, 5000);
//   res.sendFile(path.join(__dirname + "/index.html"));
// });
// app.get("/prevmatches", (req, res) => {
//   setInterval(function () {
//     request(
//       "https://www.fussball.de/ajax.club.prev.games/-/id/00ES8GNA1O000011VV0AG08LVUPGND5I/mode/PAGE",
//       function (error, response, html) {
//         if (!error && response.statusCode == 200) {
//           var $ = cheerio.load(html);

//           fs.writeFileSync(
//             path.join(process.cwd(), "prev.html"),
//             "<!DOCTYPE html><html lang='en'> <head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>Document</title>  <link rel='stylesheet' href='/css/styles.css' />  </head><body> <table>" +
//               $(".table").html() +
//               "</table></body></html>",
//             {
//               encoding: "utf-8",
//             }
//           );
//         }
//       }
//     );
//   }, 5000);
//   res.sendFile(path.join(__dirname + "/prev.html"));
// });

app.get("/", async (req, res) => {
  parseMatchplan(
    "https://www.fussball.de/ajax.club.next.games/-/id/00ES8GNA1O000011VV0AG08LVUPGND5I/mode/PAGE",
    async function (response) {
      const arrayOfObj = Object.entries(response).map((e) => e[1]);
      res.status(200).send(arrayOfObj);
    }
  );
});
app.get("/prevMatches", async (req, res) => {
  parseMatchplan(
    "https://www.fussball.de/ajax.club.prev.games/-/id/00ES8GNA1O000011VV0AG08LVUPGND5I/mode/PAGE",
    async function (response) {
      const arrayOfObj = Object.entries(response).map((e) => e[1]);

      res.status(200).send(arrayOfObj);
    }
  );
});

app.post("/getImages", async (req, res) => {
  try {
    const { url } = req.body;

    var images = [];
    var stats = [];

    const resa = await axios.get(url);

    var $ = cheerio.load(resa.data);

    $(".column-stats").map((index, value) => {
      stats.push($(value).text());
    });

    $(".table img").map((index, value) => {
      images.push(value.attribs.src);
    });

    res.status(200).send({ images, stats: [stats[0], stats[1]] });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

//Serve static assests in production

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
