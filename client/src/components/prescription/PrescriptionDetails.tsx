import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPrescriptionById, Prescription } from '../../store/slices/prescriptionSlice';

const PrescriptionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentPrescription, isLoading, error } = useAppSelector((state) => state.prescriptions);
  const prescription = currentPrescription;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchPrescriptionById(id));
    }
  }, [dispatch, id]);

  if (!prescription) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">Prescription not found.</p>
          <Link to="/prescriptions" className="text-primary font-medium hover:underline">
            Back to Prescriptions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-10">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Prescription #{prescription.prescriptionNumber}
        </h1>
        <Link
          to="/prescriptions"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-10 space-y-6">


        <div className="space-y-8">

          {/* PATIENT */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Patient Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <p>Name: {prescription.patient.name}</p>
              <p>Age: {prescription.patient.age}</p>
              <p>Gender: {prescription.patient.gender}</p>
              <p>Phone: {prescription.patient.phone}</p>
              {prescription.patient.email && <p>Email: {prescription.patient.email}</p>}
              {prescription.patient.address && <p>Address: {prescription.patient.address}</p>}
            </div>
          </section>


          {/* DOCTOR */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Doctor</h2>

            {typeof prescription.doctorId === "object" ? (
              <>
                <p>Name: {prescription.doctorId.name}</p>
                <p>Specialization: {prescription.doctorId.specialization}</p>
                <p>License: {prescription.doctorId.licenseNumber}</p>
              </>
            ) : (
              <p>Doctor ID: {prescription.doctorId}</p>
            )}
          </section>


          {/* DATES */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Dates</h2>
            <p>Issued: {new Date(prescription.dateIssued).toLocaleString()}</p>
            <p>Created: {new Date(prescription.createdAt).toLocaleString()}</p>
          </section>


          {/* DIAGNOSIS */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Diagnosis</h2>

            <p>Primary: {prescription.diagnosis.primaryDiagnosis}</p>
            {prescription.diagnosis.secondaryDiagnosis && (
              <p>Secondary: {prescription.diagnosis.secondaryDiagnosis}</p>
            )}

            <p>Duration: {prescription.diagnosis.duration}</p>
            <p>Severity: {prescription.diagnosis.severity}</p>

            <p className="mt-2 font-medium">Symptoms:</p>
            <ul className="list-disc ml-6">
              {prescription.diagnosis.symptoms.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>


          {/* VITALS */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Vitals</h2>

            <div className="grid sm:grid-cols-2 gap-3">
              {prescription.vitals.bloodPressure && <p>BP: {prescription.vitals.bloodPressure}</p>}
              {prescription.vitals.temperature && <p>Temp: {prescription.vitals.temperature}</p>}
              {prescription.vitals.heartRate && <p>HR: {prescription.vitals.heartRate}</p>}
              {prescription.vitals.weight && <p>Weight: {prescription.vitals.weight}</p>}
              {prescription.vitals.height && <p>Height: {prescription.vitals.height}</p>}
            </div>
          </section>


          {/* MEDICATIONS */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Medications</h2>

            {prescription.medications.map((med, idx) => (
              <div key={idx} className="border p-3 mb-2 rounded">
                <p className="font-medium">{med.name}</p>
                <p>Dosage: {med.dosage}</p>
                <p>Frequency: {med.frequency}</p>
                <p>Duration: {med.duration}</p>

                {med.instructions && <p>Instructions: {med.instructions}</p>}
              </div>
            ))}
          </section>


          {/* TESTS */}
          {/* <section>
  <h2 className="text-xl font-semibold mb-2">Tests</h2>

  <p className="font-medium">Ordered Tests:</p>
  <ul className="list-disc ml-6">
    {prescription.tests.orderedTests.map((t, i) => (
      <li key={i}>{t}</li>
    ))}
  </ul>

  {prescription.tests.labResults?.length > 0 && (
    <>
      <p className="font-medium mt-2">Lab Results:</p>
      <ul className="list-disc ml-6">
        {prescription.tests.labResults.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </>
  )}

  {prescription.tests.imagingResults?.length > 0 && (
    <>
      <p className="font-medium mt-2">Imaging Results:</p>
      <ul className="list-disc ml-6">
        {prescription.tests.imagingResults.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </>
  )}
</section> */}


          {/* LIFESTYLE */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Lifestyle</h2>

            <p className="font-medium">Diet:</p>
            <ul className="list-disc ml-6">
              {prescription.lifestyle.dietaryAdvice.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>

            <p className="font-medium mt-2">Exercise:</p>
            <ul className="list-disc ml-6">
              {prescription.lifestyle.exerciseRecommendations.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>

            <p className="mt-2">
              Follow Up: {prescription.lifestyle.followUpInstructions}
            </p>
          </section>


          {/* NOTES */}
          {prescription.notes && (
            <section>
              <h2 className="text-xl font-semibold mb-2">Doctor Notes</h2>
              <p>{prescription.notes}</p>
            </section>
          )}

        </div>

        {/* ============ END REPLACEMENT ============ */}


      </div>
    </div>
  );
};

export default PrescriptionDetails;
