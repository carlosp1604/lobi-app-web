import "~/styles/globals.css";
import type { AppProps } from "next/app";
import AppNavbar from "~/components/Navbar/AppNavbar";
import AppFooter from "~/components/Footer/AppFooter";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <AppNavbar/>
      <Component {...pageProps} />
      <AppFooter/>
    </div>);
}
