import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "TripFlow BC | Roteiro Família em Balneário Camboriú",
  description:
    "Gerenciador completo e mobile-first do roteiro da viagem em família para Balneário Camboriú (26/11/2026 a 01/12/2026).",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#121212",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#121212] text-[#F3F4F6] min-h-screen antialiased selection:bg-[#008B8B] selection:text-white">
        <Toaster
          position="top-center"
          richColors
          closeButton
          theme="dark"
          toastOptions={{
            style: {
              background: "#1e1e1e",
              border: "1px solid #2e2e2e",
              color: "#F3F4F6",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}

