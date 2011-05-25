# qwikileaks

A Qwiki mini-clone written using the Sammy.js framework. It uses the Google
search API to search in a wikileaks repository, then uses the cablesearch.org 
API to download the relevant cable content, calls again the Google API to
download relevant images and makes them move around in the screen while reading 
the cables using the Neospeech Text-to-Speech API. All the action happens in the
qwikileaks.js file.

It is deployed as a Sinatra app so I could use haml and sass for the template.
It uses the HTML5 canvas element to animate images.

Available online at http://qwikileaks.net
