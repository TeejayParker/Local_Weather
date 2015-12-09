$(document).ready(function () {
    function showWeather(el) {
        navigator.geolocation.getCurrentPosition(success, err);
        function err(e) {
            el.text('Geolocation error ' + e.code + ': ' + e.message);
        }

        function success(pos) {
            var lat = pos.coords.latitude;
            var long = pos.coords.longitude;
            // Create a url for a GET request
            var url = 'http://api.openweathermap.org/data/2.5/weather?' + 'lat=' + lat + '&lon=' + long + '&units=metric' + '&APPID=435b46fa1cb21702b91736f300312c5c';
            $.getJSON(url)
                .done(function (data) {

                    // Create handlebars.js template
                    var img = "https://dl.dropboxusercontent.com/u/28151607/icons/" + data.weather[0].icon + '.png';
                    var source = $("#weather_display").html();
                    var template = Handlebars.compile(source);
                    var context = template({
                        city: data.name,
                        country: data.sys.country,
                        image: img,
                        temperatureC: data.main.temp.toFixed(0),
                        temperatureF: celcToFahr(data.main.temp),
                        clouds: cloudiness(data.clouds.all),
                        wind: 'Wind: ' + data.wind.speed + ' m/s'
                    });
                    el.html(context);

                    console.log(data.weather[0].icon);
                    setBackground(data.weather[0].icon);
                    $(".loading").fadeOut("slow");

                })
                .fail(function () {
                    el.append($('<div id="err"></div>').text('Could not get the data at the moment. Please try again later.'));
                })
        }
    }

    // Function to convert percentage of cloudiness to its verbal description
    // source: http://www.theweatherprediction.com/habyhints/189/
    function cloudiness(cloudPercentage) {
        switch (true) {
            case (cloudPercentage <= 10):
                return 'Clear sky';
            case (cloudPercentage > 10 && cloudPercentage <= 20):
                return 'Fair';
            case (cloudPercentage > 20 && cloudPercentage <= 35):
                return 'Mostly Sunny';
            case (cloudPercentage > 35 && cloudPercentage <= 60):
                return 'Partly Cloudy';
            case (cloudPercentage > 60 && cloudPercentage <= 85):
                return 'Mostly Cloudy';
            default:
                return 'Cloudy';
        }
    }

    // Set background of the container according to the time of a day or weather conditions
    // based on the icon from the API
    function setBackground(icon) {
        if (icon[icon.length - 1] == 'n') {
            $(".container").css("background-image", "url('https://dl.dropboxusercontent.com/u/28151607/backgrounds/moon.jpg')");
        } else {
            if (icon == '50d') {
                $(".container").css("background-image", "url('https://dl.dropboxusercontent.com/u/28151607/backgrounds/fog.jpg')");
            } else if (icon == '02d' || icon == '03d' || icon == '04d') {
                $(".container").css("background-image", "url('https://dl.dropboxusercontent.com/u/28151607/backgrounds/cloudy1.jpg')");
            } else if (icon == '09d' || icon == '10d' || icon == '11d') {
                $(".container").css("background-image", "url('https://dl.dropboxusercontent.com/u/28151607/backgrounds/rain.jpg')");
            } else if (icon == '13d') {
                $(".container").css("background-image", "url('https://dl.dropboxusercontent.com/u/28151607/backgrounds/snow.jpg')");
            } else {
                $(".container").css("background-image", "url('https://dl.dropboxusercontent.com/u/28151607/backgrounds/sun.jpg')");
            }
        }
    }

    // Convert Celcius to Fahrenheit + round to integer
    function celcToFahr(celcius) {
        return (celcius * (9 / 5) + 32).toFixed(0);
    }

    var c = $('#inner_cont');

    showWeather(c);

});
