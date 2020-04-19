const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        unique: true,
        required: true
    }, 
    password: {
        type: String,
        required: true
    },
    type:
    {
        type:String,
        default:"user"
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

//encrypt the password before it is saved
userSchema.pre("save",function(next)
{

    //creates a string of random letters
    bcrypt.genSalt(12)
    .then((salt)=>{
        //hashing the salt
        bcrypt.hash(this.password,salt)
        .then((encryptPassword)=>{
            this.password = encryptPassword;
            next();
        })
        .catch(err=>console.log(`Error occured when hashing ${err}`));
    })
    .catch(err=>console.log(`Error occured when salting ${err}`));
})

//for every schema created (per collection), model must be created.
//the model allows CRUD operations
const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
