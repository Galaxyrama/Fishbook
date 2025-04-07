import { Route, Routes } from "react-router-dom"

//Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import UserPage from "./pages/UserPage"
import RegistrationPage from "./pages/RegistrationPage"
import PageNotFound from "./pages/PageNotFound"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import AccountSetupPage from "./pages/AccountSetupPage"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/setup" element={<AccountSetupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/profile/:username" element={<UserPage />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  )
}

export default AppRoutes