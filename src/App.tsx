import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import AnnouncementsBoard from "./components/AnnouncementsBoard";
import { Toaster } from "react-hot-toast";

function Shell() {
  // Get `user` and `loading` from AuthContext
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 flex items-center justify-center">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 mx-4">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
          MSC MSIT Announcements Board
        </h1>

        {loading ? (
  <p className="text-center text-gray-500">Loading...</p>
) : user ? (
  <>
    <p className="text-center text-gray-600 mb-3">
      Welcome, <span className="font-semibold">{user.displayName}</span> 👋
    </p>
    <AnnouncementsBoard />
  </>
) : (
  <Login />
)}

      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
