import { Response } from "express"


export const sendServerFailed = (res: Response, action?: string) =>{
    const message = `server failed ${action && "to " + action}`
    return res.status(500).json({message})
}

export const sendInvalidEntry = (res: Response, field?: string) =>{
    const message = `invalid ${field?field: "entry"}`
    return res.status(400).json({message})
}

export const sendDuplicateResource = (res: Response, field?: string)=>{
    const message = !field? "duplicate resource": field + "already exists"
    return res.status(409).json({message})
}

export const sendMissingDependency = (res: Response, field?: string) =>{
    const message = !field? "missing dependency": field + "is required"
    return res.status(400).json({message})
}

export const sendResourceNotound = (res: Response, resource?:string) =>{
    const message = `${resource && resource} not found`
    return res.status(404).json({message})
}

export const sendUnauthenticated = (res: Response) => res.status(401).json({message: "UNAUTHENTICATED"})