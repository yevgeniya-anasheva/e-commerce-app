const express = require('express')
const router = express.Router();

const userModel = require("../models/user");
const cartModel = require("../models/cart");
const bcrypt = require("bcryptjs");
const isLoggedIn = require("../middleware/authentication");
const loadDashboard = require("../middleware/authorization");

router.use(express.static("public"));

require('dotenv').config({path: "../config/keys.env"});

router.get("/registration", (req,res)=>{
    res.render("user/registration", {
        title: "Registration Page"
    });
});

router.post("/registration",(req,res)=>{

    const errorMessages = [] ;
    let patternPassword = /^.*(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/g;
    let patternName = /\w\D{2,20}/;

    const {name, email, password, password2} = req.body;

    if(name=="")
    {
        errorMessages[0] = "You must enter first name";
    }
    else if(!patternName.test(name))   //testing if name is between 2 to 20 chars and has only letters
    {
        errorMessages[0] = "Your name must contain only letters";
    }
    if(email=="")
    {
        errorMessages[1] = "You must enter email";
    }
    if(password=="")
    {
        errorMessages[2] = "You must enter password";
    }
    else if(password.length < 6 || password.length > 15) 
    {
        errorMessages[2] = "Your password must have 6 to 15 characters"
    }
    else if(!patternPassword.test(password)) //testing regex if the password has the right chars
    {
        errorMessages[2] = "Your password must have at least one lowercase char, one uppercase char and one digit";
    }
    if(password.localeCompare(password2))
    {
        errorMessages[3] = "Your passwords don't match";
    }

    //displaying errors
    if(errorMessages.length > 0)
    {
        let form = {
            nameholder: req.body.name,
            emailholder: req.body.email
        };
        res.render("user/registration",{
            title : "Registration Page",
            errors : errorMessages,
            form: form
        });
    }

    //successful submission
    else
    {
        const {name, email} = req.body;

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
        to: `${email}`,
        from: `test@example.com`,
        subject: 'Successful registration',
        text: 'Congratulations! Registration for Jen\'s art Supplies was successful',
        html: `<strong>Jen's Art Supplies</strong> 
               <br> Hello ${name}! Thank you for your interest in Jen's Art Supplies! Your registration was successful`,
        };

        const newUser = 
        {
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        };
        //create an instance of type userModel
        var user = new userModel(newUser);
        //add to the database
        user.save()
        .then(()=>{
            sgMail.send(msg)
            .then(()=>
            {
                res.redirect("/dashboard");
            })
            .catch(err=>{
                console.log(`Error while sending an email ${err}`);
            })
        })
        .catch((err)=>{
            console.log(`Error happened when inserting in the database: ${err}`);
            const errorMessages = [];
                errorMessages[1] = "The email you entered is already in use";
                let form = {
                    nameholder: req.body.name,
                    emailholder: req.body.email
                };

                res.render("user/registration",{
                    title : "Registration Page",
                    errors : errorMessages,
                    form: form
                });
        });
    }
});

//Route to direct user to the login form
router.get("/login", (req,res)=>{
    res.render("user/login", {
    title: "Login Page"
    });
});

//Route to process user's request and data when user submits login form
router.post("/login", (req,res)=> {
    const errorMessages = [] ;
    const {password,email} = req.body;

    if(email=="")
        errorMessages[0] = "You must enter email";
    if(password=="")
        errorMessages[1] = "You must enter password";
    
    if(errorMessages.length > 0)
    {
        let form = { emailholder: req.body.email };
        res.render("user/login",{
            title : "Login Page",
            errors : errorMessages,
            form: form
        });
    }
    else
    {
        userModel.findOne({email:req.body.email})
        .then(user=>{

            const errorsLogin= [];

            //email is not found
            if(user==null)
            {
                errorsLogin.push("Sorry, your email and/or password is incorrect");
                res.render("user/login",{
                    errorsLogin
                })
            }

            //email is found
            else
            {
                bcrypt.compare(req.body.password, user.password)
                .then(isMatched=>{
                    
                    if(isMatched)
                    {
                        //create our session
                        req.session.userInfo = user;
                        res.redirect("userdashboard");
                    }

                    else
                    {
                        errorsLogin.push("Sorry, your email and/or password is incorrect ");
                        res.render("user/login",{
                            errorsLogin
                        })
                    }

                })
                .catch(err=>console.log(`Error ${err}`));
            }
        })
        .catch(err=>console.log(`Error while logging in: ${err}`));
    }
});

router.get("/userdashboard",isLoggedIn,loadDashboard,(req,res)=>{

    res.render("user/userDashboard",{
        cart
    });
})

router.get("/adminDashboard",isLoggedIn,(req,res)=>{
    res.render("user/adminDashboard");
});

router.get("/logout",(req,res)=>{
    req.session.destroy(); 
    res.redirect("login");
});

router.get("/cart/:id", isLoggedIn, (req,res)=>{
    cartModel.findOne({userId: req.params.id})
    .then((cart)=>{
        let totals = 0;
        cart.products.forEach((product)=>totals += product.price * product.quantity);
        const {products} = cart;

        let userId = req.session.userInfo._id;
        res.render("user/cart",{
            userId,
            products,
            totals
        });
    })
    .catch((err)=>{
        console.log(`User controller: Error happened when pulling cart from database: ${err}`);
    });
    
});

router.get("/checkout/:id", isLoggedIn, (req,res)=> {

    cartModel.findOne({ userId: req.params.id })
    .then((cart)=>{
        const {name, email} = req.session.userInfo;
        const {products} = cart;

        let productData = "";
        products.forEach((product)=>{
            product.price = product.price * product.quantity;
            productData += `${product.name}, Quantity: ${product.quantity}, Price Total: ${product.price}`;
        });

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
        to: `${email}`,
        from: `test@example.com`,
        subject: 'Order confirmation',
        text: 'Congratulations! Your order is confirmed',
        html: `<strong>Jen's Art Supplies</strong> 
               <br> Hello ${name}! Thank you for your order of: <br>
               ${productData}`,
        };
        sgMail.send(msg)
        .then(()=>
        {
            cartModel.deleteOne({userId:req.params.id})
            .then(()=>{
                res.redirect("/user/confirmation");
            })
            .catch(err=>console.log(`Error happened when deleting cart :${err}`));
            
        })
        .catch(err=>{
            console.log(`Error when sending an email during checkout: ${err}`);
        })
    })
    .catch(err=>console.log(`Error when checking out: ${err}`));
});

router.get("/confirmation", isLoggedIn, (req,res)=> {
    res.render("user/confirmation");
});

module.exports=router;