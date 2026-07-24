import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseProvider } from "@/components/SupabaseProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Anubandha | Luxury Gift Hampers & Meaningful Connections",
  description: "Premium, customized gift hampers for every occasion. Experience elegance and warmth with Anubandha.",
  metadataBase: new URL("https://Anubandha.com"),
  openGraph: {
    title: "Anubandha | Luxury Gift Hampers",
    description: "Premium, customized gift hampers for every occasion.",
    url: "https://Anubandha.com",
    siteName: "Anubandha",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anubandha | Luxury Gift Hampers",
    description: "Premium, customized gift hampers for every occasion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            {children}
            <CartDrawer />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
