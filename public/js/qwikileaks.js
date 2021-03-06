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

var timer = null;
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

google.load('search', '1.0');

function GetImages(query) {
	var searchControl = new google.search.SearchControl();
	searchControl.addSearcher(new google.search.ImageSearch());
	searchControl.draw(document.getElementById("searchcontrol"));
	searchControl.execute(query);
	searchControl.setSearchCompleteCallback(this, imagesDone);
}

var zoomed = 0;
var results = null;
function imagesDone(sc, searcher) {
	slide = '<div class="images_slide">';
	if ( searcher.results && searcher.results.length > 0) {
		results = searcher.results;
        for(var i=0; i<4; i++) {
		  var result = searcher.results[i];
		  try {
			slide += '<div class="img">';	
			slide += '<div class="caption">' + result['title'] + '</div>';
			slide += '<img src="' + result['tbUrl'] + '" />'
			slide += '</div>'
      		if (context2D) {
                var image = new Image();
			  image.src = result['tbUrl'];
                images.push(image);
              }
		  } catch (e) {}
        }
	}
	document.getElementById('images').innerHTML += slide + '</div>';
	$('.images_slide:first').remove();
	$('.images_slide:first').animate({left: '-800px'});
	$('.images_slide:last').animate({left: '0px'});
	zoomed = 0;
	zoom();
}

function zoom() {
	if(zoomed == 4) {
		//$('.fullimg').each(function() {$(this).animate({opacity: 0.5});});
		zoomed += 1;
		setTimeout('zoom()', 1000);
		return;
	}
	if(zoomed == 5) {
		$('.fullimg:first').remove();
		$('.fullimg:first').remove();
		$('.fullimg:first').remove();
		return;
	}
	$('.images_slide:last').append('<img class="fullimg" src="' + results[zoomed]['unescapedUrl'] + '" style="position: absolute; top: 0px; left: 0px; opacity: 0.0;" width="800px"/>');
	$('.fullimg:last').animate({opacity: 1.0, width: 850, top: (Math.random() - 0.5)*20 - 25, left: (Math.random() - 0.5)*20 - 25}, 2000)
	zoomed += 1
	setTimeout('zoom()', 2000);
}

var abstract = null;
var loaded = null;

function consume() {
     chunk_size = 150; 
	chunk = abstract.substring(0,chunk_size);
	if(chunk == null) return;

	if(abstract.length > chunk_size) {
		abstract = chunk.substring(chunk.lastIndexOf(" ")) + abstract.substring(chunk_size);
		chunk = chunk.substring(0, chunk.lastIndexOf(" "));
	} else {
		abstract = '';
	}
	src = mock_mode?'/sound/neospeech.mpeg':'http://www.neospeech.com/GetAudio1.ashx?speaker=103&content='+encodeURIComponent(chunk);
     document.getElementById('voice').src = src;
	GetImages(chunk);

	$('.sentence:first').remove();
	$('.sentence:first').animate({marginTop: '-30px'});
	$('#abstract').append('<div class="sentence">' + chunk + '</div>');
}

// Save the abstract and set up the first results
function result(r) {
	loaded = true;
	abstract = r['results']['bindings'][0]['abstract']['value'];
	abstract = abstract.substring(0, abstract.lastIndexOf("."));
	consume();
}

 