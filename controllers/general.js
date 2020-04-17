const express = require('express')
const router = express.Router();

const productCategories = require("../models/categories");

router.get("/", (req,res)=>{
    res.render("home", {
        title: "Home Page",
        categories: productCategories.getAll()
    });
});

router.get("/dashboard", (req,res)=>{
    res.render("dashboard", {
        title : "Dashboard",
        successMessage :`Thank you. We received your information and will send a confirmation email`
    })
});

module.exports=router;