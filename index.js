const express = require('express');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
const ejs = require("ejs");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get('/',(req,res)=>{
    // res.sendFile(__dirname + '/index.html')
    res.render('index')
})

app.post('/',function(req,res){
    const url = 'https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple'
    https.get(url,function(response){
     response.on('data',function (data){
        var quizData = JSON.parse(data);
        res.render('quiz',{quiz: quizData.results})
     })

    })
})

app.post('/quiz',function(req,res){

    const result = (req.body)

    console.log(Object.values(result))
    const ans = Object.values(result)
    let count = 0
    ans.map(x => x === 'D' && count++ )


    res.render('result',{mark: count})

})

app.post('/result',function(req,res){
    res.redirect('/')
})


app.listen(3000,function(){
    console.log('Server started');
})