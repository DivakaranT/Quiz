const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", function (req, res) {
  //console.log(req.body);
  const amt = req.body.amount;
  const diff = req.body.difficulty;
  const category = req.body.category;


  let diffy = 'easy';

  if (diff === 'Hard') {
    diffy = 'hard'
  } else if (diff === 'Medium') {
    diffy = 'medium'
  }

  let type = 9;
  switch (category) {
    case "General":
      type = 9;
      break;
    case "Science":
      type = 17;
      break;
    case "Computers":
      type = 18;
      break;
    // case "Mathematics":  API not working!
    //   type = 19;
    //   break;
    case "Geography":
      type = 22;
      break;
    case "History":
      type = 23;
      break;
    case "Sports":
      type = 21;
      break;
    case "Animals":
      type = 27;
      break;
    case "Vehicles":
      type = 28;
      break;
    case "Books":
      type = 10;
      break;
    case "Movies":
      type = 11;
      break;
    case "Celebrities":
      type = 26;
      break;
    // case "Politics":  API not working!
    //   type = 24;
    //   break;

    default:
      type = 9;
      break;
  }
  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }
  const url =
    "https://opentdb.com/api.php?amount=" + amt + "&category=" + type + "&difficulty=" + diffy + "&type=multiple&encode=url3986";
  https.get(url, function (response) {
    response.on("data", function (data) {
      var quizData = JSON.parse(data);
      // console.log(quizData.results)
      var answers = []
      quizData.results.map(x => {x.incorrect_answers.push(x.correct_answer);
        shuffle(x.incorrect_answers);
        answers = [...answers,x.incorrect_answers]});
        var correct = quizData.results.map(x => x.correct_answer);
        console.log(correct);
      res.render("quiz", { quiz: quizData.results , ans:answers, correct:correct, amt:amt });
    });
  });
});

app.post("/quiz", function (req, res) {
  const result = req.body;
  const answers = result.btn.split(',');
  //console.log(result);
  let count = 0;
  for (const [key, value] of Object.entries(result)) {
    if (key != 'btn') {
      if (answers[key] === value){
        count++
      }
    }
  }
  res.render("result", { mark: count ,amount:answers.length});
});

app.post("/result", function (req, res) {
  res.redirect("/");
});

// app.listen(3000, function () {
//   console.log("Server started");
// });

const PORT = 4000

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

// Export the Express API
module.exports = app