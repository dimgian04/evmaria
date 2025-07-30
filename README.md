# Evmaria Services - Summer Language Camps

A modern, responsive website for Evmaria Services, offering summer language camps and educational activities across the UK, Ireland, Malta, and Scotland.

## 🌟 Features

### Modern Design
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Interactive Elements**: Hover effects, smooth scrolling, and dynamic content
- **Beautiful Typography**: Using Inter font family for excellent readability

### Functionality
- **Contact Form**: Fully functional contact form with validation
- **Mobile Menu**: Responsive navigation with hamburger menu for mobile
- **Smooth Scrolling**: Anchor links with smooth scrolling behavior
- **Dropdown Navigation**: Interactive dropdown menus for program categories
- **Notification System**: User-friendly notifications for form submissions
- **Search Functionality**: Real-time search across website content

### Performance
- **Optimized Images**: Lazy loading for better performance
- **CSS Animations**: Hardware-accelerated animations
- **Minimal Dependencies**: Lightweight and fast loading
- **SEO Optimized**: Proper meta tags and semantic HTML

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd evmaria
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Build

1. **Install production dependencies**
   ```bash
   npm install --production
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
evmaria/
├── public/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   └── main.js           # JavaScript functionality
│   ├── images/               # Image assets
│   └── index.html            # Main HTML file
├── server.js                 # Express server
├── package.json              # Project dependencies
└── README.md                 # This file
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Secondary**: Dark blue (#2c3e50)
- **Accent**: Orange (#FFA500)
- **Neutral**: Grays (#f8f9fa, #666, #333)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately on all devices

### Components
- **Hero Section**: Full-screen landing with call-to-action
- **Program Cards**: Interactive cards for different camp locations
- **Feature List**: Detailed breakdown of included services
- **Testimonials**: Student feedback with author information
- **Contact Form**: Professional contact form with validation
- **Footer**: Comprehensive footer with links and social media

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1200px and above
- **Tablet**: 768px to 1199px
- **Mobile**: 320px to 767px

### Mobile Features
- Hamburger menu navigation
- Touch-friendly buttons and forms
- Optimized typography and spacing
- Swipe-friendly interactions

## 🔧 Customization

### Adding New Programs
1. Edit `public/index.html`
2. Add new program cards in the programs section
3. Update navigation dropdown menu
4. Add corresponding images to `public/images/`

### Styling Changes
1. Modify `public/css/style.css`
2. Update color variables at the top of the file
3. Adjust responsive breakpoints as needed

### JavaScript Functionality
1. Edit `public/js/main.js`
2. Add new interactive features
3. Extend existing functions as needed

## 📊 Performance Optimization

### Images
- Use WebP format when possible
- Implement lazy loading for images below the fold
- Optimize image sizes for different screen sizes

### CSS
- Minified for production
- Critical CSS inlined for faster rendering
- Unused CSS removed automatically

### JavaScript
- Modular code structure
- Event delegation for better performance
- Debounced scroll and resize handlers

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Safari**: 14+
- **Chrome Mobile**: 90+

## 📈 SEO Features

- Semantic HTML structure
- Proper heading hierarchy (H1-H6)
- Meta descriptions and titles
- Open Graph tags for social sharing
- Structured data markup
- Fast loading times
- Mobile-friendly design

## 🔒 Security

- Form validation on both client and server side
- XSS protection through proper input sanitization
- HTTPS ready (configure SSL certificate for production)
- Secure headers implementation

## 📞 Contact Information

**Evmaria Services Ltd.**
- **Address**: 15a Station Road, Epping, Essex, CM16 4HG, UK
- **Email**: evmariaservises@gmail.com
- **Website**: www.evmaria-services.co.uk

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Unsplash for placeholder images
- Modern CSS techniques and best practices

---

**Built with ❤️ for Evmaria Services** 