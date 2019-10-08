//宣告對話框、按鈕、新的todo、done
const form = document.getElementById('form');
const newTodo = document.getElementById('newTodo');
const endDate = document.getElementById('endDate');
const myTodo = document.getElementById('myTodo');
const myDone = document.getElementById('myDone');
//原本的todo項目
const todos = [
  "Hit the gym",
  "Read a book",
  "Buy eggs",
  "Organize office",
  "Pay bills"
];
todos.forEach(function(item){
  let items = document.createElement('li');
  items.innerHTML =`
      <i class="delete fa fa-trash"></i>
      <div>
        <label>${item}</label>
      </div>
    `
  myTodo.appendChild(items);
});
//從對話框內擷取資料到todo
function getTodo(){
  event.preventDefault();
  let   newEndDate = endDate.value.split('-');
  if(newTodo.value ==='' || Number(newEndDate[2]) < Number(new Date().getDate())){
    window.alert('Please type something or date choose after today');
  }else{
    let newItem = document.createElement('li');
    newItem.innerHTML = `
        <i class="delete fa fa-trash"></i>
        <div class="todo_wrapper">
          <label>${newTodo.value}</label>
          <time>${newEndDate[1]}月${newEndDate[2]}日前完成</time>
          <span>剩${Number(newEndDate[2]) - Number(new Date().getDate())}天</span>
        </div>
     `
    myTodo.appendChild(newItem);
    newTodo.value = '';
  }
};
//點擊add新增todo項目
form.addEventListener('submit', getTodo);
//Enter 也可以新增todo項目
newTodo.addEventListener('keypress',function(){
  if(event.keyCode === 13){
    getTodo();
  }
})
//刪除todo的項目 + 劃掉功能,toggle可以在變回來add不行
myTodo.addEventListener('click',function (){
  if(event.target.classList.contains('delete')){
    event.target.parentElement.remove();
  }else if(event.target.tagName === 'LABEL' || 'span' || 'time'){
    event.target.parentElement.classList.toggle('checked');
    myDone.appendChild(event.target.parentElement.parentElement);//直接append可以移植原本項目的位置
  }
});
//刪除myDone的項目
myDone.addEventListener('click',function (){
  if(event.target.classList.contains('delete')){
    event.target.parentElement.parentElement.remove();
  }else if(event.target.tagName === 'LABEL' || 'span' || 'time'){
    event.target.parentElement.classList.remove('checked');
    myTodo.appendChild(event.target.parentElement.parentElement);
  }
});