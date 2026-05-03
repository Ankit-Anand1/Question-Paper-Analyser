import './globals.css'

export const metadata = {
  title: 'SyllabusIQ — AI Exam Intelligence',
  description: 'Analyze past papers, predict important topics & get personalized study plans.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
