import "./globals.css";

export const metadata = {
  title: "CID Portal",
  description: "Criminal Investigations Division Management Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
