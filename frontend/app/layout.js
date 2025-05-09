import './globals.css'

export const metadata = {
  title: 'ERP Customer Feedback Summarizer',
  description: 'AI-powered customer feedback analysis tool',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}