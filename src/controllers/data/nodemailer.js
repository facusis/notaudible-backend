/*const nodemailer = require("nodemailer");
const credenciales = require('./credenciales');

const sendMail = (code, email) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: credenciales.usuario,
            pass: credenciales.password
        }
    });

  let info = transporter.sendMail({
    from: 'audiblenot@gmail.com', 
    to: email, 
    subject: "Codigo de verificacion", 
    text: "Su codigo de verificacion es: " + code + " Por favor introduzcalo en el formulario y restaure su contraseña"
  });
}

module.exports = {
    sendMail,
}*/