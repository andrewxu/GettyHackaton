// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
(function ($) {
	"use strict";

	$(document).ready(function () {

		var	map = new L.Map('map', {
			center: new L.LatLng(37.8,-96.9),
			zoom: 3,
		});


		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/30d1976aef28416ba4e9ed7cdd909ad8/5870/256/{z}/{x}/{y}.png',
		cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18});
		map.addLayer(cloudmade);

		map.setView(new L.LatLng(40, -90), 3);                

/*    	$.ajax({
    		type: 'GET',
    		url: 'test.json',
    		dataType: 'json',
    		success: plotPoints,
    		error:  function(req, message) {
    			console.log('Error loading map: ' + message);
    		}
    	});*/
	var markers = new L.MarkerClusterGroup();

	function plotPoints(json) {
		$.each(json, function(i, item){
			var location = new L.LatLng(item.coords.lat, item.coords.long);
			var marker = new L.Marker(location);
			var msg = '<h3>' + item.city + '</h3>' + 
			'<img src="' + item.image + '">' +
			'<p>something something shomething seomthigggg</p>';
			marker.bindPopup(msg);
			markers.addLayer(marker);
		});

		map.addLayer(markers);
	}

	function plotTweet(tweet) {
		var location = new L.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);
		var marker = new L.Marker(location);
		var msg = '<p>' + tweet.text + '</p>';

		marker.bindPopup(msg);
		markers.addLayer(marker);
		map.addLayer(markers);
	}

	$("#tweets").liveTwitter('food', {rpp: 300000, filter: function(tweet){
		if(tweet.geo != null) {
			plotTweet(tweet);
		}
	}});
});
})(jQuery);
