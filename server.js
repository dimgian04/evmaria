const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

require('dotenv').config();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Content Security Policy to allow Google Maps and inline scripts
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://maps.googleapis.com https://maps.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "frame-src 'self' https://www.google.com https://maps.google.com; " +
    "connect-src 'self' https:; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  );
  next();
});

// Country code to full name mapping
const countryNames = {
  'UK': 'United Kingdom',
  'US': 'United States',
  'CA': 'Canada',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'BR': 'Brazil',
  'MX': 'Mexico',
  'JP': 'Japan',
  'KR': 'South Korea',
  'CN': 'China',
  'IN': 'India',
  'GR': 'Greece',
  'other': 'Other'
};

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // This is your Gmail account (host_email)
    pass: process.env.EMAIL_PASS  // This is your Gmail password/app password
  }
});

// Email addresses
const FROM_EMAIL = process.env.EMAIL_USER; // Gmail account (host_email)
const DISPLAY_EMAIL = 'evmariaservises@gmail.com'; // What users see as sender
const TO_EMAIL = 'aggverykios@gmail.com'; // Where emails are sent (test email)

// Program mapping for full names
const programNames = {
  'bath-university': 'Bath University Summer Program',
  'brunel-university': 'Brunel University Summer Program',
  'chelmsford-university': 'Chelmsford University Summer Program',
  'dublin-university': 'Dublin University Summer Program',
  'edinburgh-university': 'Edinburgh University Summer Program',
  'hatfield-university': 'Hatfield University Summer Program',
  'kingston-university': 'Kingston University Summer Program',
  'loughborough-university': 'Loughborough University Summer Program',
  'malta-village': 'Malta Village Summer Program',
  'stirling-university': 'Stirling University Summer Program',
  'surrey-university': 'Surrey University Summer Program',
  'westminster-university': 'Westminster University Summer Program',
  'ellesmere-college': 'Ellesmere College Summer Program',
  'travel-camps': 'Travel Camps Program',
  'other': 'Other Program'
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      country,
      program,
      message,
      newsletter,
      privacy
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !country || !program || !message || !privacy) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Create email content
    const mailOptions = {
      from: {
        name: 'Evmaria Services',
        address: DISPLAY_EMAIL
      },
      to: TO_EMAIL,
      subject: `New Contact Form Submission - ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background-color: #ffffff; 
              line-height: 1.6;
              color: #333;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #ffffff; 
              border: 1px solid #ddd;
            }
            .header { 
              background: #6b7192; 
              padding: 20px; 
              border-bottom: 1px solid #5d6386;
            }
            .header h1 { 
              margin: 0; 
              font-size: 24px; 
              color: white;
            }
            .content { 
              padding: 20px; 
            }
            .field { 
              margin: 15px 0; 
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .field:last-child {
              border-bottom: none;
            }
            .field-label { 
              font-weight: bold; 
              color: #555;
              margin-bottom: 5px;
            }
            .field-value { 
              color: #333; 
              font-size: 14px;
            }
            .message-field {
              margin: 15px 0;
            }
            .message-text { 
              white-space: pre-wrap; 
              background: #f8f9fa;
              padding: 15px;
              border: 1px solid #ddd;
            }
            .footer { 
              background: #2f3552; 
              padding: 15px; 
              text-align: center; 
              border-top: 1px solid #3a4060; 
              font-size: 12px;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="field-label">Name:</div>
                <div class="field-value">${firstName} ${lastName}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value">${email}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Country:</div>
                <div class="field-value">${countryNames[country] || country}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Program Interest:</div>
                <div class="field-value">${programNames[program] || program}</div>
              </div>
              
              <div class="message-field">
                <div class="field-label">Message:</div>
                <div class="message-text">${message}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Submitted:</div>
                <div class="field-value">${new Date().toLocaleString()}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>Evmaria Services Ltd. - Educational activities and summer language camps</p>
              <p>15a Station Road, Epping, Essex, CM16 4HG, UK</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationMailOptions = {
      from: {
        name: 'Evmaria Services',
        address: DISPLAY_EMAIL
      },
      to: email,
      subject: 'Thank you for contacting Evmaria Services',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for contacting Evmaria Services</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background-color: #ffffff; 
              line-height: 1.6;
              color: #333;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #ffffff; 
              border: 1px solid #ddd;
            }
            .header { 
              background: #6b7192; 
              padding: 20px; 
              border-bottom: 1px solid #5d6386;
            }
            .header h1 { 
              margin: 0; 
              font-size: 24px; 
              color: white;
            }
            .content { 
              padding: 20px; 
            }
            .welcome { 
              background: #f8f9fa; 
              padding: 20px; 
              margin: 20px 0; 
              border: 1px solid #ddd;
            }
            .welcome h2 { 
              margin: 0 0 10px 0; 
              font-size: 20px; 
              color: #333;
            }
            .welcome p { 
              margin: 0; 
              color: #555;
            }
            .field { 
              margin: 15px 0; 
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .field:last-child {
              border-bottom: none;
            }
            .field-label { 
              font-weight: bold; 
              color: #555;
              margin-bottom: 5px;
            }
            .field-value { 
              color: #333; 
              font-size: 14px;
            }
            .message-field {
              margin: 15px 0;
            }
            .message-text { 
              white-space: pre-wrap; 
              background: #f8f9fa;
              padding: 15px;
              border: 1px solid #ddd;
            }
            .signature { 
              background: #f8f9fa; 
              padding: 20px; 
              margin: 20px 0; 
              border: 1px solid #ddd;
              text-align: center;
            }
            .signature h3 { 
              margin: 0 0 10px 0; 
              font-size: 18px; 
              color: #333;
            }
            .signature p { 
              margin: 0; 
              color: #555;
            }
            .footer { 
              background: #2f3552; 
              padding: 15px; 
              text-align: center; 
              border-top: 1px solid #3a4060; 
              font-size: 12px;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Inquiry</h1>
            </div>
            
            <div class="content">
              <div class="welcome">
                <h2>Dear ${firstName} ${lastName}</h2>
                <p>Thank you for reaching out to Evmaria Services. We have received your inquiry and our dedicated team will review your message and respond within 24-48 hours.</p>
              </div>
              
              <div class="field">
                <div class="field-label">Program of Interest:</div>
                <div class="field-value">${programNames[program] || program}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Country:</div>
                <div class="field-value">${countryNames[country] || country}</div>
              </div>
              
              <div class="message-field">
                <div class="field-label">Your Message:</div>
                <div class="message-text">${message}</div>
              </div>
              
              <div class="signature">
                <h3>Best regards</h3>
                <p>The Evmaria Services Team</p>
              </div>
            </div>
            
            <div class="footer">
              <p>Evmaria Services Ltd. - Educational activities and summer language camps</p>
              <p>15a Station Road, Epping, Essex, CM16 4HG, UK</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(confirmationMailOptions);

    res.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24-48 hours.'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later or contact us directly.'
    });
  }
});

// fallback for everything else—regex bypasses the parser error
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
