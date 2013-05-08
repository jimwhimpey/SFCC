$(document).ready(function() {
  'use strict';

  var grid = $('#instagram_grid');
  $.getJSON('/instagram', function(data) {
    $.each(data, function(i, item) {
      grid.append('<li><a href="'
                 + item.link + '" target="_blank"><img src="'
                 + item.images.thumbnail.url + '" /></a></li>');
    });
  })
});