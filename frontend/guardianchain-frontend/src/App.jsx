import { HashRouter as Router } from "react-router-dom";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Success from "./pages/Success";
import Verify from "./pages/Verify";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import Footer from "./components/Footer";
import { setLanguage } from "./i18n";

function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Language Switch */}
        <div style={{ position: "absolute", top: 20, right: 20 }}>
          <button onClick={() => setLanguage("pt")} style={{ marginRight: "5px" }}>
            PT
          </button>
          <button onClick={() => setLanguage("en")}>
            EN
          </button>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<Success />} />
            <Route path="/verify/:hash" element={<Verify />} />

            {/* Legal Pages */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;