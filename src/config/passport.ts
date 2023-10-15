import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import dotenv from "dotenv";
import { user_int } from "../models/types/user";
import User from "../models/user";
import config from "./config";

passport.use(new GoogleStrategy({
    clientID: config.APP.auth.OAUTH.GOOGLE.clientId,
    clientSecret: config.APP.auth.OAUTH.GOOGLE.secret,
    passReqToCallback: true,
    callbackURL:config.APP.baseUrl + "/auth/redirect"
},async(request, accessToken, requestToken, profile, done)=>{
    const {given_name: firstName, family_name: lastName, email} = profile?._json
    const {id: password} = profile
    let user: user_int;
    const existing = await User.findOne({email})
    if(!existing){
    user = await User.create({email, password: profile.id, firstName, lastName})
    return done(undefined, user)
    }
    const validatePassword = existing.validatePassword(password);
    if(!validatePassword)return done("incorrect password", undefined)
    return done(undefined, existing)
}))

passport.serializeUser((user, done)=>{
    return done(undefined, (user as user_int)?._id)
})

passport.deserializeUser(async(id: string, done)=>{
    const user = await User.findById(id)
    if(!user)return done({message: "user not found"}, undefined)
    return done(undefined, user)
})

export const usePassport = passport.authenticate("google", {scope: ["profile", "email"]})