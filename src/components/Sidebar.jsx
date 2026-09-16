import { NavLink } from "react-router-dom";

function Sidebar() {

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "📊",
    },
    {
      path: "/products",
      label: "Products",
      icon: "📦",
    },
    {
      path: "/pricing",
      label: "Pricing",
      icon: "💰",
    },
    {
      path: "/demand-forecast",
      label: "Demand Forecast",
      icon: "📈",
    },
    {
      path: "/competitors",
      label: "Competitors",
      icon: "🏪",
    },
    {
      path: "/revenue",
      label: "Revenue",
      icon: "💵",
    },
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">

        <div className="brand-logo">
          P
        </div>

        <div>
          <h2>
            PricePilot AI
          </h2>

          <span>
            Revenue Intelligence
          </span>
        </div>

      </div>


      <nav className="sidebar-menu">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `menu-item ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="menu-icon">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>

          </NavLink>

        ))}

      </nav>


      <div className="ai-engine-card">

        <div className="ai-status-dot"></div>

        <div>

          <strong>
            AI Engine
          </strong>

          <span>
            Ready for analysis
          </span>

        </div>

      </div>


      <div className="sidebar-footer">

        <p>
          PricePilot AI
        </p>

        <span>
          Version 1.0
        </span>

      </div>

    </aside>
  );
}

export default Sidebar;