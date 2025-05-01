import logo from "../assets/logo.png";

function Navbar() {
  return (
    <>
      <nav className="flex items-center w-full bg-gray-700 fixed top-0 z-50">
        <div className="ml-1 mt-1">
          <img className="w-15" src={logo} alt="logo" />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          Challenge ME
        </div>
      </nav>
    </>
  );
}

export default Navbar;
