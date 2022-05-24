
var app = new Vue({
    el: '#app',
    data: {
        URL: "http://localhost:3000",
        main_container : true,
        form_container : true,
        btn_create_post : true,
        form_container_addpost: false,
        Comment:true,
        post : true,
        update : false,
        Edit_comment :false,
        post_edit_data : {},
        comment_edit_data:{},
        List_posts : [],
        resultsearch : [],
        username :"",
        post_title : "",
        post_caption : "",
        comment_text:"",
        search : "",
        file : '',
        post_satuation : "allpost",
        today :localStorage.getItem("today"),
        username_storage :localStorage.getItem("username"),
    },
    methods: {
        load_data(){
            this.username_storage =localStorage.getItem("username")
            if(this.username_storage!=""){
                this.main_container = true
                this.form_container = false

            }
            else{
                this.main_container = false
                this.form_container = true
            }
            axios.get(this.URL+"/post").then(response => {
                this.List_posts = response.data.reverse();
              })

        },
        login(event){
            event.preventDefault();
            if(this.username!= ""){
                this.main_container = true
                this.form_container = false
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                localStorage.setItem("username",this.username);
                localStorage.setItem("today",date);
            }
            else{
                alert("Fill in username");
            }
            this.username_storage =localStorage.getItem("username")
            console.log(this.username_storage)
        },
        logout(){
            this.load_data();
            this.username=""
            this.main_container = false
            this.form_container = true
            this.post_satuation = "allpost"
            localStorage.setItem("username","");


        },
        create_post(){
            console.log("yes")
            this.form_container_addpost=true

        },
        onSelect() {
            this.file = this.$refs.file.files[0];
            this.file.name;
            this.addImage ()
          },
        addImage(){
            const formData = new FormData();
            formData.append("file", this.file);

            axios
                .post(this.URL+"/profile", formData)
                .then((response) => {
                    console.log("file uploaded ! ")
                })
                .catch((response) => {
                  this.message = "error ! ";
                });
            },
        Addpost(){
            console.log( this.post_title+"|"+ this.post_caption)
            this.post=true;
            this.upload=false;
            this.form_container_addpost = false
            // get date and time 
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.toLocaleTimeString();

            if(this.post_caption!="" && this.post_title!=""){
                let post={
                    username : localStorage.getItem("username"),
                    post_title : this.post_title,
                    post_caption : this.post_caption,
                    date : date,
                    time : time,
                    file : this.file.name
                }
                axios.post("/post",post).then(response=>{
                this.List_posts = response.data.reverse();
                })
            }
            else{
                alert("please fill information in!");
            }
            this.post_title = ""
            this.post_caption = ""
        },
        hide_form(){
            this.post=true;
            this.upload=false;
            this.form_container_addpost = false
            this.post_title = ""
            this.post_caption = ""
        },
        My_post(){
            this.post_satuation = "mypost";
        },
        all_posts(){

            this.post_satuation = "allpost";
        },
        new_feed(){
            this.post_satuation = "newfeed";
        },
        Editpost(post){
            this.form_container_addpost = true;
            this.post=false;
            this.update=true;
            this.post_title = post.post_title;
            this.post_caption = post.post_caption;
            this.post_edit_data = post;
        },
        Updatepost(){
            this.post_edit_data.post_title = this.post_title;
            this.post_edit_data.post_caption= this.post_caption;
            let post = this.post_edit_data;
            post.edited = true;
            if(this.post_caption!="" && this.post_title!=""){
                axios.put("/post/"+post.id,post).then(response=>{
                this.List_posts = response.data.reverse()
                })
            }
            else{
                alert("please fill information in!")
            }
            this.post_edit_data = {};
            this.form_container_addpost = false
            this.post_title = ""
            this.post_caption = ""
        },
        removepost(post){
            console.log(post.id)
            axios.delete("/post/"+ post.id).then(response=>{
                console.log(response.data)
                this.List_posts = response.data.reverse()
            })
        },
        post_react(post){
            axios.put("/post/reactpost/"+post.id,{user_react :this.username_storage}).then(response=>{
                this.List_posts = response.data.reverse()
            })
        },
        show(post){
            if(post.show!= true){
                post.show=true;
            }
            console.log(post.show)
            axios.put("/post/show/"+ post.id,post).then(response=>{
                this.List_posts = response.data.reverse()
            })
        },
        hide(post){
            if(post.show != false){
                post.show=false;
            }
            axios.put("/post/hide/"+ post.id,post).then(response=>{
                    this.List_posts = response.data.reverse()
                })
        },
        showcomment_input(post){
            if(post.show_comment_input){
                post.show_comment_input = false
            }
            else{
                post.show_comment_input = true
            }
            console.log(post.show_comment_input)
            axios.put("/post/hide/showcomment/"+ post.id,post).then(response=>{
                this.List_posts = response.data.reverse();
            })
        },
        hide_show_comment(post){
            if(post.show_comment){
                post.show_comment = false
            }
            else{
                post.show_comment = true
            }
            console.log(post)
            axios.put("/post/hide/showcomment/"+ post.id,post).then(response=>{
                this.List_posts = response.data.reverse();
                console.log(this.List_posts)
            })
        },
        comment(post){
            if(this.comment_text!=="" && this.comment_text!==" "){
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                var time = today.toLocaleTimeString();
                post_comment={
                    username_comment : this.username_storage,
                    comment_text :this.comment_text,
                    date : date,
                    time : time,
                    edited : false
                }
                axios.post("/post/comment/"+ post.id,post_comment).then(response=>{
                    this.List_posts = response.data.reverse();
                    console.log(this.List_posts)
                })
                this.comment_text=""
                }
            else{
                    alert("fill in your comment!")
                }    
        },
        edit_comment(post,comment){
            this.Edit_comment = true
            this.Comment = false
            post.show_comment_input = true
            this.comment_text = comment.comment_text;
            this.post_edit_data = post 
            this.comment_edit_data = comment
        },
        Update_comment(){
            let data_comment =  this.comment_edit_data
            data_comment.comment_text = this.comment_text
            let commentid = this.comment_edit_data.commentid
            let postid = this.post_edit_data.id
            axios.put("/post/comment/"+postid+"/"+commentid,data_comment).then(response=>{
                this.List_posts = response.data.reverse()
            })
            this.post_edit_data ={}
            this.comment_edit_data  = {}
            this.comment_text = ""
            this.Edit_comment = false
            this.Comment = true
        },
        delete_comment(post,comment){
            axios.delete("/post/comment/"+post.id+"/"+comment.commentid).then(response=>{
                this.List_posts = response.data.reverse()
            })
        },
        cmt_react(post,comment){
            let postID = post.id
            let cmtID = comment.commentid
            axios.post("/post/reactcomment/"+postID+"/"+cmtID,{user_react :this.username_storage}).then(response=>{
                this.List_posts = response.data.reverse()
                console.log(this.List_posts)
            })
        }
    },
    computed: {
        posts : function(){
            let List_data = [];
            if (this.post_satuation =="allpost"){
                List_data = this.List_posts
            }
            else if (this.post_satuation =="newfeed"){
                List_data =  this.List_posts.filter((post) => post.date ===this.today   )
            }
            else if (this.post_satuation =="mypost"){
                List_data =  this.List_posts.filter((post) => post.username ===this.username_storage)  
            }
            else{
                List_data = this.resultsearch
            }
            return List_data.reverse()
        }
    },
    watch : {
        search:function(){
            this.post_satuation = "search" 
            this.resultsearch = this.List_posts.filter((post) =>  post.username.indexOf(this.search) !== -1);
        }
    },
    mounted: function() {
        this.load_data()
    }
  })