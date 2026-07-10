import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASIO Premium Network",
  description: "Built by Alternative Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* We moved the background color and text color directly onto the body tag! */}
      <body className="bg-zinc-950 text-zinc-50 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}