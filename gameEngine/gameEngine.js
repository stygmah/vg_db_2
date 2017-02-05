const igdb = require('igdb-api-node')

/*Genre Associative Object*/
var genreArray = {
	'2':"Point-and-click",
	'4':"Fighting",
	'5':"Shooter",
	'7':"Music",
	'8':"Platform",
	'9':"Puzzle",
	'10':"Racing",
	'11':"Real Time Strategy (RTS)",
	'12':"RPG",
	'13':"Simulator",
	'14':"Sports",
	'15':"Strategy",
	'16':"Turn-Based Strategy",
	'24':"Tactical",
	'25':"Beat 'em up",
	'26':"Quiz/Trivia",
	'30':"Pinball",
	'31':"Adventure",
	'32':"Indie",
	'33':"Arcade"
};
/*Game Category Array*/
var gameCategory = ['Main Game', 'DLC/Addon', 'Expansion','Bundle','Standalone Expansion'];


/*****Text Resolvers*****

/***********************/

/*Genre Resolve*/
var genreResolve = (genreId,i)=> {
	if(genreId === undefined || genreId[i] === undefined) return " ";
	if(i>0) return " - "+genreArray[genreId[i].toString()];
	return genreArray[genreId[i].toString()];
}


/**Search functions**/
/********************/
var linkGame = (game)=>{
	var id = game.id;
	var name = game.name;
	var genre1 = genreResolve(game.genres,0);
	var genre2 = genreResolve(game.genres,1);
	var thumb = igdb.image(game.cover, "thumb", "jpg");
	var classes= "searchBlock";
	return '<li><div class="'+classes+'"><a href="/gameView?id='+id+'"><img src="'+thumb+'"><div><h5>'+name+'</h5><h6>'+genre1+genre2+'</h6></div></a></div></li>';
}


var searchResultsList = (game)=>{
	console.log(game[0]);
	var htmlString ='<ul>';
	for (var i = 0; i < game.length; i++) {
		htmlString += linkGame(game[i]);
	};
	return htmlString+'</ul>';
}


/**RENDER OBJECTS**/
/******************/

/*Game View*/
var gameViewRenderObject = (output)=>{
	return {
      css: "gameView",
      pageTitle: output.body[0].name,
      gameTitle: output.body[0].name,
      genre1: genreResolve(output.body[0].genres,0),
      genre2: genreResolve(output.body[0].genres,1),
      image:  igdb.image(output.body[0].cover, "cover_big", "jpg") || "no image",
      summary: output.body[0].summary/*.substring(0, 700) */|| output.body[0].name+" has no description yet"
  };
}

/*Module exports*/
module.exports = {
	genreArray,
	gameCategory,
	genreResolve,
	searchResultsList,
	gameViewRenderObject
}
