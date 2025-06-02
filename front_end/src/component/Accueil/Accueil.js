"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../app/Layout";
import { Eye, ChevronLeft, ChevronRight, Search } from "lucide-react";

// Custom UI Components (reused from previous code)
const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/50 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-bold text-emerald-800 ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Input = ({ className = "", type = "text", id, ...props }) => (
  <input
    type={type}
    id={id}
    className={`flex h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`}
    {...props}
  />
);

const Select = ({ children, value, onValueChange, placeholder = "Select...", ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        {...props}
      >
        <span>{value || placeholder}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                onValueChange(child.props.value);
                setIsOpen(false);
              },
            })
          )}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ children, value, onClick }) => (
  <div
    className="px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer first:rounded-t-xl last:rounded-b-xl"
    onClick={onClick}
    role="option"
    aria-selected={false}
  >
    {children}
  </div>
);

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-label="Close dialog"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

const DialogTitle = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-bold text-emerald-800 ${className}`} {...props}>
    {children}
  </h2>
);

const DialogContent = ({ children, className = "", ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant = "default", size = "default", className = "", onClick, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-600 focus:ring-emerald-500",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
  };
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Accueil = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  // Fetch machines
  useEffect(() => {
    const fetchMachines = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/machines`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch machines");
        }
        setMachines(response.data.data);
        setFilteredMachines(response.data.data);
      } catch (error) {
        console.error("Error fetching machines:", error);
        setError(error.message || "Failed to load machines.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMachines();
  }, []);

  // Filter machines
  useEffect(() => {
    let filtered = machines;
    if (searchTerm) {
      filtered = filtered.filter((machine) =>
        machine.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterMethod) {
      filtered = filtered.filter((machine) => machine.method === filterMethod);
    }
    setFilteredMachines(filtered);
    setCurrentIndex(0); // Reset to first page on filter
  }, [searchTerm, filterMethod, machines]);

  // Pagination
  const paginatedMachines = filteredMachines.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredMachines.length / itemsPerPage);
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + itemsPerPage, filteredMachines.length - itemsPerPage));
  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));

  // Open machine details modal
  const openMachineDetails = useCallback((machine) => {
    setSelectedMachine(machine);
  }, []);

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-6">
          <div className="flex items-center justify-center h-screen">
            <Card className="p-6">
              <div className="flex items-center gap-3 text-red-600">
                <Eye className="h-6 w-6" />
                <p className="text-lg font-semibold">{error}</p>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Section with Two Divs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                  Définition du Décapage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Le décapage constitue l'étape préliminaire essentielle de l'exploitation minière, consistant à retirer les couches de terre et de roche stérile recouvrant le gisement. Cette opération stratégique conditionne l'efficacité de l'ensemble du processus d'extraction.
                </p>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <span className="h-2 w-2 bg-orange-500 rounded-full"></span>
                  Objectif Principal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Préparer méticuleusement le terrain en vue des opérations de forage et de soutage, en optimisant l'accès au gisement phosphatier tout en respectant les standards de sécurité et d'efficacité opérationnelle de l'OCP.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Machines Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                Machines
              </CardTitle>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search machines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={filterMethod}
                  onValueChange={setFilterMethod}
                  placeholder="Filter by Method"
                >
                  <SelectItem value="">All Methods</SelectItem>
                  <SelectItem value="Poussage">Poussage</SelectItem>
                  <SelectItem value="Casement">Casement</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : filteredMachines.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-500">No machines found</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {paginatedMachines.map((machine) => (
                      <div
                        key={machine._id}
                        className="cursor-pointer"
                        onClick={() => openMachineDetails(machine)}
                      >
                        <img
                          src={`${process.env.REACT_APP_API_URL}${machine.image}` || "https://via.placeholder.com/300x200"}
                          alt={machine.name}
                          className="w-full h-64 object-cover rounded-xl"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/300x200"; }}
                        />
                        <h4 className="mt-2 text-lg font-semibold text-emerald-800">
                          {machine.name}
                        </h4>
                        <p className="text-sm text-gray-600">{machine.method}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      variant="secondary"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={currentIndex + itemsPerPage >= filteredMachines.length}
                      variant="secondary"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Machine Details Modal */}
          <Dialog open={!!selectedMachine} onOpenChange={() => setSelectedMachine(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedMachine?.name}</DialogTitle>
              </DialogHeader>
              {selectedMachine && (
                <div className="p-6 space-y-4">
                  <img
                    src={`${process.env.REACT_APP_API_URL}${selectedMachine.image}` || "https://via.placeholder.com/300x200"}
                    alt={selectedMachine.name}
                    className="w-full h-64 object-cover rounded-xl"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300x200"; }}
                  />
                  <p className="text-sm text-gray-600">
                    <strong>Method:</strong> {selectedMachine.method}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Description:</strong> {selectedMachine.description || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Added By:</strong> {selectedMachine.addedBy?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Added On:</strong>{" "}
                    {new Date(selectedMachine.createdAt).toLocaleString()}
                  </p>
                  {selectedMachine.pdf && (
                    <a
                      href={`${process.env.REACT_APP_API_URL}${selectedMachine.pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline"
                    >
                      View PDF
                    </a>
                  )}
                  <div className="flex justify-end">
                    <Button onClick={() => setSelectedMachine(null)}>Close</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Accueil;