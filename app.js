const express = require('express');
const fs = require('fs');
const axios = require('axios');
const port = 3000;
const app = express();


app.use(express.urlencoded());
app.use(express.json());
const multer = require("multer");
app.use(express.static("public"));
app.use(express.static("upload"));

app.listen((process.env.PORT) || port,()=>{
    console.log("Server is running on port: "+port)
})

const myMulter = multer({
    dest: "./public/image",
  });
// variables 
let userspost = JSON.parse(fs.readFileSync('dataposts.json'));
let data_post = userspost.data_post;
let postid = JSON.parse(fs.readFileSync('id.json'));

// functions 

function foundIndex(ID){
    for(id in postid){
        if(postid[id]== ID){
            return id
        }
    } 
}

function foundindexcmt (cmtid ,listcommentid ){
    for(id in listcommentid){
        if(listcommentid[id]==cmtid){
           return id
        }
    }
}
// load posts 

app.get("/post",(req,res)=>{
    tosend = userspost
    res.send(tosend.data_post)
})

// add Image 

app.post("/profile/", myMulter.single("file"), (req, res) => {
    // 1- Change the file name to the original name
    let oldpath = req.file.path;
    let newpath = "./public/image/" + req.file.originalname; // Note it overwrite the destination if exist
    fs.rename(oldpath, newpath, (err) => {});
  });

// add Post 

app.post("/post",(req,res)=>{
    userspost.last_id+=1
    let id = userspost.last_id
    postid.push(id)
    console.log(req.body.file+"yes")
    userpost ={
        id  :id,
        username : req.body.username,
        post_title : req.body. post_title,
        post_caption: req.body.post_caption,
        date: req.body.date,
        time: req.body.time,
        file : req.body.file,
        show:true,
        show_comment : false,
        show_comment_input : false,
        edited : false,
        comment : {
            commentList :[],
            lastComentid :0
        },
        commentID : [],
        post_react : [],
        count_react : 0,
        url_img :''
    }
    data_post.push(userpost)
    fs.writeFileSync("dataposts.json",JSON.stringify(userspost))
    fs.writeFileSync("id.json",JSON.stringify(postid))
    res.send(data_post)
}) 

// edit post

app.put("/post/:id",(req,res)=>{
    let ID = parseInt(req.params.id);
    let index_edit = foundIndex(ID)
    let post_edit_data = req.body;
    data_post[index_edit]=post_edit_data;
    fs.writeFileSync("dataposts.json",JSON.stringify(userspost))
    res.send(userspost.data_post)
})

// delete post 

app.delete('/post/:id',(req,res)=>{
    let ID = parseInt(req.params.id);
    let index_delete = foundIndex(ID);
    console.log(index_delete)
    data_post.splice(index_delete,1)
    postid.splice(index_delete,1)
    fs.writeFileSync("dataposts.json",JSON.stringify(userspost))
    fs.writeFileSync("id.json",JSON.stringify(postid))
    res.send(userspost.data_post)
})

// react post 

app.put('/post/reactpost/:id',(req,res)=>{
    let ID = parseInt(req.params.id);
    let user_react = req.body.user_react
    let index_post = foundIndex(ID);
    let post_react = data_post[index_post].post_react
    let count_react = data_post[index_post].count_react
    founduserreact = false
    for(index in post_react){
        if(post_react[index] == user_react ){
            founduserreact = true
            post_react.splice(index,1)
            data_post[index_post].count_react = count_react- 1

        }
    }
    if(!founduserreact){
        post_react.push(user_react)
        data_post[index_post].count_react = count_react+ 1

    }
    fs.writeFileSync("dataposts.json",JSON.stringify(userspost))
    res.send(userspost.data_post)
})

//  hide / show post  

app.put("/post/show/:id",(req,res)=>{
    let id = req.params.id;
    let ID =foundIndex(id)
    let post = req.body;
    data_post[ID]=post;
    fs.writeFileSync("dataposts.json",JSON.stringify(userspost))
    res.send(userspost.data_post)
})

