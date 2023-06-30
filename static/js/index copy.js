const attractions = document.querySelector('.attractions')
const search = document.querySelector('header form')

function add_attraction(id, image, name, mrtName, categoryName){
    let attraction = document.createElement('div');
    attraction.className = 'attraction';
    attraction.id = 'attraction'+id;
    attraction.onclick = function(){location.href=`/attraction/${id}`};
    attractions.appendChild(attraction);
    let attraction_img = document.createElement('div');
    attraction_img.className = 'attraction_img';
    attraction_img.id = 'image'+id;
    attraction_img.style.backgroundImage = `url(${image})`;
    document.querySelector('#attraction'+id).appendChild(attraction_img);
    let attraction_name = document.createElement('div');
    attraction_name.className = 'attraction_name';
    attraction_name.id = 'name'+id;
    attraction_name.textContent = name;
    document.querySelector('#image'+id).appendChild(attraction_name);
    let info = document.createElement('div');
    info.className = 'info';
    info.id = 'info'+id
    document.querySelector('#attraction'+id).appendChild(info);
    let mrt = document.createElement('div');
    mrt.className = 'mrt';
    mrt.id = 'mrt'+id;
    mrt.textContent = mrtName; 
    document.querySelector('#info'+id).appendChild(mrt);
    let category = document.createElement('div');
    category.className = 'category';
    category.id = 'category'+id;
    category.textContent = categoryName; 
    document.querySelector('#info'+id).appendChild(category);
}

let page = 0
let keyword = ''
let isFatching = false
async function fetchAPI(){
    isFatching = true;
    if(page === null){return}
    let apiUrl = '';
    if(keyword === ''){
        apiUrl = `/api/attractions?page=${page}` 
    }else{
        apiUrl = `/api/attractions?page=${page}&keyword=${keyword}`
    }
    let response = await fetch(apiUrl);
    let data = await response.json();
    let arr =await data['data']
    if(data['data']=[]){
        for(let i of arr){
            let id = i['id'];
            let image = i['images'][0];
            let name = i['name'];
            let mrt = i['mrt'];
            let category = i['category'];
            add_attraction(id, image, name, mrt, category);
        }
    }
    page = await data['nextPage']

    if (attractions.innerHTML === ''){
        let searchError = document.createElement('h1');
        searchError.innerText = `找不到「${keyword}」的搜尋結果！`;
        searchError.style.color = '#666666';
        attractions.appendChild(searchError)
    }
    isFatching = false
}

// fetchAPI()

function renderNextPage(){
    if(isFatching)return;
    // const screenBottom = this.pageYOffset + this.innerHeight
    //inner
    if((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight){
	    fetchAPI()
    } 
}  

//解決連續觸發的問題
function debounce(func, delay=250) {
    let timer = null;
    return () => {
        // 下面這兩行是做什麼的?
        let context = this;
        let args = arguments;

        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(context, args);
        }, delay)
    }
}

function fetchSearch(event){
    event.preventDefault(); //停止網頁上的默認動作，html呼叫這函示時也要帶上event
    keyword = document.querySelector('.slogan_area input').value;
    page = 0;
    // console.log(keyword);
    attractions.innerHTML=''
    fetchAPI()
}

async function fetchCategoryApi(){
    let category_list = document.querySelector('#category_list')
    category_list.innerHTML = ''
    isFatching = true;
    const response = await fetch('/api/categories');
    const data = await response.json()
    const list = await data['data']
    for(const i of list){
        let category = document.createElement('div');
        category.className = 'category_name';
        category.textContent = i
        category_list.appendChild(category)
    }
    isFatching = false
}

const inputKw = document.querySelector('.inputKw');
const menu = document.querySelector('.category_block');
inputKw.addEventListener('click', async function (event) {
    await fetchCategoryApi();
    menu.style.display = 'block';
    event.stopPropagation();
    //將所有category抓入
    let category_list = document.querySelectorAll('.category_name');
    for (let i of category_list) {
        i.addEventListener('click', function () {
            inputKw.value = i.textContent;
            menu.style.display = 'none';
        })
    }
})

document.addEventListener('click',function(){
    menu.style.display = 'none';
})
// window.addEventListener('scroll', debounce(renderNextPage))
search.addEventListener('submit', fetchSearch)

