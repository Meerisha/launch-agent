import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "LaunchPilot - AI Launch Consultant",
  description: "Transform your raw idea into a revenue-generating product or course with AI-powered launch consulting",
  keywords: "AI launch consultant, product launch, course launch, startup strategy, revenue forecasting",
  authors: [{ name: "LaunchPilot AI" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
} 