const express = require('express')
const router = express.Router();

router.use(express.static("public"));

const path = require("path");
const isLoggedIn = require("../middleware/authentication");
const isAdmin = require("../middleware/admin");
const session = require('express-session');
const productModel = require("../models/product");
const userModel = require("../models/user");
const cartModel = require("../models/cart");

router.get("/all", (req,res)=>{

    productModel.find()
    .then((allproducts)=>{
        const filteredProducts = allproducts.map(product=>{
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

        res.render("product/products", {
            title: "Products",
            data: filteredProducts
        });
    })
    .catch((err)=>{
        console.log(`Error happened when pulling from the database: ${err}`);
    });
});

//adming product page for managing products (updating and deleting)
router.get("/alladmin", (req,res)=>{
    productModel.find()
    .then((allproducts)=>{
        const filteredProducts = allproducts.map(product=>{
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

        res.render("product/productsAdmin", {
            title: "Products",
            data: filteredProducts
        });
    })
    .catch((err)=>{
        console.log(`Error happened when pulling from the database: ${err}`);
    });
});

router.get("/edit/:id",(req,res)=>{

    productModel.findById(req.params.id)
    .then((product)=>{

        const {_id,name,price,description,category,quantity,bestseller,productImg} = product;
        res.render("product/editProduct",{
            _id,
            name,
            price,
            description,
            category,
            quantity,
            bestseller,
            productImg  
        });
    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
})

router.put("/update/:id",(req,res)=>{

    const product =
    {
        name:  req.body.name,
        price: req.body.price,
        description:    req.body.description,
        category:    req.body.category,
        quantity: req.body.quantity,
        bestseller:   req.body.bestseller,
        productImg: req.files.productImg.name
    }

    productModel.updateOne({_id:req.params.id},product)
    .then(()=>{
        res.redirect("/products/alladmin");
    })
    .catch(err=>console.log(`Error happened when updating data in the database :${err}`));
});

router.delete("/delete/:id",(req,res)=>{
    
    productModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/products/alladmin");
    })
    .catch(err=>console.log(`Error happened when deleting products from the database :${err}`));

});

router.get("/add",isLoggedIn, isAdmin, (req,res)=>{
    res.render("product/addProduct", {
        title: "Add Product"
    });
});

router.post("/add", isLoggedIn, isAdmin, (req,res)=>{
    const errorMessages = [];
    const {name, price, description, category, quantity} = req.body;
    if(name=="") 
        errorMessages[0] = "You must enter product name";
    if(price=="")
        errorMessages[1] = "You must enter price";    
    if(description=="")
        errorMessages[2] = "You must enter description";
    if(category=="")
        errorMessages[3] = "You must enter category";
    if(quantity=="")
        erroMessages[4] = "You must enter quantity";

    if(errorMessages.length > 0)
    {
        let form = {
            nameholder: req.body.name,
            priceholder: req.body.price,
            descholder: req.body.description,
            catholder: req.body.category,
            quantityholder: req.body.quantity
        };
        res.render("product/addProduct",{
            title : "Add product",
            errors : errorMessages,
            form: form
        });
    }
    else
    {
        const newProduct = 
        {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            quantity: req.body.quantity,
            bestseller: req.body.bestseller
        }
        var product = new productModel(newProduct);

        product.save()
        .then((product)=>{

            console.log(`Extension = ${req.files.productImg.mimetype}`);

            if(req.files.productImg.mimetype == "image/jpeg" || req.files.productImg.mimetype == "image/png" ||
                req.files.productImg.mimetype == "image/gif" || path.parse(req.files.productImg.name).ext == "image/jpg")
            {
                req.files.productImg.name = `img${product._id}${path.parse(req.files.productImg.name).ext}`;
                req.files.productImg.mv(`public/img/${req.files.productImg.name}`)
                .then(()=>{
                    productModel.updateOne({_id: product._id},{
                        productImg: req.files.productImg.name
                    })
                    .then(()=>{
                        res.redirect("/products/alladmin");
                    })
                    .catch((err)=>{
                        console.log(`Error happened when inserting the picture: ${err}`);
                    }); 
                })
                .catch((err)=>{
                    console.log(`Error happened when uploading the picture: ${err}`);
                })
            }
            else {
                console.log(`Error: file uploaded is not an image`);
            }
            
        })
        .catch((err)=>{
            console.log(`Error happened when inserting in the database: ${err}`);
        });

    }

});

router.get("/description/:id", (req,res)=>{
    productModel.findById(req.params.id)
    .then((product)=>{

        const {_id,name,price,description,category,quantity,bestseller,productImg} = product;
        res.render("product/productDescription",{
            _id,
            name,
            price,
            description,
            category,
            quantity,
            bestseller,
            productImg  
        });
    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
});

router.post("/addToCart", isLoggedIn, (req,res)=>{

    //note: _id is a product id
    const { name, quantity, price, _id } = req.body;
    let userId = req.session.userInfo._id;

    cartModel.findById(userId)
    .then(cart=>{
        //cart was already created for this user
        if(cart) {
            let index = cart.products.findIndex(p => p._id == _id); 
            //product already exists, updating the quantity   
            if(index > -1) {
                let product = cart.products[index];
                product.quantity = quantity;
                cart.products[index] = product;
            } else {
                //push a new item if the same product doesn't exist
                cart.products.push({ _id, quantity, name, price });
            }
            var totals = products[index].quantity * products[index].price;
            cart.save()
            .then(()=>{
                res.render("user/cart",{
                    userId,
                    products: [{ _id, quantity, name, price }],
                    totals
                });
            })
            .catch(err=>{
                err=>console.log(`Error happened when updating cart: ${err}`);
            });
        } else {
            const newCart = 
            {
                userId,
                products: [{ _id, quantity, name, price }]
            };
            //create an instance of type cartModel
            var cart2 = new cartModel(newCart);
            var totals = newCart.products[0].quantity * newCart.products[0].price;

            cart2.save()
            .then(()=>{
                res.render("user/cart",{
                    userId,
                    products: [{ _id, quantity, name, price }],
                    totals
                });
            })
            .catch(err=>console.log(`Error happened when creating new cart: ${err}`));
        }
    })
    .catch(err=>{
        console.log(`Error retrieving cart data ${err}`);
    });
    
});
module.exports=router;