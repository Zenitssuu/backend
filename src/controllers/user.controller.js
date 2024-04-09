import { asyncHandler } from "../utils/asyncHandlers.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiresponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.geneteAccessToken();
    const refreshToken = user.geneteRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new apiError(
      500,
      "something went wrong while generating refresh and access tooken"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
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

  const { username, email, fullname, password } = req.body;

  // console.log("email: ",email);
  // if(fullname===""){
  //     throw new apiError(400,"FUllname required");
  // }
  if (
    [fullname, email, password, username].some((feild) => feild?.trim() === "") //if any/all input section is empty, data collection from frontend
  ) {
    throw new apiError(400, "all feild are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new apiError(409, "user already exists");
  }
  console.log(req.files);
  const avatarLoacalPath = req.files?.avatar[0].path;
  console.log(avatarLoacalPath);
  // const coverageImagePath = req.files?.coverImage[0].path; //error if coverImage is not given

  // console.log(1);

  const avatar = await uploadOnCloudinary(avatarLoacalPath);

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverageImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const newUser = await User.findById(user._id).select(
    //removing password and refresh token
    "-password -refreshToken"
  );

  if (!newUser) {
    throw new apiError(505, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, newUser, "User registered suucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body > data
  // username or email
  // find the user
  //password check
  //access and refresh token
  // send cookie

  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new apiError(400, "username or email required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new apiError(404, "user doesn't exist");
  }

  const isPassowrdValid = await user.isPasswordCorrect(password);

  if (!isPassowrdValid) {
    throw new apiError(404, "invalid user credentials");
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly:true, //made cookie modeifiable thrgh server only not frontend
    secure:true
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new apiResponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "user logged In Successfully"
    ) 
  )
});


const logOutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: 
        {
          refreshToken:undefined
        }
      },{
        new:true
      }
      
    )
    const options = {
      httpOnly:true, //made cookie modeifiable thrgh server only not frontend
      secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"user is logged Out"));
})


export { registerUser, loginUser, logOutUser };
