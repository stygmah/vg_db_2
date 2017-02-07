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
	var htmlString ='<ul>';
	for (var i = 0; i < search.length; i++) {
		htmlString += linkSearch(search[i], type);
	};
	return htmlString+'</ul>';
}


/**RENDER OBJECTS**/
/******************/

/*Game View*/
var gameViewRenderObject = (output)=>{
	return {
      css: "views",
      pageTitle: output.body[0].name,
      gameTitle: output.body[0].name,
      gameCategory: gameCategory[output.body[0].category],
      genre1: genreResolve(output.body[0].genres,0),
      genre2: genreResolve(output.body[0].genres,1),
      image:  igdb.image(output.body[0].cover, "cover_big", "jpg") || "no image",
      summary: output.body[0].summary/*.substring(0, 700) */|| output.body[0].name+" has no description yet"
  };
}
/*Company view*/
var companyViewRenderObject = (output)=>{
	return {
      css: "views",
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
      css: "views",
      pageTitle: output.body[0].name,
      systemName: output.body[0].name,
      image:  igdb.image(output.body[0].logo, "cover_big", "jpg") || "no image",
      summary: output.body[0].summary/*.substring(0, 700) */|| output.body[0].name+" has no description yet"
  };
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
	systemViewRenderObject
}
