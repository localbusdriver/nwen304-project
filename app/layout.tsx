import Navbar from './components/navbar/Navbar'
import './globals.css'
import { Nunito } from 'next/font/google'


export const metadata = {
  title: "NwenBnb",
  description:"james La",
}

const font=Nunito({
  subsets: ["latin"],
})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return(
    <html lang="en">
    <body>{children}
    <Navbar />
    </body>
    </html>
  )
}
