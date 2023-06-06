import multer from "multer";
import fs, { mkdir } from "fs";
import path from 'path'

const storage = multer.diskStorage({
    destination: async(req, file, cb)=>{
        const dir = path.resolve(__dirname, "/uploads")
        console.log(dir)
        if(fs.existsSync(dir))return cb(null, dir)
        mkdir(dir,()=>{
            return cb(null, dir)
        })
    },
    filename: (req, file, cb) =>{
        const fname = String(Math.floor(Math.random()*10000)) + String(Date.now()) + file.filename
        return cb(null, fname)
    } 
})

const Media = multer({storage})

export const useMedia = Media.array("image",20)