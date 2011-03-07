

function qwiki(q) {
	$('#results').html('');
	clearTimeout(timer);
	//$(document.body).append('<script src="http://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&titles='+(q)+'&rvprop=content&rvsection=0&callback=wikiabstract"><\/script>');
	//$(document.body).append('<script src="https://www.googleapis.com/customsearch/v1?key=AIzaSyCmmCUH9YYgjb0tVoE4PBz-zITLdueYTDY&cx=016894559323830144684:psimmjsuxr4&q='+(q)+'&callback=cablesearch"><\/script>');
	$(document.body).append('<script src="/json/search.json"><\/script>');
}


function cablesearch(r) {
  loaded = true;
  var cable = r.items[0];
  snippet = cable.snippet;
  //app.log(cable.title);
  //app.log(snippet);
  var link=cable.link.replace(/.*\/(.*)\.html/,'$1');
  $(document.body).append('<script src="http://cablesearch.org/cable/api/cable?id='+(link)+'&jsonp=cablegrab"><\/script>');
}

function cablegrab(r) {
  abstract = r.items[0].text;
  //abstract = abstract.replace("\n"," ");
  //abstract = abstract.replace(/\s+/," ");
  abstract = abstract.substring(abstract.indexOf("SUBJECT"),abstract.length);
  //app.log(abstract);
  consume();
}

var canvas = null;
var context2D = null;
var x = 0;
var images = new Array();

window.onload = init;
function init() {
  canvas = document.getElementById('photoCanvas');
  context2D = canvas.getContext('2d');
  setInterval(draw, 50);
}
        
function draw()
{
	context2D.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<images.length; i++) {
        var image = images[i];
        var pos =  4*x+400-150*i;
        context2D.drawImage(image, pos, 0);
     } 
	x++;
}
