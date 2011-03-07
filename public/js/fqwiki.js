 
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
		//console.log(searcher.results[0]);
		try {
          for(var i=0; i<4; i++) {
			var result = searcher.results[i];
			slide += '<div class="img">';	
			slide += '<div class="caption">' + result['title'] + '</div>';
			slide += '<img src="' + result['tbUrl'] + '" />'
			slide += '</div>'
          }
		} catch (e) {}
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
	//document.getElementById('voice').src = 'http://translate.google.com/translate_tts?tl=en&q=' + encodeURIComponent(chunk);
     document.getElementById('voice').src = 'http://www.neospeech.com/GetAudio1.ashx?speaker=103&content='+encodeURIComponent(chunk);
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

function wikiabstract(r) {
	loaded = true;
	var rev = 0;
	for(key in r.query.pages)
		rev = key
	abstract = r.query.pages[rev].revisions[0]['*'];
	//console.log(abstract);
	// Holy bejeesus this is an insane bunch of regexes...
	abstract = (abstract.replace(/{{[^]*?({{[^{}]*?}}[^]*?)*}}/g,'').replace(/{{[^]*?}}/g,'').replace(/\[\[[^:\]]*:[^\]]*?\]\]/g,'').replace(/\([^]*?\)/g,'').replace(/<ref[^]*?\/ref>/g,'').replace(/<ref[^>]*\/>/g,'').replace(/\[\[[^\]]*?\|/g,'[[').replace(/'''?/g,'').replace(/\n/g,'').replace(/\*/g,'').replace(/<!--.*-->/g,''))
	
	//console.log(abstract);
	// Sanitizing out what would be search terms
	abstract = abstract.replace(/(\[\[|\]\])/g,'')
	consume();

}

// Get the wikipedia abstract
//var q = "select distinct ?abstract WHERE {<http://dbpedia.org/resource/Megan_Fox> dbpedia-owl:abstract ?abstract . FILTER langMatches( lang(?abstract), 'en' )}";
//document.write('<script src="http://dbpedia.org/sparql?query='+escape(q)+'&format=application/sparql-results%2Bjsonp&callback=result"><\/script>');

function qwiki(q) {
	$('#results').html('');
	clearTimeout(timer);
	//$(document.body).append('<script src="http://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&titles='+(q)+'&rvprop=content&rvsection=0&callback=wikiabstract"><\/script>');
	//$(document.body).append('<script src="https://www.googleapis.com/customsearch/v1?key=AIzaSyCmmCUH9YYgjb0tVoE4PBz-zITLdueYTDY&cx=016894559323830144684:psimmjsuxr4&q='+(q)+'&callback=cablesearch"><\/script>');
	$(document.body).append('<script src="/json/search.json"><\/script>');
}

