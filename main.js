const form = document.querySelector('form');
const button = document.querySelector('button');
const input = document.querySelector('.search');
const h1 = document.querySelector('h1');
const h2 = document.querySelector('h2');
const p = document.querySelector('p');
const weather_div = document.querySelector('.weather');
const weatherFive_div = document.querySelector('.weatherFive');
const h1Error = document.querySelector('.error');
const loader = document.querySelector('.loader');

form.addEventListener("submit", function(e){
  e.preventDefault();
  if (input.value.trim() === '') {
    return false;
  }
  weatherFive_div.innerHTML = '';
  getWeather();
  getWeatherFive();
})

function getWeatherFive() {
  loader.classList.add('show');
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&units=metric&APPID=790b0cad877acccab6384572ca8dfa89`)
  .then(response => response.json())
  .then(function(data) {
    renderFive(data);
  })
  .catch(function() {
    button.textContent = 'Search';
    showError('Something went wrong.');
  });   
}

function renderFive(data) {
  loader.classList.add('hide');
  loader.classList.remove("show");
  let dataFive = data.list;
  const filtered = dataFive.filter(function(single) {
    if (single.dt_txt.includes('18:00:00') === true) {
      return true;
    }                
  })
  filtered.forEach(function(weather){
    const div = document.createElement('div');
    const temp = document.createElement('p');
    const date = document.createElement('p');
    const type = document.createElement('p');

    temp.innerHTML = Math.round(weather.main.temp) + ' °C';
    date.innerHTML = weather.dt_txt;
    type.innerHTML = weather['weather'][0]['main'];

    div.appendChild(temp);
    temp.appendChild(date);
    div.appendChild(type);
    weatherFive_div.appendChild(div);
  }) 
}


function getWeather() {
  loader.classList.add('show');
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=metric&APPID=790b0cad877acccab6384572ca8dfa89`)
  .then(response => response.json())
  .then(function(data) {
    render(data);
  })
  .catch(function() {
    button.textContent = 'Search';
    showError('Something went wrong.');
  });   
}

function showError(message) {
  weather_div.style.display = 'none';
  document.body.style.background = '#e74c3c';
  h1Error.style.display = 'block';
  h1Error.textContent = message;
  weatherFive_div.innerHTML = '';
}

function render(data) {
  loader.classList.add('hide');
  loader.classList.remove("show");
  if (data.cod === 200) {
    weather_div.style.display = 'block';
    document.body.style.background = '#2ecc71';
    h1Error.style.display = 'none';
    h1.innerHTML = `${data.name}, ${data.sys.country}`;
    h2.innerHTML = `${data.main.temp} °C`;
    p.innerHTML = data['weather'][0]['main'];
  } else if (data.cod === '404') {
    showError('City not found.');
  } else {
    showError('Something went wrong.');
  }
}
