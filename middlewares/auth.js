
//to check whether user has session on his browser or not if yes! then let him access the protected route i.e. /chat
function isloggedIn(req,res,next){
    if(req.session.user){
     next();
    }
    else{res.redirect('/login')}
 }
 module.exports.isloggedIn=isloggedIn;