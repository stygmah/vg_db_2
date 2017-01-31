//Node modules
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const igdb = require('igdb-api-node')
//Other Const
const doc = require('./private/doc');
const gameEngine = require('./gameEngine/gameEngine');
global.mashapeKey = doc.mashapeKey;
const port = process.env.PORT || 3000;



/*Setup & middleware*/
var app = express();
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use("/public", express.static(path.join(__dirname, 'public')));

/*Helpers*/
hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear();
});


/*maintenance*
Toggle true when in maintenance
*************/


app.use((req,res,next)=>{
  var mainten = false;
  if(mainten){
    res.render('maintenance.hbs');
  }
  next();
});



/*Load home view*

*****************/
app.get('/', (req, res) => {
  res.render('home.hbs',{
    pageTitle: 'Home'
  });
});

/*Load game view*

****************/
app.get('/gameView', (req, res) => {
  igdb.games({ ids: [req.query.id], fields: "*" }).then((output)=>{
    res.render('gameView.hbs',{
      pageTitle: output.body[0].name,
      gameTitle: output.body[0].name,
      genre1: gameEngine.genreResolve(output.body[0].genres,0),
      genre2: gameEngine.genreResolve(output.body[0].genres,1),
      image:  igdb.image(output.body[0].cover, "cover_big", "jpg") || "no image",
      summary: output.body[0].summary || output.body[0].name+" has no description yet"
    });
  },(e)=>{
    res.render('404.hbs');
  });
});

/*Game not found view*

**********************/



/*Bad request view*

*******************/
app.get('/badRequest', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});


/*Server on function/
/*******************/
app.listen(port, () => {
  console.log('Server is up on port '+port);
});