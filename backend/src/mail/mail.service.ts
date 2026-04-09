import nodemailer, { Transporter } from "nodemailer";

interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "zoho",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async send({ to, subject, html }: SendMailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
}

export const mailService = new MailService();
