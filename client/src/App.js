import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from './scenes/homePage';
import LoginPage from "./scenes/loginPage";
import ProfilePage from "./scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import ChatPage from "./scenes/chatPage/Message";
import EditUserDetails from "./scenes/editUserPage";
import Notification from "./scenes/notification/Notification";
import ReactivateAccountPage from "./scenes/reactivateAccountPage";
// import ScrapedContent from "./Scrapping/webScrappingPractice";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* <Route path="/" element={<ScrapedContent />} /> */}
            <Route path="/reactivateAccount" element={<ReactivateAccountPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route
              path="/chat/:userId"
              element={isAuth ? <ChatPage /> : <Navigate to="/" />}
            />
            <Route
              path="/notification/:userId"
              element={isAuth ? <Notification /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/editUserDetails"
              element={isAuth ? <EditUserDetails /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
