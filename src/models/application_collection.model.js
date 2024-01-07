import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";


const ApplicationSchema= new Schema(
{
     
    Jobid:
    {
        type:Schema.Types.ObjectId,
        ref:"Job"

    },
    JobSeekerid:
    {
        type:Schema.Types.ObjectId,
        ref:"JobSeeker",

    },
    status:
    {
      type:String,
      required: true,

      
    },
    
    refreshToken:
    {
    type: String,
    },

}
,
{
    timestamps: true
}
);


ApplicationSchema.plugin(mongooseAggregatePaginate);  // this allow to write aggreagation queiry on given collection schema


// custom methods


export const Application= mongoose.model("Application", ApplicationSchema);