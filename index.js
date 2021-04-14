const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
// const POSTER_URL = BASE_URL + '/posters/'

const friends = []
let filteredFriends = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')


//決定每ㄧ頁要抓哪些資料
const friendsPerPage = 20

function getFriendsByPage(page) {
  //如果filteredFriends上有東西(true)就用filteredFriends當data不然（false)就用friends  
  const data = filteredFriends.length ? filteredFriends : friends
  const startPage = (page - 1) * friendsPerPage
  return data.slice(startPage, startPage + friendsPerPage)
}

//根據資料的數量來計算畫面下方要顯示有多少頁數
function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / friendsPerPage)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}


function renderFriendsList(data) {
  let rawHTML = ''
  data.forEach((ppl) => {
    rawHTML += `<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${ppl.avatar
      }" class="card-img-top" alt="Friend Avatar" >
          <div class="card-body">
          <h5 class="card-title">${ppl.name} ${ppl.surname}</h5>
          </div>
          <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
              data-target="#profile-modal" data-id="${ppl.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${ppl.id}" style="background-color:var(--danger); border-color:var(--danger)"><i class="fas fa-heart"></i></button>
          </div>
        </div>
        </div >
      </div >`
  })
  dataPanel.innerHTML = rawHTML
}

function showFriendModal(id) {
  const modalName = document.querySelector('#profile-modal-title')
  const modalAvatar = document.querySelector('#profile-avatar')
  const modalEmail = document.querySelector('#profile-email')
  const modalGender = document.querySelector('#profile-gender')
  const modalBirthday = document.querySelector('#profile-birthday')
  const modalAge = document.querySelector('#profile-age')
  const modalRegion = document.querySelector('#profile-region')
  console.log(modalAvatar)
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    console.log(response.data.avatar)
    modalName.innerText = data.name + " " + data.surname
    modalEmail.innerHTML = `<a href="mailto: ${data.email}">${data.email}</a>`
    modalGender.innerText = "Gender: " + data.gender
    modalBirthday.innerText = "Birthday:" + "\n" + data.birthday
    modalAge.innerText = "Age: " + data.age
    modalRegion.innerText = "Region: " + data.region
    // modalAvatar.innerHTML = `<img src="${INDEX_URL + data.avatar}" alt="friend-avartar"
    //             class="img-fluid">`
    modalAvatar.innerHTML = `<img src="${data.avatar}" alt="friend-avartar"
               class="img-fluid">`
  })

}

function addToFavorite(id) {
  // function isMovieIdMatched(movie) {
  //   return movie.id === id
  // }

  /////localStorge can only store string hance JSON.parse
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  // const movie = movies.find(isMovieIdMatched) 把movies上的每一部電影都跑一次指定的函數

  if (list.some(movie => movie.id === id)) {
    return alert('This movie had been added to your list')
  }



  const movie = movies.find(movie => movie.id === id)
  list.push(movie)
  console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))

}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderFriendsList(getFriendsByPage(page))
})

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showFriendModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase()


  if (!keyword.length) {
    return alert('Please enter a valid string')
  }

  for (const friend of friends) {
    // console.log(friend.name)
    if (friend.name.toLowerCase().includes(keyword) || friend.surname.toLowerCase().includes(keyword)) {
      filteredFriends.push(friend)
    }
  }
  renderPaginator(filteredFriends.length)
  renderFriendsList(getFriendsByPage(1))
})

//issue:如果直接 movies.push(response.data.results)，那 movies 會變成一個只有 1 個元素的陣列：
// axios.get(INDEX_URL)
//   .then((response) => {
//     movies.push(response.data.results)
//     }
//     console.log(movies)
//     console.log(movies.length) //1

//   })
//   .catch((err) => console.log(err))

//解法一 使用for...of迭代器
// axios.get(INDEX_URL)
//   .then((response) => {
//     for (const movie of response.data.results) {
//       movies.push(movie)
//     }
//     console.log(movies)
//     console.log(movies.length) //80

//   })
//   .catch((err) => console.log(err))

//解法二 展開運算子
axios.get(INDEX_URL)
  .then((response) => {
    friends.push(...response.data.results)
    renderPaginator(friends.length)
    renderFriendsList(getFriendsByPage(1))
    console.log(response.data.results)

  })
  .catch((err) => console.log(err))



