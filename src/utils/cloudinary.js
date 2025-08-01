import { v2 as cloudinary } from "cloudinary";
import fs from "fs"


 cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });


const uploadResult = async (localFilePath)=>{
    try{
        if(!localFilePath) return null;

        // upload the file

       const response=await cloudinary.uploader.upload(localFilePath,{
             resource_type:"auto"
        })

        // file uploaded
        // console.log("file  is uploaded on cloudinary",response.url);

        fs.unlinkSync(localFilePath)
        return response;

    } catch(error){
        console.log(error);
        fs.unlinkSync(localFilePath) //remove the locally saved temporaey file as the upload opertaion  got fail
        return null;
    }
   
}

export {uploadResult}