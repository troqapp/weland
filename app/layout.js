import './globals.css'

export const metadata = {
  title: 'Weland - Your Digital Identity',
  description: 'Create your digital identity and join the virtual nation',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-white">
        {children}
      </body>
    </html>
  )
}
