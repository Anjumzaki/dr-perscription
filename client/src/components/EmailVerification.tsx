import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/auth/verify-email?token=${token}`
        );
        setStatus('success');
        setMessage(response.data.message);
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error.response?.data?.message || 'Email verification failed'
        );
      }
    };

    verifyEmail();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
        <div className="flex h-screen w-full items-center justify-center">
          <div className="w-full max-w-md p-8 text-center">
            <div className="inline-block text-primary mb-6">
              <svg
                className="h-16 w-16 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-light dark:text-text-dark">
              Verifying Your Email
            </h1>
            <p className="mt-2 text-sm text-placeholder-light dark:text-placeholder-dark">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="w-full max-w-md p-8 text-center">
          {/* Header with Logo */}
          <div className="mb-8">
            <div className="inline-block text-primary mb-6">
              {status === 'success' ? (
                <svg
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-primary text-white p-2 rounded-full">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-9h-3V7c0-.55-.45-1-1-1s-1 .45-1 1v4H8c-.55 0-1 .45-1 1s.45 1 1 1h3v4c0 .55.45 1 1 1s1-.45 1-1v-4h3c.55 0 1-.45 1-1s-.45-1-1-1z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-text-light dark:text-text-dark">
                MediConsult
              </h1>
            </div>
          </div>

          {/* Status Message */}
          <div
            className={`p-6 rounded-xl mb-8 ${
              status === 'success'
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
            }`}
          >
            <h2
              className={`text-xl font-bold mb-2 ${
                status === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}
            >
              {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
            </h2>
            <p
              className={`text-sm ${
                status === 'success'
                  ? 'text-green-600 dark:text-green-300'
                  : 'text-red-600 dark:text-red-300'
              }`}
            >
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {status === 'success' ? (
              <>
                <Link
                  to="/login"
                  className="block w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                >
                  Sign In to Your Account
                </Link>
                <Link
                  to="/dashboard"
                  className="block w-full py-3 px-4 bg-subtle-light dark:bg-subtle-dark hover:bg-subtle-light/80 dark:hover:bg-subtle-dark/80 text-text-light dark:text-text-dark font-semibold rounded-lg transition-colors"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <ResendVerificationButton />
                <Link
                  to="/register"
                  className="block w-full py-3 px-4 bg-subtle-light dark:bg-subtle-dark hover:bg-subtle-light/80 dark:hover:bg-subtle-dark/80 text-text-light dark:text-text-dark font-semibold rounded-lg transition-colors"
                >
                  Register Again
                </Link>
              </>
            )}
          </div>

          {/* Help Text */}
          <p className="mt-8 text-xs text-placeholder-light dark:text-placeholder-dark">
            Having trouble? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

// Component for resending verification email
const ResendVerificationButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const resendVerification = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/auth/resend-verification`,
        { email }
      );
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || 'Failed to resend verification email'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="email"
        placeholder="Enter your email to resend verification"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="form-input relative block w-full px-4 py-3 bg-subtle-light dark:bg-subtle-dark border border-transparent placeholder-placeholder-light dark:placeholder-placeholder-dark text-text-light dark:text-text-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary focus:z-10 text-sm"
      />
      <button
        onClick={resendVerification}
        disabled={loading}
        className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Resend Verification Email'}
      </button>
      {message && (
        <p className="text-xs text-center text-placeholder-light dark:text-placeholder-dark">
          {message}
        </p>
      )}
    </div>
  );
};

export default EmailVerification;
