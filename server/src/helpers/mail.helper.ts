import { complier } from '@/utils/complier';
import { createTransport } from 'nodemailer';
import { config } from '@/config/config.service';
import { InternalServerError } from 'http-errors';
import type { SendMailOptions } from 'nodemailer';

// interface and types
export type MailOptions = SendMailOptions & {
  context?: Record<string, any>;
  template?: string;
};

// create transporter instance
const transporter = createTransport({
  host: config.getOrThrow('mail.host'),
  port: config.getOrThrow('mail.port'),
  auth: {
    user: config.getOrThrow('mail.user'),
    pass: config.getOrThrow('mail.pass'),
  },
});

// compiler
transporter.use('compile', async (mail, callback) => {
  const { template, context } = mail.data as any;
  // if template is not empty, use the template to compile ejs template
  if (template)
    try {
      mail.data.html = await complier(template, context);
    } catch (error: any) {
      return callback(error);
    }
  return callback();
});

export async function sendMail(options: MailOptions) {
  const verify = await transporter.verify();
  // check connection configuration
  if (!verify)
    throw new InternalServerError('Failed to connect to mail server');

  options.from = options.from || config.getOrThrow('mail.from');

  console.log(`Sending mail to ${options.to}`);

  // after send mail, return the result
  return await transporter.sendMail(options);
}
