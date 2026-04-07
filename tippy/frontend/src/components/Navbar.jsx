import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav('/'); };

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">tippy<span>.mn</span></Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-ghost" style={{ fontSize: 14 }}>Dashboard</Link>
            <Link to="/settings" className="btn btn-ghost" style={{ fontSize: 14 }}>Тохиргоо</Link>
            <Link to={`/${user.username}`} className="btn btn-ghost" style={{ fontSize: 14 }}>Миний хуудас</Link>
            <button className="btn btn-outline" style={{ fontSize: 14 }} onClick={handleLogout}>Гарах</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost" style={{ fontSize: 14 }}>Нэвтрэх</Link>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: 14 }}>Бүртгүүлэх</Link>
          </>
        )}
      </div>
    </nav>
  );
}
