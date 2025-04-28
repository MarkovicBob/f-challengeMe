import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <p>The page you are looking for, does not exist</p>
      <h2>404 Not Found</h2>
      <Link to="/">GO BACK</Link>
    </div>
  );
}

export default NotFound;
