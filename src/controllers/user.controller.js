import { asyncHandeler } from "../utils/asynchandeler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.models.js";
import { uploadResult } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiresponse.js";


const generateAccessAndRefreshToken = async (userId)=>{
    try{
        const user = await User.findById(userId)
      const accessToken  =  user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken =refreshToken
      await  user.save({validateBeforeSave: false})

      return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token  ")
    }

}

const registerUser = asyncHandeler(async (req, res) => {
  // register user
  // validation
  // checck is user already exists: username /email
  // avatar  //check images
  // upload to cloudinary,avatar
  // create user object--create entry in db
  // remove pass and refresh token field from respnase
  // check for user creation
  // return res

  const { fullname, email, username, password } = req.body;
  console.log("email:", email);
  // we can handel use multiple (if )condition
  // if(fullname===""){
  //     throw new ApiError(400,"Fullname is required");
  // }
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Fullname is required");
  }
  console.log(email, fullname, username);
  // find the user in db
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(409, "Existed User Already");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  //    const coverLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  console.log(avatarLocalPath, coverImageLocalPath); // path

  if (!avatarLocalPath) {
    throw new ApiError(400, "path not found");
  }

  const avatar = await uploadResult(avatarLocalPath);
  const coverImage = await uploadResult(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // use to remove some content
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandeler(async (req, res) => {
  // req body ->> data
  // username/email
  // find the user
  // password check
  // access and referesh token
  // send cookie

  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect");
  }
  const {accessToken,refreshToken}= await 
  generateAccessAndRefreshToken(user._id)

  const loggedInUser =await  User.findById(user._id).select("-password -refreshToken")
  const options ={
    httpOnly:true,
    secure:true
  }
  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
        200,{
            user:loggedInUser,accessToken,refreshToken
        },"User logged in Successfully"
    )
  )

})
const logoutUser =asyncHandeler(async(req,res)=>{
   await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken: undefined
        }
    },
        {
            new: true
        }
    )
    const options ={
        httpOnly:true,
        secure :true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{}," User Logout "))
})



export { registerUser, loginUser,logoutUser };
