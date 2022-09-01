// Translate 

import translation from "./language.js";

const language = document.querySelector('.languages');
language.value = localStorage.getItem('language');
if(!language.value){
    language.value = 'en';
}

let lang = language.value;

let settings = document.querySelectorAll('.setting-section span');
settings.forEach(el => el.textContent =  translation[lang][el.textContent]);
let laguageOption = document.querySelectorAll('.languages option');
laguageOption.forEach(el => {
    let text = el.textContent;
    el.textContent =  translation[lang][text];
});

language.onchange = ()=>{
    localStorage.setItem('language', language.value);
    location.reload();
}

// Date
const time = document.querySelector('.time');
const date = document.querySelector('.date');

const options = {weekday: 'long', month: 'long', day: 'numeric'};
setInterval(() => {
    time.textContent = new Date().toLocaleTimeString();
    date.textContent = new Date().toLocaleDateString(translation[lang]['localDate'], options);}, 1000);

// Greeting

const greeting = document.querySelector('.greeting-text');

function timeOfDay(){
    if(new Date().getHours() >= 6 && new Date().getHours() < 12){
        return 'morning';
    }else if(new Date().getHours() >= 12 && new Date().getHours() < 18){
        return 'afternoon';
    }else if(new Date().getHours() >= 18 && new Date().getHours() < 24){
        return 'evening';
    }else{
        return 'night';
    }
}

setInterval(() => {
    greeting.textContent = translation[lang][timeOfDay()]
}, 1000);

const nameOfUser = document.querySelector('.name');
nameOfUser.placeholder = translation[lang]['placeholder'];
nameOfUser.value = localStorage.getItem('nameOfUser');
nameOfUser.oninput = () => {
localStorage.setItem('nameOfUser', nameOfUser.value)
};

// Slider

const body = document.querySelector('body');
const prev = document.querySelector('.slide-prev');
const next = document.querySelector('.slide-next');
const background = document.querySelector('.background-options');
const tag = document.querySelector('.section-tag');
const tagValue = document.querySelector('.tag');

let tagName = 'nature';
if(localStorage.getItem('tag')){
    tagName = localStorage.getItem('tag');
    tagValue.value = tagName;
}

background.value = localStorage.getItem('background');

if(!background.value){
    background.value = 'github' ;
}

switchBackground();


function switchBackground(){
    switch(background.value) {
        case 'github': 
        getGitHubSlider();
        tag.classList.add('show-tag');
        break;
      
        case 'flickr': 
        getFlickrSlider(tagName);
        tag.classList.remove('show-tag');
        tagValue.addEventListener('change', ()=>{
            tagName = `${tagValue.value}`;
            getFlickrSlider(tagName);
            localStorage.setItem('tag', tagName);
        })
        break;

        case 'unsplash': 
        getUnsplashSlider(tagName);
        tag.classList.remove('show-tag');
        tagValue.addEventListener('change', ()=>{
            tagName = `${tagValue.value}`;
            getUnsplashSlider(tagName);
            localStorage.setItem('tag', tagName);
        })
        break;
      }
}

background.addEventListener('change', e => {
    switchBackground();
    localStorage.setItem('background', background.value);
})


function getRandom(num) {
    return Math.ceil(Math.random() * num);
};

// GitHub Slider

function getGitHubSlider(){

    let num = getRandom(20);

    function getImgGitHub(num){
        (num < 10)?num = '0' + num: num; 
        return `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay()}/${num}.jpg`;
    }

    let url = getImgGitHub(num);

    // Функция дла загрузки фоновой картинки

    function bgLoad(url){
    const img = new Image();
    img.src = url;
    img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`
        }
    };

    bgLoad(url);

    prev.onclick = function(){
        num--;
        if(num <= 0){
            num = 20;
        }  
        bgLoad(getImgGitHub(num));
    }

    next.onclick = function(){
        num++;
        if(num > 20){
            num = 1;
        }
        bgLoad(getImgGitHub(num));
    }

}

//Slider Unsplash API

function getUnsplashSlider(tag){

    async function getLinkToUnsplashImage() {
        try{
            const url = `https://api.unsplash.com/photos/random?orientation=landscape&tags=${tag}&query=${timeOfDay()}&client_id=iyepPDp9wHrDEZU1sArX2ToIadAz3zEH7Y2G5JhSp3A`;
            const res = await fetch(url);
            const data = await res.json();
            const img = new Image();
            img.src = data.urls.raw;
            img.onload = () => {
                body.style.backgroundImage = `url(${img.src})`
            }
        }catch{
            if(lang === 'ru'){
                 alert('Данный сервис недоступен. Попробуйте выбрать другой сервис');
            }else{
                alert('This service is not available. Try to choose another service');
            }
           
        }

    }

    getLinkToUnsplashImage();
    
    prev.onclick = function(){getLinkToUnsplashImage()};
    next.onclick = function(){getLinkToUnsplashImage()};

}

//Slider Flickr API

