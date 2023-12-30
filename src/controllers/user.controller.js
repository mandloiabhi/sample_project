import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse}  from "../utils/ApiResponse.js";
const registerUser= asyncHandler( async (req,res) => {
    
    // res.status(200).json({message:"Ok"})
    // console.log("request comes");

    const {username,email,role,password}=req.body;
    console.log(req.body);
    // from reqest body we are taking this thing it  // take care that name should be same as key value of in json object of request
    
    if([username,email,role,password].some((field)=>field?.trim()===""))
    {
        throw new ApiError(400,"all fields are required");
    }
    // const ExistedUser= await User.find({username});
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    
    if(existedUser)
    {
        throw new ApiError(409,"user is already existed");
    }
    // creat new resource as user in
    console.log(email);
    const user= await User.create({
        username : username,
        email,
        role,
        password,
    });
    console.log("abhijeeet");
    const createdUser= await User.findById(user._id).select("-password -refreshToken");  // it check wether the user is created or not in database by using the findById to check wether the user is present or not
    // above select will not allowed password and refreshToken to be stored in createdUser 
    if(!createdUser)
    {
        throw new ApiError(500,"something went wrong in creating user");
    }

     return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
     );
});

export {registerUser};