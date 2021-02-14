import { createTransport } from 'nodemailer';

const mailer = createTransport(JSON.parse(process.env.SMTP_SETTING_JSON));
const defaultFrom = process.env.SMTP_FROM;

export const sendMail = ({
  from = defaultFrom,
  to,
  subject,
  text,
  html,
}: {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
}) => mailer.sendMail({ from, to, subject, text, html });
