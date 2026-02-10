import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPrescriptions, deletePrescription } from '../../store/slices/prescriptionSlice';
import { Link } from 'react-router-dom';

const PrescriptionList: React.FC = () => {
  const [search, setSearch] = useState("");

  const dispatch = useAppDispatch();

  const {
    prescriptions,
    isLoading,
    error,
    total
  } = useAppSelector(state => state.prescriptions);


  useEffect(() => {
    // Initial load
    dispatch(fetchPrescriptions({}));
  }, [dispatch]);

  useEffect(() => {
    if (search) {
      const timeoutId = setTimeout(() => {
        dispatch(fetchPrescriptions({ search }));
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      dispatch(fetchPrescriptions({}));
    }
  }, [search, dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await dispatch(deletePrescription(id)).unwrap();
      } catch (err) {
        // handled by redux
      }
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Prescriptions
            </h1>

            <div className="w-32"></div>
          </div>



        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* STATUS */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Prescriptions
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Total: {total} prescriptions
              </p>
            </div>

            <Link
              to="/create-prescription"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              + Create Prescription
            </Link>
          </div>

        </div>
        {/* SEARCH BAR ROW */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, diagnosis, or prescription number..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />

            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2 text-sm text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading prescriptions...
            </div>

          ) : prescriptions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No prescriptions found.
            </div>

          ) : (

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Number
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Patient
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Diagnosis
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Date
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">

                  {prescriptions.map((prescription) => (

                    <tr
                      key={prescription.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary">
                          #{prescription.prescriptionNumber}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {prescription.patient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prescription.patient.age} years • {prescription.patient.gender}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {prescription?.diagnosis?.primaryDiagnosis || '—'}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(prescription.dateIssued).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Link
                          to={`/prescriptions/${prescription.id}`}
                          className="text-primary hover:text-primary/80 mr-3"
                        >
                          View
                        </Link>

                        <button
                          onClick={() => handleDelete(prescription.id)}
                          className="text-red-600 hover:text-red-500"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PrescriptionList;
