import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcomepage from "./pages/WelcomePage/Welcomepage";
import Login from "./pages/Login/Login";
import Signin from "./pages/Signin/Signin";
import Homepage from "./pages/Homepage/Homepage";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./utils/PrivateRoute";
import ChooseInterest from "./pages/ChooseInterest/ChooseInterest";
import Recommendation from "./pages/Recommendation/Recommendation";
import CreatePost from "./components/CreatePost/CreatePost";
import CreateCommunity from "./components/CreateCommunity/CreateCommunity";
import UserProfile from "./components/UserProfile/UserProfile";
import Terms from "./components/TermsConditions/Terms";
import CommunityPage from "./components/CommunityPage/CommunityPage";
import PostPage from "./components/PostPage/PostPage";
import { ChatProvider } from "./context/ChatContext";
function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route exact path="/" element={<Homepage />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/chooseinterest" element={<ChooseInterest />} />
            <Route path="/recommendations" element={<Recommendation />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/create-community" element={<CreateCommunity />} />
            <Route path="/MyProfile" element={<UserProfile />} />
            <Route path="/community/:id" element={
              <ChatProvider>
                <CommunityPage />
              </ChatProvider>
            } />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/terms" element={<Terms />} />

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
export default App;
