const form = document.querySelector('form');
const button = document.querySelector('button');
const input = document.querySelector('.search');
const h1 = document.querySelector('h1');
const h2 = document.querySelector('h2');
const p = document.querySelector('p');
const weather_div = document.querySelector('.weather');
const h1Error = document.querySelector('.error');

form.addEventListener("submit", function(e){
  e.preventDefault();
  if (input.value.trim() === '') {
    return false;
  }
  getWeather();
})

function getWeather() {
  button.textContent = 'Loading';
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
}

function render(data) {
  button.textContent = 'Search';
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
    console.log(data);
    showError('Something went wrong.');
  }
}
