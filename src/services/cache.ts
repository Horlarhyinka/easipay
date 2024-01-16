import {createClient, RedisClientType} from "redis";
import config from "../config/config";

let client: RedisClientType

if(process.env.NODE_ENV === "production"){
    client = createClient({
        username: config.SERVICES.REDIS.user,
        password: config.SERVICES.REDIS.password,
        socket: {
            host: config.SERVICES.REDIS.host,
            port: Number(config.SERVICES.REDIS.port) || 6379,
        }
    })
}else{
    client = createClient()
}

client.on("connections", ()=>{
    console.log("connected to redis client")
})

client.on("error", (err)=>{
    console.log("Cache Error: ", err)
})

client.connect()
.then(()=>{console.log("redis-client connected")})
.catch((ex)=>{console.log("Error: ", ex)})

const exp_time = 60*60*2

async function getOrSet(key: string, func: Function){
    const ext = await client.get(key)
    if(!ext){
        try{
        const res  = await func()
        const stringified = JSON.stringify(res)
        await client.setEx(key, exp_time, stringified)
        return res
        }catch(ex){
            throw ex
        }
    }
    return JSON.parse(ext)
}

async function addOrUpdate(key: string, newVal: any){
    try{
        const stringified = JSON.stringify(newVal)
        await client.setEx(key, exp_time, stringified)
        return newVal
    }catch(ex){
        throw ex
    }
}

const cache = {
    getOrSet, 
    addOrUpdate
}

export default cache