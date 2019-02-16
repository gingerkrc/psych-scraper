var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = 3000;

var app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


mongoose.connect("mongodb://localhost/psychScraper", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
  axios.get("https://www.psychologytoday.com/us").then(function (results) {
    const $ = cheerio.load(results.data);
    var result = {};
    $(".media").each(function (i, element) {
      result.img = "https://cdn.psychologytoday.com/sites/default/files/styles/thumbnail/public/field_blog_entry_teaser_image/" + $(this).find(".img-fluid").attr("src");
      result.title = $(this).find("h2.blog_entry__title").text();
      result.link = $(this).find(".blog_entry__title").children("a").attr("href");
      result.teaser = $(this).find("p.blog_entry__teaser").text();
      console.log(result);
      console.log(result.teaser);

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
