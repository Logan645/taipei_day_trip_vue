createApp({
    data(){
        return{
            id: document.URL.split('/').slice(-1)[0],
            attraction: {},
            timeInputValue:'',
            dateInputValue: '',
            index : 0,
            min: '',
            price: '',
            //以下是合併sign.js
            signInUpBtn:'登入/註冊',
            signInShow: false,
            signUpShow: false,
            signInMessage: '',
            signUpMessage: '',
            signUpName: '',
            signUpEmail: '',
            signUpPassword:'',
            signInEmail: '',
            signInPassword:'',
        }
    },
    async mounted(){
        await this.checkUserStatus();
        await this.fetchAttractionApi()
        const Today =new Date()
        // 比較特別的是 getMonth() 預設會從零開始，所以我們把他 +1 來修正結果。
        this.min = Today.getFullYear()+ '-' + (Today.getMonth()+1) + '-' +(Today.getDate()+1)
        this.indexClassName()
    },
    updated(){
        if(this.timeInputValue == 'morning'){
            this.price = 2000;
        }else if(this.timeInputValue == 'afternoon'){
            this.price = 2500;
        }
    },
    methods:{
        async fetchAttractionApi(){
            const response = await fetch(`/api/attraction/${this.id}`)
            const data = await response.json()
            this.attraction = {
                'name': data['data']["name"],
                'category': data['data']["category"],
                'description': data['data']["description"],
                'address': data['data']["address"],
                'transport': data['data']["transport"],
                'mrt': data['data']["mrt"],
                'images': data['data']["images"]
            }
        },
        indexClassName(){
            const slider_index = document.querySelector('#slider_index');
            const indexNum = slider_index.children.length
            for(let i=1; i<indexNum+1; i++){
                if(i == this.index+1){
                    const slider_index = document.querySelector(`.slider_index > span:nth-child(${i})`)
                    slider_index.className = 'current_slider_index_icon'
                }
                else{
                    const slider_index = document.querySelector(`.slider_index > span:nth-child(${i})`)
                    slider_index.className = 'slider_index_icon'
                } 
            }
        },
        refresh(){
            const attraction_img = document.querySelector('.attraction_img')
            const widthPx = getComputedStyle(attraction_img).width
            // console.log(width); //印出570px
            const width = Number(widthPx.slice(0,-2)) //只取570
            slider.style.left = this.index * width * -1 +'px';
            const slider_index = document.querySelector('#slider_index');
            const indexNum = slider_index.children.length
            for(let i=1; i<indexNum+1; i++){
                const index = document.querySelector(`.slider_index > span:nth-child(${i})`)
                index.className = 'slider_index_icon'
            }
            const next_index = document.querySelector(`.slider_index > span:nth-child(${this.index+1})`)
            next_index.className = 'current_slider_index_icon'    
        },
        rightShift(){
            const slider = document.querySelector('.slider')
            const allItems = slider.children;
            if(this.index < (allItems.length-1)){
                this.index ++;
            }
            this.refresh()
        },
        leftshift(){
            if(this.index > 0){
                this.index--;
            }
            this.refresh()
        },
        //呼叫加入購物車的API
        async callCartApi(){
            // event.preventDefault()
            const data ={
                "attractionId": this.id,
                "date": this.dateInputValue,
                "time": this.timeInputValue,
                "price": this.price
            }
            console.log(data);
            const config ={
                method: "POST",
                body: JSON.stringify(data),
                headers: { //headers必須要是小寫
                    "Content-type": "application/json",
                    "Accept": "application/json"
                }
            }
            const res = await fetch('/api/booking', config)
            const response = await res.json()
            if(response.ok){
                window.location.href='/booking'
            }
        },
        //點擊加入購物車
        async addToCart(){
            // event.preventDefault()
            const response = await fetch('/api/user/auth');
            const data = await response.json();
            console.log(data['data']);
            if(data['data']){
                await this.callCartApi(event)
            }else{
                this.signInShow = true
                this.signInMessage = '請先登入'
            }
        },
        //以下是合併sign.js
        //點擊右上角的登入/註冊按鈕或登出按鈕，顯示登入區塊
        clickSignInUpBtn(){
            if(this.signInUpBtn === '登入/註冊'){
                this.signInShow = true
                this.signUpShow = false
            }else{
                this.logOut()
            }
        },
        //點擊彈出視窗中的Ｘ
        clickCloseBtn(){
            this.signInShow = false
            this.signUpShow = false
            this.signInMessage = ''
            this.signUpMessage = ''
        },
        //點擊彈出視窗中的點此註冊
        click_to_signUp(){
            this.signInShow = false
            this.signUpShow = true
        },
        //點擊彈出視窗中的點此登入
        click_to_signIn(){
            this.signInShow = true
            this.signUpShow = false
        },
        // 註冊
        async signUp(){
            const data ={
                "name": this.signUpName,
                "email": this.signUpEmail,
                "password": this.signUpPassword
            }
            const config = {
                method: "POST",
                body: JSON.stringify(data),
                headers: { //headers必須要是小寫
                    "Content-type": "application/json",
                    "Accept": "application/json"
                }
            };
            const response = await fetch('/api/user', config);
            const result = await response.json();
            //註冊發生問題
            if (result.error){
                this.signUpMessage = result['message'];
            }
            //註冊成功
            if(result.ok){
                this.signUpMessage = '註冊成功';
                this.signUpName = ''
                this.signUpEmail= ''
                this.signUpPassword = ''
            }    
        },
        //登入
        async signIn(){
            const data = {
                "email": this.signInEmail,
                "password": this.signInPassword
            }
            const config = {
                method: "PUT",
                body: JSON.stringify(data),
                headers: { //headers必須要是小寫
                    "Content-type": "application/json",
                    "Accept": "application/json"
                }
            }
            const response = await fetch('/api/user/auth', config);
            const result = await response.json();
            if (result.error){
                signInMessage = result['message'];
            }
            if(result.ok){
                location.reload()
            }
        },
        //確認登錄狀態
        async checkUserStatus(){
            response = await fetch('/api/user/auth');
            data = await response.json();
            if (data["data"]){
                this.signInUpBtn = '登出系統'
            }else{
                this.signInUpBtn = '登入/註冊'
            }
        },
        //登出系統
        async logOut(){
            const response = await fetch('/api/user/auth', {method: "DELETE"});
            const result = await response.json();
            if(result.ok){
                location.reload();
            }  
        },
        //點擊預定行程
        async clickScheduleBtn(){
            response = await fetch('/api/user/auth');
            data = await response.json();
            if (data['data']){
                this.signInUpBtn = '登出系統';
                window.location.href = '/booking'
            }else{
                this.signInShow = true;
                this.signInMessage = '請先登入'
                this.signInUpBtn ='登入/註冊'
            }
        }
    }
}).mount('#app')