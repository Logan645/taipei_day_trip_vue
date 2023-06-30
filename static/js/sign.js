// const { createApp } = Vue 提出去直接寫在html中
createApp({
    data(){
        return {
            signInUpBtn:'登入/註冊',
            signInShow: false,
            signUpShow: false,
            signInMessage: '',
            signUpMessage: '',
            signUpName: '',
            signUpEmail: '',
            signUpPassword:'',
            signInEmail: '',
            signInPassword:''
        }
    },
    mounted() {
        this.checkUserStatus();
    },
    methods:{
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
}).mount('#signInSignUp')