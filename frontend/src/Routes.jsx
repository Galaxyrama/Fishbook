import { Route, Routes } from "react-router-dom"

//Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import UserPage from "./pages/UserPage"
import EditUserProfilePage from "./pages/EditUserProfilePage"
import RegistrationPage from "./pages/RegistrationPage"
import PageNotFound from "./pages/PageNotFound"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import AccountSetupPage from "./pages/AccountSetupPage"
import PostPage from "./pages/PostPage"
import CommentPage from "./pages/CommentPage"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/setup/:username" element={<AccountSetupPage />} />
      <Route path="/edit/:username" element={<EditUserProfilePage />} />
      <Route path="/:username/status/:id" element={<PostPage />} />
      <Route path="/:username/comment/:id" element={<CommentPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/profile/:username" element={<UserPage />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  )
}

export default AppRoutes