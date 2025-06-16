"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';


const OwnerVisitsPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/Docter/GetCompletedVisits/${id}`);
        if (response.data.data && response.data.data.length > 0) {
          setVisits(response.data.data);
          setOwnerInfo(response.data.data[0].createdBy);
        } else {
          setError('No completed visits found');
        }
      } catch (err) {
        console.error('Error fetching visits:', err);
        setError('Failed to fetch visits data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVisits();
    }
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Owner Information Header */}
        {ownerInfo && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {ownerInfo.ownerName || 'Owner Name Not Available'}
                </h1>
                <p className="text-gray-600 mt-1">
                  Dairy: {ownerInfo.dairyName || 'N/A'}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Back to List
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visits List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Today's Completed Visits ({visits.length})
          </h2>

          {visits.map((visit) => (
            <div key={visit._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Visit Header */}
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {visit.username || 'N/A'}
                    </h3>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                     Completed
                  </span>
                </div>
              </div>

              {/* Visit Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Visit Date</h4>
                        <p className="text-gray-800">
                          {new Date(visit.date).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Location</h4>
                        <p className="text-gray-800">
                          {visit.village}, {visit.tahasil}, {visit.district}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Animal Type</h4>
                        <p className="text-gray-800">{visit.AnimalType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Disease</h4>
                        <p className="text-gray-800">{visit.Decises}</p>
                      </div>
                    </div>

                    {visit.diseasesOccurred && (
                      <div className="flex items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Symptoms Observed</h4>
                          <p className="text-gray-800">{visit.diseasesOccurred}</p>
                        </div>
                      </div>
                    )}

                    {visit.treatmentFollowed && (
                      <div className="flex items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Treatment Followed</h4>
                          <p className="text-gray-800">{visit.treatmentFollowed}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {visit.medicinesUsed && visit.medicinesUsed.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-500 flex items-center">
                         Medicines Prescribed
                      </h4>
                      <ul className="space-y-2">
                        {visit.medicinesUsed.map((medicine, index) => (
                          <li key={index} className="bg-gray-50 p-3 rounded-md text-gray-600">
                            <div className="flex justify-between">
                              <span className="font-medium">{medicine.name || 'Medicine'}</span>
                              <span className="text-gray-600">
                                {medicine.dosage || 'N/A'}
                              </span>
                            </div>
                            {medicine.notes && (
                              <p className="text-sm text-gray-500 mt-1">{medicine.notes}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
                <div className="flex justify-between items-center">
                  <span>
                    Completed at: {new Date(visit.completedAt).toLocaleString('en-IN')}
                  </span>
                  <span>Visit ID: {visit._id.substring(18)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerVisitsPage;
