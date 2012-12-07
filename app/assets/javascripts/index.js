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
            refreshImages('cats');
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

			$('.trend').each(function(i) {
				$(this).click(function(event) {
					event.preventDefault();
					searchAndPlot($(this).text());
				});
			});
		}

	function redrawMap() {

		$('#map-content').append('<div id="overlay"></div>');
		$("#overlay").css({
			'opacity' : 0.8,
			'top': 0,
			'left': 0,
			'background-color': 'black',
			'background': 'url("assets/loader.gif") center no-repeat #000',
			'height': '850px',
			'width': '100%',
			'z-index': 5000
		});
		markers.clearLayers();
		map.removeLayer(markers);
		$('#overlay').fadeOut('slow', function() {
			$(this).remove();
		});
	}

    function refreshImages() {

        var coords = map.getBounds().toBBoxString().split(','),
            keyword = $('#searchBar').val(),
           lnt = (parseFloat(coords[0])+parseFloat(coords[2]))/2,
           lat = (parseFloat(coords[1])+parseFloat(coords[3]))/2;

       $.get('index/image.json?phrase='+keyword+'&zoom='+map.getZoom()+'&long='+lnt+'&lat='+lat+'&num=1', function(data) {
            console.log(data[0].image);
            var imgsrc = '<img src="'+data[0].image+'">';
            $('#imager').html(imgsrc);
       });
    }

	function searchAndPlot(searchTerm) {
		fetchGettyImages();
		redrawMap();
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
				marker = new L.Marker(location);

			marker.on('click', function() {
				$('#info').empty();
				var num = Math.floor(Math.random() * (gettyImages.length + 1));
    
				var imageMarkup = '<div id="image-set">';
				for(var i = 0; i < 4; i++) {
					imageMarkup += '<img src="' + gettyImages[num+i].image + '"/>';
				}
				imageMarkup += '</div>';
				var tweetMarkup = '<div id="tweet">' + tweet.text + '</div>';
				$('#info').append(imageMarkup);
				$('#info').append(tweetMarkup);
			});

		markers.addLayer(marker);
		map.addLayer(markers);
	}
});
})(jQuery);
