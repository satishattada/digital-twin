# Digital Twin Store Management Application

A modern React TypeScript application for store management with planogram compliance tracking, inventory management, and AI-powered insights.

## Features

- **Dual Persona Interface**: Store Manager and Operations Manager dashboards
- **Planogram Compliance Tracking**: Real-time monitoring of shelf layouts vs expected configurations
- **AI-Powered Recommendations**: Intelligent suggestions for inventory optimization
- **Real-time Insights**: Actionable insights for store operations
- **Task Management**: Integrated task queue with priority management
- **Inventory Tracking**: Comprehensive inventory movement and shelf status monitoring

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling
- **ESLint** for code linting
- **Modern ES modules** with proper TypeScript configurations

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd digital-twin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
digital-twin/
├── components/           # React components
│   ├── Header.tsx
│   ├── StoreManagerDashboard.tsx
│   ├── OperationsManagerDashboard.tsx
│   ├── PlanogramTracker.tsx
│   └── ...
├── types.ts             # TypeScript type definitions
├── constants.ts         # Application constants and mock data
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── index.html          # HTML template
├── index.css           # Tailwind CSS imports
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Dependencies and scripts
```

## Key Components

### Store Manager Dashboard
- Planogram compliance tracking
- KPI monitoring
- AI recommendations
- Task management

### Operations Manager Dashboard
- Multi-store inventory overview
- Shelf space utilization
- Purchase order management
- Operational alerts and insights

### Planogram Tracker
- Side-by-side comparison of current vs AI-optimized layouts
- Real-time compliance scoring
- Visual shelf representations

## Development Guidelines

- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error boundaries
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Maintain component modularity

## Contributing

1. Ensure all TypeScript types are properly defined
2. Follow the existing code style and patterns
3. Add proper error handling
4. Test components thoroughly
5. Update documentation as needed

## License

[Add your license information here]
