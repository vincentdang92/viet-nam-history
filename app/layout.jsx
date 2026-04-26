import './globals.css'

export const metadata = {
  title: 'Minh Chủ — Game Lịch Sử Việt Nam',
  description: 'Game mô phỏng lịch sử Việt Nam theo phong cách Reigns',
}

export const viewport = {
  themeColor: '#1A0F0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-tran-bg font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
