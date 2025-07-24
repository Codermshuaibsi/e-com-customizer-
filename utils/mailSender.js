  const nodemailer = require("nodemailer");
  require("dotenv").config();

  const mailSender = async(email , title )=>{
    try{
       let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS,
        }
       })


       let info = await transporter.sendMail({
        from: 'Ecommerce website',
        to: `${email}`,
        subject: `${title}`,
       
       })

       console.log("this is email send info ",info);
       return info;
    }
     catch(error){
        console.log(error);

     }
  }

 module.exports = mailSender;