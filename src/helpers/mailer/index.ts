import nodemailer, { Transporter } from "nodemailer"
import ejs from "ejs";
import Mail from "nodemailer/lib/mailer";

export var mailer: Mailer;

export default class Mailer {
    transporter: Mail | undefined;
    constructor(config:any) {
        this.transporter = undefined;
        if (!config){
            nodemailer.createTestAccount((err, account) => {
                if (err) {
                    console.error('Failed to create a testing account');
                    console.error(err);
                    return process.exit(1);
                }
                this.transporter = nodemailer.createTransport(
                    {
                        host: account.smtp.host,
                        port: account.smtp.port,
                        secure: account.smtp.secure,
                        auth: {
                            user: account.user,
                            pass: account.pass
                        },
                        logger: false,
                        debug: false // include SMTP traffic in the logs
                    },
                    {
                        // default message fields
                        // sender info
                        from: 'Nodemailer <example@nodemailer.com>',
                        /*headers: {
                            'X-Laziness-level': 1000 // just an example header, no need to use this
                        }*/
                    }
                );
            });
        }else {
            this.transporter = nodemailer.createTransport(config);
        }
        Object.freeze(this.transporter);
        console.info("Nodemailer initialized...")
    }

    static getInstance() {
        if (!mailer) {
            throw Error("No mailer found!")
        }
        return mailer;
    }

    static initialize(config:any) {
        mailer = new Mailer(config);
    }

    async sendEmail(emailAddress:string, emailSubject:string, emailTemplate:string, emailData:Object) {
        const data = await ejs.renderFile(__dirname + `/templates/${emailTemplate}.ejs`, emailData);
        try {
            let mailOptions = {
                subject: emailSubject,
                to: emailAddress,
                from: '<demo@email.com>',
                html: data,
            };

            return this.transporter?.sendMail(mailOptions, (error, info) => {
                if (error) console.log(error + "\n");
                else {
                    console.log("An Email has been sent to " + emailAddress);
                    console.log(nodemailer.getTestMessageUrl(info));
                }
            })
        } catch (error) {
            console.log("Could not send email: " + error);
        }
    }
}
