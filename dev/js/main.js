const $id = id => {return document.getElementById(id)};
const $class = cls => {return document.querySelector(cls)};
const $classAll = cls => {return document.querySelectorAll(cls)};
const myKey = 'AIzaSyBTULL9GjK0xgTLQcPJCMU5l2Xh4ktBCWc';
const data = [];
const nextPageToken = Object;
Object.defineProperty(nextPageToken, 'next', {
    get(){
        return this.value;
    },
    set(val){
        this.value = val; 
    }
})
var getResult = 12;
const userFav = JSON.parse(localStorage.getItem('favVid')) || [];

const favCheck = new CustomEvent('favCheck',{
    detail:{
        id:`&id=`,
        key:`&key=${myKey}`,
        url:`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails`
    }
}) 

//初始化icon顏色
function iconFill(){
    let pages = $classAll('.page svg path');
        pages.forEach((item, index)=>{
            if(index%2!==0){
                item.setAttribute('fill','#292929');
                item.style.transition = 'all .3s';
            }
        })
    pages[1].setAttribute('fill','rgba(225, 208, 161,.5)');
}

//點擊換頁->更換hash
function switchPage(e){
    let pages = $classAll('.page svg path');
    pages.forEach((item, index)=>{
        if(index%2!==0){
            item.setAttribute('fill','#292929');
        }
    })
    e.target.setAttribute('fill','rgba(225, 208, 161,.5)')
    let pageGuide = e.target.parentNode.parentNode.dataset;
    $classAll(`.view`).forEach(item=>{item.classList.remove('activePage');})
    $classAll(`.view`)[pageGuide.page-1].classList.add('activePage');
    switchHash();
}

//初始hash
function initHash(){
    history.replaceState({},'Home','#home');
    let hash = location.hash.replace('#', '');
    document.title = `MyTube / ${hash}`;
}

//點擊更換hash
function switchHash(){
    let currentPage = $class('.view.activePage').dataset.target;
    history.pushState({},currentPage,`#${currentPage}`);
    document.title = `MyTube / ${currentPage}`;
    
}

//上下頁更換hash
function poppin(){
    let hash = location.hash.replace('#', '');
    $class('.activePage').classList.remove('activePage');
    $class(`.${hash}`).classList.add('activePage');
    document.title = `MyTube / ${hash}`;
}

//抓取資料
function fetchData(token){
    data.splice(0,data.length);
    console.log(data);
    if(token == '' || token == undefined){
        var pageToken = '';
    }else{
        var pageToken = `&pageToken=${token}`;
    }
    let options = {method: "GET",};
    try {
        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&maxResults=${getResult}&key=${myKey}${pageToken}`,options)
            .then((res) => res.json())
            .then((json)=>{
                nextPageToken.next = json.nextPageToken;
                console.log(json);
                json.items.forEach(item=>{
                    data.push(item);
                })
            })
            .then(()=>{
                createDiv(data);
            })
            .then(()=>{
                document.documentElement.scrollTop=0;
            });
    } catch (e) {
        console.log("ERROR", e);
    }
}

//產生div
function createDiv(data){
    if(data.length>0){
        data.forEach((item)=>{
            let div = document.createElement('div');
            $class('.home').insertBefore(div,$class('.pagination'));
        })
    }
    createContent(data);
}

//產生pagination
function createPagination(){
    for(i=1;i<=9;i++){
        let paginaton = document.createElement('li');
        paginaton.innerText = i;
        $class('.pagiLayer').appendChild(paginaton);
    }
    // $class('.pagiLayer').prepend($class('.pagiLayer').lastElementChild);
    $classAll('.pagiLayer li')[0].classList.add('activePagi');
}

//產生content
function createContent(data){
    console.log(data);
    let div = $classAll('.home div');
    div.forEach((item,index)=>{
        let imgBox = document.createElement('div');
        imgBox.classList.add('imgBox');
        let img = document.createElement('img');
        img.setAttribute('src', data[index].snippet.thumbnails.standard.url);
        let block = document.createElement('a');
        block.setAttribute('data-id', data[index].id);
        block.innerText = '播放';
        let addFav = document.createElement('button');
        addFav.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
        imgBox.appendChild(img);
        imgBox.appendChild(block);
        imgBox.appendChild(addFav);

        let infoBox = document.createElement('div');
        infoBox.classList.add('infoBox');
        let infoLayer = document.createElement('div');
        let h5 = document.createElement('h5');
        h5.innerText = data[index].snippet.localized.title;
        let channel = document.createElement('p');
        channel.innerText = data[index].snippet.channelTitle;
        let vidLen = document.createElement('p');
        let len =  data[index].contentDetails.duration.replace('PT','');
        let len2 = len.replace('M','分');
        let len3 = len2.replace('S','秒');
        vidLen.innerText = len3;

        infoBox.appendChild(h5);
        infoLayer.appendChild(channel);
        infoLayer.appendChild(vidLen);
        infoBox.appendChild(infoLayer);
        item.appendChild(imgBox);
        item.appendChild(infoBox);
    })
    $classAll('.imgBox button').forEach(item=>{
        item.addEventListener('click', clickFav);
    })
    initFavIcon();
}

//getToken
const tik = [];
async function multiTokenFirst(){
    let options = {method: "GET",};
    let res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&maxResults=12&key=${myKey}`,options);
    let jsn = await res.json();
    let tok = jsn.nextPageToken;
    tik.push(tok);
    console.log('phase1');
    multiTokenThen();
}
var reGet = 0;
async function multiTokenThen(){
    ++reGet;
    if(reGet == 7){
        multiTokenLast();
    }else if(reGet<7){
        let options = {method: "GET",};
        let res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&maxResults=12&key=${myKey}&pageToken=${tik[tik.length-1]}`,options);
        let jsn = await res.json();
        let tok = jsn.nextPageToken;
        tik.push(tok);
        multiTokenThen();
        console.log('phase2');
    }
}

async function multiTokenLast(){
    console.log('phase3');
    let options = {method: "GET",};
    let res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&maxResults=4&key=${myKey}&pageToken=${tik[tik.length-1]}`,options);
    let jsn = await res.json();
    let tok = jsn.nextPageToken;
    tik.push(tok);
    await setToken();
}

