import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse}  from "../utils/ApiResponse.js";
import {JobSeeker} from "../models/jobseekers.model.js"
import { JobPoster } from "../models/jobposter.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application_collection.model.js";


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
    console.log(req.body)
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
    console.log("logout success")
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

const createJob=asyncHandler(async(req,res)=>
{
    // get the user object who is creating the jobs
    // check wether user is jobposter or not
    // get the jobposterid from the jobposter schema with help of user id which is foreign key in jobposter schema
    // similary get company name from it
    // be careful of about start date and end date
    // then create the entry of the job in job database
     
    const {startDatetoapply,title,lastDatetoapply,skillsRequired} = req.body

    console.log(req.body)
    const user= await User.findById(req.user._id);
    if(!user)
    {
        throw new ApiError(400, "job poster is not registered as user ")
    }
    
    if(user.role!=="jobposter")
    {
        throw new ApiError(400,"you are not registered as job poster")
    }
    const Userid=user._id;
    const jobposter=await JobPoster.findOne({Userid})
    if(!jobposter)
    {
        throw new ApiError(400,"user does not exits in jobposter database")
    }
    const jobposter_id=jobposter._id;

    const company_name=jobposter.CompanyName;

    const jobposter_user = await Job.create({
   
       
        JobPosterid:jobposter_id ,
        title:title,
        company:company_name,
        startDatetoapply:startDatetoapply,
        lastDatetoapply:lastDatetoapply,
        skillsRequired:skillsRequired

        })
    
    if(!jobposter_user)
    {
        throw new ApiError(400,"Something went wrong while entrying in job in database")
    }
    
    return res.status(201).json(
        new ApiResponse(200, "this is data of entry of job", "job created successfully")
    )


})

const availableJobs=asyncHandler(async(req,res)=>
{
    // get the user id 
    // then get array of skill from user
    // write a query to get all job id's where  skill required is subset of user id jobs
    // return the array of job id's   // in later part we can pass the object json some attributes
    
    const user= await User.findById(req.user._id);
    if(!user)
    {
        throw new ApiError(400, "job poster is not registered as user ")
    }
    
    if(user.role!=="jobseeker")
    {
        throw new ApiError(400,"you are not registered as job poster")
    }
    
    const Userid=user._id;
    const jobseeker=await JobSeeker.findOne({Userid})
    if(!jobseeker)
    {
        throw new ApiError(400,"user does not exits in jobposter database")
    }
   
    const skillsofuser=jobseeker.skills;

 
    //console.log(skillsofuser);
    const JobSeekerid=jobseeker._id;
    const applied_job_applications=await Application.find({JobSeekerid:JobSeekerid});
    const array_job=[];
    //console.log(typeof applied_job_applications)
    applied_job_applications.forEach(element => {

        array_job.push(element.Jobid)
    });
    console.log(array_job)
   const result= await Job.find({
        skillsRequired: {
          $all: skillsofuser 
        },
        _id: { $nin: array_job }
      });
    const list_array=[]
   // console.log(typeof result)
    result.forEach(element => {

        const lastDatetoapply=element.lastDatetoapply;
        const company=element.company;
        const title=element.title;
        const id_string=String(element._id);
        const ret={
            "ending_date":lastDatetoapply,
            "company":company,
            "title":title,
            "job_id":id_string
        }
        list_array.push(ret)
    }); 
   

    return res.status(201).json(
        new ApiResponse(200, list_array, "job created successfully")
    )


})
const applytoJob=asyncHandler(async(req,res)=>{

    // get the user object
    // get the job id also
    // check if user is already applied or not
    // create entry for application collection
    const { jobid} = req.body
    console.log(jobid)
    const user= await User.findById(req.user._id);
    if(!user)
    {
        throw new ApiError(400, "user is primarily not registered")
    }
    const Userid=user._id;
    console.log(Userid)
    const jobseeker= await JobSeeker.findOne({Userid});
    //console.log(jobseeker)
    if(!jobseeker)
    {
        throw new ApiError(400,"user is not registered as jobseeker")
    }

    const jobseekerId=jobseeker._id;

   const result= await Application.find({
        "Jobid": jobid,
        "JobSeekerid": jobseekerId
      })
    const len=result.length;
    console.log(len)
    if(len)
    {
        throw new ApiError(400,"you have already applied for this job");
    }  


    const Application_instance = await Application.create({
   
        Jobid:jobid,
        JobSeekerid:jobseekerId,
        status:"applied",
        
        })

    if(!Application_instance)
    {
        throw new ApiError(400,"application instance is not created due to some problem")
    }    

    return res.status(201).json(
        new ApiResponse(200, "applied_successfully", "applied successfully")
    )



})
const appliedJobStatus=asyncHandler(async(req,res)=>
{
    const user= await User.findById(req.user._id);
    if(!user)
    {
        throw new ApiError(400, "user is primarily not registered")
    }
    const Userid=user._id;

    const jobseeker= await JobSeeker.findOne({Userid});
    //console.log(jobseeker)
    if(!jobseeker)
    {
        throw new ApiError(400,"user is not registered as jobseeker")
    }

   const jobseekerId=jobseeker._id;
   console.log(jobseekerId)
   const result= await Application.find({
        "JobSeekerid": jobseekerId
      },
      {
        "_id": 0,  // Exclude the _id field if you don't want it
        "Jobid": 1,
        "status": 1
        // Add more fields you want to include with 1 or exclude with 0
      })
    const list_array=[]
    console.log(result)
    
    async function yourAsyncFunction() {
        // Assuming result is an array
        await Promise.all(result.map(async (element) => {
            const temp_obj = await Job.findById(element.Jobid);
            console.log(temp_obj);
            const company = temp_obj.company;
            const title = temp_obj.title;
            const id_string = String(element.Jobid);
            const ret = {
                "status": element.status,
                "company": company,
                "title": title,
                "job_id": id_string
            };
            list_array.push(ret);
        }));
    }
    
    // Call the async function
   await yourAsyncFunction();
    //console.log(list_array)
    return res.status(201).json(
        new ApiResponse(200, list_array, 'job ids that user applied and their status')
    )

})
const removeJobByJobProvider=asyncHandler(async(req,res)=>{
    const { jobid} = req.body;
    const user= await User.findById(req.user._id);
    if(!user)
    {
        throw new ApiError(400, "user is primarily not registered")
    }
    const Userid=user._id;

    const jobposter= await JobPoster.findOne({Userid});
    //console.log(jobseeker)
    if(!jobposter)
    {
        throw new ApiError(400,"user is not registered as jobposter")
    }

   const jobposterrId=jobposter._id;

  Application.updateMany(
    {
      "status": "applied",
      "Jobid":jobid
      // Add more conditions as needed
    },
    {
      $set: {
        "status": "rejected"
        // Add more fields to update as needed
      }
    }
  )

  return res.status(201).json(
    new ApiResponse(200, "removed jobs", 'job is removed and application db is updated')
)


})
export {registerUser,loginUser,logoutUser,registerJobSeeker,registerJobPoster,createJob,availableJobs,applytoJob,appliedJobStatus,removeJobByJobProvider};