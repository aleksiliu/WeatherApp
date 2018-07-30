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

const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();

const newdate = year + "/" + month + "/" + day;

console.log(newdate);

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
  loader.classList.add('active');
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&units=metric&APPID=790b0cad877acccab6384572ca8dfa89`)
  .then(response => response.json())
  .then(function(data) {
    renderFive(data);
  })
  .catch(function() {
    showError('Something went wrong.');
  });   
}

function getDayOfWeek(date) {
  var dayOfWeek = new Date(date).getDay();    
  return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

function renderFive(data) {
  loader.classList.remove('active');
  let dataFive = data.list;
  const filtered = dataFive.filter(function(single) {
    console.log(single.dt_txt.includes(newdate));
    if (single.dt_txt.includes('18:00:00') === true && single.dt_txt.includes(newdate) != true) {
      return true;
    }                
  })
  filtered.forEach(function(weather){
    const div = document.createElement('div');
    const temp = document.createElement('p');
    const date = document.createElement('p');
    const type = document.createElement('p');

    let stringDate = weather.dt_txt.split(" ")[0];
    
    temp.innerHTML = Math.round(weather.main.temp) + ' °C';
    date.innerHTML = getDayOfWeek(stringDate);
    type.innerHTML = weather['weather'][0]['main'];

    div.appendChild(temp);
    temp.appendChild(date);
    div.appendChild(type);
    weatherFive_div.appendChild(div);
  }) 
}


function getWeather() {
  loader.classList.add('active');
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
  loader.classList.remove('active');
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
