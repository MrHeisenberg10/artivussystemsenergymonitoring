import { useState } from "react";
import { Login } from "./components/Login";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Devices } from "./components/Devices";
import { Analytics } from "./components/Analytics";
import { Alerts } from "./components/Alerts";
import { Sustainability } from "./components/Sustainability";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";

/* MARKER-MAKE-KIT-INVOKED */

type Page = "dashboard" | "devices" | "analytics" | "reports" | "alerts" | "sustainability" | "settings";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState<Page>("dashboard");

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":      return <Dashboard />;
      case "devices":        return <Devices />;
      case "analytics":      return <Analytics />;
      case "reports":        return <Reports />;
      case "alerts":         return <Alerts />;
      case "sustainability": return <Sustainability />;
      case "settings":       return <Settings />;
      default:               return <Dashboard />;
    }
  };

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      onLogout={() => setLoggedIn(false)}
    >
      {renderPage()}
    </Layout>
  );
}
