const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendVerificationEmail = async (
  to,
  code
) => {

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Código de verificación',
    text: `Tu código de verificación es: ${code}`
  });

};