const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    category:
    {
        type: String,
        required: true
    },
    quantity:
    {
        type: Number,
        required: true
    },
    bestseller:
    {
        type: String,
        default: 'true'
    },
    productImg: 
    {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

//for every schema created (per collection), model must be created.
//the model allows CRUD operations
const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;
