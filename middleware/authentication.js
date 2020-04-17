const isLoggedIn = (req,res,next)=>{

    if(req.session.userInfo)
    {
        next(); //going to the next middleware function
    }
    
    else
    {
        res.redirect("/user/login")
    }

}

module.exports = isLoggedIn;