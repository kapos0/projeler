import Home from "./Home";
import Cuisine from "./Cuisine";
import Searched from "./Searched";
import Recipe from "./Recipe";
import Menu from "./Menu";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Favorites from "./Favorites";
import LoginRegister from "./LoginRegister";

export default function Pages() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/cuisine/:type" element={<Cuisine />} />
        <Route path="/searched/:search" element={<Searched />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/loginregister" element={<LoginRegister />} />
        <Route path="/recipe/:name" element={<Recipe />} />
      </Routes>
    </AnimatePresence>
  );
}
