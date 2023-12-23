export default (ex: Error | any) =>{
    const messages: string[] = []
    if(ex.code === 1100)return {message: "duplicate resource"}
        for(let key in ex.errors){
            messages.push(ex.errors[key]?.properties?.message)
        }
    if(messages.length < 1)return null
    return {message: messages.join("\n")}
}