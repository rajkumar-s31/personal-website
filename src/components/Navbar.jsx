import { NavLink, useNavigate } from "react-router-dom";
import { profile } from "../data/profile";
import { useAuth } from "../app/AuthContext";

export default function Navbar({ theme, onToggleTheme }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <header className="header">
            <div className="container headerRow">
                <div className="brand">
                    <span className="brandMark" aria-hidden="true">■</span>
                    <span className="brandName">{profile.name}</span>
                </div>

                <nav className="nav">
                    <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                        Home
                    </NavLink>
                    <NavLink to="/curricular" className={({ isActive }) => (isActive ? "active" : "")}>
                        Curricular
                    </NavLink>
                    <NavLink to="/co-curricular" className={({ isActive }) => (isActive ? "active" : "")}>
                        Co-Curricular
                    </NavLink>
                    <NavLink to="/extra-curricular" className={({ isActive }) => (isActive ? "active" : "")}>
                        Extra-Curricular
                    </NavLink>
                    <NavLink to="/budget" className={({ isActive }) => (isActive ? "active" : "")}>
                        Personal Budget
                    </NavLink>
                    <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
                        Contact
                    </NavLink>
                </nav>

                <div className="navActions">
                    {user ? (
                        <div className="navUser">
                            {user.picture && (
                                <img
                                    src={user.picture}
                                    alt={user.name || "User"}
                                    className="navAvatar"
                                    referrerPolicy="no-referrer"
                                />
                            )}
                            <span className="navUserName">{user.name || user.email}</span>
                            <button type="button" className="btn ghost small" onClick={handleLogout}>
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <NavLink to="/login" className="btn small">
                            Sign In
                        </NavLink>
                    )}
                    <button type="button" className="btn" onClick={onToggleTheme} aria-label="Toggle theme">
                        {theme === "light" ? "Dark" : "Light"}
                    </button>
                </div>
            </div>
        </header>
    );
}
