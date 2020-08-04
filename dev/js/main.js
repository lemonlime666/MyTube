const $id = id => {return document.getElementById(id)};
const $class = cls => {return document.querySelector(cls)};
const $classAll = cls => {return document.querySelectorAll(cls)};
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
var constraint = 0;
var getResult = 12;

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

    if(token == '' || token == undefined){
        var pageToken = '';
    }else{
        var pageToken = `&pageToken=${token}`;
    }

    if(constraint == 8){
        getResult = 4;
    }

    let options = {method: "GET",};
    try {
        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&maxResults=${getResult}&key=AIzaSyCT02dMwQtC8llj3xTdMCs1GTpMFDQJzTc${pageToken}`,options)
            .then((res) => res.json())
            .then((json)=>{
                nextPageToken.next = json.nextPageToken;
                json.items.forEach(item=>{
                    data.push(item);
                })})
            .then(()=>{
                createDiv(data);
            });
    } catch (e) {
        console.log("ERROR", e);
    }

    constraint++;
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
    createPagination();
}

//產生pagination
function createPagination(){
    for(i=1;i<=9;i++){
        let paginaton = document.createElement('li');
        paginaton.innerText = i;
        $class('.pagiLayer').appendChild(paginaton);
    }
}

//產生content
function createContent(data){
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
    console.log(data);
}

document.addEventListener('DOMContentLoaded', function(){
    iconFill();
    initHash();
})

window.addEventListener('load', function(){
    $classAll('.page svg path').forEach((item)=>{item.addEventListener('click', switchPage);})
    fetchData(nextPageToken.next);
})

window.addEventListener('popstate',function(){
    poppin();
})