app.put("/post/hide/:id",(req,res)=>{
    let id = req.params.id;
    let ID =foundIndex(id)
    let post = req.body;
    data_post[ID]=post;
    fs.writeFileSync("dataposts.json",JSON.stringify(userspost))
    res.send(userspost.data_post)
})

// hide / show comment side 

app.put("/post/hide/showcomment/:id",(req,res)=>{
    console.log("hello")
    let id = req.params.id;
    let ID =foundIndex(id)
    let post = req.body;
    data_post[ID]=post;
    fs.writeFileSync("dataposts.json",JSON.stringify(userspost))
    res.send(userspost.data_post)
})

// add comment 

app.post("/post/comment/:id",(req,res)=>{
    let id = req.params.id;
    let ID =foundIndex(id)
    let post_comment = req.body;
    let comments = data_post[ID].comment.commentList
    let lastCommentID = data_post[ID].comment.lastComentid
    lastCommentID+=1
    // add last comment id to array of lastCommentID 
    data_post[ID].comment.lastComentid = lastCommentID
    // // add coment id to comment 
    post_comment.commentid = lastCommentID
    post_comment.user_react=[];
    post_comment.count_react = 0;
    // // add comment id to array coment ID 
    data_post[ID].commentID.push(lastCommentID)
    comments.push(post_comment)
    fs.writeFileSync("dataposts.json",JSON.stringify(userspost))
    res.send(userspost.data_post)
    
}),

// delete  

app.delete("/post/comment/:postid/:cmtid",(req,res)=>{
    let postid = req.params.postid;
    let cmtid =  req.params.cmtid;
    let Postindex = foundIndex(postid)
    let post = data_post[Postindex]
    let listcommentid = post .commentID
    let cmtindex = foundindexcmt (cmtid ,listcommentid )
    let cmtList = post.comment.commentList;
    let idlist = post.commentID;
    cmtList.splice(cmtindex,1)
    idlist.splice(cmtindex,1)
    console.log(post.comment)
    fs.writeFileSync("dataposts.json",JSON.stringify(userspost))
    res.send(userspost.data_post)
})

// edit comment 

app.put("/post/comment/:postid/:cmtid",(req,res)=>{
    let postid = req.params.postid;
    let Postindex = foundIndex(postid)
    let post = data_post[Postindex]
    let listcommentid = post .commentID;
    let cmtid =  req.params.cmtid;
    let cmtindex = foundindexcmt (cmtid ,listcommentid )
    let comment_data = req.body
    let cmtList = post.comment.commentList;
    comment_data.edited = true
    console.log(comment_data)
    cmtList[cmtindex] = comment_data
    fs.writeFileSync("dataposts.json",JSON.stringify(userspost))
    res.send(userspost.data_post)
})

// react comment  

app.post("/post/reactcomment/:postid/:cmtid",(req,res)=>{
    let username = req.body.user_react;
    let postid = req.params.postid;
    let cmtid =  req.params.cmtid;
    let Postindex = foundIndex(postid)
    let post = data_post[Postindex]
    let listcommentid = post .commentID;
    let cmtindex = foundindexcmt (cmtid ,listcommentid )
    let founduser = false
    let comments=  post.comment.commentList;
    let cmt_react = comments[cmtindex].user_react;
    let countreact = comments[cmtindex].count_react;
    for (index in cmt_react){
        if ( cmt_react[index] == username){
            founduser = true;
            cmt_react.splice(index,1)
            comments[cmtindex].count_react = countreact-1
        }
    }
    if(!founduser){
        cmt_react.push(username);      
        comments[cmtindex].count_react = countreact+1; 
    }
    fs.writeFileSync("dataposts.json",JSON.stringify(userspost))
    res.send(userspost.data_post)
})









