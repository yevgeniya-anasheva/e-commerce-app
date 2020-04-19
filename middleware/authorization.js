const loadDashboard = (req,res)=>{

    if(req.session.userInfo.type=="admin")
    {
        res.render("user/adminDashboard");
    }
    else
    {
        res.render("user/userDashboard");
    }
}
module.exports = loadDashboard;