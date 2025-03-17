import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

// Interface for contact form data
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Interface for newsletter subscription data
export interface NewsletterSubscription {
  email: string;
}

// Create a test account for development, in production use SMTP settings
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Use production SMTP settings if available
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // For local development, use Ethereal for testing
    console.warn('SMTP credentials not found, using Ethereal email for testing');
    const testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

/**
 * Send an email from the contact form
 * @param data The contact form data
 * @returns Object with success status and message
 */
export const sendContactEmail = async (data: ContactFormData): Promise<{ success: boolean; message: string; }> => {
  try {
    const transporter = await createTransporter();
    
    // Send email to vapecavetx@gmail.com
    const info = await transporter.sendMail({
      from: `"${data.name}" <${data.email}>`,
      to: 'vapecavetx@gmail.com',
      subject: `Contact Form Submission: ${data.subject}`,
      text: `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
  <h2 style="color: #FF6B00;">New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Subject:</strong> ${data.subject}</p>
  <h3 style="margin-top: 20px;">Message:</h3>
  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
    ${data.message.replace(/\n/g, '<br>')}
  </div>
  <p style="margin-top: 20px; color: #666;">This email was sent from the contact form on vapecavetx.com</p>
</div>
      `,
    });
    
    console.log('Contact email sent:', info.messageId);
    
    // For development with Ethereal, log the preview URL
    if (!process.env.SMTP_HOST) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending contact email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

/**
 * Send a confirmation email for newsletter subscription
 * @param data The newsletter subscription data
 * @returns Object with success status and message
 */
export const sendNewsletterSubscriptionEmail = async (data: NewsletterSubscription): Promise<{ success: boolean; message: string; }> => {
  try {
    const transporter = await createTransporter();
    
    // Send email to vapecavetx@gmail.com
    const info = await transporter.sendMail({
      from: '"Vape Cave Newsletter" <noreply@vapecavetx.com>',
      to: 'vapecavetx@gmail.com',
      subject: 'New Newsletter Subscription',
      text: `
New Newsletter Subscription
Email: ${data.email}

This user has subscribed to receive updates from Vape Cave.
      `,
      html: `
<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
  <h2 style="color: #FF6B00;">New Newsletter Subscription</h2>
  <p><strong>Email:</strong> ${data.email}</p>
  <p style="margin-top: 20px;">This user has subscribed to receive updates from Vape Cave.</p>
  <p style="margin-top: 20px; color: #666;">This email was sent from the newsletter subscription form on vapecavetx.com</p>
</div>
      `,
    });
    
    console.log('Newsletter subscription email sent:', info.messageId);
    
    // For development with Ethereal, log the preview URL
    if (!process.env.SMTP_HOST) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, message: 'Subscription email sent successfully' };
  } catch (error) {
    console.error('Error sending newsletter subscription email:', error);
    return { success: false, message: 'Failed to send subscription email' };
  }
};