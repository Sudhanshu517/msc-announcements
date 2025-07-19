import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import AnnouncementsBoard from "./components/AnnouncementsBoard";

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return user ? <AnnouncementsBoard /> : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
