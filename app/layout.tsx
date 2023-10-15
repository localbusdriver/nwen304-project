import { Nunito } from 'next/font/google'

import Navbar from '@/app/components/navbar/Navbar';
import LoginModal from '@/app/components/modals/LoginModal';
import RegisterModal from '@/app/components/modals/RegisterModal';
import './globals.css'
import ClientOnly from './components/ClientOnly';
import getCurrentUser from './actions/getCurrentUser';

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb Clone',
}

const font = Nunito({ 
  subsets: ['latin'], 
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();
  return(
    <html lang="en">
      <body>{children}
          <ClientOnly>
            <LoginModal />
            <RegisterModal />
            <Navbar />
          </ClientOnly>
        {children}
      </body>
    </html>
  )
}
