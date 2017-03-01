
/*API Call Values*/
var gameRenderFields = "id,name,category,genres,cover,summary,release_dates,first_release_date,publishers,developers,screenshots,hypes";
var featuredGamesArray = [7346, 11156, 18320, 19562, 19765, 26761, 7349, 25076, 10031, 1111, 1234, 2200];

/*Home*/
var futureReleasesParams = {
	limit:10, 
	fields: "name", 
    order: "first_release_date:asc",
    filters:{
    'first_release_date-gt': Date.now(),
    'first_release_date-lt': Date.now()+15983864500,
    'publishers-exists': 0
  }
};













/*exports*/
module.exports = {
	gameRenderFields,
	featuredGamesArray,
	futureReleasesParams
}