// const { createApp } = Vue 提出去直接寫在html中
createApp({
    data() {
        return {
            attractions: [],
            isFetching: false,
            page: 0, 
            category_list: [],
            keyword: '',
            categoryBool: false,
            userInput:'',
            apiUrl:'',
            document: this.document,
        }
    },
    mounted() {
        this.loadPage()
        window.addEventListener('scroll', this.debounce(this.renderNextPage))
        document.addEventListener('click', ()=>{
            this.categoryBool = false;
        })
    },
    //看起來掛在mounted或updated效果一樣，不太知道mounted和updated的差別
    // updated(){
    //     console.log('updated')
        // document.addEventListener('click', ()=>{
        //     this.categoryBool = false;
        // })
    // },
    methods: {
        async loadPage() {
            this.isFetching = true;
            if(this.page!=null){
                if(this.keyword === ''){
                    this.apiUrl = `/api/attractions?page=${this.page}` 
                }else{
                    this.apiUrl = `/api/attractions?page=${this.page}&keyword=${this.keyword}`
                }
                let response = await fetch(this.apiUrl);
                let data = await response.json();
                let arr =await data['data']
                this.attractions = this.attractions.concat(arr)
                this.page = await data['nextPage']
            }
            this.isFetching = false
        },
        debounce(func, delay=250) {
            let timer = null;
            return () => {
                let context = this;
                let args = arguments;

                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(context, args);
                }, delay)
            }
        },
        renderNextPage(){
            if(this.isFetching)return;
            if((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight){
                this.loadPage()
            } 
        },
        async fetchCategoryApi(){
            if(this.category_list=[]){
                this.isFatching = true;
                const response = await fetch('/api/categories');
                const data = await response.json();
                const list = await data['data'];
                this.category_list =this.category_list.concat(list)
            }
            this.isFatching = false
        },
        async showCategory(){
            await this.fetchCategoryApi();
            this.categoryBool = true;
            // event.stopPropagation(); 在vue中透過.stop
        },
        clickCategory(category){
            this.userInput = category 
            this.categoryBool = false;
        },
        async fetchSearch(){
            // event.preventDefault(); //停止網頁上的默認動作，html呼叫這函示時也要帶上event
            //上面這行看起來沒有work，沒有呼叫對應的API，直接畫面重新loading
            this.keyword = this.userInput
            this.page = 0;
            this.attractions=[]
            await this.loadPage()
        },
        //點擊預定行程
        async clickScheduleBtn(){
            response = await fetch('/api/user/auth');
            data = await response.json();
            // console.log("點擊預定行程="+data[data]);
            if (data['data']){
                this.signInUpBtn = '登出系統';
                window.location.href = '/booking';
            }else{
                signInBlock.style.display = 'block';
                signInMessage.textContent = '請先登入'
                signInOutBtn.textContent='登入/註冊'
            }
        },
    }
}).mount('#app')
//隨便點擊空白處關閉category的功能