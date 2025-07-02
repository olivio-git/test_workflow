import { Route } from "react-router";
import { Routes } from "react-router";
import { HomeScreen } from "./screens/HomeScreen";
import LoginScreen from "@/modules/auth/screens/LoginScreen";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen/>} />
    </Routes>
  );
};
  
export default App;
