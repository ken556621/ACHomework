const dataPanel = document.getElementById('data_Panel');
const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users";
const data = [];
const navBar = document.getElementById('nav_bar');
const modalName = document.getElementById('cardName');
const modalBody = document.getElementById('cardBody');
const modalBtn = document.getElementById('modalBtn');
const fontBtn = document.getElementById('font-btn');
const removeBtn = document.getElementById('remove-btn');
const selectForm = document.getElementById('form');
const genderField = document.getElementById('inlineFormCustomSelect');
const ageField = document.getElementById('ageField');
const checkBox = document.getElementById('customControlAutosizing');
const selectDataList = [];
let isSelectPanel = false;  

//API 取資料 avatar,name,email
axios.get(INDEX_URL).then(function(profile){
  data.push(...profile.data.results)
  getTotalPages(data);
  getPageData (1, data);
}).catch(error => {console.log(error)});
  
// 01.menu select
function menuSelect(event){
  if(event.target.matches('.socialList')){
    isSelectPanel = false;
    getTotalPages (data);
    getPageData (1, data);
    selectForm.classList.remove('d-none');
  }else if(event.target.matches('.favorite')){
    isSelectPanel = false;
    dataPanel.innerHTML = '';
    getTotalPages (favoriteSelectList);
    insertCard(favoriteSelectList);
    console.log(favoriteSelectList);
    removeBtn.classList.remove('d-none');
    selectForm.classList.add('d-none');
  }else if(event.target.matches('.select')){
    isSelectPanel = true;
    insertCard(selectDataList);
    getTotalPages (selectDataList);
    getPageData (1, data);
    selectForm.classList.add('d-none');
  }
}

