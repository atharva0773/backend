import { asyncHandeler } from "../utils/asynchandeler.js";
 import {ApiError} from "../utils/apierror.js"
import {User} from "../models/user.models.js"
import {uploadResult, upuploadResult} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiresponse.js";
const registerUser = asyncHandeler(async (req,res)=>{
    // register user
    // validation
    // checck is user already exists: username /email
    // avatar  //check images 
    // upload to cloudinary,avatar
    // create user object--create entry in db
    // remove pass and refresh token field from respnase 
    // check for user creation
    // return res 

    const {fullname,email,username,password}=req.body
        console.log("email:",email);
        // if(fullname===""){
        //     throw new ApiError(400,"Fullname is required");
        // }
        if(
            [fullname,email,username,password].some(()=>{
                return feild?.trim()==="";
            })
        ){
            throw new ApiError(400,"Fullname is required");
        }
        // find the user in db
       const existedUser =   User.findOne({
        $or:[{email},{username}]
        })
        if(existedUser){
           throw new ApiError(409,"Existed User Already") 
        }
        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverLocalPath = req.files?.coverImage[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(400,"Avatar is required");
        }
        
        const avatar = await uploadResult(avatarLocalPath)
        const coverImage = await uploadResult(coverLocalPath)

        if(!avatar){
            throw new ApiError(400,"Avatar is required");
        }

       const user = await User.create({
            fullname,
            avatar:avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            username:username.toLower()
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken "
        )
        if(!createdUser){
            throw new ApiError(500,"something went wrong while registering the user")
        }

     return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
     )
})



export  { registerUser }