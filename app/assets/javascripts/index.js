// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
(function ($) {
	"use strict";

	$(document).ready(function () {

		$('#map-container').hide();
		$('#search').click(function() {
			$('#map-container').slideDown('slow', function() {
				initialize();
			});
		})

		var gettyImages = [],
			map;
		function initialize() {
			var southWest = new L.LatLng(-58.077876, -168.750000),
			northEast = new L.LatLng(74.683250, 178.945313),
			bounds = new L.LatLngBounds(southWest, northEast);

			map = new L.Map('map', {
				center: new L.LatLng(28.304381, -21.445313),
				zoom: 1,
				maxBounds: bounds
			});

			var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/30d1976aef28416ba4e9ed7cdd909ad8/5870/256/{z}/{x}/{y}.png',
			cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18});
			map.addLayer(cloudmade);

			map.setView(new L.LatLng(40, -90), 3);                

			$.ajax({
				type: 'GET',
				url: 'test.json',
				dataType: 'json',
				success: parseGettyResponse,
				error:  function(req, message) {
					console.log('Error loading map: ' + message);
				}
			});
			var markers = new L.MarkerClusterGroup();
		}

	function parseGettyResponse(response) {
		$.each(response, function(i, item){
			gettyImages.push(item.image);
		});
	}

	function plotTweet(tweet) {
		var location = new L.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]),
			marker = new L.Marker(location),
			num = Math.floor(Math.random() * (gettyImages.length + 1)),
			msg = '<h3>Hello there</h3><img src="' + gettyImages[num] + '"/><p>' + tweet.text + '</p>';

		marker.bindPopup(msg);
		markers.addLayer(marker);
		map.addLayer(markers);
	}

	$("#tweets").liveTwitter('food', {rpp: 300000, filter: function(tweet){
		if(tweet.geo != null) {
			console.log(tweet);
			plotTweet(tweet);
		}
	}});
});
})(jQuery);
