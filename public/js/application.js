$(function() {
  'use strict';

  $.ajax('/api/setup', { method: 'GET' }).then(function() {
    $('.loading').hide();
    $('.loaded').show();

    $('.order-new a.order-button').click(function() {
      $('.order-form').show();
      $('.order-new').hide();
      $('.order-count').hide();
    });
    $('.order-form a.order-button').click(function() {
      var name = $('.order-system input').val();
      $.ajax('/api/orders', {
        method: 'POST',
        data: { name: name }
      })
      .then(function(data) {
        return $.ajax('/api/orders');
      })
      .then(function(data) {
        $('.order-count .count').text(data.length);
        $('.order-count').show();
        $('.order-form').hide();
        $('.order-new').show();
      }, function() {
        $('.error.predefined').show();
      });
    })
  }, function(e) {
    console.log(e)
    $('.error.predefined').show();
  });
});
