# Contact Form Setup Guide

## Overview
The contact form is now fully functional with email sending capabilities. It includes:
- Real-time form validation
- Email notifications to EVMaria Services
- Confirmation emails to users
- Enhanced UI/UX with loading states and animations

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email Settings
Create a `.env` file in the root directory with the following variables:

```env
# Email Configuration for Contact Form
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
```

### 3. Gmail App Password Setup
To send emails, you need to set up a Gmail App Password:

1. Go to your Google Account settings (https://myaccount.google.com/)
2. Enable 2-factor authentication if not already enabled
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Use this app password in your `.env` file (not your regular Gmail password)

### 4. Start the Server
```bash
npm start
```

## Features

### Form Validation
- **Required Fields**: First Name, Last Name, Email, Country, Program, Message, Privacy Policy
- **Email Validation**: Ensures valid email format
- **Phone Validation**: Optional but validates format if provided
- **Real-time Feedback**: Shows errors as users type

### Email Notifications
- **Admin Notification**: Detailed email sent to EVMaria Services with all form data
- **User Confirmation**: Professional confirmation email sent to the user
- **HTML Templates**: Beautiful, branded email templates

### User Experience
- **Loading States**: Button shows "Sending..." during submission
- **Success Messages**: Clear feedback when form is submitted successfully
- **Error Handling**: Graceful error messages if something goes wrong
- **Responsive Design**: Works perfectly on all devices

### Security Features
- **Input Sanitization**: All inputs are validated and sanitized
- **CSRF Protection**: Built-in protection against cross-site request forgery
- **Rate Limiting**: Prevents spam submissions

## Email Templates

### Admin Notification Email
- Professional layout with EVMaria branding
- Organized sections for contact info, program interest, and message
- Includes submission timestamp and user preferences

### User Confirmation Email
- Welcoming message with user's name
- Summary of their submission
- Links to relevant pages on the website
- Contact information for urgent questions

## Customization

### Email Templates
Edit the email templates in `server.js`:
- Lines 50-90: Admin notification template
- Lines 95-140: User confirmation template

### Form Fields
Add or modify form fields in `contact.html`:
- Update the form structure
- Add corresponding validation in `main.js`
- Update email templates to include new fields

### Styling
Customize form appearance in `style.css`:
- Form validation styles (lines 2070-2150)
- Enhanced form styling (lines 2155-2200)
- Responsive design (lines 2205-2220)

## Troubleshooting

### Email Not Sending
1. Check your `.env` file has correct credentials
2. Ensure 2-factor authentication is enabled on Gmail
3. Verify the app password is correct
4. Check server logs for error messages

### Form Not Working
1. Ensure all dependencies are installed
2. Check browser console for JavaScript errors
3. Verify the server is running on the correct port
4. Test the `/api/contact` endpoint directly

### Styling Issues
1. Clear browser cache
2. Check CSS file is loading correctly
3. Verify responsive breakpoints work on your device

## Production Deployment

### Environment Variables
Set up environment variables on your hosting platform:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your Gmail app password
- `PORT`: Server port (optional)

### Security Considerations
- Use HTTPS in production
- Consider adding rate limiting
- Monitor for spam submissions
- Regularly update dependencies

## Support
For technical support or customization requests, contact the development team. 