const nodemailer = require("nodemailer")
const { generateTemplate } = require("./mailtemplate")

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: process.env.NM_USER,
		pass: process.env.NM_PASSWORD
	}
});

//Sends the email
module.exports.sendActivationEmail = (email, token) => {
    transporter.sendMail({
        from: `"Eatook app" <${process.env.NM_USER}>`, 
        to: email, 
        subject: "Eatook activate account",
        html: generateTemplate(token)
      })
}