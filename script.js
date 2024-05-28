const apiKey = '32b543025d51cafefd37ed68c1f00dd6';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

function searchWeather() {
    const locationInput = document.getElementById('locationInput').value;
    const url = `${apiUrl}?q=${locationInput}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('API Data:', data); // Log API data to check structure
            if (data && data.list) {
                displayWeather(data);
            } else {
                console.error('API data does not contain expected "list" property.');
                alert('Failed to get weather data, please check the city name and try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('An error occurred while retrieving weather data, please try again later.');
        });
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = ''; 

    const todayData = getTodayWeather(data.list);
    const tomorrowData = getNextDayWeather(data.list, 1).slice(0, 1);
    const afterTomorrowData = getNextDayWeather(data.list, 2).slice(0, 1);

    const todayWeatherContainer = document.createElement('div');
    todayWeatherContainer.classList.add('weather-container'); 
    todayWeatherContainer.style.overflowX = 'auto'; 

    displayWeatherForDay(todayData, 'Today', false, todayWeatherContainer); 

    weatherInfo.appendChild(todayWeatherContainer); // Append today's weather first

    if (tomorrowData.length > 0) {
        displayWeatherForDay(tomorrowData, getDayName(new Date(tomorrowData[0].dt * 1000)), true);
    }
    if (afterTomorrowData.length > 0) {
        displayWeatherForDay(afterTomorrowData, getDayName(new Date(afterTomorrowData[0].dt * 1000)), true);
    }

    for (let i = 3; i <= 5; i++) {
        const nextDayData = getNextDayWeather(data.list, i).slice(0, 1);
        if (nextDayData.length > 0) {
            displayWeatherForDay(nextDayData, getDayName(new Date(nextDayData[0].dt * 1000)), true);
        }
    }
}

function getTodayWeather(data) {
    const currentTime = new Date();
    currentTime.setMinutes(0);
    currentTime.setSeconds(0);

    const todayData = data.filter(item => item.dt * 1000 >= currentTime.getTime());

    if (todayData.length === 0) {
        return [];
    }

    const nextFiveData = [];
    for (let i = 0; i < todayData.length && nextFiveData.length < 8; i++) {
        nextFiveData.push(todayData[i]);
    }

    return nextFiveData;
}

function getNextDayWeather(data, daysAhead) {
    const targetDay = new Date();
    targetDay.setDate(targetDay.getDate() + daysAhead);
    return data.filter(item => {
        const date = new Date(item.dt * 1000);
        return date.toDateString() === targetDay.toDateString();
    });
}

function displayWeatherForDay(data, day, isSmallDisplay = false, container = null) {
    const weatherInfo = document.getElementById('weatherInfo');
    const weatherDay = document.createElement('div');
    weatherDay.classList.add('weather-day');

    if (isSmallDisplay) {
        weatherDay.classList.add('small-display');
    }

    weatherDay.innerHTML = `<h2>${day}</h2>`;

    const weatherItems = document.createElement('div');
    weatherItems.classList.add('weather-items');

    data.forEach((item, index) => {
        const weatherIcon = item.weather[0].icon;
        const temperature = Math.floor(item.main.temp); 
        const weatherItem = document.createElement('div');
        weatherItem.classList.add('weather-item');
        if (!isSmallDisplay) {
            let timeString;
            if (index === 0) {
                timeString = 'Now'; 
            } else {
                const time = new Date(item.dt * 1000);
                timeString = time.getHours() + ':00';
            }
            weatherItem.innerHTML = `<p>${timeString}</p>`;
        }
        weatherItem.innerHTML += `<img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"><p>${temperature}°C</p>`;
        weatherItems.appendChild(weatherItem);
    });

    weatherDay.appendChild(weatherItems);
    if (container) {
        container.appendChild(weatherDay);
    } else {
        weatherInfo.appendChild(weatherDay);
    }
}

function getDayName(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}
