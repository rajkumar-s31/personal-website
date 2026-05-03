import { NavLink } from "react-router-dom";
import { profile } from "../data/profile";

export default function Navbar({ theme, onToggleTheme }) {
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
                    <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
                        Contact
                    </NavLink>
                </nav>

                <button type="button" className="btn" onClick={onToggleTheme} aria-label="Toggle theme">
                    {theme === "light" ? "Dark" : "Light"}
                </button>
            </div>
        </header>
    );
}
