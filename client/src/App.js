import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ProtectedPages from "./Components/ProtectedPages";
import Spinner from "./Components/Spinner";
import { useSelector } from "react-redux";
import Profile from "./Pages/Profile";
import Admin from "./Pages/Admin";
import ProductInfo from "./Pages/ProductInfo";

function App() {
  const { loading } = useSelector((state) => state.loaders);
  return (
    <div>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedPages>
                <Home />
              </ProtectedPages>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedPages>
                <ProductInfo />
              </ProtectedPages>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedPages>
                <Profile />
              </ProtectedPages>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedPages>
                <Admin />
              </ProtectedPages>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
