# 🗂️ LaunchPilot Project Structure

This document outlines the organized structure of the LaunchPilot project for better maintainability and development experience.

## 📁 Directory Organization

### **Root Level**
```
launch-planner-mcp/
├── app/                    # Next.js app directory
├── docs/                   # Documentation (organized by topic)
├── lib/                    # Shared utilities and configurations  
├── tools/                  # MCP tools (organized by category)
├── scripts/                # Build and setup scripts
├── types/                  # TypeScript type definitions
└── [config files]          # Package.json, tsconfig, etc.
```

### **App Components** (`app/components/`)
Organized by functionality for better maintainability:

```
app/components/
├── auth/                   # Authentication components
│   ├── AuthButton.tsx
│   └── index.ts
├── ui/                     # Reusable UI components
│   ├── ShareButtons.tsx  
│   └── index.ts
├── features/               # Main feature components
│   ├── ChatInterface.tsx
│   ├── EnhancedFinancialCalculator.tsx
│   ├── InstagramImageGenerator.tsx
│   ├── MetricsDashboard.tsx
│   ├── ReportGenerator.tsx
│   └── index.ts
├── project/                # Project management components
│   ├── ProjectHistory.tsx
│   ├── SampleProjectSelector.tsx
│   ├── SaveProjectButton.tsx
│   └── index.ts
└── index.ts                # Main component exports
```

### **MCP Tools** (`tools/`)
Categorized by business function:

```
tools/
├── analysis/               # Competitive & market analysis
│   ├── competitive-intelligence.ts
│   └── index.ts
├── financial/              # Financial calculations & projections
│   ├── revenue-calculator.ts
│   └── index.ts
├── marketing/              # Marketing & social media tools
│   ├── social-media-strategy.ts
│   ├── instagram-image-generator.ts
│   └── index.ts
├── strategy/               # Business strategy & planning
│   ├── project-intake.ts
│   ├── launch-strategy.ts
│   └── index.ts
└── index.ts                # Main tool exports
```

### **Documentation** (`docs/`)
Organized by topic for easy navigation:

```
docs/
├── setup/                  # Setup & deployment guides
│   ├── AUTH_SETUP.md
│   ├── RAG_SETUP.md
│   ├── VERCEL_DEPLOYMENT.md
│   ├── deploy.sh
│   └── setup.sh
├── features/               # Feature documentation
│   ├── README_CHAT.md
│   ├── README_REPORTS.md
│   └── README_SAMPLES.md
├── development/            # Development guides
│   ├── PROJECT_STRUCTURE.md
│   ├── AUTHENTICATION_IMPLEMENTATION.md
│   ├── README_STRUCTURE.md
│   └── MISSING_FEATURES.md
└── README.md               # Main documentation index
```

### **Library** (`lib/`)
Shared utilities and configurations:

```
lib/
├── auth.ts                 # Authentication configuration
├── database.sql            # Database schema
├── supabase_setup.sql      # Supabase setup scripts
├── rag.ts                  # RAG functionality
├── knowledge-seeder.ts     # Knowledge base seeding
├── supabase.ts             # Supabase client
├── redis.ts                # Redis configuration
├── report-generator.ts     # Report generation logic
├── sample-projects.ts      # Sample project data
└── utils.ts                # General utilities
```

## 🎯 Benefits of This Organization

### **Better Maintainability**
- Related files are grouped together
- Easy to find specific functionality
- Clear separation of concerns

### **Improved Developer Experience**
- Logical file organization
- Index files for clean imports
- Self-documenting structure

### **Scalability**
- Easy to add new components/tools to appropriate categories
- Clear patterns for new developers
- Modular architecture

## 📝 Import Patterns

### **Components**
```typescript
// Option 1: Direct import
import ChatInterface from '@/app/components/features/ChatInterface'

// Option 2: Category import
import { ChatInterface } from '@/app/components/features'

// Option 3: Main index import
import { ChatInterface } from '@/app/components'
```

### **Tools**
```typescript
// Option 1: Direct import
import { revenueCalculatorTool } from '@/tools/financial/revenue-calculator'

// Option 2: Category import  
import { revenueCalculatorTool } from '@/tools/financial'

// Option 3: Main index import
import { revenueCalculatorTool } from '@/tools'
```

## 🔄 Migration Notes

All imports have been updated to reflect the new structure. The organization maintains backward compatibility through index files while providing cleaner, more maintainable code organization.

---

*This structure follows modern React/Next.js best practices and scales well as the project grows.* 