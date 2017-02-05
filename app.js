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



/*maintenance*
-Toggle true when in maintenance
*************/
app.use((req,res,next)=>{
  var mainten = false;
  if(mainten){
    res.render('maintenance.hbs');
  }
  next();
});

/*********************
*****GET REQUESTS*****
*********************/

/*Load home view*
****************/
app.get('/', (req, res) => {
  res.render('home.hbs',{
    pageTitle: 'Home'
  });
});

/*Load game view*
****************/
app.get('/gameView', (req, res) => {
  igdb.games({ ids: [req.query.id], fields: "*" }).then((output)=>{
    res.render('gameView.hbs', gameEngine.gameViewRenderObject(output));
  },(e)=>{
    res.render('404.hbs');
  });
});


/*Load searchview*
*****************/
app.get('/search', (req, res) => {
  if(req.query.type === 'game'){
    igdb.games({ search: req.query.search, limit: req.query.limit || 10, fields: "*" }).then((output)=>{
      res.render('search.hbs',{css:'search', searchResults: gameEngine.searchResultsList(output.body)});
    },(e)=>{
      res.render('404.hbs');
    });
  }else if(req.query.type === 'company'){
    console.log('searched company');
  }else if(req.query.type === 'system'){
    console.log('searched system');
  }
});


/*Bad request view*
******************/
app.get('/badRequest', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

/*******************/
/*Server on function/
/*******************/
app.listen(port, () => {
  console.log('Server is up on port '+port);
});

