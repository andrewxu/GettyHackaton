// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
(function ($) {
	"use strict";

	$(document).ready(function () {
		var map, markers;
		initialize();

		$('#search').click(function(event) {
			redrawMap();
            $('#info').hide();
            $('#main-description').hide();
            refreshImages('cats');
			searchAndPlot($('#searchBar').val());
		});

        map.on('zoomstart', function () {
            var searchTerm = $('#searchBar').val();
            if (searchTerm) {
                refreshImages();               
            }
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

        if (!$('#image-cont').hasClass('inited')) {
            $('#image-cont').html('loading images..');
            $('#image-cont').addClass('inited');
        }
        console.log('refreshing image');
       $.get('index/image.json?phrase='+keyword+'&zoom='+map.getZoom()+'&long='+lnt+'&lat='+lat+'&num=4', function(data) {
            var imgdata = '';
            
            if (data) {
                var undefound = false;
                $.each(data, function (key, img) {
                    imgdata += '<img class="sample-image" src="'+img.image+'" alt="'+img.caption+'" title="'+img.caption+'">';
                    if (img.image == undefined) {
                        undefound = true;
                    }
                });

                if (undefound) { 
                    $('#image-cont').fadeOut("slow", function(){
                        $('#image-cont').html(imgdata);
                        $('#image-cont').fadeIn("slow");
                    });
                    console.log('image replaced');
                }
            }
        });
    }

	function searchAndPlot(searchTerm) {
		redrawMap();
		$("#tweets").liveTwitter(searchTerm, {rpp: 300000, filter: function(tweet){
			if(tweet.geo != null) {
				plotTweet(tweet);
			}
			return (tweet.geo != null);
		}});
	}
	

	function plotTweet(tweet) {
		var location = new L.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]),
			marker = new L.Marker(location);

			marker.on('click', function() {
				$('#info').empty();
                var tweetMarkup = '<div class="tweet">' + tweet.text + '</div>';
				$('#info').append(tweetMarkup);
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
