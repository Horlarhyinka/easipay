import nodemailer, { Transport, TransportOptions } from "nodemailer";
import dotenv from "dotenv";
import templates from "../util/templates";
import ejs from "ejs";
import path from "path";

dotenv.config()
const {MAIL_HOST, MAIL_PORT, MAIL_SERVICE, MAIL_USER, MAIL_PASSWORD, MAIL_ADDRESS} = process.env

interface mailer_int{
    sendPasswordResetMail: (passwordResetLink: string)=>Promise<void>,
    sendNotificationMail: <t>(templateFileName: string, notificationInfo: t) =>Promise<void>,

}

class Mailer implements mailer_int{
    private targetMail: string = "";
    private transporter = nodemailer.createTransport({
        port: 465,
        host: MAIL_HOST!,
        service: MAIL_SERVICE!,
        auth:{
            user: MAIL_USER!,
            pass: MAIL_PASSWORD!
        }
    })
    private mailOptions: {
        to: string,
        from: string,
        html?: string
    }

    constructor(private targetUserMail: string){
        this.targetMail = targetUserMail
        this.mailOptions = {
                    to: this.targetMail,
                    from: MAIL_ADDRESS!
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