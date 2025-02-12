import { Metadata } from "next";
import { SplashProvider } from "@/providers/SplashProvider";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";

export const metadata: Metadata = {
  title: "Course Archiver",
  description: "Course Archiver System"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SplashProvider>
          {children}
        </SplashProvider>
      </body>
    </html>
  );
}
