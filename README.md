<div align="center">

# 🚀 Cyberline API Documentation

<img src="https://cyberlineapi.vercel.app/favicon.ico" alt="Cyberline Logo" width="120" height="120" style="border-radius: 15px; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);">

### *Navigating the Digital Frontier*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-red?style=for-the-badge&logo=vercel)](https:/docs.gishankrishka.dev/)
[![API Status](https://img.shields.io/badge/📡_API-Live-green?style=for-the-badge&logo=api)](https://api.gishankrishka.dev/)
[![Real-time](https://img.shields.io/badge/⚡_Updates-Real--time-orange?style=for-the-badge&logo=lightning)](https://docs.gishankrishka.dev)

---

**Professional, real-time API documentation with interactive testing capabilities and beautiful dark theme design.**

</div>

## ✨ Features

### 🎯 **Core Functionality**
- **Real-time Documentation** - Auto-updates every 30 seconds
- **Interactive API Testing** - Test endpoints directly in the browser
- **Smart Search & Filtering** - Find endpoints by method, path, or description
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Dark Theme** - Easy on the eyes with CyberLine aesthetic

### 🛠️ **Technical Excellence**
- **OpenAPI 3.0 Support** - Automatic spec parsing and transformation
- **Multiple Response Types** - JSON, Images, HTML, XML, CSV, Binary files
- **Download & Preview** - View responses inline or download files
- **Error Handling** - Graceful fallbacks and retry mechanisms
- **Performance Optimized** - Fast loading with efficient caching

### 🎨 **Design Features**
- **Modern UI/UX** - Clean, professional interface
- **Smooth Animations** - Subtle micro-interactions
- **Accessibility** - WCAG compliant design
- **Mobile-First** - Responsive across all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cyberline-api-docs.git

# Navigate to project directory
cd cyberline-api-docs

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

Update the API endpoint in `src/App.tsx`:

```typescript
const API_DOCS_URL = 'https://your-api.com/openapi.json';
```

## 📖 Usage

### 🔍 **Search & Filter**
- Use the search bar to find specific endpoints
- Filter by HTTP method (GET, POST, PUT, DELETE, etc.)
- Search through parameters and descriptions

### 🧪 **Interactive Testing**
1. Click "Try Now" on any endpoint
2. Fill in required parameters
3. Click "Execute" to test the API
4. View formatted responses with syntax highlighting

### 📱 **Mobile Experience**
- Fully responsive design
- Touch-friendly interface
- Optimized for mobile testing

## 🛡️ API Specification

This documentation automatically parses OpenAPI 3.0 specifications and supports:

- **Path Parameters** - Dynamic URL segments
- **Query Parameters** - URL query strings  
- **Request Bodies** - JSON payloads for POST/PUT requests
- **Response Schemas** - Detailed response structures
- **Authentication** - Bearer tokens and API keys
- **Examples** - Sample requests and responses

## 🎨 Customization

### Theme Colors
The design uses a sophisticated dark theme with red accents:

```css
/* Primary Colors */
--bg-primary: from-gray-900 via-black to-gray-900
--accent-red: #ef4444
--text-primary: #ffffff
--text-secondary: #9ca3af
```

### Logo & Branding
Replace the logo by updating the image source in `src/components/Header.tsx`:

```typescript
<img 
  src="your-logo-url.png" 
  alt="Your Logo" 
  className="w-8 h-8 sm:w-10 sm:h-10 rounded-md"
/>
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Header.tsx      # Main header with branding
│   ├── SearchBar.tsx   # Search and filter functionality
│   ├── EndpointCard.tsx # Individual endpoint display
│   ├── TryNowPanel.tsx # Interactive testing panel
│   └── CodeBlock.tsx   # Syntax highlighted code display
├── hooks/              # Custom React hooks
│   └── useApiDocs.ts   # API documentation fetching logic
├── types/              # TypeScript type definitions
│   └── api.ts          # API-related types
└── App.tsx             # Main application component
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Add proper error handling
- Include JSDoc comments for functions
- Test on multiple devices and browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAPI Initiative** - For the OpenAPI specification standard
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide React** - For the beautiful icon library
- **Vite** - For the fast build tool and development server

---

<div align="center">

### 🌟 **Powered by CyberLine**

<img src="https://cyberlineapi.vercel.app/favicon.ico" alt="Cyberline" width="32" height="32" style="border-radius: 6px;">

**Experience the power of innovative technology that enhances your development workflow**

[![Telegram](https://img.shields.io/badge/Telegram-@Cyberline__Official-blue?style=flat-square&logo=telegram)](https://t.me/Cyberline_Official)
[![Developer](https://img.shields.io/badge/Developer-@KrishDev-red?style=flat-square&logo=telegram)](https://t.me/KrishDev)

---

**© 2025 [Gishan Krishka](https://t.me/KrishDev) • Built with ❤️ for the developer community**

*Navigating the Digital Frontier, One API at a Time*

</div>
