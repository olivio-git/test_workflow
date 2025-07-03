import { Route } from "react-router";
import { Routes } from "react-router";
import { routes } from "./navigation/Routes";

const App = () => {
  return (
    <Routes>
      {routes.map((route: any) => (
        <Route
          key={route.path}
          path={route.path}
          element={<route.component />}
        />
      ))}
    </Routes>
  );
};

export default App;
