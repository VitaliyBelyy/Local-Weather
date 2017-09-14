
$(document).ready(function() {

  var today = new Date(),
  day = ((today.getDate() < 10) ? "0" : "") + today.getDate(),
  weekDay = today.toLocaleString('en', {weekday: 'short'}),
  month = today.toLocaleString('en', {month: 'long'});
  
  clock();

  function clock() {
    var date = new Date(),
    minutes = ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes(),
    hours = ((date.getHours() < 10) ? "0" : "") + date.getHours();
    $('.control-info .time').text(''+hours+':'+minutes+'');
    setTimeout(clock, 100);
  }

  $('.weather-info .date').text(''+day+' '+month+' '+weekDay+'');

  setTimeout(bounceEffect, 20000);

  function bounceEffect() {
    $('.temperature .units').effect('bounce', {times:3}, 500);
    setTimeout(bounceEffect, 20000);
  }

  $('.temperature .units').click(function() {
    $('.temperature, .daily-temp').toggleClass('fahrenheit');
    if ($(this).text() == 'C') {
         $(this).text('F');
    }
    else {
        $(this).text('C');
    }
  });

  var APPID = 'bd5e378503939ddaee76f12ad7a97608';                           

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locationSuccess);
  }
  else {
    $('.error-message p').text("Your browser does not support Geolocation!");
  }

  function locationSuccess(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    var API = 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=metric&APPID='+APPID+'';
    $.getJSON(API, function(data){
      var city = data.name,
      description = data.weather[0].description,
      temperatureC = Math.round(data.main.temp),
      icon = data.weather[0].icon;

      $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=imperial&APPID='+APPID+'', function(data){
        var temperatureF = Math.round(data.main.temp);
        $('.temperature .value.fahrenheit').text(''+temperatureF+'');
      });

      $.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lon+'&units=metric&cnt=7&APPID='+APPID+'', function(data){
        for(var i = 1; i < data.list.length; i++) {
          var thumbnail = data.list[i].weather[0].icon,
          maxTempC = Math.round(data.list[i].temp.max),
          minTempC = Math.round(data.list[i].temp.min),
          dayOfTheWeek =  new Date(data.list[i].dt * 1000).toLocaleString('en', {weekday: 'short'});

          $.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lon+'&units=imperial&cnt=7&APPID='+APPID+'', (function(i, thumbnail, maxTempC, dayOfTheWeek) {
              return function (r) {
                var maxTempF = Math.round(r.list[i].temp.max),
                minTempF = Math.round(r.list[i].temp.min);

                var dailyForecast = 
                  '<div class="thumbnail-wrapper">\
                    <img src="images/thumbnails/'+thumbnail+'.png" alt="weather-thumbnail">\
                  </div>\
                  <div class="daily-temp">\
                    <p class="value celsius">'+maxTempC+'&#176;/'+minTempC+'&#176;</p>\
                    <p class="value fahrenheit">'+maxTempF+'&#176;/'+minTempF+'&#176;</p>\
                  </div>\
                  <p>'+dayOfTheWeek+'</p>';

                $('.daily-forecast').append($('<li></li>').html(dailyForecast));
              };
          })(i, thumbnail, maxTempC, dayOfTheWeek));
        }
      });

      $('.status .city').text(''+city+'');
      $('.status .description').text(''+description+'');
      $('.temperature .value.celsius').text(''+temperatureC+'');
      $('.weather-info .icon-wrapper').append($('<img src="images/'+icon+'.png" alt="weather-icon">'));

      $('.error-message').css({
        'background': 'rgba(255, 255, 255, .7) url(images/spinner.gif) no-repeat center',
        'font-size': '0'
      });

      setTimeout(function() {
        $('.error-message').hide();
        $('.weather-info').show();
        switch(true) {
          case (temperatureC > 25):
            $('.display-wrapper').addClass('hot');
            break;
          case (temperatureC >= 15 && temperatureC <= 25):
             $('.display-wrapper').addClass('warm');
            break;
          case (temperatureC >= 5 && temperatureC < 15):
             $('.display-wrapper').addClass('cold');
            break;
          default:
             $('.display-wrapper').addClass('frost');
            break;
        }
      }, 1000);
      
    });

  }

});