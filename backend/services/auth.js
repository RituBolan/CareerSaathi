const jwt= require("jsonwebtoken");
const bcrypt=require("bcrypt");
const secret=process.env.JWT_SECRET;

async function hashPassword(password) {
    return await bcrypt.hash(password,10);
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password,hashedPassword);
}

function createTokenForUser(user){
    const payload={
        _id : user._id,
        email : user.email,

    };

    const token=jwt.sign(payload,secret, {expiresIn: "1d"});
    return token;
};

function validateToken(token){
    const payload=jwt.verify(token,secret);
    return payload;
};

module.exports= {
    hashPassword,
    comparePassword,
    createTokenForUser,
    validateToken,
};