

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
  app.log(cable.title);
  app.log(snippet);
  var link=cable.link.replace(/.*\/(.*)\.html/,'$1');
  $(document.body).append('<script src="http://cablesearch.org/cable/api/cable?id='+(link)+'&jsonp=cablegrab"><\/script>');
}

function cablegrab(r) {
  abstract = r.items[0].text;
  //abstract = abstract.replace("\n"," ");
  //abstract = abstract.replace(/\s+/," ");
  abstract = abstract.substring(abstract.indexOf("SUBJECT"),abstract.length);
  app.log(abstract);
  consume();
}

// target frames per second
const FPS = 300;
var x = 0;
var y = 0;
var xDirection = 10;
var yDirection = 1;
var canvas = null;
var context2D = null;

function draw(image,i)
{
	//context2D.clearRect(0, 0, canvas.width, canvas.height);
	context2D.drawImage(image, x+200*i, y);
	x += 1 * xDirection;
	y += 1 * yDirection;
	
	if (x >= 450)
	{
		x = 450;
		xDirection = -1;
	}
	else if (x <= 0)
	{
		x = 0;
		xDirection = 1;
	}
	
	if (y >= 250)
	{
		y = 250;
		yDirection = -1;
	}
	else if (y <= 0)
	{
		y = 0;
		yDirection = 1;
	}
}
