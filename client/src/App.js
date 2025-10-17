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
            path="/profile"
            element={
              <ProtectedPages>
                <Profile />
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
