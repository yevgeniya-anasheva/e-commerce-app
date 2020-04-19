const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require("express-fileupload");

require('dotenv').config({path: "./config/keys.env"});
const app = express();
//getting rid of ensureIndex deprecation warning
mongoose.set('useCreateIndex', true);

//registering handlebars as a template engine
app.engine("handlebars", exphbs({
    //to be developed...
    helpers: {
        if_admin : function(str1, str2, options) {
            console.log(`First: ${str1} and second: ${str2}`);
            if(str1 == str2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    }
}));
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

//session middleware
app.use(session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true
  }))
//create a global session variable
app.use((req,res,next)=>{
    
    res.locals.user= req.session.userInfo;
    next();
})
/*
    This is to allow specific forms and/or links that were submitted/pressed
    to send PUT and DELETE request respectively!!!!!!!
*/
app.use((req,res,next)=>{

    if(req.query.method=="PUT")
    {
        req.method="PUT"
    }
    else if(req.query.method=="DELETE")
    {
        req.method="DELETE"
    }
    next();
})

//attach fileupload middleware to express
app.use(fileUpload());

//load controllers
const userController = require("./controllers/user");
const generalController = require("./controllers/general");
const productsController = require("./controllers/products");

//map controllers to the app
app.use("/", generalController);
app.use("/user", userController);
app.use("/products", productsController);

mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connected to MongoDB database`);
})
.catch(err=>console.log(`Error occurred when conecting to database ${err}`));

const PORT = process.env.PORT;
app.listen(PORT, ()=>
{
    console.log("WEB SERVER IS UP AND RUNNING");
})
