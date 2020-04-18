const express = require('express')
const router = express.Router();

const productModel = require("../models/product");
const productCategories = require("../models/categories");

router.get("/", (req,res)=>{

    productModel.find({bestseller: 'true'})
    .then((bestsellers)=>{
        const filteredProducts = bestsellers.map(product=>{
            return {
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                quantity: product.quantity,
                productImg: product.productImg
            }
        });

        res.render("home", {
            title: "Home Page",
            categories: productCategories.getAll(),
            data: filteredProducts
        });
    });
    
});

router.get("/dashboard", (req,res)=>{
    res.render("dashboard", {
        title : "Dashboard",
        successMessage :`Thank you. We received your information and will send a confirmation email`
    })
});

module.exports=router;