import fs from "fs";
import path from "path";

export default () =>{
    fs.readdir(path.resolve(__dirname, "../uploads"),(err, files)=>{
        if(err)throw err;
        for(let file in files){
            const dir = path.resolve(__dirname, "../uploads/" + files[file])
            if(!fs.existsSync(dir))continue;
            fs.unlink(dir, (err)=>{ if(err)throw err })
        }
    })
}