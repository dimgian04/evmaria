const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

require('dotenv').config();

// Security middleware
app.use(helmet());

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many contact form submissions, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Contact form endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
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
      from: process.env.EMAIL_USER,
      to: 'evmariaservises@gmail.com',
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
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              padding: 0; 
              background-color: #f8f9fa; 
              line-height: 1.6;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #ffffff; 
              box-shadow: 0 15px 35px rgba(0,0,0,0.1); 
              border-radius: 12px; 
              overflow: hidden; 
            }
            .header { 
              background: linear-gradient(135deg, #6b7192 0%, #5d6386 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
              box-shadow: 0 4px 15px rgba(107, 113, 146, 0.3);
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: 600; 
              letter-spacing: -0.02em;
            }
            .header p { 
              margin: 15px 0 0 0; 
              opacity: 0.9; 
              font-size: 16px; 
              font-weight: 400;
            }
            .content { 
              padding: 40px 30px; 
            }
            .section { 
              background: #f8f9fa; 
              border-radius: 8px; 
              padding: 25px; 
              margin: 25px 0; 
              border-left: 4px solid #6b7192; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .section h3 { 
              color: #6b7192; 
              margin: 0 0 20px 0; 
              font-size: 18px; 
              font-weight: 600; 
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 15px; 
            }
            .info-item { 
              background: white; 
              padding: 15px; 
              border-radius: 6px; 
              border: 1px solid #e9ecef; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }
            .info-item strong { 
              color: #6b7192; 
              display: block; 
              margin-bottom: 8px; 
              font-size: 12px; 
              text-transform: uppercase; 
              letter-spacing: 0.5px; 
              font-weight: 600;
            }
            .info-item span { 
              color: #333; 
              font-size: 15px; 
              font-weight: 500;
            }
            .message-box { 
              background: white; 
              border: 1px solid #e9ecef; 
              border-radius: 6px; 
              padding: 20px; 
              margin: 15px 0; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }
            .message-text { 
              white-space: pre-wrap; 
              line-height: 1.6; 
              color: #333; 
              font-size: 15px; 
            }
            .preferences { 
              display: flex; 
              gap: 20px; 
            }
            .preference-item { 
              flex: 1; 
              text-align: center; 
              padding: 15px; 
              border-radius: 6px; 
            }
            .preference-yes { 
              background: #d1ecf1; 
              color: #0c5460; 
              border: 1px solid #bee5eb; 
            }
            .preference-no { 
              background: #f8d7da; 
              color: #721c24; 
              border: 1px solid #f5c6cb; 
            }
            .footer { 
              background: #f8f9fa; 
              padding: 25px; 
              text-align: center; 
              border-top: 1px solid #e9ecef; 
            }
            .timestamp { 
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
              color: white; 
              padding: 20px; 
              border-radius: 8px; 
              text-align: center; 
              margin: 25px 0; 
              box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
            }
            .timestamp strong { 
              font-weight: 600;
            }
            .badge { 
              display: inline-block; 
              background: #6b7192; 
              color: white; 
              padding: 6px 12px; 
              border-radius: 20px; 
              font-size: 11px; 
              font-weight: 600; 
              text-transform: uppercase; 
              letter-spacing: 0.5px; 
            }
            .company-info {
              background: #2f3552;
              color: white;
              padding: 20px;
              text-align: center;
              margin-top: 25px;
              box-shadow: 0 4px 15px rgba(47, 53, 82, 0.3);
            }
            .company-info p {
              margin: 5px 0;
              font-size: 14px;
              opacity: 0.9;
            }
            @media (max-width: 600px) {
              .info-grid { grid-template-columns: 1fr; }
              .preferences { flex-direction: column; }
              .content { padding: 25px 20px; }
              .header { padding: 30px 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
              <p>A new inquiry has been received from your website</p>
            </div>
            
            <div class="content">
              <div class="section">
                <h3>Contact Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <strong>Full Name</strong>
                    <span>${firstName} ${lastName}</span>
                  </div>
                  <div class="info-item">
                    <strong>Email Address</strong>
                    <span>${email}</span>
                  </div>
                  <div class="info-item">
                    <strong>Phone Number</strong>
                    <span>${phone || 'Not provided'}</span>
                  </div>
                  <div class="info-item">
                    <strong>Country</strong>
                    <span>${country}</span>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <h3>Program Interest</h3>
                <div class="info-item">
                  <strong>Selected Program</strong>
                  <span>${program}</span>
                </div>
              </div>
              
              <div class="section">
                <h3>Message</h3>
                <div class="message-box">
                  <div class="message-text">${message}</div>
                </div>
              </div>
              
              <div class="timestamp">
                <strong>Submission Time:</strong> ${new Date().toLocaleString()}
              </div>
            </div>
            
            <div class="company-info">
              <p><strong>Evmaria Services Ltd.</strong></p>
              <p>Educational activities and summer language camps</p>
              <p>15a Station Road, Epping, Essex, CM16 4HG, UK</p>
            </div>
            
            <div class="footer">
              <p style="margin: 0; color: #666; font-size: 14px;">
                This email was sent from your Evmaria Services contact form
              </p>
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
      from: process.env.EMAIL_USER,
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
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              padding: 0; 
              background-color: #f8f9fa; 
              line-height: 1.6;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #ffffff; 
              box-shadow: 0 15px 35px rgba(0,0,0,0.1); 
              border-radius: 12px; 
              overflow: hidden; 
            }
            .header { 
              background: linear-gradient(135deg, #6b7192 0%, #5d6386 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
              box-shadow: 0 4px 15px rgba(107, 113, 146, 0.3);
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: 600; 
              letter-spacing: -0.02em;
            }
            .header p { 
              margin: 15px 0 0 0; 
              opacity: 0.9; 
              font-size: 16px; 
              font-weight: 400;
            }
            .content { 
              padding: 40px 30px; 
            }
            .welcome { 
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
              color: white; 
              padding: 30px; 
              border-radius: 8px; 
              margin: 25px 0; 
              text-align: center; 
              box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
            }
            .welcome h2 { 
              margin: 0 0 15px 0; 
              font-size: 22px; 
              font-weight: 600;
            }
            .welcome p { 
              margin: 0; 
              opacity: 0.95; 
              font-size: 16px; 
              line-height: 1.5;
            }
            .summary { 
              background: #f8f9fa; 
              border-radius: 8px; 
              padding: 25px; 
              margin: 25px 0; 
              border-left: 4px solid #6b7192; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .summary h3 { 
              color: #6b7192; 
              margin: 0 0 20px 0; 
              font-size: 18px; 
              font-weight: 600; 
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .summary-item { 
              background: white; 
              padding: 15px; 
              border-radius: 6px; 
              margin: 12px 0; 
              border: 1px solid #e9ecef; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }
            .summary-item strong { 
              color: #6b7192; 
              display: block; 
              margin-bottom: 8px; 
              font-size: 12px; 
              text-transform: uppercase; 
              letter-spacing: 0.5px; 
              font-weight: 600;
            }
            .summary-item span { 
              color: #333; 
              font-size: 15px; 
              font-weight: 500;
            }
            .message-box { 
              background: white; 
              border: 1px solid #e9ecef; 
              border-radius: 6px; 
              padding: 20px; 
              margin: 15px 0; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }
            .message-text { 
              white-space: pre-wrap; 
              line-height: 1.6; 
              color: #333; 
              font-size: 15px; 
            }
            .links { 
              background: #f8f9fa; 
              border-radius: 8px; 
              padding: 25px; 
              margin: 25px 0; 
            }
            .links h3 { 
              color: #6b7192; 
              margin: 0 0 20px 0; 
              font-size: 18px; 
              font-weight: 600; 
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .link-item { 
              background: white; 
              padding: 20px; 
              border-radius: 6px; 
              margin: 15px 0; 
              border: 1px solid #e9ecef; 
              display: flex; 
              align-items: center; 
              transition: all 0.3s ease;
            }
            .link-item:hover {
              box-shadow: 0 4px 12px rgba(107, 113, 146, 0.1);
              transform: translateY(-2px);
            }
            .link-icon { 
              background: #6b7192; 
              color: white; 
              width: 45px; 
              height: 45px; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin-right: 20px; 
              font-size: 20px; 
              flex-shrink: 0;
            }
            .link-text { 
              flex: 1; 
            }
            .link-text h4 { 
              margin: 0 0 8px 0; 
              color: #333; 
              font-size: 16px; 
              font-weight: 600;
            }
            .link-text p { 
              margin: 0; 
              color: #666; 
              font-size: 14px; 
              line-height: 1.4;
            }
            .link-button { 
              background: #6b7192; 
              color: white; 
              padding: 10px 20px; 
              border-radius: 25px; 
              text-decoration: none; 
              font-size: 12px; 
              font-weight: 600; 
              text-transform: uppercase; 
              letter-spacing: 0.5px; 
              transition: all 0.3s ease;
              flex-shrink: 0;
            }
            .link-button:hover {
              background: #5d6386;
              transform: translateY(-1px);
            }
            .contact-info { 
              background: #f8f9fa; 
              border-radius: 8px; 
              padding: 25px; 
              margin: 25px 0; 
              border-left: 4px solid #28a745; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .contact-info h3 { 
              color: #28a745; 
              margin: 0 0 20px 0; 
              font-size: 18px; 
              font-weight: 600; 
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .contact-item { 
              display: flex; 
              align-items: center; 
              margin: 12px 0; 
            }
            .contact-icon { 
              background: #6b7192; 
              color: white; 
              width: 35px; 
              height: 35px; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin-right: 15px; 
              font-size: 16px; 
              flex-shrink: 0;
              box-shadow: 0 2px 8px rgba(107, 113, 146, 0.2);
            }
            .contact-text { 
              color: #333; 
              font-size: 15px; 
              font-weight: 500;
            }
            .signature { 
              background: linear-gradient(135deg, #6b7192 0%, #5d6386 100%); 
              color: white; 
              padding: 30px; 
              border-radius: 8px; 
              margin: 25px 0; 
              text-align: center; 
              box-shadow: 0 6px 20px rgba(107, 113, 146, 0.3);
            }
            .signature h3 { 
              margin: 0 0 10px 0; 
              font-size: 20px; 
              font-weight: 600;
            }
            .signature p { 
              margin: 0; 
              opacity: 0.95; 
              font-size: 16px; 
            }
            .company-info {
              background: #2f3552;
              color: white;
              padding: 25px;
              text-align: center;
              margin-top: 25px;
              box-shadow: 0 4px 15px rgba(47, 53, 82, 0.3);
            }
            .company-info p {
              margin: 8px 0;
              font-size: 14px;
              opacity: 0.9;
            }
            .footer { 
              background: #f8f9fa; 
              padding: 25px; 
              text-align: center; 
              border-top: 1px solid #e9ecef; 
            }
            @media (max-width: 600px) {
              .link-item { 
                flex-direction: column; 
                text-align: center; 
                gap: 15px;
              }
              .link-icon { 
                margin: 0; 
              }
              .content { 
                padding: 25px 20px; 
              }
              .header { 
                padding: 30px 20px; 
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Inquiry</h1>
              <p>We have received your message and look forward to assisting you</p>
            </div>
            
            <div class="content">
              <div class="welcome">
                <h2>Dear ${firstName} ${lastName}</h2>
                <p>Thank you for reaching out to Evmaria Services. We have received your inquiry and our dedicated team will review your message and respond within 24-48 hours.</p>
              </div>
              
              <div class="summary">
                <h3>Your Message Summary</h3>
                <div class="summary-item">
                  <strong>Program of Interest</strong>
                  <span>${program}</span>
                </div>
                <div class="summary-item">
                  <strong>Country</strong>
                  <span>${country}</span>
                </div>
                <div class="summary-item">
                  <strong>Your Message</strong>
                  <div class="message-box">
                    <div class="message-text">${message}</div>
                  </div>
                </div>
              </div>
              
              <div class="signature">
                <h3>Best regards</h3>
                <p>The Evmaria Services Team</p>
              </div>
            </div>
            
            <div class="company-info">
              <p><strong>Evmaria Services Ltd.</strong></p>
              <p>Educational activities and summer language camps</p>
              <p>15a Station Road, Epping, Essex, CM16 4HG, UK</p>
            </div>
            
            <div class="footer">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Evmaria Services Ltd. - Educational activities and summer language camps
              </p>
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
