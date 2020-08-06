const $id = id => {return document.getElementById(id)};
const $class = cls => {return document.querySelector(cls)};
const $classAll = cls => {return document.querySelectorAll(cls)};
const myKey = 'AIzaSyDK8yUbP3EsR1cJK3wpDB4AI2qNWvqQs-4';

const vid = $class('.vidBox');
const play = $class('.playBtn');
const duration = $class('.duration');
const controler = $class('.controlBar').querySelectorAll('[type="range"]');
const full = $class('.full');
const progressBar = $class('.progressBar');
const progressing = $class('.progressing');
const forward = $class('.forward');
const backward = $class('.backward');
const via = $id('vid_html5_api');
const volumeLabel = $class('.volumeLabel');
const rateLabel = $class('.rateLabel');

const title = $class('header h1');
const info = $class('.infoBox p');

const checkPlay = new Event('playStatus');
const fullScreen = new Event('fullScreen');

let mousedown = false;

var player = videojs('vid');
videojs(vid, {html5: {
    hls: {
        withCredentials: true
    }
}});



function checkStatus(){
    window.dispatchEvent(checkPlay);
}

function playPause(){
    if(vid.paused){
        vid.play();
        $class('.playSvg').style.display = 'none';
        $class('.pauseSvg').style.display = 'inline-flex';
    }else{
        vid.pause();
        play.setAttribute('data-play', 'play');
        $class('.playSvg').style.display = 'inline-flex';
        $class('.pauseSvg').style.display = 'none';
    }
}

const formatSecond = function(secs) {          
    let hr = Math.floor(secs / 3600);
    let min = Math.floor((secs - (hr * 3600)) / 60);
    let sec = parseInt( secs - (hr * 3600) - (min * 60));

    while (min.length < 2) { min = '0' + min; }
    while (sec.length < 2) { sec = '0' + min; }
    if (hr) hr += ':';
    if (sec<10) sec = "0" + sec;
    return hr + min + ':' + sec;
}

function goControl(){
    vid[this.name] = this.value;
}

function checkFull(){
    window.dispatchEvent(fullScreen);
}

function screenSize(){
    if (vid.requestFullscreen) {
        vid.requestFullscreen();
    } else if (vid.mozRequestFullScreen) { /* Firefox */
        vid.mozRequestFullScreen();
    } else if (vid.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        vid.webkitRequestFullscreen();
    } else if (vid.msRequestFullscreen) { /* IE/Edge */
        vid.msRequestFullscreen();
    }
}

function handleProgress() {
    const percent = (vid.currentTime / vid.duration) * 100;
    progressing.style.flexBasis = `${percent}%`;
    duration.innerText = formatSecond(vid.currentTime);
}

function drag(e) {
    if (mousedown) {
        const dragTime = (e.offsetX / progressBar.offsetWidth) * vid.duration;
        vid.currentTime = dragTime;
    }
}

function clickProgressBar(e) {
    e.stopPropagation();
    const dragTime = (e.offsetX / progressBar.offsetWidth) * vid.duration;
    vid.currentTime = dragTime;
}

function goforward(){
    if(!vid.ended && (Math.floor(vid.duration)-Math.ceil(vid.currentTime))>10){
        vid.currentTime += 10;
    }
}

function gobackward(){
    if(vid.currentTime>10){
        vid.currentTime -= 10;
    }
    if(vid.currentTime<=10){
        vid.currentTime = 0;
    }
}

function set(){
    let name = localStorage.getItem('title');
    let channel = localStorage.getItem('channel');
    let description = localStorage.getItem('videoDescription')
    
    if(!name || !channel || name == undefined || channel == undefined){
        title.innerText = '無影片資訊'; 
    }else{
        title.innerText = `${name} | ${channel}`;
    }
    info.innerText = description;
    vid['volume'] = 0.2;
}

function arrange(){
    let show = this.querySelector('[type="range"]');
    let display = window.getComputedStyle(show).getPropertyValue('display');
    if(display == 'none'){
        show.style.display = 'block';
    }else{
        show.style.display = 'none'
    }
}

function shine(){
    let svg = this.querySelector('svg path');
    svg.style.fill = 'rgb(225, 208, 161)';
    setTimeout(()=>{
        svg.style.fill = 'rgba(198, 178, 110, .8)';
    },300);
}



window.addEventListener('load',function(){
    window.addEventListener('playStatus', playPause);
    play.addEventListener('click', checkStatus);
    play.addEventListener('click', shine);
    vid.addEventListener('click', checkStatus);
    controler.forEach((item)=>{
        item.addEventListener('change', goControl);
        item.addEventListener('mousemove', goControl);
    })
    window.addEventListener('fullScreen',screenSize);
    full.addEventListener('click', checkFull);
    volumeLabel.addEventListener('click', arrange);
    volumeLabel.addEventListener('click', shine);
    rateLabel.addEventListener('click', arrange);
    rateLabel.addEventListener('click', shine);


    vid.addEventListener('timeupdate', handleProgress);
    progressBar.addEventListener('mousemove', drag);
    progressBar.addEventListener('mousedown', clickProgressBar);
    progressBar.addEventListener('mouseup', clickProgressBar);

    forward.addEventListener('click', goforward);
    forward.addEventListener('click', shine);
    backward.addEventListener('click', gobackward);
    backward.addEventListener('click', shine);
    
    set();
    setTimeout(()=>{
        if(vid.duration){
            duration.innerText = formatSecond(vid.duration);
        }
    }, 1000)
    setTimeout(()=>{
        if(vid.duration){
            duration.innerText = formatSecond(vid.duration);
        }
    }, 2000)
    setTimeout(()=>{
        if(vid.duration){
            duration.innerText = formatSecond(vid.duration);
        }
    }, 3000)
})