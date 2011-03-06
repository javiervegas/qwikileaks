
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
