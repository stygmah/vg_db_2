var hbs = require('hbs');


var arrayToLinksHBS = ()=>{
	/*Screenshot carousel list*/
	hbs.registerHelper('screenshot', function(items, options) {
  		var out = '';
  		for(var i=0, l=items.length; i<l; i++) {
    		if(i===0){
    			out = out + 
    				'<li class="orbit-slide is-active">'
      				+'<img class="orbit-image" src="' + options.fn(items[i]).replace(/ /g,'') + '">'
    				+'</li>';
    		}else{
    			out = out + 
    				'<li class="orbit-slide">'
      				+'<img class="orbit-image" src="' + options.fn(items[i]).replace(/ /g,'') + '">'
    				+'</li>';
    		}
  		}
  		return out;
	});
}

var searchHelpersHBS = ()=>{
  
}


module.exports = {
	arrayToLinksHBS
}