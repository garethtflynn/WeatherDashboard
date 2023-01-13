// variables 
var currentInfo = document.getElementById('currentInfo')
var currentCity = document.getElementById('city')
var temp = document.getElementById('temp')
var wind = document.getElementById('wind')
var humidity = document.getElementById('humidity')
var uvIndex = document.getElementById('uvIndex')
var fiveCards = document.getElementById('cards')
var futureForecast = document.getElementById('fiveDay')
var clearHistoryBtn = document.getElementById('clearHistory')
var cityBtn = document.getElementById('searchCityBtn')
var searchedCity = JSON.parse(localStorage.getItem('cityName')) || [] 

// API key
const key = '60f4014c529f2761598d19c3516e8ede'

// displays the current date.
var date = moment().format('L');
$('#date').text(date)

// searching city
$('#searchBtn').click(function (event) {
    event.preventDefault();   

    let input = document.getElementById('searchBar').value
    if (input === " ") {
        console.log("City not found! Please try again");
        return; 
    }
    else {
        console.log("city searched!")
        console.log(searchedCity)
        console.log(city)
        var oldSearch = input
        var newSearch = oldSearch.toUpperCase()
        searchCity(newSearch)
    } 
})

$("#clearHistory").click(function () {
    console.log('Clear History')
    localStorage.clear()
    location.reload();
})


// searchinng city with previous searched city buttons
$('#searchedCityBtn').click(function(event) {
    event.preventDefault();
    var cityName = event.target.innerHTML
    if (cityName === '') {
        console.log('not working')
        alert('Please search for vail city!')
        return
    } else {
        console.log('button pressed')
        console.log(cityName)
        searchCity (event.target.innerHTML)
        console.log(event.target.innerHTML)
    }

})

// setting searched cities as buttons to click on and search again
function cityButtons() {
    var button = JSON.parse(localStorage.getItem('cityName'))
    var searchHisBtn = document.getElementById('searchedCityBtn')
    searchHisBtn.innerHTML = ''
    for (i = 0; i < searchedCity.length; i++) {
        const createBtn = document.createElement('button')
        createBtn.classList.add('searchedCityBtn')
        createBtn.textContent = button[i] 
        searchHisBtn.append(createBtn)
    }
}




// searching by city and setting to local storage 
function searchCity (city) {
    currentInfo.classList.remove('hide')
    futureForecast.classList.remove('hide')
    
    if (!searchedCity.includes(city)) {
    searchedCity.push(city)}
    localStorage.setItem('cityName', JSON.stringify(searchedCity))
    console.log(searchedCity)
    
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=60f4014c529f2761598d19c3516e8ede&units=imperial'

    console.log(city) 

    fetch(requestUrl, {
        cache: 'reload',
    })
    .then(function(response){
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        cityInfo = data 
        city = data.name
        lat = data.coord.lat
        lon = data.coord.lon

        var uvUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityInfo.coord.lat + '&lon=' + cityInfo.coord.lon + '&units=imperial&appid=60f4014c529f2761598d19c3516e8ede'

        fetch (uvUrl, {
            cache: 'reload',
        }) 
        .then(function(responseUv){
            return responseUv.json();
        })
        .then(function (dataUv){
            console.log (dataUv)

            cityInfo = dataUv
            localStorage.setItem('recentCity', JSON.stringify(dataUv))
            
            $('#city').text(city)
            $('#currentDayimg').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
            $('#temp').text('Temp: ' + cityInfo.current.temp + '°F')
            $('#wind').text('Wind: ' + cityInfo.current.wind_speed + 'mph')
            $('#humidity').text('Humidity: ' + cityInfo.current.humidity + '%')
            $('#uvIndex').text('UV-Index: ' + cityInfo.current.uvi) 
            if (cityInfo.current.uvi <= 4) {
                uvIndex.classList.add('favorable');
            } 
            if (cityInfo.current.uvi > 4 && cityInfo.current.uvi <= 6 ){
                uvIndex.classList.add('moderate');
            } 
            if (cityInfo.current.uvi > 6) {
                uvIndex.classList.add('severe')
            }
        
            // forecast for day 1/5
            $('#day1').text(moment.unix(cityInfo.daily[1].dt).format('L'))
            $('#day1img').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
            $('#day1temp').text(cityInfo.daily[1].temp.day)
            $('#day1wind').text(cityInfo.daily[1].wind_speed)
            $('#day1humi').text(cityInfo.daily[1].humidity)
        
            // forecast for day 2/5
            $('#day2').text(moment.unix(cityInfo.daily[2].dt).format('L'))
            $('#day2img').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
            $('#day2temp').text(cityInfo.daily[2].temp.day)
            $('#day2wind').text(cityInfo.daily[2].wind_speed)
            $('#day2humi').text(cityInfo.daily[2].humidity)
            
            // forecast for day 3/5
            $('#day3').text(moment.unix(cityInfo.daily[3].dt).format('L'))
            $('#day3img').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
            $('#day3temp').text(cityInfo.daily[3].temp.day)
            $('#day3wind').text(cityInfo.daily[3].wind_speed)
            $('#day3humi').text(cityInfo.daily[3].humidity)
        
            // forecast for day 4/5
            $('#day4').text(moment.unix(cityInfo.daily[4].dt).format('L'))
            $('#day4img').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
            $('#day4temp').text(cityInfo.daily[4].temp.day)
            $('#day4wind').text(cityInfo.daily[4].wind_speed)
            $('#day4humi').text(cityInfo.daily[4].humidity)
        
            // forecast for day 5/5
            $('#day5').text(moment.unix(cityInfo.daily[5].dt).format('L'))
            $('#day5img').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
            $('#day5temp').text(cityInfo.daily[5].temp.day)
            $('#day5wind').text(cityInfo.daily[5].wind_speed)
            $('#day5humi').text(cityInfo.daily[5].humidity)
            cityButtons()
        })    
    })
}

