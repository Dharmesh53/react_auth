import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import axios from "axios";

axios.defaults.withCredentials = true;

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const sendReq = async () => {
    const res = await axios.post("http://localhost:5000/api/logout", null, {
      withCredentials: true,
    });
    if (res.status == 200) {
      return res;
    }
    throw new Error("Unable to Logout");
  };
  const handleLogout = () => {
    sendReq().then(() => dispatch(logout()));
  };

  return (
    <div>
      <nav className="flex justify-between">
        <div>
          <Link to="/">Home</Link>
        </div>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
