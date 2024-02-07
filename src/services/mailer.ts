import nodemailer, { Transporter } from "nodemailer";
import templates from "../util/templates";
import ejs from "ejs";
import path from "path";
import config from "../config/config";

const {host, user, pass, port, service, address} = config.SERVICES.MAIL

interface mailer_int{
    sendPasswordResetMail: (passwordResetLink: string)=>Promise<void>,
    sendNotificationMail: <t>(templateFileName: string, notificationInfo: t) =>Promise<void>,

}


const poolConfig = `smtp://${user}:${pass}@${host}/?service=${service}&&port=${port}`

class Mailer implements mailer_int{
    private targetMail: string = "";
    private transporter = nodemailer.createTransport(poolConfig)
    private mailOptions: {
        to: string,
        from: string,
        html?: string
    }

    constructor(private targetUserMail: string){
        this.targetMail = targetUserMail
        this.mailOptions = {
                    to: this.targetMail,
                    from: address
                }
        }
    private sendMail = async <t>(options: t, templateName: string)=>{
        try{
        const templatePath = path.resolve(__dirname, "../views/"+ templateName + ".ejs")
        const template = await ejs.renderFile(templatePath, <object>options)
        this.mailOptions.html = template
        await this.transporter.sendMail(this.mailOptions)
        }catch(ex){
            console.log("error sending mail>> ", ex)
            throw(ex)
        }
    }
    sendPasswordResetMail = async(passwordResetLink: string)=>{
        return this.sendMail({url: passwordResetLink}, templates.PASSWORD_RESET)
    }
    sendNotificationMail = async <t>(templateFileName: string, notificationInfo: t) =>{
        return this.sendMail(notificationInfo, templateFileName)
    }
}

export default Mailer;