# Poshak - Modern E-commerce Platform with Email Marketing

<div align="center">
  <h3>🛍️ A comprehensive e-commerce solution with integrated email marketing capabilities</h3>
  <p>Built with React, Vite, and Tailwind CSS for a modern shopping experience</p>
</div>

## 🌟 Overview

Poshak is a feature-rich e-commerce platform that combines modern shopping experiences with powerful email marketing tools. The platform offers a complete solution for online retail businesses, including product management, cart functionality, wishlist features, and comprehensive bulk email marketing capabilities.

## ✨ Key Features

### 🛒 E-commerce Core
- **Product Catalog**: Browse products with advanced filtering and categorization
- **Shopping Cart**: Add, remove, and manage products with persistent cart state
- **Wishlist**: Save favorite products for later purchase
- **Product Details**: Detailed product views with specifications and images
- **Collections**: Organized product collections for better navigation
- **User Authentication**: Secure login and user management

### 📧 Email Marketing System
- **Bulk Email Campaigns**: Send 1000-2000 emails per campaign
- **Professional Templates**: Pre-built templates for welcome, promotional, and newsletter emails
- **SMTP Integration**: Support for Gmail, Outlook, Yahoo, SendGrid, and AWS SES
- **Subscriber Management**: Import/export, segmentation, and bulk operations
- **Campaign Analytics**: Real-time tracking and performance metrics
- **Newsletter Subscription**: Integrated footer signup with auto-segmentation

### 🎨 Design & UX
- **Responsive Design**: Mobile-first approach with seamless device compatibility
- **Modern UI**: Clean, intuitive interface with consistent design system
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Component Architecture**: Reusable React components for maintainability

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Poshak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── email/           # Email marketing components
│   │   ├── AwsSesInfo.jsx
│   │   ├── AwsSesSetup.jsx
│   │   ├── CampaignCreator.jsx
│   │   ├── EmailDashboard.jsx
│   │   ├── EmailTemplateDesigner.jsx
│   │   ├── SmtpSetup.jsx
│   │   └── SubscriberManagement.jsx
│   ├── Filters.jsx      # Product filtering
│   ├── Footer.jsx       # Site footer with newsletter signup
│   ├── HeroBanner.jsx   # Homepage hero section
│   ├── Navbar.jsx       # Navigation header
│   ├── ProductCard.jsx  # Product display card
│   ├── Sidebar.jsx      # Mobile navigation sidebar
│   └── WishlistButton.jsx # Wishlist toggle button
├── contexts/            # React Context providers
│   ├── CartContext.jsx  # Shopping cart state
│   ├── EmailContext.jsx # Email marketing state
│   └── WishlistContext.jsx # Wishlist state
├── data/               # Static data and sample content
│   ├── categories.json
│   ├── products.json
│   ├── sample-subscribers.json
│   └── wishlist.json
├── pages/              # Page components
│   ├── Cart.jsx        # Shopping cart page
│   ├── Collection.jsx  # Product collection view
│   ├── EmailMarketing.jsx # Email marketing dashboard
│   ├── Home.jsx        # Homepage
│   ├── Login.jsx       # User authentication
│   ├── ProductDetails.jsx # Individual product view
│   └── Wishlist.jsx    # Saved products page
├── App.jsx             # Main application component
├── App.css             # Application styles
├── index.css           # Global styles
└── index.jsx           # Application entry point
```

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern UI library with latest features
- **Vite 7.1.7** - Fast build tool and development server
- **React Router Dom 7.9.1** - Client-side routing
- **Tailwind CSS 4.1.13** - Utility-first CSS framework

### Development Tools
- **ESLint** - Code linting and quality assurance
- **React Hooks** - Modern React patterns
- **Context API** - State management solution

### Email Marketing Integration
- **SMTP Support** - Multiple email provider compatibility
- **AWS SES Ready** - Enterprise-grade email delivery
- **Template Engine** - Dynamic email content generation

## 📧 Email Marketing Setup

### SMTP Configuration
1. Navigate to **Email Marketing → Settings**
2. Choose your email provider (Gmail, Outlook, SendGrid, etc.)
3. Enter SMTP credentials and test connection
4. Configure sender information

### Creating Campaigns
1. **Templates**: Choose from pre-built templates or create custom
2. **Audience**: Select subscribers or import CSV lists
3. **Campaign**: Set up campaign details and schedule
4. **Send**: Monitor real-time progress and analytics

### AWS SES Integration
For production email delivery, refer to `AWS_SES_INTEGRATION_GUIDE.md` for detailed setup instructions.

## 🎯 Key Capabilities

### E-commerce Features
- ✅ Product browsing and search
- ✅ Shopping cart with persistence
- ✅ Wishlist functionality
- ✅ User authentication
- ✅ Responsive design
- ✅ Category-based navigation

### Email Marketing Features
- ✅ Bulk email campaigns (1000-2000 emails)
- ✅ Professional email templates
- ✅ Subscriber management and segmentation
- ✅ SMTP configuration and testing
- ✅ Campaign analytics and tracking
- ✅ CSV import/export functionality
- ✅ Real-time progress monitoring
- ✅ Newsletter subscription integration

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- **Vercel**: Configured with `vercel.json`
- **Netlify**: Compatible with static site deployment
- **Traditional Hosting**: Standard static file hosting

### Environment Configuration
For production deployment, configure:
- Email service credentials (AWS SES, SendGrid, etc.)
- Domain verification for email sending
- SSL certificates for secure transactions

## 📖 Documentation

- **Email Marketing Guide**: `EMAIL_MARKETING_README.md`
- **AWS SES Setup**: `AWS_SES_INTEGRATION_GUIDE.md`
- **Component Documentation**: Inline code comments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Aditya Mishra**
- Email: mishraaditya3456@gmail.com
- LinkedIn: [iadii](https://www.linkedin.com/in/iadii)

## 🆘 Support

If you encounter any issues or have questions:
1. Check existing documentation in the repository
2. Review the email marketing setup guides
3. Create an issue with detailed description
4. Contact the developer for technical support

---

<div align="center">
  <p>Made with ❤️ for modern e-commerce experiences</p>
</div>
