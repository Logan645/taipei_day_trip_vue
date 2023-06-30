createApp({
    data(){
        return {
            userName:'',
            cartData:{},
            contentShow: true,
            nullMessage: '',
            nullMessageShow: false
        }
    },
    async mounted() {
        await this.fetchUserAPI()
        await this.getCartData()
        await (function(){
            // console.log('視窗內部高度'+window.innerHeight);
            // console.log('body高度' + document.body.offsetHeight);
            // console.log(window.innerHeight-document.body.offsetHeight);
            if(window.innerHeight-document.body.offsetHeight>0){
                const footer = document.createElement('div')
                const height = window.innerHeight-document.body.offsetHeight
                footer.style = `height: ${height}px; background: #757575`
                const body = document.querySelector('body')
                body.appendChild(footer)
            }
        })()
    },
    methods:{
        async fetchUserAPI(){
            const res = await fetch('/api/user/auth');
            const response = await res.json();
            if (response["data"]){
                // console.log(data["data"]);
                this.userName = response["data"]["name"]
            }else{
                window.location.href = '/'
            }
        },
        //取得預定⾏程，並將購物車資料呈現在畫面中
        async getCartData(){
            const res = await fetch('/api/booking');
            const data = await res.json();
            console.log(data);
            if (data['data']){
                this.cartData['attractionName'] = data['data']['attraction']['name']
                this.cartData.date = data['data']['date']
                this.cartData.time = data['data']['time']
                this.cartData.price = data['data']['price']
                this.cartData.address = data['data']['attraction']['address']
                this.cartData.image = data['data']['attraction']['image'];
            }else{
                this.contentShow = false
                this.nullMessageShow = true
                this.nullMessage = '目前沒有任何待預訂的行程'
            }  
        },
        //刪除預定⾏程API
        async deleteCartData(){
            const config = {method: "DELETE"}
            const res = await fetch('/api/booking', config);
            const response = await res.json();
            if (response.ok){
                location.reload()
            }
        }
    }
}).mount('main')