async function setToken(){
    let pagi = $classAll('.pagiLayer li');
    for(i=1;i<pagi.length;i++){
        pagi[i].setAttribute('data-token',tik[i-1])
    }
    await $classAll('.pagiLayer li').forEach(item=>{
            item.addEventListener('click', clickPage)
        });
}

//paginationEvent
let handler = 1;
function pagiMove(e){
    if(e.target.id == 'left'){
        if(handler == 1){
            return;
        }else{
            $class('.activePagi').classList.remove('activePagi');
            $classAll('.pagiLayer li')[handler-2].classList.add('activePagi');
            handler--;
        }
    }else if(e.target.id == 'right'){
        if(handler == $classAll('.pagiLayer li').length){
            return;
        }else{
            $class('.activePagi').classList.remove('activePagi');
            $classAll('.pagiLayer li')[handler].classList.add('activePagi');
            handler++;
        }
    }
    selectFetch();
}

function selectFetch(){
    if(handler==$classAll('.pagiLayer li').length){
        getResult = 4;
    }else{
        getResult = 12;
    }
    let theToken = $class('.activePagi').dataset.token;
    $classAll('.home div').forEach(item => {
        item.remove();
    });
    nextPageToken.next = theToken;
    fetchData(nextPageToken.next);
}

//clickPage
function clickPage(e){
    handler = e.target.textContent;
    if(e.target.textContent == $classAll('.pagiLayer li').length){
        getResult = 4;
    }else{
        getResult = 12;
    }
    $class('.activePagi').classList.remove('activePagi');
    e.target.classList.add('activePagi');
    let theToken = e.target.dataset.token;
    $classAll('.home div').forEach(item => {
        item.remove();
    });
    nextPageToken.next = theToken;
    fetchData(nextPageToken.next);
}

//clickFav
function clickFav(e){
    let bgc = window.getComputedStyle(this,null).getPropertyValue('background-color');
    if(bgc!='rgb(239, 239, 239)'){
        this.style.backgroundColor = 'rgb(239, 239, 239)';
        this.querySelectorAll('svg path')[1].style.fill = 'indianred';

        let storeId = this.offsetParent.querySelector('a').dataset.id;
        let obj = {
            id:storeId
        }
        userFav.push(obj);
        let favVid = JSON.stringify(userFav);
        localStorage.setItem('favVid', favVid);
    }else{
        this.style.backgroundColor = '#383838';
        this.querySelectorAll('svg path')[1].style.fill = '#efefef';
        let unStoreId = this.offsetParent.querySelector('a').dataset.id;
        userFav.forEach((item,index)=>{
            if(item.id == unStoreId){
                userFav.splice(index,1);
            }
        })
        let favVid = JSON.stringify(userFav);
        localStorage.setItem('favVid', favVid);
    }
}

//initFav
function initFavIcon(){
    let a = $classAll('.imgBox a');
    let b = userFav;
    for(i=0; i<a.length; i++){
        for(j=0; j<b.length; j++){
            if(a[i].dataset.id == b[j].id){
                $classAll('.imgBox button')[i].style.backgroundColor = 'rgb(239, 239, 239)';
                $classAll('.imgBox button svg path:nth-child(2)')[i].style.fill = 'indianred';
            }
        }
    }
}



//============================================================================================//
document.addEventListener('DOMContentLoaded', function(){
    iconFill();
    initHash();
})

window.addEventListener('load', function(){
    $classAll('.page svg path').forEach((item)=>{item.addEventListener('click', switchPage);})
    fetchData(nextPageToken.next);
    createPagination();
    multiTokenFirst();
    $id('left').addEventListener('click',pagiMove);
    $id('right').addEventListener('click',pagiMove);
})

window.addEventListener('popstate',function(){
    poppin();
})




