 
var timer = null;

function search() {
	$(document.body).append('<script src="http://en.wikipedia.org/w/api.php?action=opensearch&search='+encodeURIComponent($('#search').val())+'&callback=lookup"><\/script>');
}

function lookup(result) {
	topics = result[1];
	$('#results').html('');
	for(i = 0; i < (topics.length > 5 ? 5 : topics.length); i++) {
		$('#results').append('<div>' + topics[i] + '</div>');
		$('#results div:last').click(function() { $('#search').val($(this).html()); qwiki(encodeURIComponent($(this).html())); });
	}
};

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
        var canvas = document.getElementById('photoCanvas');
        ctx= canvas.getContext("2d");
        for(var i=0; i<4; i++) {
		  var result = searcher.results[i];
		  try {
            if (ctx) {
              var image = new Image();
			  image.src = result['tbUrl'];
              ctx.drawImage(image,i*200,0);
            }
			slide += '<div class="img">';	
			slide += '<div class="caption">' + result['title'] + '</div>';
			slide += '<img src="' + result['tbUrl'] + '" />'
			slide += '</div>'
		  } catch (e) {alert(e)}
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
	chunk = abstract.substring(0,100);
	if(chunk == null) return;

	if(abstract.length > 100) {
		abstract = chunk.substring(chunk.lastIndexOf(" ")) + abstract.substring(100);
		chunk = chunk.substring(0, chunk.lastIndexOf(" "));
	} else {
		abstract = '';
	}
	app.log(chunk);
	document.getElementById('voice').src = '/sound/neospeech.mpeg';
	//document.getElementById('voice').rel="noreferrer";
	//document.getElementById('voice').src = 'http://translate.google.com/translate_tts?tl=en&q=' + encodeURIComponent(chunk);
     //document.getElementById('voice').src = 'http://www.neospeech.com/GetAudio1.ashx?speaker=103&content='+encodeURIComponent(chunk);
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



