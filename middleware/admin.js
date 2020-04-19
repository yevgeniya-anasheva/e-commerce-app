const isAdmin = (req,res,next)=>{

    if(req.session.userInfo.type == "admin")
    {
        next(); //going to the next middleware function
    }
    else
    {
        res.redirect("/");
    }

}

module.exports = isAdmin;