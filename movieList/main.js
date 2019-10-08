(function () {
    const BASE_URL = 'https://movie-list.alphacamp.io'
    const INDEX_URL = BASE_URL + '/api/v1/movies/'
    const POSTER_URL = BASE_URL + '/posters/'
    const data = []
    const dataPanel = document.getElementById('data-panel')
  
    axios.get(INDEX_URL).then((response) => {
      data.push(...response.data.results)
      //displayDataList(data)
      getTotalPages(data)
      getPageData(1, data)
    }).catch((err) => console.log(err))
  
    // listen to data panel
    dataPanel.addEventListener('click', (event) => {
      if (event.target.matches('.btn-show-movie')) {
        showMovie(event.target.dataset.id)
      }else if (event.target.matches('.btn-add-favorite')) {
        addFavoriteItem(event.target.dataset.id)
      }
    })
    //listen to botton
    const searchForm = document.getElementById('search')
    const searchInput = document.getElementById('search-input')
    // listen to search form submit event
    searchForm.addEventListener('submit', event => {
      let results = []
      event.preventDefault()
      const regex = new RegExp(searchInput.value, 'i')
      results = data.filter(movie => movie.title.match(regex))
      getTotalPages(results)
      getPageData(1, results)
  })
    //add to favorite
    function addFavoriteItem (id) {
      const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
      const movie = data.find(item => item.id === Number(id))
      if (list.some(item => item.id === Number(id))) {
        alert(`${movie.title} is already in your favorite list.`)
      } else {
        list.push(movie)
        alert(`Added ${movie.title} to your favorite list!`)
      }
      localStorage.setItem('favoriteMovies', JSON.stringify(list))
    }
    //display data
    let isListModel = false;
    
    function displayDataList (data) {
      //用isListModel變數控制是否執行
      if(!isListModel){
        let cardHtmlContent = ''
      data.forEach(function (movie, index) {
        cardHtmlContent += `
          <div class="col-sm-3">
            <div class="card mb-2">
              <img class="card-img-top " src="${POSTER_URL}${movie.image}" alt="Card image cap">
              <div class="card-body movie-item-body">
                <h5 class="card-title">${movie.title}</h5>
              </div>
              <!-- "More" button -->
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${movie.id}">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${movie.id}">+</button>
              </div>
            </div>
          </div>
        `
        })
        dataPanel.innerHTML = cardHtmlContent;
      }else if(isListModel){
        let listHtmlContent = ''
      data.forEach(function (movie, index) {
        listHtmlContent += `
        <table class="table col-12">
          <tbody>
            <tr>
              <td class="col-2">${movie.title}</td>
              <td></td>
              <td class="d-flex">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${movie.id}">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${movie.id}">+</button>
              </td>
            </tr>
          </tbody>
        </table>
        `
       })
        dataPanel.innerHTML = listHtmlContent;
      }
    }
    
    
    function showMovie (id) {
      // get elements
      const modalTitle = document.getElementById('show-movie-title')
      const modalImage = document.getElementById('show-movie-image')
      const modalDate = document.getElementById('show-movie-date')
      const modalDescription = document.getElementById('show-movie-description')
  
      // set request url
      const url = INDEX_URL + id
      // send request to show api
      axios.get(url).then(response => {
        const movieData = response.data.results
        // insert data into modal ui
        modalTitle.textContent = movieData.title
        modalImage.innerHTML = `<img src="${POSTER_URL}${movieData.image}" class="img-fluid" alt="Responsive image">`
        modalDate.textContent = `release at : ${movieData.release_date}`
        modalDescription.textContent = `${movieData.description}`
      })
    }
    //製作分頁表
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
    //get data page
    let paginationData = []
    
    function getPageData (pageNum, data) {
      paginationData = data || paginationData
      let offset = (pageNum - 1) * ITEM_PER_PAGE
      let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
      displayDataList(pageData)
    }
    // listen to pagination click event
    let datasetPage = '' || 1;
    pagination.addEventListener('click', (event) => {
      datasetPage = event.target.dataset.page;
      if (event.target.tagName === 'A') {
        getPageData(datasetPage)
      }
      return datasetPage
    })
    //listen to font-btn 切換圖案
    const font_btn = document.getElementById('font-btn');
    font_btn.addEventListener('click', event => {
      if(event.target.matches('.fa-th')){
        isListModel = false;
        getPageData(datasetPage)
      }else if(event.target.matches('.fa-bars')){
        isListModel = true;
        getPageData(datasetPage)
      }
    })
  })()
  