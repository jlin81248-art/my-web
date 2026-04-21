import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OfferWise｜基于城市生活成本的真实购买力决策平台',
  description: '输入 offer 年包、工作时长和生活方式偏好，评估不同城市下的真实购买力、可支配收入和真实时薪。',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark:bg-gray-900">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
              if (e.matches) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            });
          })();
        `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} dark:bg-gray-900 dark:text-gray-200`}>
        {children}
      </body>
    </html>
  );
}
