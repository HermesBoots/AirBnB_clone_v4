$(function () {
  const amenities = new Map();
  $('.filters .amenities input').on('change', function (event) {
    if (this.checked) { amenities.set(this.dataset.id, this.dataset.name); }
    if (!this.checked) { amenities.delete(this.dataset.id); }
    let text = '\xa0';
    if (amenities.size > 0) {
      text = Array.from(amenities.values()).join(', ');
    }
    $('.filters .amenities h4').text(text);
  });

  $.getJSON('//0.0.0.0:5001/api/v1/status/', function (body) {
    if (body.status === 'OK') { $('#api_status').addClass('available'); }
  });
});
