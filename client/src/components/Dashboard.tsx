import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalPatients: 0,
    consultationsToday: 0,
    pendingPrescriptions: 0
  });

  useEffect(() => {
    // In a real app, you'd fetch these stats from the API
    // For now, we'll use sample data
    setStats({
      totalPatients: 245,
      consultationsToday: 12,
      pendingPrescriptions: 3
    });
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <div className="flex min-h-screen w-full flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-primary/20 bg-background-light/80 px-10 py-3 backdrop-blur-sm dark:bg-background-dark/80">
          <div className="flex items-center gap-4">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
            </svg>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">MediConsult</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-gray-700 hover:bg-primary/20 dark:text-gray-300 dark:hover:bg-primary/30">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5v-12"/>
              </svg>
            </button>
            <div 
              className="h-10 w-10 rounded-full bg-cover bg-center cursor-pointer relative"
              onClick={handleLogout}
              title="Click to logout"
              style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%231193d4' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 13.5C14.8 13.3 14.6 13.1 14.3 13.1L13 14.4C12.8 14.6 12.5 14.6 12.3 14.4L10.5 12.6C10.1 12.2 9.5 12.2 9.1 12.6L3 18.7V21C3 21.6 3.4 22 4 22H20C20.6 22 21 21.6 21 21V9Z'/%3E%3C/svg%3E")`}}
            >
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-10 py-8">
          <div className="mx-auto max-w-7xl">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome, Dr. {user?.name || 'Doctor'}
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Manage your patients, consultations, and prescriptions efficiently.
              </p>
              {user?.specialization && (
                <p className="mt-1 text-sm text-primary font-medium">
                  {user.specialization} • License: {user.licenseNumber}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mb-10 flex flex-wrap gap-4">
              <Link
                to="/create-prescription"
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Add New Prescription
              </Link>
              <Link
                to="/patients"
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Manage Patients
              </Link>
            </div>

            {/* Quick Overview */}
            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Quick Overview</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-primary/20 bg-background-light p-6 shadow-sm dark:border-primary/30 dark:bg-background-dark">
                  <p className="text-base font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
                  <p className="mt-1 text-4xl font-bold text-gray-900 dark:text-white">{stats.totalPatients}</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-background-light p-6 shadow-sm dark:border-primary/30 dark:bg-background-dark">
                  <p className="text-base font-medium text-gray-600 dark:text-gray-400">Consultations Today</p>
                  <p className="mt-1 text-4xl font-bold text-gray-900 dark:text-white">{stats.consultationsToday}</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-background-light p-6 shadow-sm dark:border-primary/30 dark:bg-background-dark">
                  <p className="text-base font-medium text-gray-600 dark:text-gray-400">Pending Prescriptions</p>
                  <p className="mt-1 text-4xl font-bold text-primary">{stats.pendingPrescriptions}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-10">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  to="/prescriptions"
                  className="flex items-center gap-3 rounded-lg border border-primary/20 bg-background-light p-4 shadow-sm hover:bg-primary/5 dark:border-primary/30 dark:bg-background-dark dark:hover:bg-primary/10 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">View Prescriptions</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage existing prescriptions</p>
                  </div>
                </Link>

                <Link
                  to="/patients"
                  className="flex items-center gap-3 rounded-lg border border-primary/20 bg-background-light p-4 shadow-sm hover:bg-primary/5 dark:border-primary/30 dark:bg-background-dark dark:hover:bg-primary/10 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Patient Records</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage patient data</p>
                  </div>
                </Link>

                <button className="flex items-center gap-3 rounded-lg border border-primary/20 bg-background-light p-4 shadow-sm hover:bg-primary/5 dark:border-primary/30 dark:bg-background-dark dark:hover:bg-primary/10 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7h8M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Appointments</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Schedule & manage</p>
                  </div>
                </button>

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                    <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-300">Sign Out</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Logout securely</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;