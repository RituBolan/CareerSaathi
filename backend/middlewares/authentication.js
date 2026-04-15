const {validateToken}= require("../services/auth");

function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const token= req.cookies[cookieName];
        if(!token){
            return next();
        }
        try{
            req.user= validateToken(token);
        }catch{
            return next();
        }
        next();
    };
}

module.exports= {checkForAuthenticationCookie,};