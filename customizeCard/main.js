//init
const form =document.getElementById('form');
const nameField = document.getElementById('nameField');
const photoField = document.getElementById('photoField');
const introField = document.getElementById('introField');
const nameCard = document.getElementById('nameCard');
const nameCardField = document.getElementById('nameCardField');
const h4 = document.querySelector('h4');






//從input確認有無輸入文字  name & introduction ＋ 顯示此欄必填跟剩餘多少字
form.addEventListener('input',check);
function check(){
    let count = event.target.value.length;
    let feedbackDiv = nameField.nextElementSibling;
    if(event.target.id === 'nameField'){
        if(count > 0){
            feedbackDiv.innerHTML = 'Pass';
            nameField.classList.add('sucess');
        }else if(count === 0){
            feedbackDiv.innerHTML = 'Type something';
            nameField.classList.remove('sucess');
            nameField.classList.add('danger');
        }
    }else if(event.target.id === 'introField'){
        feedbackDiv = introField.nextElementSibling;
        if(count > 0){
            feedbackDiv.innerHTML = `${200 - count} remain`;
            introField.classList.add('sucess');
        }else if(count === 0){
            feedbackDiv.innerHTML = 'Type something';
            introField.classList.remove('sucess');
            introField.classList.add('danger');
        }
    }
}
//將 name photoLink introduction 所輸入的value加入新的card HTML裡面，用樣板加入，並且加入photoLink place default
function card(){
    let count = photoField.value.length;
    let output = photoField.value;
    if(count === 0){
        output = 'https://assets-lighthouse.s3.amazonaws.com/uploads/user/photo/2347/medium_IMG_1860.JPG';
    }
    let htmlContent = `
        <div class="wrapper">
            <p>${introField.value}</p>
            <img src=${output} alt="picture">
        </div>
    `
    nameCardField.innerHTML = htmlContent;
    h4.innerHTML = nameField.value;
}



//設定theme的按鈕監聽，去更改card的class，預設值是light
form.addEventListener('click', changeTheme);


function changeTheme(){
    if(event.target.id === 'darkBtn'){
        console.log(event.target);
        nameCard.classList.remove('light');
        nameCard.classList.add('dark');
    }else if(event.target.id === 'lightBtn'){
        nameCard.classList.remove('dark');
        nameCard.classList.add('light');
    }
}











//submit 去確認該有的條件都符合後將顯示card
form.addEventListener('submit', compile);

function compile(){
    event.preventDefault();
    if(nameField.value.length > 0 && introField.value.length > 0){
        card();
        nameCard.style.display = "block";
        clear();
    }else{
        window.alert("Please type something");
        nameField.classList.add('danger');
        introField.classList.add('danger');
    }
}



//送出後清除資料
function clear(){
    nameField.value = '';
    introField.value = '';
    photoField.value = '';
}