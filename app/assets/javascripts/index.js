// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
(function ($) {
	"use strict";

	$(document).ready(function () {
		var map, markers;
		var gettyImages = [];
		initialize();

		$('#search').click(function(event) {
			redrawMap();
			searchAndPlot($('#searchBar').val());
		});

		function initialize() {

			var southWest = new L.LatLng(-58.077876, -168.750000),
			northEast = new L.LatLng(74.683250, 178.945313),
			bounds = new L.LatLngBounds(southWest, northEast);

			map = new L.Map('map', {
				center: new L.LatLng(28.304381, -21.445313),
				zoom: 1,
				maxBounds: bounds
			});

			var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/30d1976aef28416ba4e9ed7cdd909ad8/50838/256/{z}/{x}/{y}.png',
			cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18});
			map.addLayer(cloudmade);

			map.setView(new L.LatLng(40, -90), 3);                
			markers = new L.MarkerClusterGroup();
		}

	function redrawMap() {
		map.removeLayer(markers);
		markers = new L.MarkerClusterGroup();
	}

	function searchAndPlot(searchTerm) {
		fetchGettyImages();
		$("#tweets").liveTwitter(searchTerm, {rpp: 300000, filter: function(tweet){
			if(tweet.geo != null) {
				plotTweet(tweet);
			}
			return (tweet.geo != null);
		}});
	}
	
	function fetchGettyImages() {
			$.ajax({
				type: 'GET',
				url: 'test.json',
				dataType: 'json',
				success: function(response) {
					$.each(response, function(i, item){
						gettyImages.push(item);
					});
				},
				error:  function(req, message) {
					console.log('Error loading map: ' + message);
				}
			});
	}

	function plotTweet(tweet) {
		var location = new L.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]),
			marker = new L.Marker(location),
			num = Math.floor(Math.random() * (gettyImages.length - 6));

      var imageMarkup = '<div id="image-set"></div>';
			for(var i = 0; i < 6; i++) {
				imageMarkup += '<img id="image-' + i + '" class="image" src="' + gettyImages[num+i].image + '"/>';
				imageMarkup += '<div id="dialog-for-image-' + i + '" class="dialog" style="width:700px; display:none;">'
							+ '<img style="float:left; margin:0 10px 10px 0;" src="' + gettyImages[num+i].image + '"/>'
							+ '<div>'
								+ '<h3>' + gettyImages[num+i].title + '</h3>'
								+ '<p>' + gettyImages[num+i].caption + '</p>'
							+ '</div>'
							+ '</div>';
			}

			marker.on('click', function() {
				$('#info').replaceWith(imageMarkup);
				// $('#image-set').after('<div id="tweet">' + tweet.text + '</div>');
			});

		markers.addLayer(marker);
		map.addLayer(markers);
	}
	$('body').delegate('.image', 'click', function(e){
		var dialogID = '#dialog-for-' + e.target.id;
		$(dialogID).modal();
		return false;
	})
});
})(jQuery);
