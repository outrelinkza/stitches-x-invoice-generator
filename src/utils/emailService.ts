import nodemailer from 'nodemailer';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface InvoiceEmailData {
  clientEmail: string;
  clientName: string;
  invoiceNumber: string;
  total: number;
  pdfBuffer?: Buffer;
  companyName: string;
}

export interface FeedbackData {
  name: string;
  email: string;
  feedback: string;
  rating?: number;
}

// Create transporter (using Gmail SMTP for simplicity)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'stitchesx.service@gmail.com',
      pass: process.env.EMAIL_PASS || process.env.APP_PASSWORD, // Use App Password for Gmail
    },
  });
};

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Stitches X" <${process.env.EMAIL_USER || 'stitchesx.service@gmail.com'}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      attachments: emailData.attachments,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendContactFormEmail = async (formData: ContactFormData): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">New Contact Form Submission</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">From Stitches X Website</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
        <div style="margin-bottom: 15px;">
          <strong style="color: #495057;">Name:</strong>
          <span style="color: #6c757d; margin-left: 10px;">${formData.name}</span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #495057;">Email:</strong>
          <span style="color: #6c757d; margin-left: 10px;">${formData.email}</span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #495057;">Subject:</strong>
          <span style="color: #6c757d; margin-left: 10px;">${formData.subject}</span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #495057;">Message:</strong>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 5px; border-left: 4px solid #667eea;">
            ${formData.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6; text-align: center;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            This message was sent from the Stitches X contact form.
          </p>
        </div>
      </div>
    </div>
  `;

  const text = `
New Contact Form Submission from Stitches X Website

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
This message was sent from the Stitches X contact form.
  `;

  return await sendEmail({
    to: 'stitchesx.service@gmail.com',
    subject: `Contact Form: ${formData.subject}`,
    html,
    text,
  });
};

export const sendInvoiceEmail = async (invoiceData: InvoiceEmailData): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">Invoice from ${invoiceData.companyName}</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Invoice #${invoiceData.invoiceNumber}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
        <div style="margin-bottom: 20px;">
          <p style="color: #495057; font-size: 16px; margin: 0 0 10px 0;">Dear ${invoiceData.clientName},</p>
          <p style="color: #6c757d; line-height: 1.6; margin: 0;">
            Please find attached your invoice #${invoiceData.invoiceNumber} for the amount of <strong>$${invoiceData.total.toFixed(2)}</strong>.
          </p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #28a745;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #495057; font-weight: 600;">Total Amount Due:</span>
            <span style="color: #28a745; font-size: 20px; font-weight: bold;">$${invoiceData.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div style="margin: 20px 0;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            If you have any questions about this invoice, please don't hesitate to contact us.
          </p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6; text-align: center;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Thank you for your business!<br>
            <strong>${invoiceData.companyName}</strong>
          </p>
        </div>
      </div>
    </div>
  `;

  const text = `
Invoice from ${invoiceData.companyName}

Dear ${invoiceData.clientName},

Please find attached your invoice #${invoiceData.invoiceNumber} for the amount of $${invoiceData.total.toFixed(2)}.

Total Amount Due: $${invoiceData.total.toFixed(2)}

If you have any questions about this invoice, please don't hesitate to contact us.

Thank you for your business!
${invoiceData.companyName}
  `;

  const attachments = invoiceData.pdfBuffer ? [{
    filename: `invoice-${invoiceData.invoiceNumber}.pdf`,
    content: invoiceData.pdfBuffer,
    contentType: 'application/pdf',
  }] : undefined;

  return await sendEmail({
    to: invoiceData.clientEmail,
    subject: `Invoice #${invoiceData.invoiceNumber} from ${invoiceData.companyName}`,
    html,
    text,
    attachments,
  });
};

export const sendFeedbackEmail = async (feedbackData: FeedbackData): Promise<boolean> => {
  const ratingStars = feedbackData.rating ? '★'.repeat(feedbackData.rating) + '☆'.repeat(5 - feedbackData.rating) : 'Not provided';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">New Feedback Submission</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">From Stitches X User</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
        <div style="margin-bottom: 15px;">
          <strong style="color: #495057;">Name:</strong>
          <span style="color: #6c757d; margin-left: 10px;">${feedbackData.name}</span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #495057;">Email:</strong>
          <span style="color: #6c757d; margin-left: 10px;">${feedbackData.email}</span>
        </div>
        
        ${feedbackData.rating ? `
        <div style="margin-bottom: 15px;">
          <strong style="color: #495057;">Rating:</strong>
          <span style="color: #ffc107; margin-left: 10px; font-size: 18px;">${ratingStars}</span>
        </div>
        ` : ''}
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #495057;">Feedback:</strong>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 5px; border-left: 4px solid #667eea;">
            ${feedbackData.feedback.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6; text-align: center;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            This feedback was submitted through the Stitches X feedback form.
          </p>
        </div>
      </div>
    </div>
  `;

  const text = `
New Feedback Submission from Stitches X User

Name: ${feedbackData.name}
Email: ${feedbackData.email}
${feedbackData.rating ? `Rating: ${ratingStars}` : ''}

Feedback:
${feedbackData.feedback}

---
This feedback was submitted through the Stitches X feedback form.
  `;

  return await sendEmail({
    to: 'stitchesx.service@gmail.com',
    subject: `Feedback from ${feedbackData.name}`,
    html,
    text,
  });
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">Welcome to Stitches X!</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Your AI Invoice Generator</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
        <div style="margin-bottom: 20px;">
          <p style="color: #495057; font-size: 16px; margin: 0 0 10px 0;">Hi ${name},</p>
          <p style="color: #6c757d; line-height: 1.6; margin: 0;">
            Welcome to Stitches X! We're excited to help you create professional invoices with our AI-powered generator.
          </p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #495057; margin: 0 0 10px 0;">What you can do:</h3>
          <ul style="color: #6c757d; margin: 0; padding-left: 20px;">
            <li>Generate professional PDF invoices</li>
            <li>Scan documents with OCR technology</li>
            <li>Use multiple invoice templates</li>
            <li>Track your invoice analytics</li>
          </ul>
        </div>
        
        <div style="margin: 20px 0; text-align: center;">
          <a href="https://stitchesx.com" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: 600;">
            Get Started
          </a>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6; text-align: center;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            If you have any questions, feel free to reach out to us at stitchesx.service@gmail.com
          </p>
        </div>
      </div>
    </div>
  `;

  const text = `
Welcome to Stitches X!

Hi ${name},

Welcome to Stitches X! We're excited to help you create professional invoices with our AI-powered generator.

What you can do:
- Generate professional PDF invoices
- Scan documents with OCR technology
- Use multiple invoice templates
- Track your invoice analytics

Get started at: https://stitchesx.com

If you have any questions, feel free to reach out to us at stitchesx.service@gmail.com
  `;

  return await sendEmail({
    to: email,
    subject: 'Welcome to Stitches X - Your AI Invoice Generator',
    html,
    text,
  });
};