function getFlickrSlider(tag){
    async function getLinkToFlickrImage() {
        try{
            const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=dcec5137bd483168c519534a20d6c10a&is_getty&tags=${tag}&text=${timeOfDay()}&extras=url_h&format=json&nojsoncallback=1`;
            const res = await fetch(url);
            const data = await res.json();
            const img = new Image();
            let num = data.photos.photo.length - 1;
            img.src = data.photos.photo[getRandom(num)].url_h;
            img.onload = () => {
                body.style.backgroundImage = `url(${img.src})`
            }
        }catch{
            if(lang === 'ru'){
                 alert('Данный сервис недоступен. Попробуйте выбрать другой сервис');
            }else{
                alert('This service is not available. Try to choose another service');
            }
           
        }
    }

    getLinkToFlickrImage();

    prev.onclick = function(){getLinkToFlickrImage()};
    next.onclick = function(){getLinkToFlickrImage()};

}

// Weather

const weather = document.querySelector('.weather');

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const errorWeather = document.querySelector('.weather-error');

city.value = translation[lang]['city'];

async function getWheater(){
    try{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${language.value}&appid=3d0d3ab80f2c8f46918a3edf9db83529&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    errorWeather.textContent = '';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${translation[lang]['wind']}: ${Math.round(data.wind.speed)} ${translation[lang]['speed']}`;
    humidity.textContent = `${translation[lang]['humidity']}: ${data.main.humidity}%`;
    }
    catch(error){
        errorWeather.textContent = `${translation[lang]['error']} '${city.value}'!`;
        weatherIcon.className = 'weather-icon owf';
        temperature.textContent = '';
        weatherDescription.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
    }
}

city.oninput = () => {
    localStorage.setItem('city', city.value);
    };
  
if(localStorage.getItem('city')!= null){
    city.value = localStorage.getItem('city');
}

getWheater();
city.addEventListener('change', () => {getWheater()});


// Quotes

const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');



async function getQuotes(){
    const quotes = `./quotes/quotes-${lang}.json`;
    const res = await fetch(quotes);
    const data = await res.json();

    let randomQuote = getRandom(data.length);
    quote.textContent = data[randomQuote].text;
    author.textContent = data[randomQuote].author;

}

getQuotes();
changeQuote.onclick = () => {getQuotes()};

//Player

const player = document.querySelector('.player');
const play = document.querySelector('.play');
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const playListAudio = document.querySelector('.play-list');
const songTitle = document.querySelector('.song-title');

import playList from "./playList.js";

const audio = document.createElement('audio');
let isPlay = false;
let playNum = 0;

audio.src = playList[playNum].src;
showSongTitle();

//Создание плей-листа

playList.forEach(el => {
    const li = document.createElement('li');   
    li.classList.add('play-item');
    li.textContent = el.title;
    playListAudio.appendChild(li);
});

//Вывод название текущего трека в заголовок

function showSongTitle(){
    songTitle.innerHTML = playList[playNum].title;
}

//Запускаем проигрывание трека при клике на названии композиции

const itemList = Array.from(document.querySelectorAll('.play-item'));

for(let item of itemList){
    item.addEventListener('click', ()=>{

        let index = itemList.findIndex(el => el.textContent === item.textContent);


        if(playNum == index && isPlay){
            pauseAudio();
            itemList[playNum].classList.remove('item-pause');
            

        }else if(playNum == index && !isPlay){
            playAudio();
            itemList[playNum].classList.add('item-pause');

        }else{
        playNum = index;
        itemList.forEach(el => {el.classList.remove('item-active');
            el.classList.remove('item-pause');});

        audio.src = playList[playNum].src;
        itemActive(playNum);
        itemList[playNum].classList.add('item-pause');

        playAudio();
        }
    });
}

//запуск плеера через панель управления

function startPlayAudio() {
    if(!isPlay){
        playAudio();
        itemActive(playNum);
        itemList[playNum].classList.add('item-pause');
    }else{
        pauseAudio();
        itemList[playNum].classList.remove('item-pause');
  }
};

function itemActive(playNum){
    itemList[playNum].classList.add('item-active');
    itemList[playNum].classList.add('item-pause');
    itemList[playNum].scrollIntoView({block: "center", behavior: "smooth"});
}

function itemInactive(playNum){
    itemList[playNum].classList.remove('item-active');
    itemList[playNum].classList.remove('item-pause');
}


function playAudio(){
    showSongTitle();
    audio.play();
    isPlay = true;
    play.classList.add('pause');
}

function pauseAudio(){
    audio.pause();
    isPlay = false;
    play.classList.remove('pause');
}

play.addEventListener('click', startPlayAudio);

//переключение плеера на следующую дорожку

function playNextAudio (){
    itemInactive(playNum);
    playNum++;
    if(playNum > (playList.length - 1)){playNum = 0};
    audio.src = playList[playNum].src;
    itemActive(playNum);
    playAudio();
    play.classList.add('pause');
};

playNext.onclick = () => {playNextAudio()};

//переключение плеера на предыдущую дорожку

function playPrevAudio(){
    itemInactive(playNum);
    playNum--;
    if(playNum < 0){playNum = playList.length - 1};
    audio.src = playList[playNum].src;
    itemActive(playNum);
    playAudio();
};

playPrev.onclick = () => {playPrevAudio()};

audio.addEventListener("ended", playNextAudio);


const progressBar = document.querySelector('#progress-bar');

progressBar.addEventListener('click', changeProgressBar);

function changeProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
};


