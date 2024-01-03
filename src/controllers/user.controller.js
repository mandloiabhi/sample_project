import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse}  from "../utils/ApiResponse.js";
const generateAccessTokenandRefreshToken= async (Userid) =>
{

  try 
  {
    const user= await User.findById(Userid);
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave: false});  // saving refresh token in database
    return {accessToken,refreshToken};


  } catch (error) 
  {
    throw new ApiError(500,"SOME thing wrong in while geneating refresh and access token");
  }
}



const registerUser = asyncHandler( async (Userid) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const { username,email, role,password } = req.body
    //console.log("email: ", email);
    console.log(req.body)
    if (
        [username,email, role,password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }
    

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is required")
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar file is required")
    // }
   

    const user = await User.create({
        role,
        email, 
        password,
        username: username
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser= asyncHandler(async (req,res)=>{
    // get data from request
    const {username,password}=req.body;
    if(!username)
    {
        throw new ApiError("400","user name is required to log in");
    }

    const  user= await User.findOne({username});
    if(!user)
    {
        throw new ApiError("400","User does not exit")
    }
   const ispasswordcorrect= await user.isPasswordCorrect(password);

   if(!ispasswordcorrect)
   {
    throw new ApiError("400","password is wrong")
   }

   const {accessToken,refreshToken}= await generateAccessTokenandRefreshToken(user._id);

   const loggedInUser= await User.findById(user._id).select("-password -refresToken");  // return user object / doc with not having password and refresTOken field 


   const options={
    httpOnly:true,
    secure:true
   }
   
   return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"user loggen in successfully"));
   
})

export {registerUser,loginUser};