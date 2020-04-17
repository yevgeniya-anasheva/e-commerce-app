const express = require('express')
const router = express.Router();

router.use(express.static("public"));

const productGrid = require("../models/products");
const productBestsellers = require("../models/bestsellers");
const isLoggedIn = require("../middleware/authentication");
const isAdmin = require("../middleware/admin");

router.get("/all", (req,res)=>{
    res.render("products", {
        title: "Products",
        product: productGrid.getAll()
    });
});

router.get("/add",isLoggedIn, isAdmin, (req,res)=>{
    res.render("product/addProduct", {
        title: "Add Product"
    });
});

router.post("/add", isLoggedIn, isAdmin, (req,res)=>{

});

module.exports=router;