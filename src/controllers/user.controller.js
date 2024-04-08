import {asyncHandler} from "../utils/asyncHandlers.js";
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiresponse.js";

const registerUser = asyncHandler(async (req,res) => {
    // res.status(200).json({
    //     message:"sid is here with backend"
    // })
    
    //get user details from frontend
    //validation -not empty
    //check if user already exits : usrname and/or email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    // creater user object - create entry in db
    // remove password and refresh token feild from response
    // check for user creation
    // return response

    console.log(req.files);
    
    const {username,email,fullname,password} = req.body;
    
    // console.log("email: ",email);
    // if(fullname===""){
    //     throw new apiError(400,"FUllname required");
    // }
    if(
        [fullname,email,password,username].some((feild)=>feild?.trim()==="") //if any/all input section is empty, data collection from frontend
    ){
        throw new apiError (400,"all feild are required");
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new apiError(409,"user already exists")
    }
    // console.log(req.files);
    const avatarLoacalPath = req.files?.avatar[0].path;
    const coverageImagePath = req.files?.coverImage[0].path;
    
    // console.log(1);
    
    const avatar = await uploadOnCloudinary(avatarLoacalPath);

    if(coverageImagePath!==""){
        const coverageImage = await uploadOnCloudinary(coverageImagePath);
    }

    if(!avatar){
        throw new apiError(400,"avatar file is required");
    }
   

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverageImage:coverageImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const newUser = await User.findById(user._id).select(
        //removing password and refresh token
        "-password -refreshToken"
    );

    if(!newUser){
        throw new apiError(505,"something went wrong while registering the user");
    }

    return res.status(201).json(
        new apiResponse(200,newUser,"User registered suucessfully")
    )

})

export {registerUser}