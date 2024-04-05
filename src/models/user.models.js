import mongoose ,{Schema, schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true //for searching (look deatils apne se), makes process expensive but make easy for searching
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            trim:true
        },
        fullname: {
            type:String,
            required: true,
            trim:true,
            index:true    
        },
        avatar:{
            type:String, //cloudnry url
            required:true
        },
        coverImage:{
            type:String //cloudnary url 
        },
        watchHistory:[
            {
                type: Schema.mongoose.Types.objectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,"password is required"]
        },
        refershTokens:{
            type:String
        }

    },
    {timestamps:true}
)

// not use arrow fn cz we dont get this. context in arrow fn, make async as process will take some time
userSchema.pre("save", async function (next){
    if(!this.isModefied("password")) return next();
    this.password = bcrypt.hash(this.password,10); //10 is no. of rounds
    next()
});


//checking if passowrd is correct
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            //payload : data from database
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            //payload : data from database
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}

export const User = mongoose.model('User',userSchema);