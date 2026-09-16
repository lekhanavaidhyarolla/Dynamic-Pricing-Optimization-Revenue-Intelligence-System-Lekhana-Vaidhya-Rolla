import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

function Topbar() {

  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  const userName =
    user?.name ||
    "User";


  const handleLogout = () => {

    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };


  return (

    <header className="topbar">

      <div className="topbar-left">

        <div>

          <h3>
            Pricing Intelligence
          </h3>

          <p>
            Monitor pricing and
            revenue performance
          </p>

        </div>

      </div>


      <div className="topbar-right">

        <button className="notification-button">
          🔔
        </button>


        <div className="user-info">

          <div className="user-avatar">

            {userName
              .charAt(0)
              .toUpperCase()}

          </div>


          <div className="user-details">

            <strong>
              {userName}
            </strong>

            <span>
              Business User
            </span>

          </div>

        </div>


        <button
          className="logout-button"
          onClick={
            handleLogout
          }
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Topbar;