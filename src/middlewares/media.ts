import multer from "multer";
import fs from "fs";
import path from 'path'
import { NextFunction, Request, Response } from "express";

const storage = multer.diskStorage({
    destination: async(req, file, cb)=>{
        const dir = path.resolve(__dirname,"../uploads")
        if(fs.existsSync(dir))return cb(null, dir)
        fs.mkdir(dir,()=>{
            return cb(null, dir)
        })
    },
    filename: (req, file, cb) =>{
        const fname = String(Math.floor(Math.random()*10000)) + String(Date.now()) + file.originalname
        return cb(null, fname)
    } 
})

const Media = multer({storage})

export const uploadMany = Media.array("images",20)
export const uploadOne = Media.single("image")
export const uploadAny = Media.any()