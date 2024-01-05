import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";


const JobPosterSchema= new Schema(
{
     
    Userid:
    {
        type:Schema.Types.ObjectId,
        ref:"User"

    },
    CompanyName:
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

// UserSchema.pre("save",async function (next) {
//     if(!this.isModified("password")) return next();
//     this.password= await bcrypt.hash(this.password,10);
//     next();
//})
JobPosterSchema.plugin(mongooseAggregatePaginate);  // this allow to write aggreagation queiry on given collection schema


// custom methods

// UserSchema.methods.isPasswordCorrect= async function(password){
//   return await  bcrypt.compare(password,this.password);
// }

export const JobPoster= mongoose.model("JobPoster",JobPosterSchema);