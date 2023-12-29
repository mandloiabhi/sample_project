import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";


const UserSchema= new Schema(
{
     username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
     },
     email:
     {
        type: String,
        required: true,
        unique: true,
        trim: true,
     },
     role:
     {
       type: String,
       required: true,
       trim: true,
     },
     password:
     {
        type: String,
        required: [true,'Password is required'],
        trim:true,
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

UserSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10);
    next();
})
UserSchema.plugin(mongooseAggregatePaginate);  // this allow to write aggreagation queiry on given collection schema


// custom methods

UserSchema.methods.isPasswordCorrect= async function(password){
  return await  bcrypt.compare(password,this.password);
}
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User= mongoose.model("User",UserSchema);