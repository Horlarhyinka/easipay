import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import { rmdir } from "fs";
import path from "path";
import { Request } from "express";

dotenv.config()

const {CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env

cloudinary.config({
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    cloud_name: CLOUDINARY_NAME
})

const upload = async(path: string): Promise<string | null> =>{
    try{
       const data = await cloudinary.uploader.upload(path)
       rmdir(path,()=>{})
       return data.secure_url
    }catch(ex){
        return null
    }
}

const destroy = async(url: string): Promise<void> =>{
    const id = url.slice(url.lastIndexOf("/"), url.lastIndexOf("."))
    try{
        await cloudinary.uploader.destroy(id)
    }catch(ex){
        throw Error("cloudinary error")
    }
}

class Media{
    destroy = destroy;
    handleMedias = async(arg: Request["files"] | Request["file"]) =>{
        if(!Array.isArray(arg)){
            const file = arg as Request["file"]
            if(!file)return null;
            const res = await upload(file!.path)
            return [res]
        }
        const files = arg as Request["files"]
        if(!files)return null;
        const urls = Promise.all((files as Request["file"][]).map(async(file)=>{
            return await upload(file!.path)
        }))
        return urls
    }
}

export default new Media;