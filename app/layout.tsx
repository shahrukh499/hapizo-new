import type { Metadata } from "next";
import "./globals.css";
import '@splidejs/react-splide/css';
import { League_Spartan } from "next/font/google";
import ReactQueryProvider from "./ReactQueryProvider";
import Header from "./components/header/Header";
import { Providers } from "./redux/Provider";
import SnackbarProviderWrapper from "./components/snackbar/SnackbarProviderWrapper"
import SnackbarCustom from "./components/snackbar/SnackbarCustom"
import UserDetailsModal from "./components/profile/UserDetailsModal";
import Footer from "./components/footer/Footer";
import BottomNav from "./components/footer/BottomNavigation";

const leagueSpartan = League_Spartan({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Hapizo – Best Online Gift Shop for Every Occasion in India",
  description: "Discover amazing gifts at Hapizo! From personalized surprises to trending gift items, find the perfect gift for every occasion. Shop now for fast delivery, best prices, and secure checkout.",
  metadataBase: new URL(`https://www.hapizo.in/`),
  alternates: {
    canonical: `./`,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className={`${leagueSpartan.className} h-full antialiased`}>
        <ReactQueryProvider>
          <Providers>
            <SnackbarProviderWrapper>
              <SnackbarCustom />
              <Header />
              <main>{children}</main>
              <Footer />
              <BottomNav />
              <UserDetailsModal />
            </SnackbarProviderWrapper>
          </Providers>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
