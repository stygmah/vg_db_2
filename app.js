//Node modules
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const igdb = require('igdb-api-node');
//Other Const
const doc = require('./private/doc');

//Local modules
const engineVariables = require('./gameEngine/engineVariables');
const gameEngine = require('./gameEngine/gameEngine');
const helpers = require('./views/helpers/hbsHelpers');

global.mashapeKey = doc.mashapeKey;
const port = process.env.PORT || 3000;



/*Setup & middleware*/
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use("/public", express.static(path.join(__dirname, 'public')));

//Load hbs helpers
helpers.arrayToLinksHBS();

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
  igdb.games({ ids: engineVariables.featuredGamesArray, fields: engineVariables.gameRenderFields }).then((output)=>{
    res.render('home.hbs', gameEngine.renderHome(output));
  },(e)=>{
    res.render('404.hbs');
  });




});

/*Load game view*/
app.get('/gameView', (req, res) => {
  igdb.games({ ids: [req.query.id], fields: engineVariables.gameRenderFields }).then((output)=>{
    gameEngine.gameToConsoleLinks(output,(consoles)=>{
      gameEngine.resolveCompaniesForGame(output.body[0],(devs,pubs)=>{
        res.render('gameView.hbs', gameEngine.gameViewRenderObject(output,consoles,devs,pubs));
      });
    });
  },(e)=>{
    res.render('404.hbs');
  });
});
/*Load company view*/
app.get('/companyView', (req, res) => {
  igdb.companies({ ids: [req.query.id], fields: "*" }).then((output)=>{
    res.render('companyView.hbs', gameEngine.companyViewRenderObject(output));
  },(e)=>{
    res.render('404.hbs');
  });
});
/*Load system view*/
app.get('/systemView', (req, res) => {
  igdb.platforms({ ids: [req.query.id], fields: "*" }).then((output)=>{
    res.render('systemView.hbs', gameEngine.systemViewRenderObject(output));
  },(e)=>{
    res.render('404.hbs');
  });
});


/*Load searchview*
*****************/
app.get('/search', (req, res) => {
  if(req.query.type === 'game'){
    igdb.games({ search: req.query.search, limit: req.query.limit || 10, fields: engineVariables.gameRenderFields}).then((output)=>{
      if (req.query.search === ''|| output.length === 0) {
        res.render('404.hbs');
      };
      res.render('search.hbs', gameEngine.renderGameSearch(output));
    },(e)=>{
      console.log(e);
    });
  }else if(req.query.type === 'company'){
    igdb.companies({ search: req.query.search, limit: req.query.limit || 10, fields: "*", order:'popularity:desc'}).then((output)=>{
      res.render('search.hbs',gameEngine.renderCompanySearch(output));
    },(e)=>{
      res.render('404.hbs');
    });
  }else if(req.query.type === 'system'){
    igdb.platforms({ search: req.query.search, limit: req.query.limit || 10, fields: "*"}).then((output)=>{
      res.render('search.hbs',gameEngine.renderSystemSearch(output));
    },(e)=>{
      res.render('404.hbs');
    });
  }
});
/*Bad request view*
******************/
app.get('/badRequest', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

/*testing purposes only*/
app.get('/test', (req, res) => {
  igdb.games({ search: 'zelda', limit: req.query.limit || 10, fields: engineVariables.gameRenderFields}).then((output)=>{
    res.render('test.hbs',{
      list: gameEngine.searchResultsList(output.body,"game")
    });

  },(e)=>{
    res.render('404.hbs');
  });
});

/*******************/
/*Server on function/
/*******************/
app.listen(port, () => {
  console.log('Server is up on port '+port);
});

