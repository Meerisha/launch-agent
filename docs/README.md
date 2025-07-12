# LaunchPilot - AI Launch Consultant

Transform your raw idea into a revenue-generating product or course with AI-powered launch consulting.

## 🚀 Features

- **Market Analysis** - Comprehensive viability assessment and competitive landscape analysis
- **Revenue Forecasting** - Detailed financial projections with break-even analysis and scenario planning  
- **Launch Strategy** - Custom go-to-market roadmap with timeline and budget allocation
- **MCP Integration** - Powered by Model Context Protocol for seamless AI tool integration

## 📁 Project Structure

```
launch-planner-mcp/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and custom CSS utilities
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main LaunchPilot interface
├── tools/                 # MCP tools for launch consulting
│   ├── index.ts          # Tool exports
│   ├── project-intake.ts # Project analysis and recommendations
│   ├── revenue-calculator.ts # Financial projections and forecasting
│   └── launch-strategy.ts # Go-to-market strategy generator
├── scripts/              # Utility and testing scripts
│   ├── setup.sh         # Environment setup script
│   ├── generate-cursor-*.mjs # Cursor IDE integration
│   └── test-*.mjs       # Testing scripts for various components
├── lib/                  # Shared utilities
│   └── utils.ts         # Common utility functions
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── next.config.ts       # Next.js configuration
└── next-env.d.ts       # Next.js TypeScript definitions
```

## 🛠️ Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file with:
   ```
   TAVILY_API_KEY=your_tavily_api_key
   FIRECRAWL_API_KEY=your_firecrawl_api_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 MCP Tools

### Project Intake Analysis
- **Tool**: `project_intake_analysis`
- **Purpose**: Analyze project details and provide initial assessment
- **Output**: Market viability, resource assessment, risk factors, recommendations

### Revenue Calculator
- **Tool**: `calculate_revenue_projections`
- **Purpose**: Generate detailed financial projections and break-even analysis
- **Output**: Monthly breakdowns, scenarios, profitability metrics

### Launch Strategy Generator
- **Tool**: `generate_launch_strategy`
- **Purpose**: Create comprehensive go-to-market strategy
- **Output**: Timeline, budget allocation, channel prioritization, success metrics

## 🎯 Usage

1. Fill out the project intake form on the main page
2. Submit your project details
3. Receive AI-powered analysis including:
   - Market viability assessment
   - Financial projections
   - Complete launch strategy
   - Actionable recommendations

## 🔗 MCP Integration

LaunchPilot is designed to work seamlessly with MCP-compatible clients:
- **Claude Desktop**
- **Cursor IDE**
- **Other MCP-enabled applications**

## 📊 API Endpoints

- **MCP Endpoint**: `/mcp`
- **Tool Discovery**: Automatic via MCP protocol
- **Compatible**: OpenAI, Anthropic, and other major AI providers

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Other Platforms
```bash
npm run build
npm start
```

## 🛡️ Environment

- **Next.js 15.2.4**
- **React 19.1.0**
- **TypeScript 5.x**
- **Node.js 20.9.0+**

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**LaunchPilot** - Turn your ideas into revenue engines with AI-powered launch consulting. 