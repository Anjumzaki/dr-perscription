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

        
        </nav>
        <button
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
        </button>
      </div>

    </header>
  )
}

export default Header;
