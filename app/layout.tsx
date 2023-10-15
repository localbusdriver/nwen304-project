import ClientOnly from './components/ClientOnly'
import Navbar from './components/navbar/Navbar'
import './globals.css'
import { Nunito } from 'next/font/google'
import Modal from './components/modals/Modal'
import RegisterModal from './components/modals/RegisterModal'


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
          <ClientOnly>
            <RegisterModal />
            <Navbar />
          </ClientOnly>
        {children}
      </body>
    </html>
  )
}
