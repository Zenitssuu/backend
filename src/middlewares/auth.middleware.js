//check user exists or not

import { User } from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import jwt from "jsonwebtoken"



export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        console.log(1);
        
        const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        
        console.log(token);
        if (!token) {
            throw new apiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new apiError(401, "Invalid Access Token")
        }
    
        req.user = user; //here req will store the current user, which will help us to access user later on
        next()
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }
    
})