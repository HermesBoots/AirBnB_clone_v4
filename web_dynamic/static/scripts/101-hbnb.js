let monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function numSuffix (num) {
  switch (num % 10) {
    case 3:
      return 'rd';
    case 2:
      return 'nd';
    case 1:
      return 'st';
    default:
      return 'th';
  }
}

function showPlace (place) {
  const article = $(`
    <article data-id="${place.id}">
      <div class="title">
        <h2>${place.name}</h2>
        <div class="price_by_night">${place.price_by_night}</div>
      </div>
      <div class="information">
        <div class="max_guest">
          <i class="fa fa-user fa-3x" aria-hidden="true"></i>
          <br>
          ${place.max_guest} Guests
        </div>
        <div class="number_rooms">
          <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
          <br>
          ${place.number_rooms} Rooms
        </div>
        <div class="number_bathrooms">
          <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
          <br>
          ${place.number_bathrooms} Bathrooms
        </div>
      </div>
      <div class='reviews' style="margin-top:40px;font-size:16px;border-bottom:1px solid #DDDDDD">
        <h2>Reviews</h2>
        <span>show</span>
      </div>
    </article>
  `);
  $('.places').append(article);
}

function showReview (review, place) {
  const elem = $(`
    <li>
      <h3>From ${userName} the ${date} ${month} ${year}</h3>
      <p>${review.text}</p>
    </li>
  `);
  let dateObj = new Date(review.updated_at);
  let userId = review.user_id;
  let date = dateObj.getDate() + numSuffix(dateObj.getDate());
  let month = monthNames[dateObj.getMonth()];
  let year = dateObj.getYear();
  $.get(`//localhost:5001/api/v1/users/${userId}`, function (body) {
    let userName = user.first_name + user.last_name;
  });
  place.find('.reviews').append(elem);
}

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

  //states
  const states = new Map();
  $('.filters .locations h2 input').on('change', function (event) {
    if (this.checked) { states.set(this.dataset.id, this.dataset.name); }
    if (!this.checked) { states.delete(this.dataset.id); }
    let text = '\xa0';
    if (states.size > 0) {
      text = Array.from(states.values()).join(', ');
    }
    $('.filters .locations h4').text(text);
  });

  //cities\
  const cities = new Map();
  $('.filters .locations ul li input').on('change', function (event) {
    if (this.checked) { cities.set(this.dataset.id, this.dataset.name); }
    if (!this.checked) { cities.delete(this.dataset.id); }
    let text = '\xa0';
    if (cities.size > 0) {
      text = Array.from(cities.values()).join(', ');
    }
    $('.filters .locations h4').text(text);
  });


  $.getJSON('//localhost:5001/api/v1/status/', function (body) {
    if (body.status === 'OK') { $('#api_status').addClass('available'); }
  });

  $('body').on('click', '.reviews>span', function () {
    const place = $(this).closest('article');
    const placeId = place[0].dataset.id;
    const spanTxt = $(this).text();
    if (spanTxt === "show") {
      $.get(`//localhost:5001/api/v1/places/${placeId}/reviews`, function (body) {
        body = body.sort((left, right) => -left.created_at.localeCompare(right.created_at));
        for (const review in body) { showReview(review, place); }
        $(this).text("hide");
      });
    } else if (spanTxt === "hide") {
      $('.reviews>li').hide();
      $(this).text("show");
    }
  });

  $('.filters button').click(function () {
    const body = JSON.stringify({
      amenities: Array.from(amenities.keys()),
      states: Array.from(states.keys()),
      cities: Array.from(cities.keys())
    });
    console.log(body);
    $.ajax({
      type: 'POST',
      url: '//localhost:5001/api/v1/places_search',
      data: body,
      contentType: 'application/json',
      success: function (body) {
        $('.places').empty();
        body = body.sort((left, right) => left.name.localeCompare(right.name));
        for (const place of body) { showPlace(place); }
      }
    });
  });
});
