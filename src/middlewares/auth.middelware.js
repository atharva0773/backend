import { ApiError } from "../utils/apierror.js";
import { asyncHandeler } from "../utils/asynchandeler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandeler(async (req, res, next) => {
 try {
     const token =
       req.cookies?.accessToken ||
       req.header("Authorization")?.replace("Bearer", "");
   
     if (!token) {
       throw new ApiError(401, "Unauthorization request");
     }
     const decodedTToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   
     const user =await User.findById(decodedTToken?._id).select("-password -refreshToken");
   
     if(!user){
       throw new ApiError(401,"Invalid Access Token")
     }
     req.user =user;
     next()
 } catch (error) {
    throw new ApiError(401,error?.message || "invalid access token")
    
 }

});
