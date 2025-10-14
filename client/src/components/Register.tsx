import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'doctor',
    licenseNumber: '',
    specialization: '',
    inviteCode: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      phone: value || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.phone) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization
      };
      
      const response = await axios.post('http://localhost:8000/api/auth/register', submitData);
      setSuccess('Registration successful! Please check your email to verify your account before logging in.');
      
      // Don't auto-login, let them verify email first
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-white p-2 rounded-full">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-9h-3V7c0-.55-.45-1-1-1s-1 .45-1 1v4H8c-.55 0-1 .45-1 1s.45 1 1 1h3v4c0 .55.45 1 1 1s1-.45 1-1v-4h3c.55 0 1-.45 1-1s-.45-1-1-1z"></path>
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-text-light dark:text-text-dark">MediConsult</h1>
              </div>
              <div className="flex items-center gap-6">
                <a className="text-sm font-medium text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors" href="#">
                  Home
                </a>
                <a className="text-sm font-medium text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors" href="#">
                  About
                </a>
                <a className="text-sm font-medium text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors" href="#">
                  Services
                </a>
                <a className="text-sm font-medium text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors" href="#">
                  Contact
                </a>
                <Link 
                  className="ml-4 px-4 py-2 bg-primary/20 dark:bg-primary/30 text-primary rounded-full text-sm font-semibold hover:bg-primary/30 dark:hover:bg-primary/40 transition-colors" 
                  to="/login"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 bg-background-light dark:bg-background-dark p-10 rounded-xl shadow-lg">
            <div>
              <h2 className="text-center text-3xl font-bold tracking-tight text-text-light dark:text-text-dark">
                Create your Doctor account
              </h2>
              <p className="mt-2 text-center text-sm text-placeholder-light dark:text-placeholder-dark">
                Join our network of healthcare professionals.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md space-y-4">
                <div>
                  <label className="sr-only" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="form-input relative block w-full px-4 py-3 bg-subtle-light dark:bg-subtle-dark border border-transparent placeholder-placeholder-light dark:placeholder-placeholder-dark text-text-light dark:text-text-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary focus:z-10 text-sm"
                    id="name"
                    name="name"
                    placeholder="Full Name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="sr-only" htmlFor="email">
                    Email address
                  </label>
                  <input
                    autoComplete="email"
                    className="form-input relative block w-full px-4 py-3 bg-subtle-light dark:bg-subtle-dark border border-transparent placeholder-placeholder-light dark:placeholder-placeholder-dark text-text-light dark:text-text-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary focus:z-10 text-sm"
                    id="email"
                    name="email"
                    placeholder="Email address"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="sr-only" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="phone-input-wrapper">
                    <PhoneInput
                      placeholder="Phone number with country code"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      defaultCountry="US"
                      international
                      countryCallingCodeEditable={false}
                      className="form-input relative block w-full px-4 py-3 bg-subtle-light dark:bg-subtle-dark border border-transparent placeholder-placeholder-light dark:placeholder-placeholder-dark text-text-light dark:text-text-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary focus:z-10 text-sm"
                      inputClassName="phone-number-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="sr-only" htmlFor="password">
                    Password
                  </label>
                  <input
                    autoComplete="new-password"
                    className="form-input relative block w-full px-4 py-3 bg-subtle-light dark:bg-subtle-dark border border-transparent placeholder-placeholder-light dark:placeholder-placeholder-dark text-text-light dark:text-text-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary focus:z-10 text-sm"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                    type="password"
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="sr-only" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    autoComplete="new-password"
                    className="form-input relative block w-full px-4 py-3 bg-subtle-light dark:bg-subtle-dark border border-transparent placeholder-placeholder-light dark:placeholder-placeholder-dark text-text-light dark:text-text-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary focus:z-10 text-sm"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="sr-only" htmlFor="licenseNumber">
                    License Number (Institution)
                  </label>
                  <input
                    className="form-input relative block w-full px-4 py-3 bg-subtle-light dark:bg-subtle-dark border border-transparent placeholder-placeholder-light dark:placeholder-placeholder-dark text-text-light dark:text-text-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary focus:z-10 text-sm"
                    id="licenseNumber"
                    name="licenseNumber"
                    placeholder="Your License Number"
                    required
                    type="text"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="sr-only" htmlFor="specialization">
                    Specialization
                  </label>
                  <input
                    className="form-input relative block w-full px-4 py-3 bg-subtle-light dark:bg-subtle-dark border border-transparent placeholder-placeholder-light dark:placeholder-placeholder-dark text-text-light dark:text-text-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary focus:z-10 text-sm"
                    id="specialization"
                    name="specialization"
                    placeholder="Your Specialization"
                    required
                    type="text"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="sr-only" htmlFor="inviteCode">
                    Invite Code
                  </label>
                  <input
                    className="form-input relative block w-full px-4 py-3 bg-subtle-light dark:bg-subtle-dark border border-transparent placeholder-placeholder-light dark:placeholder-placeholder-dark text-text-light dark:text-text-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary focus:z-10 text-sm"
                    id="inviteCode"
                    name="inviteCode"
                    placeholder="Invite Code (Optional)"
                    type="text"
                    value={formData.inviteCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 dark:text-green-400 text-sm text-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  {success}
                </div>
              )}

              <div>
                <button
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>

              <div className="text-sm text-center">
                <Link className="font-medium text-primary hover:text-primary/90" to="/login">
                  Already have an account? Login
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;