import React from 'react'
import { logout } from '../store/slices/authSlice';
import { useAppDispatch } from '../store/hooks';
import { useNavigate, NavLink } from 'react-router-dom';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-primary/20 px-10 py-3 flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center gap-4">
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
        </svg>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">MediConsult</h2>
      </div>



      <div className="flex items-center gap-4">
        {/* Navigation Links */}
        <nav className="flex gap-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-gray-700 dark:text-gray-300 font-medium hover:text-primary dark:hover:text-primary ${isActive ? 'text-primary dark:text-primary' : ''
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/patients"
            className={({ isActive }) =>
              `text-gray-700 dark:text-gray-300 font-medium hover:text-primary dark:hover:text-primary ${isActive ? 'text-primary dark:text-primary' : ''
              }`
            }
          >
            Patients
          </NavLink>

          <NavLink
            to="/prescriptions"
            className={({ isActive }) =>
              `text-gray-700 dark:text-gray-300 font-medium hover:text-primary dark:hover:text-primary ${isActive ? 'text-primary dark:text-primary' : ''
              }`
            }
          >
            Perscriptions
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `text-gray-700 dark:text-gray-300 font-medium hover:text-primary dark:hover:text-primary ${isActive ? 'text-primary dark:text-primary' : ''
              }`
            }
          >
            Reports
          </NavLink>
        </nav>
        <div
          className="h-10 w-10 rounded-full bg-cover bg-center cursor-pointer relative"
          onClick={handleLogout}
          title="Click to logout"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%231193d4' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 13.5C14.8 13.3 14.6 13.1 14.3 13.1L13 14.4C12.8 14.6 12.5 14.6 12.3 14.4L10.5 12.6C10.1 12.2 9.5 12.2 9.1 12.6L3 18.7V21C3 21.6 3.4 22 4 22H20C20.6 22 21 21.6 21 21V9Z'/%3E%3C/svg%3E")` }}
        >
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </div>

    </header>
  )
}

export default Header;
