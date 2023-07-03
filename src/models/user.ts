import { Schema, model } from "mongoose";
import { user_int } from "./types/user";
import { mail_regex, tel_regex } from "../util/regex";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const userSchema = new Schema<user_int>({
    email: {
        type: String,
        required: true,
        match: [mail_regex, "invalid email address"],
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "password length must be greater than or equal to 6"]
    },
    firstName: {
        type: String,
        minlength: 3
    },
    tel: {
        type: String,
        match: tel_regex
    },
    resetToken:{
        type: String
    },
    tokenExpiresIn: {
        type: Date
    }
},{
    timestamps: true
})

userSchema.pre("save", async function(){
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password!, salt)
    this.password = hashedPassword

})

userSchema.methods.validatePassword = function(password: string):Promise<boolean>{
    return bcrypt.compare(password, this.password)
}

userSchema.methods.genToken = function(){
    const body = {id: this._id}
    return jwt.sign(body, process.env.SECRET!,{expiresIn: "2d"})
}

export default model("user", userSchema)

