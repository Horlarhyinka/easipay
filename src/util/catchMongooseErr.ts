export default (ex: Error | any) =>{
    const messages: string[] = []
        for(let key in ex.errors){
            messages.push(ex.errors[key]?.properties?.message)
        }
    if(messages.length < 1)return null
    return {message: messages.join("\n")}
}