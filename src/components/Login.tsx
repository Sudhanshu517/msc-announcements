
import { signInWithGoogle, logout } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">MSC MSIT Announcements Board</h1>
      {user ? (
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default Login;