function updateProgressValue() {
    
    if(audio.duration){
        progressBar.max = audio.duration;
    }
    progressBar.value = audio.currentTime;
    document.querySelector('.currentTime').innerHTML = (formatTime(Math.floor(audio.currentTime)));
    if (document.querySelector('.durationTime').innerHTML === "NaN:NaN") {
        document.querySelector('.durationTime').innerHTML = "0:00";
    } else {
        document.querySelector('.durationTime').innerHTML = (formatTime(Math.floor(audio.duration)));
    }
};

// конвертация в mm:ss
function formatTime(seconds) {
    let min = Math.floor((seconds / 60));
    let sec = Math.floor(seconds - (min * 60));
    if (sec < 10){ 
        sec  = `0${sec}`;
    };
    return `${min}:${sec}`;
};

// функция для обновления индикатора проигрывателя
setInterval(updateProgressValue, 500);

//настройка громкости звука

const volume = document.querySelector("#volumeRange");
volume.value = audio.volume;
volume.addEventListener('input', function() { 
  audio.volume = volume.value;
});

const muteButton = document.querySelector(".volume");

muteButton.addEventListener("click", () => {
    audio.muted = !audio.muted;
    if (audio.muted) {
        muteButton.classList.remove("volume");
        muteButton.classList.add("volume-off");
      } else {
        muteButton.classList.add("volume");
        muteButton.classList.remove("volume-off");
      }
});

//Settings

const openMenu = document.querySelector('.open-settings');
const settingsMenu = document.querySelector('.settings-menu');
const checkboxButton = document.querySelectorAll('.chekbox-button');

checkboxButton.forEach(e=> {    

    if(localStorage[e.id] == 'false'){
        e.checked = false;
        document.querySelector(`.${e.name}`).classList.toggle('hidden');
    }
});

openMenu.onclick = () => {
    settingsMenu.classList.toggle('show');
    openMenu.classList.toggle('open-settings-active');
}

settingsMenu.addEventListener('click', e => {

    if(e.target.name && e.target.name !='tag'){
        document.querySelector(`.${e.target.name}`).classList.toggle('hidden');
        localStorage.setItem(e.target.name, document.getElementById(`${e.target.name}`).checked);
    }
});

//Todo List

const openTodo = document.querySelector('.open-list');
const todoMenu = document.querySelector('.todo-menu');

openTodo.onclick = () =>{
    todoMenu.classList.toggle('show');

}

const list = document.querySelector('.todo-list');
let items = list.children;
const newItemForm = document.querySelector('.add-form');
const taskTemplate = document.querySelector('#task-template').content;
const newItemTemplate = taskTemplate.querySelector('.todo-list-item');
const newItemTitle = newItemForm.querySelector('.add-form-input');
const emptyList = document.querySelector('.empty-list');
const emptyButton = document.querySelector('.empty-list-button');

emptyButton.onclick = ()=>{
    emptyList.classList.toggle('hidden');
    newItemForm.classList.toggle('show');
    newItemTitle.focus();
}

newItemTitle.placeholder = translation[lang]['newTodo'];
emptyList.querySelector('span').textContent = translation[lang]['noTodo'];
emptyButton.textContent = translation[lang]['newTodo'];

//
let itemSotrage = [];
if(localStorage.getItem('todo')){
    itemSotrage = JSON.parse(localStorage.getItem('todo'));
    itemSotrage.forEach(e => out(e));
    toggleEmptyListMessage();
}

//Функция вывода задач

function out(value){
    const taskText = value;
    const task = newItemTemplate.cloneNode(true);
    const taskDescription = task.querySelector('span');
    taskDescription.textContent = taskText;
    addCheckHandler(task);
  
    list.appendChild(task);
    list.classList.add('min-height');
    task.scrollIntoView();
}
//

function addCheckHandler (item) {
    const checkbox = item.querySelector('.todo-list-input');
    checkbox.addEventListener('change', function () {
        itemSotrage.splice(itemSotrage.indexOf(item.textContent.trim()), 1);
        localStorage.setItem('todo', JSON.stringify(itemSotrage));
        item.remove();
        toggleEmptyListMessage();
    });

  };

function toggleEmptyListMessage () {
    if (items.length === 0) {
        list.classList.remove('min-height');
        emptyList.classList.remove('hidden');
        newItemForm.classList.remove('show');
    }else{
        list.classList.add('min-height');
        emptyList.classList.add('hidden');
        newItemForm.classList.add('show');
    }
  };


  
newItemForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    itemSotrage.push(newItemTitle.value.trim());
    out(newItemTitle.value);
    newItemTitle.value = '';
    
    localStorage.setItem('todo', JSON.stringify(itemSotrage));
    //

  });




