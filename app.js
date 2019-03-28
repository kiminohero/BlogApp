var express        = require("express"),
    app            = express(),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/blogapp");

// APP CONFIG

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// DATABASE CONFIG

var blogSchema = mongoose.Schema({
  title: String,
  body: String,
  image: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//ROUTE CONFIG

app.get("/",function(req,res){
  res.redirect("/blogs");
});

// INDEX ROUTE

app.get("/blogs",function(req,res){
  Blog.find({},function(err,blogs){
    if(err){
      console.log(err);
    }
    else{
      res.render("index",{blogs: blogs});
    }
  });
});

// NEW ROUTE

app.get("/blogs/new",function(req,res){
  res.render("new");
});

// CREATE ROUTE

app.post("/blogs", function(req,res){
  Blog.create(req.body.blog,function(err,newblog){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    if(err){
      res.render("new");
    }
    else{
      res.redirect("/blogs");
    }
  })
});

// SHOW ROUTE

app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err, foundblog){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.render("show",{blog: foundblog})
    }
  });
});

// EDIT ROUTE

app.get("/blogs/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err, foundblog){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.render("edit",{blog: foundblog});
    }
  });
});

// UPDATE ROUTE

app.put("/blogs/:id",function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/"+ req.params.id);
    }
  });
});

// DELETE ROUTE

app.delete("/blogs/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err,blog){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.redirect("/blogs");
    }
  });
});

var port = process.env.PORT || 3000;
var ip  = "localhost" || process.env.IP;
app.listen(port, ip, function(){
    console.log("Server is running now!!");
});
