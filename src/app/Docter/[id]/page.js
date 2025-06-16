"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Avatar from "react-avatar";
import { Loader } from "@googlemaps/js-api-loader";
import { ToastContainer, toast as Toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
    const { id } = useParams();
    const [visits, setVisits] = useState([]);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [routeInfo, setRouteInfo] = useState({ distance: "", duration: "" });
    const [locationError, setLocationError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        visitRate: "",
        visitType: "",
        diseasesOccurred: "",
        treatmentFollowed: "",
        medicinesUsed: []
    });
    const [currentMedicine, setCurrentMedicine] = useState({
        name: "",
        type: "",
        dosage: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [visitTypes, setVisitTypes] = useState([]);
    const [visitRate, setVisitRate] = useState("");

    useEffect(() => {
        const fetchVisitTypes = async () => {
            try {
                const res = await axios.get("/api/Docter/GetVisitType");
                setVisitTypes(res.data.data || []);
                setVisitRate(res.data.data[0]?.visitRate || "");
            } catch (err) {
                console.error("Failed to fetch visit types:", err);
                setError("Failed to load visit types.");
            } finally {
                setLoading(false);
            }
        };

        fetchVisitTypes();
    }, []);

    useEffect(() => {
        const getOwners = async () => {
            try {
                const res = await axios.get("/api/Docter/getOwners");
                console.log("Sangh Data:", res.data.data);
                setOwners(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch owners:", error.message);
                setError("Failed to fetch owners");
                setLoading(false);
            }
        };
        getOwners();
    }, []);


    // Fetch visits data
    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const res = await fetch(`/api/Docter/GetVisitsDocterside/${id}`, {
                    credentials: 'include'
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                setVisits(data.data);
            } catch (err) {
                console.error("Error fetching doctor visits:", err);
                setError("Failed to load visits.");
                setLoading(false);
            }
        };

        if (id) fetchVisits();
    }, [id]);

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationError("Could not get your location. Please enable location services.");
                    // Default to a central location if user denies geolocation
                    setUserLocation({ lat: 19.9975, lng: 73.7898 }); // Nashik coordinates
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
            setUserLocation({ lat: 19.9975, lng: 73.7898 }); // Fallback to Nashik
        }
    }, []);

    // Initialize Google Maps and calculate route when visit is selected
    useEffect(() => {
        if (!selectedVisit || !userLocation) return;

        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            version: "weekly",
            libraries: ["places", "directions"]
        });

        loader.load().then(() => {
            const mapElement = document.getElementById("map");
            if (!mapElement) return;

            const newMap = new google.maps.Map(mapElement, {
                center: userLocation,
                zoom: 10,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
            });

            setMap(newMap);

            // Clear previous directions if any
            if (directionsRenderer) {
                directionsRenderer.setMap(null);
            }

            // Geocode the destination (village/tahasil)
            const geocoder = new google.maps.Geocoder();
            const address = `${selectedVisit.village}, ${selectedVisit.tahasil}, ${selectedVisit.district}, Maharashtra`;

            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results[0]) {
                    const destination = results[0].geometry.location;

                    // Create markers
                    const userMarker = new google.maps.Marker({
                        position: userLocation,
                        map: newMap,
                        title: "Your Location",
                        icon: {
                            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }
                    });

                    const destinationMarker = new google.maps.Marker({
                        position: destination,
                        map: newMap,
                        title: `${selectedVisit.username}'s Location`,
                        icon: {
                            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        }
                    });

                    setMarker(destinationMarker);

                    // Calculate route
                    const directionsService = new google.maps.DirectionsService();
                    const newDirectionsRenderer = new google.maps.DirectionsRenderer({
                        map: newMap,
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: "#3b82f6",
                            strokeOpacity: 0.8,
                            strokeWeight: 5
                        }
                    });

                    setDirectionsRenderer(newDirectionsRenderer);

                    directionsService.route(
                        {
                            origin: userLocation,
                            destination: destination,
                            travelMode: google.maps.TravelMode.DRIVING
                        },
                        (response, status) => {
                            if (status === "OK") {
                                newDirectionsRenderer.setDirections(response);

                                // Extract route information
                                const route = response.routes[0].legs[0];
                                setRouteInfo({
                                    distance: route.distance.text,
                                    duration: route.duration.text
                                });

                                // Fit bounds to show entire route
                                const bounds = new google.maps.LatLngBounds();
                                bounds.extend(userLocation);
                                bounds.extend(destination);
                                newMap.fitBounds(bounds);
                            } else {
                                console.error("Directions request failed:", status);
                            }
                        }
                    );

                    // Info window for destination
                    const infowindow = new google.maps.InfoWindow({
                        content: `
                            <div class="text-black">
                                <h3 class="font-bold">${selectedVisit.username}</h3>
                                <p>${selectedVisit.village}, ${selectedVisit.tahasil}</p>
                                <p>${selectedVisit.district} District</p>
                            </div>
                        `
                    });

                    destinationMarker.addListener("click", () => {
                        infowindow.open(newMap, destinationMarker);
                    });
                }
            });
        });
    }, [selectedVisit, userLocation]);

    const handleAddMedicine = () => {
        if (currentMedicine.name && currentMedicine.type) {
            setFormData(prev => ({
                ...prev,
                medicinesUsed: [...prev.medicinesUsed, currentMedicine]
            }));
            setCurrentMedicine({
                name: "",
                type: "",
                dosage: ""
            });
        }
    };

    const handleRemoveMedicine = (index) => {
        setFormData(prev => ({
            ...prev,
            medicinesUsed: prev.medicinesUsed.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Here you would typically send the data to your backend
            const response = await axios.post(`/api/Docter/completeVisit/${selectedVisit._id}`, {
                ...formData,
                doctorId: id
            });

            Toast.success("Visit completed successfully!");

            // Update the visits list to remove the completed visit
            setVisits(visits.filter(visit => visit._id !== selectedVisit._id));
            setSelectedVisit(null);
            setShowForm(false);

            // Reset form
            setFormData({
                visitRate: "",
                visitType: "",
                diseasesOccurred: "",
                treatmentFollowed: "",
                medicinesUsed: []
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Treatment Completion Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Treatment Completion Form</h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Visit Type
                                        </label>
                                        <select
                                            value={selectedVisit?.visitType || ""}
                                            onChange={(e) => {
                                                const selectedType = e.target.value;
                                                setSelectedVisit({ ...selectedVisit, visitType: selectedType });

                                                // Find the rate based on selected visit type
                                                const selected = visitTypes.find(v => v.visitType === selectedType);
                                                if (selected) {
                                                    setVisitRate(selected.visitRate); // update state
                                                    setFormData({
                                                        ...formData,
                                                        visitRate: selected.visitRate,
                                                        visitType: selectedType         // ✅ Add this line!
                                                    }); // update formData
                                                }
                                            }}
                                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Select Visit Type</option>
                                            {visitTypes.map((visitType) => (
                                                <option key={visitType._id} value={visitType.visitType}>
                                                    {visitType.visitType}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Visit Rate
                                        </label>
                                        <input
                                            type="text"
                                            value={visitRate}
                                            readOnly
                                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Diseases Diagnosed
                                        </label>
                                        <textarea
                                            value={formData.diseasesOccurred}
                                            onChange={(e) => setFormData({ ...formData, diseasesOccurred: e.target.value })}
                                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Treatment Followed
                                        </label>
                                        <textarea
                                            value={formData.treatmentFollowed}
                                            onChange={(e) => setFormData({ ...formData, treatmentFollowed: e.target.value })}
                                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Medicines Used</h3>

                                        {formData.medicinesUsed.length > 0 && (
                                            <div className="mb-4 space-y-2">
                                                {formData.medicinesUsed.map((medicine, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                        <div>
                                                            <span className="font-medium text-gray-700">{medicine.name}</span>
                                                            <span className="text-sm text-gray-600 ml-2">({medicine.type})</span>
                                                            {medicine.dosage && <span className="text-sm text-gray-600 ml-2">- {medicine.dosage}</span>}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveMedicine(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                                                <input
                                                    type="text"
                                                    value={currentMedicine.name}
                                                    onChange={(e) => setCurrentMedicine({ ...currentMedicine, name: e.target.value })}
                                                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"

                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                                <select
                                                    value={currentMedicine.type}
                                                    onChange={(e) => setCurrentMedicine({ ...currentMedicine, type: e.target.value })}
                                                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"

                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="Tablet">Tablet</option>
                                                    <option value="Injection">Injection</option>
                                                    <option value="Syrup">Syrup</option>
                                                    <option value="Ointment">Ointment</option>
                                                    <option value="Powder">Powder</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage (optional)</label>
                                                <input
                                                    type="text"
                                                    value={currentMedicine.dosage}
                                                    onChange={(e) => setCurrentMedicine({ ...currentMedicine, dosage: e.target.value })}
                                                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="e.g., 2 times a day"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                onClick={handleAddMedicine}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Add Medicine
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Treatment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Doctor Treatment Requests</h1>

                {owners.length > 0 && (
                    <div className="overflow-x-auto mb-8 px-4 bg-white rounded-xl shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Reg No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Dairy Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Owner Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{owners[0].registerNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{owners[0].dairyName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{owners[0].ownerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{owners[0].phone}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-2/3">
                        {visits.length === 0 ? (
                            <div className="bg-white p-6 rounded-xl shadow-md text-center">
                                <p className="text-gray-600 text-lg">No visits found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {visits.map((visit) => (
                                    <div
                                        key={visit._id}
                                        className={`bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition-all flex flex-col cursor-pointer ${selectedVisit?._id === visit._id ? 'ring-2 ring-blue-500' : ''}`}
                                        onClick={() => setSelectedVisit(visit)}
                                    >
                                        <div className="flex items-center mb-3">
                                            <Avatar
                                                name={visit.username || "N/A"}
                                                size="40"
                                                round={true}
                                                className="mr-3"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{visit.username || "N/A"}</h3>
                                                <p className="text-sm text-gray-500">{new Date(visit.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start">
                                                <span className="text-gray-500 w-20 flex-shrink-0">Village:</span>
                                                <span className="text-gray-800">{visit.village || "N/A"}</span>
                                            </div>
                                            <div className="flex items-start">
                                                <span className="text-gray-500 w-20 flex-shrink-0">Tahasil:</span>
                                                <span className="text-gray-800">{visit.tahasil || "N/A"}</span>
                                            </div>
                                            <div className="flex items-start">
                                                <span className="text-gray-500 w-20 flex-shrink-0">District:</span>
                                                <span className="text-gray-800">{visit.district || "N/A"}</span>
                                            </div>
                                            <div className="pt-2 border-t border-gray-100">
                                                <span className="font-medium text-gray-700">Disease:</span>
                                                <p className="text-gray-800 mt-1">{visit.Decises || "No details provided"}</p>
                                            </div>
                                            <div className="w-full px-2">
                                                <div className="flex justify-center items-center mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedVisit(visit);
                                                            setShowForm(true);
                                                        }}
                                                        className="bg-green-500 text-white p-2 rounded w-36 hover:bg-green-600 transition-colors"
                                                    >
                                                        Completed
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white p-4 rounded-xl shadow-md sticky top-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Details</h2>
                            {selectedVisit ? (
                                <>
                                    <div className="h-64 rounded-lg overflow-hidden mb-4">
                                        <div id="map" className="w-full h-full"></div>
                                    </div>

                                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                        <h3 className="font-medium text-blue-800 mb-2">Route Information</h3>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">From:</p>
                                                <p className="font-medium">Your Location</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">To:</p>
                                                <p className="font-medium">
                                                    {selectedVisit.village}, {selectedVisit.tahasil}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l7-7 3 3-7 7-3-3z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 2l7.586 7.586" />
                                                </svg>
                                                <span className="text-gray-700">{routeInfo.distance || "Calculating..."}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-gray-700">{routeInfo.duration || "Calculating..."}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-medium text-lg flex items-center">
                                            <Avatar
                                                name={selectedVisit.username || "N/A"}
                                                size="30"
                                                round={true}
                                                className="mr-2"
                                            />
                                            {selectedVisit.username}
                                        </h3>
                                        <p className="text-gray-700">
                                            <span className="font-medium">Village:</span> {selectedVisit.village}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-medium">Tahasil:</span> {selectedVisit.tahasil}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-medium">District:</span> {selectedVisit.district}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-medium">Date:</span> {new Date(selectedVisit.date).toLocaleDateString()}
                                        </p>
                                        <div className="pt-2 mt-2 border-t border-gray-200">
                                            <p className="font-medium text-gray-700">Disease Details:</p>
                                            <p className="text-gray-800 mt-1">{selectedVisit.Decises || "No details provided"}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-gray-500 text-black">
                                    <p>Select a visit to view location details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page