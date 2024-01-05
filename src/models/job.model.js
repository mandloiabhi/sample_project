import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";


const JobSchema= new Schema(
{
     
    JobPosterid:
    {
        type:Schema.Types.ObjectId,
        ref:"JobPoster"

    },
    title:
    {
      type:String,
      required: true,
      
    },
    company:
    {
        type:String,
        required:true,
    },
    startDatetoapply:{
       type: Date,
       required:true,
    },
    lastDatetoapply:
    {
        type: Date,
        required:true,
    },
    skillsRequired:[
        {
           type: String,
        }
    ],
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


JobSchema.plugin(mongooseAggregatePaginate);  // this allow to write aggreagation queiry on given collection schema


// custom methods

export const Job= mongoose.model("Job",JobSchema);