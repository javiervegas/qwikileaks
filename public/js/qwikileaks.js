var spinner = null;
var app = $.sammy(function() {
  this.get('#!', function() {
    $('#start').show();
    $('#spinner').hide();
  });
  this.get('#!/:term', function() {
    $('#start').hide();
    $('#spinner').show();
    spinner =  new Spinner('spinner', {
      radii:     [42, 62],
      color:     '#ed145b',
      dashWidth: 1.8,
      dashes:    75,
      padding: 3,
      opacity:   .8,
      speed:     .7
    }).play;
    var term = this.params['term'];
    $('#search').val(term);
    cablesearch(encodeURIComponent(term));
    $('#spinner').hide();
  });
  this.post('#!/search', function(context) {
    context.redirect('#!/'+encodeURIComponent(this.params['term']));
  });
});

var mock_mode = false;

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
        var pos =  4*x+40-150*i;
        context2D.drawImage(image, pos, 0);
     } 
	x++;
}


function cablesearch(q) {
	$('#results').html('');
	clearTimeout(timer);
	src = mock_mode?"/json/search.json":'https://www.googleapis.com/customsearch/v1?key=AIzaSyCmmCUH9YYgjb0tVoE4PBz-zITLdueYTDY&cx=016894559323830144684:psimmjsuxr4&q='+(q)+'&callback=cablegrab';
	$(document.body).append('<script src="'+src+'"><\/script>');
}


function cablegrab(r) {
  loaded = true;
  var cable = r.items[0];
  snippet = cable.snippet;
  //app.log(cable.title);
  //app.log(snippet);
  var link=cable.link.replace(/.*\/(.*)\.html/,'$1');
  src = mock_mode?"/json/cable.json":'http://cablesearch.org/cable/api/cable?id='+(link)+'&jsonp=cableread';
  $(document.body).append('<script src="'+src+'"><\/script>');
}

function cableread(r) {
  abstract = r.items[0].text;
  //abstract = abstract.replace("\n"," ");
  //abstract = abstract.replace(/\s+/," ");
  abstract = abstract.substring(abstract.indexOf("SUBJECT"),abstract.length);
  //app.log(abstract);
  consume();
}
