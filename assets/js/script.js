// Initial Variables
var cities = [];

var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

// Search box event
var formSumbitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();

    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else{
        alert("Please enter a City");
    }

    saveSearch();
    pastSearch(city);
}

// Save search to localStorage
var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

// Introduction of open weather API
var getCityWeather = function(city) {
    var apiKey= "844421298d794574c100e3409cee0499"
    var apiURL= `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

// Show weather based on user chosen city
var displayWeather = function(weather, searchCity) {
   // Remove previous city forecast
   weatherContainerEl.textContent= "";  
   citySearchInputEl.textContent=searchCity;

   // Displays current date
   var currentDate= document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearchInputEl.appendChild(currentDate);

   // Display weather conditions icons
   var weatherIcon= document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInputEl.appendChild(weatherIcon);

   // Temperature data
   var temperatureEl= document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "list-group-item"
  
   // Humidity Data
   var humidityEl= document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"

   // Wind data
   var windSpeedEl= document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"

   // Append to container
   weatherContainerEl.appendChild(temperatureEl);
   weatherContainerEl.appendChild(humidityEl);
   weatherContainerEl.appendChild(windSpeedEl);

   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   getUvIndex(lat,lon)
}

// Introduces UV Index
var getUvIndex = function(lat,lon) {
    var apiKey= "844421298d794574c100e3409cee0499"
    var apiURL= `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayUvIndex(data)
        });
    });
}
 
// Displays weather UV Index
var displayUvIndex = function(index) {
    // Shows UV Index
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    // Shows if weather is favorable, moderate or severe
    if(index.value <=2) {
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8) {
        uvIndexValue.classList = "severe"
    };

    // Append the Index to the chosen city
    uvIndexEl.appendChild(uvIndexValue);
    weatherContainerEl.appendChild(uvIndexEl);
}

// Introduces the 5day API
var get5Day = function(city) {
    var apiKey= "844421298d794574c100e3409cee0499"
    var apiURL= `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
           display5Day(data);
        });
    });
};

// Shows the estimated forecast of selected city up to five days
var display5Day = function(weather) {
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast";

    var forecast= weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast= forecast[i];
        
       // Forecast card 
       var forecastEl=document.createElement("div");
       forecastEl.classList= "card bg-primary text-light m-2";

       // Display current date
       var forecastDate= document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList= "card-header text-center"
       forecastEl.appendChild(forecastDate);
       
       // Image of current weathehr conditions
       var weatherIcon= document.createElement("img")
       weatherIcon.classList= "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       // Append to the forecast card
       forecastEl.appendChild(weatherIcon);

       // Shows temperature
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList= "card-body text-center";
       forecastTempEl.textContent= dailyForecast.main.temp + " °F";

       // Append temperature to forecast card
        forecastEl.appendChild(forecastTempEl);

       // Shows percentage of rian
       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList= "card-body text-center";
       forecastHumEl.textContent= dailyForecast.main.humidity + "  %";

       // Append to the forecast card
       forecastEl.appendChild(forecastHumEl);

       // Append all to the forecast card
       forecastContainerEl.appendChild(forecastEl);
    }

}

// Display previous searches
var pastSearch = function(pastSearch) {
 
    pastSearchEl= document.createElement("button");
    pastSearchEl.textContent= pastSearch;
    pastSearchEl.classList= "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
}

// Event for previous searches
var pastSearchHandler = function(event) {
    var city= event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

cityFormEl.addEventListener("submit", formSumbitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);