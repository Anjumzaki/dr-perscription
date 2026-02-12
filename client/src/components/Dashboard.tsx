import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const Dashboard: React.FC = () => {

  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalPatients: 0,
    consultationsToday: 0,
    newPatientsToday: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch patients to get total count and recent patients
        const patientsResp = await apiService.patients.getAll({ limit: 1000 });
        const totalPatients = patientsResp.data.total || 0;
        const patientsList = patientsResp.data.patients || [];

        // Fetch prescriptions (large limit) and compute today's consultations
        const prescriptionsResp = await apiService.prescriptions.getAll({ page: 1, limit: 1000 });
        const prescriptions = prescriptionsResp.data.prescriptions || [];

        const isSameDay = (d1: string | number | Date, d2: Date) => {
          const a = new Date(d1);
          return a.getFullYear() === d2.getFullYear() && a.getMonth() === d2.getMonth() && a.getDate() === d2.getDate();
        };

        const today = new Date();
        const consultationsToday = prescriptions.filter((p: any) => isSameDay(p.dateIssued || p.createdAt, today)).length;

        // New patients today
        const newPatientsToday = patientsList.filter((p: any) => isSameDay(p.createdAt, today)).length;

        setStats({ totalPatients, consultationsToday, newPatientsToday });
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);



  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <div className="flex min-h-screen w-full flex-col">


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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Prescription
              </Link>
              <Link
                to="/patients"
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                  <p className="mt-1 text-4xl font-bold text-gray-900 dark:text-white">{loading ? '—' : stats.totalPatients}</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-background-light p-6 shadow-sm dark:border-primary/30 dark:bg-background-dark">
                  <p className="text-base font-medium text-gray-600 dark:text-gray-400">Consultations Today</p>
                  <p className="mt-1 text-4xl font-bold text-gray-900 dark:text-white">{loading ? '—' : stats.consultationsToday}</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-background-light p-6 shadow-sm dark:border-primary/30 dark:bg-background-dark">
                  <p className="text-base font-medium text-gray-600 dark:text-gray-400">New Patients Today</p>
                  <p className="mt-1 text-4xl font-bold text-primary">{loading ? '—' : stats.newPatientsToday}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="mt-10">
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

                <Link to="/appointments" className="flex items-center gap-3 rounded-lg border border-primary/20 bg-background-light p-4 shadow-sm hover:bg-primary/5 dark:border-primary/30 dark:bg-background-dark dark:hover:bg-primary/10 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7h8M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Appointments</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Schedule & manage</p>
                  </div>
                </Link>

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
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;