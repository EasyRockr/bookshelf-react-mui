import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppBarSite from "./components/AppBarSite";
import BrowseBooks from "./components/BrowseBooks";
import SurpriseMe from "./components/SurpriseMe";


function Trending() {
  return <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Trending Books Page</h2>;
}


function App() {
  return (
    <Router>
      <AppBarSite/>
      <Routes>
        <Route path="/" element={<Trending />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/browse" element={<BrowseBooks />} />
        <Route path="/random" element={<SurpriseMe />} />
      </Routes>
    </Router>
  );
}

export default App;
