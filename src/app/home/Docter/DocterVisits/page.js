"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const DoctorVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorVisits = async () => {
      try {
        const response = await axios.get("/api/Docter/DocterVisits");
        setVisits(response.data.data);
      } catch (err) {
        setError("Failed to fetch doctor visits");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorVisits();
  }, []);

  return (
    <div className="gradient-bg min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-white bg-blue-600 p-3 rounded-lg shadow-lg">डॉक्टर भेटी</h2>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && visits.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">कोणत्याही भेटी सापडल्या नाहीत</p>
          </div>
        )}

        {!loading && !error && visits.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visits.map((visit) => (
              <div 
                key={visit._id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-8 w-8 text-blue-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {new Date(visit.date).toLocaleDateString('en-IN')}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                        उत्पादक
                      </span>
                      <p className="text-gray-700">{visit.username}</p>
                    </div>

                    <div className="flex items-start">
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                        आजार
                      </span>
                      <p className="text-gray-700">{visit.Decises}</p>
                    </div>

                    <div className="flex items-start">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                        जनावर
                      </span>
                      <p className="text-gray-700">{visit.AnimalType}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorVisits;