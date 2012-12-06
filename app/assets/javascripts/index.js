// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
(function ($) {
    "use strict";

    $(document).ready(function () {
        $("#tweets").liveTwitter('pasta', {rpp: 300000, filter: function(tweet){
            return (tweet.geo != null);
        }});
    });
})(jQuery);
