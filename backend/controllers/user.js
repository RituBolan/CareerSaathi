const { createTokenForUser,} = require("../services/auth");
const { createUser, loginUser } = require("../services/user");

async function handleUserSignUp(req,res){
    try{
    const user= await createUser(req.body);
    const token= createTokenForUser(user);
    res.cookie("token",token,{httpOnly: true , sameSite: "lax"});
    res.status(201).json({
        token,user
    });
}catch(error){
        res.status(400).json({ message: error.message || "Signup failed" });
    }
}

async function handleUserSignIn(req,res){
    const result=await loginUser(req.body);
    if(!result.success){
        return res.status(401).json({ message: result.message });
    }

    res.cookie("token",result.token, {httpOnly : true, sameSite: "lax"});
    res.json({
        token: result.token,
        user: result.user,
    });
}


async function handleUserLogout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
}

module.exports= {
    handleUserSignIn,
    handleUserSignUp,
    handleUserLogout,
};
