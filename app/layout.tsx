import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: { default: "Warhammer Paint Hub", template: "%s | Warhammer Paint Hub" },
  description: "Find cross-brand paint equivalents and browse step-by-step Warhammer 40k painting recipes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-iron-700 mt-16 py-8 text-center text-iron-400 text-sm">
          <p>Warhammer 40,000 is a trademark of Games Workshop Ltd. This is a fan project.</p>
        </footer>
      </body>
    </html>
  );
}