// 02.insert htmlContent function
function insertCard(profiles){
  let content = '';
  profiles.forEach(function(person){
    content += `
      <div class="card m-3" style="width: 18rem;">
        <img class="card-img-top" src=${person.avatar} alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${person.name}</h5>
          <p class="card-text">${person.email}</p>
          <button href="#" class="btn btn-primary check" data-toggle="modal" data-target="#exampleModal" data-id="${person.id}">Check</button>
          <button id="remove-btn" data-id="${person.id}" class="btn btn-primary remove d-none">Remove</button>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML += content;
}

//03.showDetail
function showDetail(id){
    const show_API = INDEX_URL + '/' + id;
    axios.get(show_API).then(function(person){
      const newPerson = person.data
      let popName = `
        <h5 class="modal-title" id="exampleModalLabel">${newPerson.name}</h5>
      `
      modalName.innerHTML = popName;
      let popBody = `
        <div class="wrapper d-flex">
            <img src=${newPerson.avatar} alt="Responsive image" class="rounded">
            <ul class="list-group list-group-flush">
              <li class="list-group-item"><i class="fas fa-signature"></i> ${newPerson.surname}</li>
              <li class="list-group-item text-capitalize"><i class="fas fa-child"></i> ${newPerson.gender}</li>
              <li class="list-group-item"><i class="fas fa-hand-holding-heart"></i> ${newPerson.age}</li>
              <li class="list-group-item"><i class="fas fa-home"></i> ${newPerson.region}</li>
              <li class="list-group-item"><i class="fas fa-birthday-cake"></i> ${newPerson.birthday}</li>
            </ul>
        </div>
      `
      modalBody.innerHTML = popBody;
      let popBtn = `
        <button type="button" class="btn btn-primary" data-id="${newPerson.id}">Add To Favorite</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      `
      modalBtn.innerHTML = popBtn;
  }).catch(error => {console.log(error)});
}

//04.Add to favorite
const favoriteSelectList = JSON.parse(localStorage.getItem('favoriteList')) || [];

function addToFavorite(id){
    const favorite_API = INDEX_URL + `/${event.target.dataset.id}`
    const person = data.find(person => person.id === Number(id))
  if (favoriteSelectList.some(person => person.id === Number(id))) {
    alert(`${person.name} is already in your favorite list.`)
  } else {
    favoriteSelectList.push(person)
    alert(`Added ${person.name} to your favorite list!`)
  }
  localStorage.setItem('favoriteList', JSON.stringify(favoriteSelectList))
}

//05.delete card
function deleteCard(id){
    const index = favoriteSelectList.findIndex(person => person.id === Number(id));
    if(index === -1){
      window.alert('It is not in your favorite yet!');
      return
    }
    favoriteSelectList.splice(index, 1);
    localStorage.setItem('favoriteSocialList', JSON.stringify(favoriteSelectList));
    dataPanel.innerHTML = '';
    insertCard(favoriteSelectList);
}

//06.select gender & age
function select(){
  event.preventDefault();
  if(genderField.value === "male"){
      if(ageField.value === ''){
        let man = data.filter(function(person){
        return person.gender === "male"
      })
      selectDataList.push(...man);
      }else if(ageField.value !== ''){
        let manAndAge = data.filter(function(person){
          return person.gender === "male" && person.age < Number(ageField.value)
      })
      selectDataList.push(...manAndAge);
      }
  }else if(genderField.value === "female"){
      if(ageField.value === ''){
        let woman = data.filter(function(person){
          return person.gender === "female"
        })
      selectDataList.push(...woman);
      }else if(ageField.value !== ''){
        let womanAndAge = data.filter(function(person){
          return person.gender === "female" && person.age < Number(ageField.value)
      })
      selectDataList.push(...womanAndAge);
      }
    }
  if(!checkBox.checked){
    ageField.value = '';
  }
  window.alert('請至Select裡查看');
}

//07.Pagination 計算總分頁數目
const pagination = document.getElementById('pagination')
const ITEM_PER_PAGE = 12

function getTotalPages (data) {
  let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
  let pageItemContent = ''
  for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
  `
    }
  pagination.innerHTML = pageItemContent
}

//08.切換分頁
let paginationData = [];
let isCard = true;
let pageData = [];
let selectPageData = [];

function getPageData (pageNum, data) {
  dataPanel.innerHTML = '';
  paginationData = data || paginationData;
  let offset = (pageNum - 1) * ITEM_PER_PAGE;
  pageData.unshift(...paginationData.slice(offset, offset + ITEM_PER_PAGE));
  pageData.splice(12, 12);
  selectPageData.unshift(...selectDataList.slice(offset, offset + ITEM_PER_PAGE));
  selectPageData.splice(12, 12);
  //用isCard 和 isSelectPanel控制
  if(isCard && !isSelectPanel){
    insertCard(pageData);
  }else if(!isCard && !isSelectPanel){
    insertTable(pageData);
  }else if(isCard && isSelectPanel){
    insertCard(selectPageData);
  }else if(!isCard && isSelectPanel){
    insertTable(selectPageData);
  }
}

//09.render list mode
function insertTable(data){
    let socialListContent = '';
    data.forEach(function (person, index) {
      socialListContent += `
      <table class="table col-12 mt-4 table-borderless">
        <tbody>
          <tr class='d-flex justify-content-between align-items-center'>
            <td><img src=${person.avatar} alt="Card image cap" class="rounded-circle list-img"></td>
            <td>${person.name}</td>
            <td>${person.email}</td>
            <td class="d-flex">
              <button class="btn btn-primary btn-show-social" data-toggle="modal" data-target="#exampleModal" data-id="${person.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${person.id}">+</button>
            </td>
          </tr>
        </tbody>
      </table>
      `
     })
      dataPanel.innerHTML = socialListContent;
   }

//10.文字比對功能   card樣式 + list樣式 比對功能
const search = document.getElementById('search');

function showSearchData(){
  let dataPageResult = [];
  let selectPageResult = [];
  const regex = new RegExp(search.value, 'i');
  dataPageResult = pageData.filter(person => person.name.match(regex));
  selectPageResult = selectPageData.filter(person => person.name.match(regex));
  dataPanel.innerHTML = '';
  //用isCard 和 isSelectPanel控制
  if(isCard && !isSelectPanel){
    insertCard(dataPageResult);
  }else if(!isCard && !isSelectPanel){
    insertTable(dataPageResult);
  }else if(isCard && isSelectPanel){
    insertCard(selectPageResult);
  }else if(!isCard && isSelectPanel){
    insertTable(selectPageResult);
  }
}

//listen to search.inputvalue
search.addEventListener('input', showSearchData);

//listen to check & more & favorite & remove
dataPanel.addEventListener('click', (event) => {
  if(event.target.matches('.check')){
    showDetail(event.target.dataset.id);
  }else if(event.target.matches('.btn-show-social')){
    showDetail(event.target.dataset.id);
  }else if(event.target.matches('.btn-add-favorite')){
    addToFavorite(event.target.dataset.id);
  }else if(event.target.matches('.remove')){
    deleteCard(event.target.dataset.id);
  }
});

//listen to switch btn
fontBtn.addEventListener('click',(event) => {
  if(event.target.matches('.fa-th')){
    isCard = true;
    getPageData (1, data);
  }else if(event.target.matches('.fa-bars')){
    isCard = false;
    getPageData (1, data);
}
})

//listent to Pagination
let datasetPage = '' || 1;
pagination.addEventListener('click', (event) => {
  if(event.target.tagName === 'A'){
    datasetPage = event.target.dataset.page;
    getPageData(datasetPage,data)
  }
})

//listen 
navBar.addEventListener('click',menuSelect);
selectForm.addEventListener('submit',select)
modalBtn.addEventListener('click', (event) => {
  if(event.target.matches('.btn-primary')){
    addToFavorite(event.target.dataset.id);
  }
});


