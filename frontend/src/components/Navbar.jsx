import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav className="flex justify-between">
        <div>
          <Link to="/">Home</Link>
        </div>
        {/* <div>
          <Link to="/dashboard">Dashboard</Link>
        </div> */}
        <div className="flex gap-4">
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
