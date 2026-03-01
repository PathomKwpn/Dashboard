import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import { routes } from "@/router/routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element()} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
