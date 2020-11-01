import nodemailer from "nodemailer"
import ejs from "ejs";

export var mailer = null;

export default class Mailer {
    constructor(config) {
        if (config) this.transporter = nodemailer.createTransport(config);
        else
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
        Object.freeze(this.transporter);
        console.info("Nodemailer initialized...")
    }

    static getInstance() {
        if (!mailer) {
            throw Error("No mailer found!")
        }
        return mailer;
    }

    static initialize(config) {
        mailer = new Mailer(config);
    }

    async sendEmail(emailAddress, emailSubject, emailTemplate, emailData) {

        const data = await ejs.renderFile(__dirname + `/templates/${emailTemplate}.ejs`, emailData);
        try {
            let mailOptions = {
                subject: emailSubject,
                to: emailAddress,
                from: '<demo@email.com>',
                html: data,
            };

            return this.transporter.sendMail(mailOptions, (error, info) => {
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
