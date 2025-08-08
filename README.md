# 🎮 Gamindom - Gaming Platform

A modern, responsive gaming platform built with Next.js 15, featuring game discovery, news, and community features.

## 🚀 Features

- **Game Discovery**: Browse latest, trending, and top-rated games
- **Advanced Search**: Search games by title, genre, and platform
- **Game Details**: Comprehensive game information with screenshots and reviews
- **Gaming News**: Latest gaming news and articles
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive UI**: Smooth animations and modern design patterns
- **Real-time Data**: Integration with RAWG Video Games Database API

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: RAWG Video Games Database
- **Development**: Turbopack for fast development

## 📁 Project Structure

```
gamindom/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── game/[id]/         # Individual game pages
│   │   ├── genre/[slug]/      # Genre-specific game listings
│   │   ├── platforms/[id]/    # Platform-specific game listings
│   │   ├── search/[query]/    # Search results pages
│   │   ├── news/              # News section
│   │   │   ├── [id]/         # Individual news articles
│   │   │   └── page.tsx      # News listing page
│   │   ├── latest/           # Latest games page
│   │   ├── trending/         # Trending games page
│   │   ├── top-rated/        # Top-rated games page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── not-found.tsx     # 404 page
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   ├── Header.tsx        # Navigation header
│   │   ├── LeftSideBar.tsx   # Circular floating menu
│   │   ├── RightSideBar.tsx  # Right sidebar content
│   │   ├── NewsHero.tsx      # Featured news carousel
│   │   ├── PlayerStats.tsx   # Player statistics widget
│   │   └── ...               # Other components
│   └── lib/                  # Utility functions and configurations
├── public/                   # Static assets
├── .env.local               # Environment variables
├── package.json             # Dependencies and scripts
└── README.md               # Project documentation
```

## 🌐 Available Routes

### Main Pages
- `/` - Homepage with featured content
- `/latest` - Latest games
- `/trending` - Trending games  
- `/top-rated` - Top-rated games
- `/news` - Gaming news hub

### Dynamic Routes
- `/game/[id]` - Individual game details
- `/genre/[slug]` - Games by genre
- `/platforms/[id]` - Games by platform
- `/search/[query]` - Search results
- `/news/[id]` - Individual news articles

### Special Pages
- `/not-found` - Custom 404 page

## 🎯 Key Components

### Navigation
- **Header**: Main navigation with search functionality
- **LeftSideBar**: Circular floating menu with smooth animations
- **RightSideBar**: Additional content and widgets

### Game Components
- **LatestGamesGrid**: Grid layout for latest games
- **TrendingGamesGrid**: Trending games display
- **TopRatedGamesGrid**: Top-rated games showcase
- **GameCard**: Individual game preview cards

### News Components
- **NewsHero**: Featured news carousel
- **NewsCategories**: News category navigation
- **NewsArticle**: Full article display
- **LatestNews**: Recent news sidebar

### UI Components
- **PlayerStats**: User statistics widget
- **Pagination**: Navigation for paginated content
- **PNGCarousel**: Image carousel component

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- RAWG API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/haider-9/GaminDom
   cd gamindom
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_RAWG_API_KEY=your_rawg_api_key_here
   NEXT_PUBLIC_RAWG_API_URL=https://api.rawg.io/api/games
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design Features

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

### Animations
- Smooth page transitions
- Interactive hover effects
- Loading animations
- Circular menu animations

### Color Scheme
- Dark theme optimized for gaming
- Custom CSS variables for consistent theming
- Gradient backgrounds and effects

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS 4 with custom configurations for:
- Custom color variables
- Animation utilities
- Responsive breakpoints
- Component-specific styles

### TypeScript
Fully typed components and API responses for better development experience and code reliability.

## 📱 Mobile Experience

- Circular floating menu adapts to mobile with single-item display
- Touch-optimized navigation
- Responsive grid layouts
- Mobile-specific UI patterns

## 🌟 Key Features Explained

### Menu Shortcut Hint (Landing Page)
- On first visit to the landing page, a contextual hint appears showing how to open the circular floating menu ("Press Cmd+M" on Mac or "Ctrl+M" on Windows/Linux).
- The hint is visually positioned with a curved arrow pointing to the menu trigger: above the menu button on mobile, and to the left of the menu button on desktop.
- The hint is shown only once per user (using localStorage) and will not reappear on subsequent visits or reloads.
- Implemented via the `MenuHintWithArrow` component.

### Circular Floating Menu
- Innovative navigation pattern
- Smooth rotation animations
- Context-aware positioning
- Mobile-adaptive behavior

### Game Discovery
- Multiple browsing options (latest, trending, top-rated)
- Genre and platform filtering
- Advanced search functionality
- Detailed game information

### News System
- Featured news carousel
- Category-based organization
- Full article reading experience
- Related articles suggestions

## 🚀 Deployment

The project is optimized for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [RAWG Video Games Database](https://rawg.io/apidocs) for game data
- [Lucide React](https://lucide.dev/) for icons
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Radix UI](https://www.radix-ui.com/) for accessible components

---

Built with ❤️ for the gaming community