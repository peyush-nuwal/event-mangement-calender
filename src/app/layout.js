import { Raleway } from "next/font/google";
import "./globals.css";


const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"], // Adjust weights as needed
});

export const metadata = {
  title: "Gotu Calendar",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
