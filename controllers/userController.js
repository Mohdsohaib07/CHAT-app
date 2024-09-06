const {User} = require('../model/user');
const bcrypt = require('bcrypt');

module.exports.signup = function(req,res){
    res.render("signup");
}

module.exports.login= function(req,res){
    res.render("login");
}

module.exports.chat= function(req,res){
    res.render("chat",{username:req.session.user });
}

module.exports.logout = function(req,res){
    const  user = req.session.user;
    console.log(user + ' logged Out ,session destroyed');
    res.clearCookie('connect.sid',{path:'/'});
    req.session.destroy();
    res.redirect('/login');
}
module.exports.forgot = (req,res)=>{
    res.render('forgotpass');
}

module.exports.signUpData = async function(req,res){
    if(!req.body){
        return res.status(403).send('please enter details');
    }
   if(!isValidMail(req.body.email)){return res.status(400).send('<h1>Invalid Email,Go Back use valid mail</h1>');}
    if(req.body.password.length<6){
        return res.send(`<h1>password must be at least 6 characters long
                             go back and try again !</h1>`);
    }
    
    const matchMail = await User.findOne({email:req.body.email});
    if(matchMail){console.log('user already exists in our DB !'); return res.redirect('/login');}
  
 
   const hashedPassword = await bcrypt.hash(req.body.password,10);
   const user = new User({fullName:req.body.fullName,
                          email:req.body.email,
                          password:hashedPassword
                         });
        await user.save();
        if(req.session.views){
            req.session.views++;
            console.log('session already exists and updated succesfully')
        }
        else{
            req.session.views=1;
            console.log('first visit,new session created');
            
        }
        req.session.user=req.body.fullName;
        console.log(`the user is in session : ${req.session.user}`);
    res.redirect('/chat');
 
 }

 module.exports.loginData = async function(req,res){
    try{
        if(!isValidMail(req.body.email)){return res.status(400).send('Invalid Email use valid email only');}
        const user = await User.findOne({email:req.body.email});
        if(!user){console.log('no such user exists in DB');  return  res.redirect('/');}
        if(await bcrypt.compare(req.body.password,user.password)){
            console.log(' password match');
            if(req.session.views){
                req.session.views++;
                console.log('session already exists and updated succesfully');
            }
            else{
                req.session.views=1;
                console.log('first visit,new session created');
                
            }
           req.session.user=user.fullName;
           console.log(`the user is in session : ${req.session.user}`);
           
            res.redirect('/chat');
        } 
        else{
            console.log("password dont match");
            res.json({error: "invalid password !"});
        }
    }
    catch(err){
        console.log(err);
    }
}

module.exports.forgotData = async function(req,res){
    console.log(req.body);
    if(!isValidMail(req.body.email)){return res.status(400).json({result:'Invalid Email'})}
    let user = await User.findOne({email:req.body.email});
    if(user){
       return res.status(200).json({result:'We have sent you a mail'});
    }
    else{
        return res.status(400).json({result:'Not a Registered User '});
    }
}

//email validation 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidMail(email){
    return emailRegex.test(email);
}