// getting uv-index using lat and lon from original fetch
// function getUv (city) {

//     var uvUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityInfo.coord.lat + '&lon=' + cityInfo.coord.lon + '&units=imperial&appid=60f4014c529f2761598d19c3516e8ede'

//     fetch (uvUrl, {
//         cache: 'reload',
//     }) 
//     .then(function(response){
//         return response.json();
//     })
//     .then(function (data){
//         console.log (data)
//         cityInfo = data
//         localStorage.setItem('recentCity', JSON.stringify(data))
//         displayWeather (city, cityInfo)
//     })    
// }

// displaying weather data in corresponding DOM area. 


function displayWeather(city, cityInfo) {
    // $('#city').text(city)
    // $('#currentDayimg').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
    // $('#temp').text('Temp: ' + cityInfo.current.temp + '°F')
    // $('#wind').text('Wind: ' + cityInfo.current.wind_speed + 'mph')
    // $('#humidity').text('Humidity: ' + cityInfo.current.humidity + '%')
    // $('#uvIndex').text('UV-Index: ' + cityInfo.current.uvi) 
    // if (cityInfo.current.uvi <= 4) {
    //     uvIndex.classList.add('favorable');
    // } 
    // if (cityInfo.current.uvi > 4 && cityInfo.current.uvi <= 6 ){
    //     uvIndex.classList.add('moderate');
    // } 
    // if (cityInfo.current.uvi > 6) {
    //     uvIndex.classList.add('severe')
    // }

    // // forecast for day 1/5
    // $('#day1').text(moment.unix(cityInfo.daily[1].dt).format('L'))
    // $('#day1img').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
    // $('#day1temp').text(cityInfo.daily[1].temp.day)
    // $('#day1wind').text(cityInfo.daily[1].wind_speed)
    // $('#day1humi').text(cityInfo.daily[1].humidity)

    // // forecast for day 2/5
    // $('#day2').text(moment.unix(cityInfo.daily[2].dt).format('L'))
    // $('#day2img').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
    // $('#day2temp').text(cityInfo.daily[2].temp.day)
    // $('#day2wind').text(cityInfo.daily[2].wind_speed)
    // $('#day2humi').text(cityInfo.daily[2].humidity)
    
    // // forecast for day 3/5
    // $('#day3').text(moment.unix(cityInfo.daily[3].dt).format('L'))
    // $('#day3img').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
    // $('#day3temp').text(cityInfo.daily[3].temp.day)
    // $('#day3wind').text(cityInfo.daily[3].wind_speed)
    // $('#day3humi').text(cityInfo.daily[3].humidity)

    // // forecast for day 4/5
    // $('#day4').text(moment.unix(cityInfo.daily[4].dt).format('L'))
    // $('#day4img').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
    // $('#day4temp').text(cityInfo.daily[4].temp.day)
    // $('#day4wind').text(cityInfo.daily[4].wind_speed)
    // $('#day4humi').text(cityInfo.daily[4].humidity)

    // // forecast for day 5/5
    // $('#day5').text(moment.unix(cityInfo.daily[5].dt).format('L'))
    // $('#day5img').attr('src', "https://openweathermap.org/img/wn/" + cityInfo.daily[1].weather[0].icon + ".png")
    // $('#day5temp').text(cityInfo.daily[5].temp.day)
    // $('#day5wind').text(cityInfo.daily[5].wind_speed)
    // $('#day5humi').text(cityInfo.daily[5].humidity)

}

cityButtons ()