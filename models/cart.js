const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    products: [
        {
            productId: String,
            quantity: Number,
            name: String,
            price: Number
        }
    ], 
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

//for every schema created (per collection), model must be created.
//the model allows CRUD operations
const cartModel = mongoose.model('Cart', cartSchema);
module.exports = cartModel;
