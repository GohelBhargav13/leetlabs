import Mailgen from "mailgen";
import nodemailer from "nodemailer";

export const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "LeetLab",
      link: "https://www.linkedin.com/in/bhargav-gohel-968919303/",
      logo: "https://mailgen.js/img/logo.png",
    },
  });

  // Generate an HTML email with the provided contents
  const emailBody = mailGenerator.generate(options.mailgencontent);

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailText = mailGenerator.generatePlaintext(options.mailgencontent);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    },
  });

  const mailOptions = {
    from: "gohelbhargav401@gmail.com",
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Mail Sent...");
  } catch (error) {
    console.log(error);
    return;
  }
};

export const emailVerificationMail = (username, verificationURL) => {
  return {
    body: {
      name: username,
      intro: `Welcome to LeetLab! We're excited to have you on board.`,
      action: {
        instructions:
          "To verify your email and activate your account, please click the button below:",
        button: {
          color: "#22BC66", // Green button
          text: "Verify My Email",
          link: `http://localhost:8080/api/v1/user/verify/${verificationURL}`,
        },
      },
      outro: "If you did not create an account, no further action is required.",
    },
  };
};
