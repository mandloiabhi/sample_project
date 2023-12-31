import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse}  from "../utils/ApiResponse.js";
const registerUser = asyncHandler( async (req, res) => {
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
// const registerUser= asyncHandler( async (req,res) => {
    
//     // res.status(200).json({message:"Ok"})
//     // console.log("request comes");

//     const {username,email,role,password}=req.body;
//     console.log(req.body);
//     // from reqest body we are taking this thing it  // take care that name should be same as key value of in json object of request
    
//     if([username,email,role,password].some((field)=>field?.trim()===""))
//     {
//         throw new ApiError(400,"all fields are required");
//     }
//     // const ExistedUser= await User.find({username});
//     const existedUser = await User.findOne({
//         $or: [{ username }, { email }]
//     })
    
//     if(existedUser)
//     {
//         throw new ApiError(409,"user is already existed");
//     }
//     // creat new resource as user in
//     console.log(email);
//     const user= await User.create({
//         username : username,
//         email,
//         role,
//         password,
//     });
//     console.log("abhijeeet");
//     const createdUser= await User.findById(user._id).select("-password -refreshToken");  // it check wether the user is created or not in database by using the findById to check wether the user is present or not
//     // above select will not allowed password and refreshToken to be stored in createdUser 
//     if(!createdUser)
//     {
//         throw new ApiError(500,"something went wrong in creating user");
//     }

//     //  return res.status(201).json(
//     //     new ApiResponse(200,createdUser,"User registered successfully")
//     //  );
// });

export {registerUser};