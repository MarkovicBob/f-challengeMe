import AdminPanel from "./AdminPanel";
import { useAuth } from "../Context/AuthProvider";

function Navbar() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <button onClick={logout}>LOGOUT</button>
          <AdminPanel />
        </>
      ) : (
        <button onClick={login}>LOGIN</button>
      )}
    </nav>
  );
}

export default Navbar;
