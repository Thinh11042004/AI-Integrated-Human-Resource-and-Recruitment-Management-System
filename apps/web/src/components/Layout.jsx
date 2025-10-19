import { useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/jobs', label: 'Jobs', roles: ['ADMIN', 'HR', 'CANDIDATE'] },
  { to: '/applications', label: 'Applications', roles: ['ADMIN', 'HR', 'CANDIDATE'] },
  { to: '/profile', label: 'Profile', roles: ['CANDIDATE'] },
  { to: '/admin/users', label: 'Admin', roles: ['ADMIN'] }
];

const Layout = () => {
  const { logout, fetchMe, token } = useAuth();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (token) {
      fetchMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Link to="/jobs">AI HRMS</Link>
        </div>
        <nav>
          <ul>
            {navItems
              .filter((item) => !user || item.roles.includes(user.role))
              .map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      clsx('nav-link', isActive && 'active')
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
          </ul>
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <div>
            <h1 className="title">Talent Intelligence Control Center</h1>
            <p className="subtitle">Monitor hiring pipeline, AI insights and workforce performance</p>
          </div>
          <div className="user-area">
            {user && (
              <div className="user-info">
                <span className="user-name">{user.fullName || user.email}</span>
                <span className="user-role">{user.role}</span>
              </div>
            )}
            <button className="btn-outline" onClick={logout}>
              Sign out
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;