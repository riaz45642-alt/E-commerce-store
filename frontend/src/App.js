import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.css";

import { CartProvider } from "./context/CartContext";
import LandingPage from "./e-commerce-store/Landingpage";
import AuthOnboarding from "./e-commerce-store/Authonboarding";
import HomePage from "./e-commerce-store/Homepage";
import CategoryPage from "./e-commerce-store/Category";
import CheckDemo from "./e-commerce-store/CheckDemo";
import OffersPage from "./e-commerce-store/Offers";
import CartPage from "./e-commerce-store/Cart";
import PaymentPage from "./e-commerce-store/Payment";
import ProfilePage from "./e-commerce-store/Profile";
import SearchPage from "./e-commerce-store/Search";
import AdminPanel from "./e-commerce-store/AdminPanel";

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
      <CartProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/category/:name" element={<CategoryRoute />} />
          <Route path="/check-demo" element={<CheckDemoRoute />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
