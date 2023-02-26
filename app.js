//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Motivation is the driving force behind everything we do. It's what gets us out of bed in the morning and helps us tackle our daily tasks with enthusiasm. Without motivation, we can quickly lose sight of our goals and aspirations. But when we are motivated, we have the power to achieve great things. Whether it's starting a new project, pursuing a passion, or simply trying to get through a tough day, motivation is essential. By finding ways to stay motivated, we can overcome obstacles, stay focused on our objectives, and reach new heights of success.";
const aboutContent = "Learn more about our mission, values, and commitment to providing exceptional customer experiences. Discover our history, achievements, and vision for the future. Meet our team of experts, who are dedicated to helping you achieve your goals and stay motivated every step of the way. Our About Us menu is the perfect place to learn more about who we are and what we stand for.";
const contactContent = " Contact our customer service team for assistance with orders, products, or general inquiries. Reach out to our experts for guidance and advice on staying motivated and achieving your goals. You can also join our community by subscribing to our newsletter or following us on social media. We are here to support you in your journey towards success and we look forward to hearing from you.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin_ramya:testmongodb123@cluster0.blqgvvm.mongodb.net/blogDB");
//mongoose.connect("mongodb://127.0.0.1:27017/blogDB");
mongoose.set('strictQuery', true);

// Create Schema
const postSchema = {
  title : String,
  content : String,
};
const Post = mongoose.model("post",postSchema);

let foundPosts=[];
app.get("/",function(req,res){
  Post.find({},function(err,foundPosts){
    if(!err){
      res.render("home",{
        homeContext:homeStartingContent,
        postContent:foundPosts
        });
    }
  });
});

app.get("/posts/:postid",function(req,res){
  const requestedTitle = _.capitalize(req.params.postid); 
  Post.findOne({title:requestedTitle},function(err,foundPosts){
    if(!err){
      res.render("post", {postTitle: foundPosts.title, postMessage: foundPosts.content});
    }else{
      console.log("Requested post not found");
    }
  });
});

app.get("/about",function(req,res){
  res.render("about",{aboutContext:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContext:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  const post = new Post({
    title : _.capitalize(req.body.postTitle),
    content : req.body.postBody,
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT ||3000, function() {
  console.log("Server started on port 3000");
});
