const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
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
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission - ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 15px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
            .content { padding: 30px; }
            .section { background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 20px 0; border-left: 4px solid #667eea; }
            .section h3 { color: #667eea; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef; }
            .info-item strong { color: #667eea; display: block; margin-bottom: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-item span { color: #333; font-size: 16px; }
            .message-box { background: white; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .message-text { white-space: pre-wrap; line-height: 1.6; color: #333; font-size: 16px; }
            .preferences { display: flex; gap: 20px; }
            .preference-item { flex: 1; text-align: center; padding: 15px; border-radius: 8px; }
            .preference-yes { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .preference-no { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
            .timestamp { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .badge { display: inline-block; background: #667eea; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            @media (max-width: 600px) {
              .info-grid { grid-template-columns: 1fr; }
              .preferences { flex-direction: column; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Contact Form Submission</h1>
              <p>A new inquiry has been received from your website</p>
            </div>
            
            <div class="content">
              <div class="section">
                <h3>📋 Contact Information</h3>
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
                <h3>🎯 Program Interest</h3>
                <div class="info-item">
                  <strong>Selected Program</strong>
                  <span>${program}</span>
                </div>
              </div>
              
              <div class="section">
                <h3>💬 Message</h3>
                <div class="message-box">
                  <div class="message-text">${message}</div>
                </div>
              </div>
              
              <div class="section">
                <h3>⚙️ Preferences</h3>
                <div class="preferences">
                  <div class="preference-item ${newsletter ? 'preference-yes' : 'preference-no'}">
                    <strong>Newsletter Subscription</strong>
                    <div style="margin-top: 8px;">
                      <span class="badge">${newsletter ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div class="preference-item ${privacy ? 'preference-yes' : 'preference-no'}">
                    <strong>Privacy Policy</strong>
                    <div style="margin-top: 8px;">
                      <span class="badge">${privacy ? 'Accepted' : 'Not Accepted'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="timestamp">
                <strong>📅 Submission Time:</strong> ${new Date().toLocaleString()}
              </div>
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
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 15px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
            .content { padding: 30px; }
            .welcome { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
            .welcome h2 { margin: 0 0 10px 0; font-size: 24px; }
            .welcome p { margin: 0; opacity: 0.9; font-size: 16px; }
            .summary { background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 20px 0; border-left: 4px solid #667eea; }
            .summary h3 { color: #667eea; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; }
            .summary-item { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid #e9ecef; }
            .summary-item strong { color: #667eea; display: block; margin-bottom: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
            .summary-item span { color: #333; font-size: 16px; }
            .message-box { background: white; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .message-text { white-space: pre-wrap; line-height: 1.6; color: #333; font-size: 16px; }
            .links { background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 20px 0; }
            .links h3 { color: #667eea; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; }
            .link-item { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid #e9ecef; display: flex; align-items: center; }
            .link-icon { background: #667eea; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 18px; }
            .link-text { flex: 1; }
            .link-text h4 { margin: 0 0 5px 0; color: #333; font-size: 16px; }
            .link-text p { margin: 0; color: #666; font-size: 14px; }
            .link-button { background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .contact-info { background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 20px 0; border-left: 4px solid #28a745; }
            .contact-info h3 { color: #28a745; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; }
            .contact-item { display: flex; align-items: center; margin: 10px 0; }
            .contact-icon { background: #28a745; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 14px; }
            .contact-text { color: #333; font-size: 16px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
            .signature { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
            .signature h3 { margin: 0 0 10px 0; font-size: 20px; }
            .signature p { margin: 0; opacity: 0.9; font-size: 16px; }
            @media (max-width: 600px) {
              .link-item { flex-direction: column; text-align: center; }
              .link-icon { margin: 0 0 10px 0; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Thank You!</h1>
              <p>We've received your message and we're excited to help you</p>
            </div>
            
            <div class="content">
              <div class="welcome">
                <h2>Dear ${firstName} ${lastName}</h2>
                <p>Thank you for reaching out to Evmaria Services! We have received your message and our team will get back to you within 24-48 hours.</p>
              </div>
              
              <div class="summary">
                <h3>📋 Your Message Summary</h3>
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
              
              <div class="links">
                <h3>🔗 While You Wait</h3>
                <div class="link-item">
                  <div class="link-icon">🏕️</div>
                  <div class="link-text">
                    <h4>Explore Our Programs</h4>
                    <p>Discover our exciting summer language camps across the UK, Ireland, Malta, and Scotland</p>
                  </div>
                  <a href="#" class="link-button">View Programs</a>
                </div>
                <div class="link-item">
                  <div class="link-icon">⭐</div>
                  <div class="link-text">
                    <h4>Read Testimonials</h4>
                    <p>See what our previous participants have to say about their experiences</p>
                  </div>
                  <a href="#" class="link-button">Read Stories</a>
                </div>
                <div class="link-item">
                  <div class="link-icon">💡</div>
                  <div class="link-text">
                    <h4>Why Choose Evmaria</h4>
                    <p>Learn about our unique approach and what sets us apart from others</p>
                  </div>
                  <a href="#" class="link-button">Learn More</a>
                </div>
              </div>
              
              <div class="contact-info">
                <h3>📞 Need Immediate Help?</h3>
                <div class="contact-item">
                  <div class="contact-icon">📧</div>
                  <div class="contact-text">evmariaservises@gmail.com</div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">🌐</div>
                  <div class="contact-text">www.evmaria-services.co.uk</div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">📍</div>
                  <div class="contact-text">15a Station Road, Epping, Essex, CM16 4HG, UK</div>
                </div>
              </div>
              
              <div class="signature">
                <h3>Best regards</h3>
                <p>The Evmaria Services Team</p>
              </div>
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
