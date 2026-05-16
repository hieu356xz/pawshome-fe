import type { Metadata } from "next";
import { Playfair_Display, Lato, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AuthProvider } from "@/providers/AuthContext";
import { ToastProvider } from "@/components/ui/toast";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "PawsHome - Your Trusted Pet Companion",
  description:
    "A warm and inviting place for pet adoption, blog posts, and community support.",
};

const locales = ["en", "vi"];

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <body 
        suppressHydrationWarning
        className={cn(
          "min-h-full flex flex-col antialiased",
          playfair.variable,
          lato.variable,
          geist.variable,
          "font-sans"
        )}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
