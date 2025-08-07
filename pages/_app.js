import "@/styles/globals.css";
import "@fontsource/orbitron";
import "@fontsource/roboto-mono";
import { AuthProvider } from "@/lib/authContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
     
    </AuthProvider>
  );
}
