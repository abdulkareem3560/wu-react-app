import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Admin from './pages/Admin';
import Wizard from './pages/Wizard';
import LayoutLibrary from "./pages/LayoutLibrary";
import TemplateLibrary from "./pages/TemplateLibrary";
import TemplateLibrary3 from "./pages/TemplateLibrary3";
import GlobalAttributes from "./pages/GlobalAttributes";
import ResourceBundles from "./pages/ResourceBundles.jsx";
import ImageLibrary from "./pages/ImageLibrary.jsx";
import CSSLibrary from "./pages/CSSLibrary.jsx";
import SavedReceipts from "./pages/SavedReceipts.jsx";
import ContentUser2 from "./pages/ContentUser2.jsx";

import Template1 from "./components/Template1.jsx";
import Template2 from "./components/Template2.jsx";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/admin", element: <Admin /> },
  { path: "/wizard", element: <Wizard /> },
  { path: "/layout-library", element: <LayoutLibrary /> },
  { path: "/template-library", element: <TemplateLibrary /> },
  { path: "/global-attributes", element: <GlobalAttributes /> },
  { path: "/resource-bundles", element: <ResourceBundles /> },
  { path: "/image-library", element: <ImageLibrary /> },
  { path: "/css-library", element: <CSSLibrary /> },
  { path: "/saved-receipts", element: <SavedReceipts /> },
  { path: "/content-user", element: <ContentUser2 /> },
  { path: "/template1", element: <Template1 /> },
  { path: "/template2", element: <Template2 /> }
];

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;