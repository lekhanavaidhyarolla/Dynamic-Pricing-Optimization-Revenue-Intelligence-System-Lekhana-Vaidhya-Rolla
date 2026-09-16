import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ==========================================
  // LOAD CURRENT USER
  // ==========================================

  useEffect(() => {
    const savedUser =
      localStorage.getItem("pp_current_user");

    if (savedUser) {
      try {
        setUser(
          JSON.parse(savedUser)
        );
      } catch (error) {
        console.error(
          "Error loading user:",
          error
        );

        localStorage.removeItem(
          "pp_current_user"
        );
      }
    }
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = (
    email,
    password
  ) => {
    const users = JSON.parse(
      localStorage.getItem(
        "pp_users"
      ) || "[]"
    );

    const existingUser =
      users.find(
        (item) =>
          item.email.toLowerCase() ===
            email.toLowerCase() &&
          item.password === password
      );

    if (!existingUser) {
      return {
        success: false,
        message:
          "Invalid email or password.",
      };
    }

    localStorage.setItem(
      "pp_current_user",
      JSON.stringify(
        existingUser
      )
    );

    setUser(
      existingUser
    );

    return {
      success: true,
    };
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = (
    name,
    email,
    password
  ) => {
    const users = JSON.parse(
      localStorage.getItem(
        "pp_users"
      ) || "[]"
    );

    // Check whether email already exists
    const existingUser =
      users.find(
        (item) =>
          item.email.toLowerCase() ===
          email.trim().toLowerCase()
      );

    if (existingUser) {
      return {
        success: false,
        message:
          "An account with this email already exists.",
      };
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      password: password,
    };

    // Add user to users array
    users.push(
      newUser
    );

    // Save all users
    localStorage.setItem(
      "pp_users",
      JSON.stringify(users)
    );

    // Save current logged-in user
    localStorage.setItem(
      "pp_current_user",
      JSON.stringify(newUser)
    );

    // Update React authentication state
    setUser(
      newUser
    );

    return {
      success: true,
    };
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem(
      "pp_current_user"
    );

    setUser(null);
  };

  // ==========================================
  // AUTH CONTEXT VALUE
  // ==========================================

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated:
      Boolean(user),
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// USE AUTH
// ==========================================

export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}