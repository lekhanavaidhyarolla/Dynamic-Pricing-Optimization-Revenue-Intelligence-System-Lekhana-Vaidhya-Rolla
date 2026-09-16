import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Pricing from "./pages/Pricing";
import DemandForecast from "./pages/DemandForecast";
import Competitors from "./pages/Competitors";
import Revenue from "./pages/Revenue";


function App() {

  return (

    <BrowserRouter>

      <AuthProvider>

        <Routes>


          {/* DEFAULT ROUTE */}

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />


          {/* AUTH ROUTES */}

          <Route
            path="/login"
            element={
              <Login />
            }
          />


          <Route
            path="/register"
            element={
              <Register />
            }
          />



          {/* PROTECTED DASHBOARD ROUTES */}


          <Route
            path="/dashboard"
            element={

              <ProtectedRoute>

                <Dashboard />

              </ProtectedRoute>

            }
          />



          <Route
            path="/products"
            element={

              <ProtectedRoute>

                <Products />

              </ProtectedRoute>

            }
          />



          <Route
            path="/pricing"
            element={

              <ProtectedRoute>

                <Pricing />

              </ProtectedRoute>

            }
          />



          <Route
            path="/demand-forecast"
            element={

              <ProtectedRoute>

                <DemandForecast />

              </ProtectedRoute>

            }
          />



          <Route
            path="/competitors"
            element={

              <ProtectedRoute>

                <Competitors />

              </ProtectedRoute>

            }
          />



          <Route
            path="/revenue"
            element={

              <ProtectedRoute>

                <Revenue />

              </ProtectedRoute>

            }
          />



          {/* UNKNOWN ROUTES */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />


        </Routes>


      </AuthProvider>


    </BrowserRouter>

  );

}


export default App;