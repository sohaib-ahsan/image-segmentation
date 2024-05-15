import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./NavBar";
import TrainModel from "./TrainModel";
import Home from "./Home";
import ImageSegmentation from "./ImageSegmentation";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Image-Segmentation" element={<ImageSegmentation />} />
          <Route path="/Train-Model" element={<TrainModel />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
