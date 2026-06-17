import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.css";

import LandingPage from "./e-commerce-store/Landingpage";
import AuthOnboarding from "./e-commerce-store/Authonboarding";
import HomePage from "./e-commerce-store/Homepage";
import CategoryPage from "./e-commerce-store/Category";
import CheckDemo from "./e-commerce-store/CheckDemo";

function Landing() {
  const navigate = useNavigate();
  return <LandingPage onGetStarted={() => navigate("/onboarding")} />;
}

function Onboarding() {
  const navigate = useNavigate();
  return <AuthOnboarding onComplete={() => navigate("/home")} />;
}

function Home() {
  const navigate = useNavigate();
  return (
    <HomePage
      onSelectCategory={(name) => navigate(`/category/${encodeURIComponent(name)}`)}
      onCheckDemo={() => navigate("/check-demo")}
    />
  );
}

function CategoryRoute() {
  const navigate = useNavigate();
  const { name } = useParams();
  return (
    <CategoryPage
      categoryName={decodeURIComponent(name)}
      onBack={() => navigate("/home")}
    />
  );
}

function CheckDemoRoute() {
  const navigate = useNavigate();
  return <CheckDemo onNavigate={(page) => navigate(page === "home" ? "/home" : "/")} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category/:name" element={<CategoryRoute />} />
        <Route path="/check-demo" element={<CheckDemoRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
