import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

let transporter: nodemailer.Transporter | null = null;

if (ENV.EMAIL_HOST && ENV.EMAIL_USER && ENV.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: ENV.EMAIL_PORT === 465,
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASS,
    },
  });
}

export interface InquiryEmailData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate?: Date | string;
  venue?: string;
  message: string;
}

export const sendInquiryNotification = async (data: InquiryEmailData): Promise<void> => {
  const formattedDate = data.eventDate
    ? new Date(data.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not specified';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #0b2545; border-bottom: 2px solid #ee523d; padding-bottom: 8px;">✨ New Inquiry Received — Skypixel</h2>
      <p style="font-size: 15px; color: #475569;">A prospective client has submitted an inquiry through the Skypixel website:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; font-weight: bold; color: #1e293b; width: 30%;">Name:</td><td style="padding: 8px; color: #334155;">${data.name}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #1e293b;">Email:</td><td style="padding: 8px; color: #334155;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #1e293b;">Phone:</td><td style="padding: 8px; color: #334155;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #1e293b;">Event Type:</td><td style="padding: 8px; color: #334155; text-transform: capitalize;">${data.eventType}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #1e293b;">Event Date:</td><td style="padding: 8px; color: #334155;">${formattedDate}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #1e293b;">Venue:</td><td style="padding: 8px; color: #334155;">${data.venue || 'Not specified'}</td></tr>
      </table>

      <div style="margin-top: 16px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #ee523d; border-radius: 4px;">
        <h4 style="margin: 0 0 8px 0; color: #0b2545;">Message:</h4>
        <p style="margin: 0; color: #334155; white-space: pre-line; line-height: 1.5;">${data.message}</p>
      </div>

      <p style="margin-top: 24px; font-size: 13px; color: #94a3b8; text-align: center;">
        Skypixel Photography & Videography Studio Management
      </p>
    </div>
  `;

  if (!transporter) {
    console.log('\n[Email Notification Sim]');
    console.log(`To: ${ENV.EMAIL_TO}`);
    console.log(`Subject: New Inquiry: ${data.name} (${data.eventType})`);
    console.log(`Details: Phone: ${data.phone}, Email: ${data.email}, Venue: ${data.venue}`);
    console.log(`Message: "${data.message}"\n`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Skypixel Website" <${ENV.EMAIL_USER}>`,
      to: ENV.EMAIL_TO,
      replyTo: data.email,
      subject: `New Inquiry: ${data.name} - ${data.eventType.toUpperCase()}`,
      html: htmlContent,
    });
    console.log(`[Email] Notification sent to ${ENV.EMAIL_TO}`);
  } catch (error) {
    console.error('[Email] Failed to send email notification:', error);
  }
};
