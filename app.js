const express=require("express");
const bodyparser=require("body-parser");
const ejs =require("ejs");
const mongoose=require('mongoose');

const app=express()
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
    extended:true
}));

app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/wikiDB").then(()=>{
    console.log("Db connected..")


})
.catch((err)=>{
    console.log(err)
  })
  ;//mongo db error throw up


const articaleSchema={
    tittle:"String", // db not showing showing empty
    content:"String"
};

const Article=mongoose.model("Article",articaleSchema);





/////////////////////// request targeting a specfice Articeles  ////////////////////////////

app.route("/articles")

.get((req,res) => {
    Article.find().then((err,found)=>{
        if(!err){
            res.send(found);
        }else{
            res.send(err);
        }
     



    });
})

.post((req,res)=>{
  
const newArticle=new Article({      //create obj in mongo
    tittle:req.body.tittle,
    content:req.body.content

});
newArticle.save().then(()=>{
    console.log("create sucessfully");
    res.send(newArticle);
}).catch(err=>{
    console.log(err.message);
});

   

})

.delete((req,res)=>{
    Article.deleteMany().then((err)=>{
        if(!err){
            res.send("sucessfully deleted ");
        }else{
            res.send(err);
        }

    });
})

/////////////////////// request targeting a specfice Articeles  ////////////////////////////


app.route("/articles/:articlesTittle")
.get((req,res)=>{
    const findTitle=req.params.articlesTittle;
    Article.findOne({tittle:findTitle}).then(foundArticles=>{
        res.send(foundArticles);
    }).catch(err=>{
        console.log(err);
    })
})

.put((req,res)=>{
    Article.findOneAndUpdate({
     tittle:req.params.articlesTittle
    },
    {tittle:req.body.tittle,content:req.body.content},
    {overwrite:true}
    ).then((err)=>{
        if(!err){
            res.send("Sucessfully Updated Article.")
        }
    })
})
.patch((req,res)=>{
    Article.findOneAndUpdate({
        tittle:req.params.articlesTittle 
    },
    {$set:req.body}
    ).then((err)=>{
if(!err){
    res.send("Sycessfully Updated Article ...")
}else{
    res.send(err);
}
    })
})

.delete((req,res)=>{
    Article.deleteOne({
          tittle:req.params.articlesTittle 
    }).then((err)=>{
        if (!err) {
            res.send("Sucessfully Deleted articles..")
        }else{
            res.send(err);
        }
    })
});

app.listen(3000, function(){
    console.log("server is started on port 3000");
});
