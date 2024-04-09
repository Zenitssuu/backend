//check user exists or not

import { User } from "../models/user.models";
import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandlers";
import jwt from "jsonwebtoken"



export const verfiyJWT = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Brearer ","");
    
        if(!token){
            throw new apiError(401,"Unauthorized request");
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )
    
        if(!user){
            throw new apiError(401,"invalid access token")
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401,error?.message || "invalid access token")
    }

});