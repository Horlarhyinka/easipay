import { Schema, model } from "mongoose";
import { user_int } from "./types/user";
import { mail_regex, tel_regex } from "../util/regex";
import jwt from "jsonwebtoken";
import "./order";
import Account from "./account";
import bcrypt from "bcrypt";
import config from "../config/config";  


const userSchema = new Schema<user_int>({
    email: {
        type: String,
        required: true,
        match: [mail_regex, "invalid email address"],
        unique: true,
        immutable: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "password length must be greater than or equal to 6"]
    },
    firstName: {
        type: String,
        minlength: 3,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    tel: {
        type: String,
        match: tel_regex,
        required: true
    },
    resetToken:{
        type: String
    },
    tokenExpiresIn: {
        type: Date
    },
    orders: {
        type: [Schema.Types.ObjectId],
        ref: "order"
    },
    username: {
        type: String
    },
    avatar: {
        type: String
    },
    country:{
        type: String,
        default: "NG"
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: "account",
        required: true,
    }
},{
    timestamps: true,
    virtuals: true
})


userSchema.pre("save", async function(){
    if(this.isModified("password")){
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password!, salt)
    this.password = hashedPassword
    }
})

userSchema.pre("validate", async function (next) {
    if(this.isNew){
        try{
            const account = await Account.create({userId: this._id})
            this.account = account._id
            next()
        }catch(ex){
            throw ex
        }
    }
})

userSchema.methods.validatePassword = function(password: string):Promise<boolean>{
    return bcrypt.compare(password, this.password)
}

userSchema.methods.genToken = function(){
    const body = {id: this._id}
    return jwt.sign(body, config.APP.secret,{expiresIn: "2d"})
}

export default model("user", userSchema)

