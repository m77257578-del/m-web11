import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";

export default function Root() {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}
