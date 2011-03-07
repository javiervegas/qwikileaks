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





