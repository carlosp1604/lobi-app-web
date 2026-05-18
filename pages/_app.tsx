import "~/styles/globals.css";
import type { AppProps } from "next/app";
import AppNavbar from "~/components/Navbar/AppNavbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <AppNavbar/>
      <Component {...pageProps} />
    </div>);
}
