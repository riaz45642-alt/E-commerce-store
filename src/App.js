import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.css";

import LandingPage from "./e-commerce-store/Landingpage";
import AuthOnboarding from "./e-commerce-store/Authonboarding";
import HomePage from "./e-commerce-store/Homepage";
import CategoryPage from "./e-commerce-store/Category";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category/:name" element={<CategoryRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
