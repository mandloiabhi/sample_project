import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse}  from "../utils/ApiResponse.js";
import {JobSeeker} from "../models/jobseekers.model.js"
import { JobPoster } from "../models/jobposter.model.js";
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
    console.log(error)
    throw new ApiError(500,"SOME thing wrong in while geneating refresh and access token");
  }
}



const registerUser = asyncHandler( async (req,res) => {
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
   console.log("abhijeet singh mandloi");
   const loggedInUser= await User.findById(user._id).select("-password -refresToken");  // return user object / doc with not having password and refresTOken field 


   const options={
    httpOnly:true,
    secure:true
   }
   
   return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"user loggen in successfully"));
   
})

const logoutUser= asyncHandler(async (req,res)=>{

    // remove cookies that were send to user as by loginUser function which can be updated by only server only
    // second thing we have to remove or erase accesstoken and refresh token from server

    const user= await User.findById(req.user._id);
    user.refreshToken=undefined;
    await user.save({validateBeforeSave: false});

    // await User.findByIdAndUpdate(
    //     req.user._id,
    //     {
    //         $set: {
    //             refreshToken: undefined
    //         }
    //     },
    //     {
    //         new: true
    //     }
    // )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})

const registerJobSeeker=asyncHandler(async(req,res)=>{
    // get data from request
    // check condition of all data got or not
    // get user object access
    // check wether logged in or not // but already check in middleware
    // check wether user is already registered or not
    // put entry in jobseeker collection
    // take care of user_id

    const { workexperience,education, resume,skills} = req.body
    //console.log("email: ", email);
    
    console.log(req.body)
    // if (
    //     [workexperience,education, resume].some((field) => field?.trim() === "")
    // ) {
    //     throw new ApiError(400, "All fields are required")
    // }
    const user= await User.findById(req.user._id);
    if(!user)
    {
        throw new ApiError(400, "user is primarily not registered")
    }
    const Userid=user._id;
   const jobseeker= await JobSeeker.findOne({Userid});
   if(jobseeker)
   {
     throw new ApiError(400,"user is already registered as jobseeker")
   }

   const jobseeker_user = await JobSeeker.create({
   
    workexperience :workexperience,
    education: education,
    resume: resume,
    skills: skills,
    Userid: Userid
    })

    const createdUser_asjobseeker = await JobSeeker.findById(jobseeker_user._id)

    if (!createdUser_asjobseeker) {
        throw new ApiError(500, "Something went wrong while registering the user as  jobseeker_user in database")
    }

    return res.status(201).json(
        new ApiResponse(200, "this is data of regeister jobseeker", "User registered Successfully")
    )

})

const registerJobPoster=asyncHandler(async(req,res)=>
{
    const { CompanyName} = req.body
    //console.log("email: ", email);
    
    console.log(req.body)
    // if (
    //     [workexperience,education, resume].some((field) => field?.trim() === "")
    // ) {
    //     throw new ApiError(400, "All fields are required")
    // }
    const user= await User.findById(req.user._id);
    if(!user)
    {
        throw new ApiError(400, "user is primarily not registered")
    }
    const Userid=user._id;
   const jobposter= await JobPoster.findOne({Userid});
   if(jobposter)
   {
     throw new ApiError(400,"user is already registered as jobseeker")
   }

   const jobposter_user = await JobPoster.create({
   
    CompanyName: CompanyName,
    Userid: Userid
    })

    const createdUser_asjobposter = await JobPoster.findById(jobposter_user._id)

    if (!createdUser_asjobposter) {
        throw new ApiError(500, "Something went wrong while registering the user as  jobposter_user in database")
    }

    return res.status(201).json(
        new ApiResponse(200, "this is data of regeister jobposter", "User registered Successfully")
    )
})

export {registerUser,loginUser,logoutUser,registerJobSeeker,registerJobPoster};