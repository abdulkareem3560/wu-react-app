import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Wizard from './pages/Wizard';
import LayoutLibrary from "./pages/LayoutLibrary";
import LayoutLibrary2 from "./pages/LayoutLibrary2";
import LayoutLibrary4 from "./pages/LayoutLibrary4";
import TemplateLibrary from "./pages/TemplateLibrary";
import TemplateLibrary2 from "./pages/TemplateLibrary2";
import TemplateLibrary3 from "./pages/TemplateLibrary3";
import GlobalAttributes from "./pages/GlobalAttributes";
import ResourceBundles from "./pages/ResourceBundles.jsx";
import ImageLibrary from "./pages/ImageLibrary.jsx";
import CSSLibrary from "./pages/CSSLibrary.jsx";

function App() {
  return (<Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/wizard" element={<Wizard/>}/>
      <Route path="/layout-library" element={<LayoutLibrary4/>}/>
      <Route path="/template-library" element={<TemplateLibrary/>}/>
      <Route path="/global-attributes" element={<GlobalAttributes/>}/>
      <Route path="/resource-bundles" element={<ResourceBundles/>}/>
      <Route path="/image-library" element={<ImageLibrary/>}/>
      <Route path="/css-library" element={<CSSLibrary/>}/>
    </Routes>
  </Router>);
}

export default App;