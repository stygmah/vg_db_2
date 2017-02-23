const igdb = require('igdb-api-node')
const countrydata = require('countrydata');

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
/*Country resolve*/
var countryResolve = (iso)=>{
	if(countrydata.numeric[iso] == undefined){
		return '';
	}else{
		return countrydata.numeric[iso].name.en;
	}
}


/*Console resolvers*
********************
*******************/

/*Console Resolve ASYNC*/
var consoleResolve = (systemID, callback)=>{
	igdb.platforms({ ids: [systemID], fields: "*"}).then((output)=>{
      callback(output.body[0].name);
    },(e)=>{
      console.log("Error resolving console");
      callback (1);
    });
}

/*Multiple Resolve ASYNC*/
var consoleMultipleResolve = (consoleArray, callback)=>{
	var resolvedArray = [];
	itemsProcessed = 0;

	consoleArray.forEach((item)=>{	
		consoleResolve(item,(consol)=>{
			resolvedArray.push(consol);
			itemsProcessed++;
			if(itemsProcessed === consoleArray.length) {
      			callback(resolvedArray);
    		}
		});
	});
}
/*createConsoleArray*/
var consoleArrayResolve = (game)=>{
	var resolvedArray = [];
	var unresolvedArray = game.body[0].release_dates;
	itemsProcessed = 0;

	for(var i = 0; i<unresolvedArray.length;i++){
		resolvedArray.push(unresolvedArray[i].platform);
		itemsProcessed++;
	}
	return resolvedArray;
}

/*consoleToLink*/
var consoleArrayToLinks = (game, consoleID )=>{	
	return'<a href="/systemView?id='+consoleID+'">'+game+'</a>';

}
/*gameToConsoleLinks ASYNC*/
var gameToConsoleLinks = (game, callback)=>{
	result='';
	itm = 0;
	doneArray = [];

	consoleArray = consoleArrayResolve(game);
	console.log("Array length"+consoleArray.length);
	consoleArray.forEach((item)=>{	
		consoleResolve(item,(consol)=>{

			//COMPARE IF CONSOLE ALLREADY DONE
			if(!compareArray(doneArray, item) || itm === 0){
				result = consoleArrayToLinks(consol,item)+result;
				doneArray.push(item);
			}

			
			itm++;
			if(itm === consoleArray.length) {
      			callback(result);
   			}
		});
	});
}


/**Search functions**/
/********************/
var linkSearch = (search, type)=>{
	var id = search.id;
	var name = search.name;
	var classes= "searchBlock";
	if(type === "game"){
		var genre1 = genreResolve(search.genres,0);
		var genre2 = genreResolve(search.genres,1);
		var thumb = igdb.image(search.cover, "thumb", "jpg");
		return '<li><div class="'+classes+'"><a href="/gameView?id='+id+'"><img src="'+thumb+'"><div><h5>'+name+'</h5><h6>'+genre1+genre2+'</h6></div></a></div></li>';
	}else if(type === "company"){
		var thumb = igdb.image(search.logo, "thumb", "jpg");

		return '<li><div class="'+classes+'"><a href="/companyView?id='+id+'"><img src="'+thumb+'"><div><h5>'+name+'</h5><h6>'+countryResolve(search.country)+'</h6></div></a></div></li>';
	}else if(type === "system"){
		var thumb = igdb.image(search.logo, "thumb", "jpg");
		return '<li><div class="'+classes+'"><a href="/systemView?id='+id+'"><img src="'+thumb+'"><div><h5>'+name+'</h5><h6>'+'country'+'</h6></div></a></div></li>';
	}else{

	}

}

var searchResultsList = (search, type)=>{
	var htmlString ='<ul class="result-list">';
	for (var i = 0; i < search.length; i++) {
		htmlString += linkSearch(search[i], type);
	};
	return htmlString+'</ul>';
}


/**RENDER OBJECTS VIEWS**/
/******************/

/*Game View*/
var gameViewRenderObject = (output, consoles)=>{
	var date = new Date(output.body[0].first_release_date);
	var date = date.toString();
	return {
      pageTitle: output.body[0].name,
      gameTitle: output.body[0].name,
      gameCategory: gameCategory[output.body[0].category],
      genre1: genreResolve(output.body[0].genres,0),
      genre2: genreResolve(output.body[0].genres,1),
      image:  igdb.image(output.body[0].cover, "cover_big", "jpg") || "no image",
      summary: output.body[0].summary/*.substring(0, 700) */|| output.body[0].name+" has no description yet",
      consoles: consoles,
      releaseDate: date.substring(4,16) || unknown
  };
}
/*Company view*/
var companyViewRenderObject = (output)=>{
	return {
      pageTitle: output.body[0].name,
      companyName: output.body[0].name,
      country: countryResolve(output.body[0].country),
      image:  igdb.image(output.body[0].logo, "cover_big", "jpg") || "no image",
      summary: output.body[0].description/*.substring(0, 700) */|| output.body[0].name+" has no description yet"
  };
}
/*System view*/
var systemViewRenderObject = (output)=>{
	return {
      pageTitle: output.body[0].name,
      systemName: output.body[0].name,
      image:  igdb.image(output.body[0].logo, "cover_big", "jpg") || "no image",
      summary: output.body[0].summary/*.substring(0, 700) */|| output.body[0].name+" has no description yet"
  };
}



/**Selection Games***
******************/
var gamesArray = [7346, 11156, 18320, 19562, 19765, 26761, 7349, 25076, 10031];




var renderHome = (output)=>{
	return {
		pageTitle: 'Home',

		game1Id: gamesArray[0],
		game1Title: output.body[0].name,
		game1Thumb: igdb.image(output.body[0].cover, "cover_big", "jpg"),
		game2Id: gamesArray[1],
		game2Title: output.body[1].name,
		game2Thumb: igdb.image(output.body[1].cover, "cover_big", "jpg"),
		game3Id: gamesArray[2],
		game3Title: output.body[2].name,
		game3Thumb: igdb.image(output.body[2].cover, "cover_big", "jpg"),
		game4Id: gamesArray[3],
		game4Title: output.body[3].name,
		game4Thumb: igdb.image(output.body[3].cover, "cover_big", "jpg"),
		game5Id: gamesArray[4],
		game5Title: output.body[4].name,
		game5Thumb: igdb.image(output.body[4].cover, "cover_big", "jpg"),
		game6Id: gamesArray[5],
		game6Title: output.body[5].name,
		game6Thumb: igdb.image(output.body[5].cover, "cover_big", "jpg")
	}
}



/*Auxiliary functions*/

var compareArray = (arr,value)=>{
	for(var index1 = 0; index1 < arr.length; index1++){
		if(value === arr[index1]){
			return true;
		}
	}
	return false;
}

/****************/
/*Module exports*/
/****************/
module.exports = {
	genreArray,
	gameCategory,
	genreResolve,
	searchResultsList,
	gameViewRenderObject,
	companyViewRenderObject,
	systemViewRenderObject,
	renderHome,
	gamesArray,
	consoleResolve,
	consoleMultipleResolve,
	consoleArrayResolve,
	consoleArrayToLinks,
	gameToConsoleLinks
}
