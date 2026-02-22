import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Roue de la Fortune - Dangote',
  description: 'Projet Dangote pour les campagnes marketing et stratégie de marque',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gradient-to-br from-orange-50 to-orange-100">
        {children}
      </body>
    </html>
  );
}
