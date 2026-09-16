import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function DashboardLayout({ children }) {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();



  const handleLogout = () => {

    logout();

    navigate("/login");

  };



  const menuItems = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
    },

    {
      name: "Products",
      path: "/products",
      icon: "📦",
    },

    {
      name: "Pricing",
      path: "/pricing",
      icon: "💰",
    },

    {
      name: "Demand Forecast",
      path: "/demand-forecast",
      icon: "📈",
    },

    {
      name: "Competitors",
      path: "/competitors",
      icon: "🏪",
    },

    {
      name: "Revenue",
      path: "/revenue",
      icon: "💵",
    },

  ];



  return (

    <div className="dashboard-layout">


      {/* SIDEBAR */}

      <aside className="sidebar">


        <div className="sidebar-brand">


          <div className="brand-logo">

            P

          </div>


          <div className="brand-content">

            <h2>
              PricePilot AI
            </h2>


            <span>
              Revenue Intelligence
            </span>


          </div>


        </div>



        <nav className="sidebar-nav">


          <div className="nav-section-title">

            MAIN MENU

          </div>



          {
            menuItems.map(
              (item)=>(


                <NavLink

                  key={item.path}

                  to={item.path}

                  className={({isActive}) =>
                    isActive
                    ?
                    "nav-item active"
                    :
                    "nav-item"
                  }

                >


                  <span className="nav-icon">

                    {item.icon}

                  </span>



                  <span className="nav-label">

                    {item.name}

                  </span>


                </NavLink>


              )
            )
          }


        </nav>




        {/* SIDEBAR FOOTER */}


        <div className="sidebar-bottom">


          <div className="ai-status">


            <div className="status-indicator">

              <span className="status-dot"></span>

            </div>


            <div className="ai-status-content">


              <strong>

                AI Engine

              </strong>


              <span>

                Ready for analysis

              </span>


            </div>


          </div>





          <div className="sidebar-footer">


            <strong>

              PricePilot AI

            </strong>


            <span>

              Version 1.0

            </span>


          </div>


        </div>


      </aside>





      {/* MAIN CONTENT AREA */}


      <div className="main-area">


        <header className="topbar">


          <div className="topbar-heading">


            <span className="topbar-label">

              AI-POWERED BUSINESS INTELLIGENCE

            </span>



            <h3>

              Pricing Intelligence

            </h3>



            <p>

              Monitor pricing and revenue performance

            </p>


          </div>





          <div className="user-area">



            <div className="user-avatar">


              {
                (user?.name || "U")
                .charAt(0)
                .toUpperCase()
              }


            </div>




            <div className="user-info">


              <strong>

                {
                  user?.name ||
                  "Business User"
                }

              </strong>



              <span>

                {
                  user?.email ||
                  ""
                }

              </span>


            </div>





            <button

              className="logout-btn"

              type="button"

              onClick={handleLogout}

            >

              Logout

            </button>



          </div>



        </header>





        <main className="page-content">

          {children}

        </main>



      </div>



    </div>

  );

}


export default DashboardLayout;