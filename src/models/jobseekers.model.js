import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";


const JobSeekersSchema= new Schema(
{
     resume:{
        type: String,
        required: true,
        
     },
     skills:[
        {
           type: String,
        }
    ],
    workexperience:{
        type: Number,
      //  Prev_Company: [String,'NA'],
        
    },
    Userid:
    {
        type:Schema.Types.ObjectId,
        ref:"User"

    },
    education:
    {
        type:String,
    },
    // refreshToken:
    // {
    // type: String,
    // },

}
,
{
    timestamps: true
}
);

// UserSchema.pre("save",async function (next) {
//     if(!this.isModified("password")) return next();
//     this.password= await bcrypt.hash(this.password,10);
//     next();
//})
JobSeekersSchema.plugin(mongooseAggregatePaginate);  // this allow to write aggreagation queiry on given collection schema


// custom methods

// UserSchema.methods.isPasswordCorrect= async function(password){
//   return await  bcrypt.compare(password,this.password);
// }
// JobSeekersSchema.methods.generateAccessToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
//             email: this.email,
//             username: this.username,
//             fullName: this.fullName
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }
// JobSeekersSchema.methods.generateRefreshToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
            
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }
export const JobSeeker= mongoose.model("JobSeeker",JobSeekersSchema);