$(document).ready(function() {
	'use strict';

	var grid = $('.instagram');
	$.getJSON('/instagram', function(data) {
		// Remove the loading text
		$('.instagram_container h2').remove();
		$.each(data, function(i, item) {
			grid.append('<li><a href="'
							+ item.link + '"><img src="'
							+ item.images.thumbnail.url + '" /></a></li>');
		});
	});

});