const cloudinary= require("../config/cloudinary");
const streamifier= require("streamifier");

function uploadToCloudinary(buffer){
    return new Promise((resolve,reject)=>{
        const stream= cloudinary.uploader.upload_stream(
            {resource_type: "raw"},
            (error, result)=>{
                if(result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
}

module.exports= {uploadToCloudinary,};