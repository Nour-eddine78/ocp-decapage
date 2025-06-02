"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../app/Layout";
import {
  Server,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Search,
  MoreVertical,
  Eye,
  FileText,
  Image,
  Check,
  Upload,
  User,
  Calendar,
} from "lucide-react";

// Custom UI Components
const Button = ({ children, variant = "default", size = "default", className = "", onClick, disabled, type = "button", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };
  const sizes = { sm: "px-3 py-2 text-sm", default: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  return (
    <button type={type} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className = "", type = "text", ...props }) => (
  <input type={type} className={`flex h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`} {...props} />
);

const Label = ({ children, className = "", ...props }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>{children}</label>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = { default: "bg-emerald-100 text-emerald-800", secondary: "bg-gray-100 text-gray-800", destructive: "bg-red-100 text-red-800", success: "bg-green-100 text-green-800", warning: "bg-yellow-100 text-yellow-800" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>
  );
};

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/50 ${className}`} {...props}>{children}</div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>{children}</div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-bold text-emerald-800 ${className}`} {...props}>{children}</h3>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>
);

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">{children}</div>
    </div>
  );
};

const DialogHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>{children}</div>
);

const DialogTitle = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-bold text-emerald-800 ${className}`} {...props}>{children}</h2>
);

const DialogDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>{children}</p>
);

const DialogContent = ({ children, className = "", ...props }) => (
  <div className={`${className}`} {...props}>{children}</div>
);

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" onClick={() => setIsOpen(!isOpen)} {...props}>
        <span>{value || "Select..."}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
          {React.Children.map(children, (child) => (
            React.cloneElement(child, {
              onClick: () => {
                onValueChange(child.props.value);
                setIsOpen(false);
              },
            })
          ))}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ children, value, onClick, ...props }) => (
  <div className="px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer first:rounded-t-xl last:rounded-b-xl" onClick={onClick} {...props}>
    {children}
  </div>
);

const Textarea = ({ className = "", ...props }) => (
  <textarea className={`flex min-h-[80px] w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`} {...props} />
);

const DropdownMenu = ({ children, open, onOpenChange }) => <div className="relative">{children}</div>;

const DropdownMenuTrigger = ({ children, onClick, ...props }) => <button onClick={onClick} {...props}>{children}</button>;

const DropdownMenuContent = ({ children, isOpen, className = "", ...props }) => {
  if (!isOpen) return null;
  return (
    <div className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10 ${className}`} {...props}>{children}</div>
  );
};

const DropdownMenuItem = ({ children, onClick, className = "", ...props }) => (
  <button className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${className}`} onClick={onClick} {...props}>{children}</button>
);

// Main MachinesPage Component
const MachinesPage = () => {
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    method: "Poussage",
    description: "",
    image: null,
    pdf: null,
  });
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const methods = ["Poussage", "Casement", "Transport"];

  const fetchMachines = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/machines`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.clear();
        setError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch machines");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch machines");
      }

      setMachines(data.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching machines:", err);
      setError(err.message || "Failed to load machines. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.method) {
      setFormError("Name and method are required.");
      return false;
    }
    if (!methods.includes(formData.method)) {
      setFormError("Invalid method selected.");
      return false;
    }
    if (formData.image && !["image/jpeg", "image/jpg", "image/png"].includes(formData.image.type)) {
      setFormError("Image must be JPEG, JPG, or PNG.");
      return false;
    }
    if (formData.pdf && formData.pdf.type !== "application/pdf") {
      setFormError("File must be a PDF.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleCreateMachine = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      setFormError("Authentication required. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    // Validate userId format (basic check for ObjectId-like string)
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      setFormError("Invalid user ID format. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("method", formData.method);
    form.append("description", formData.description);
    if (formData.image) form.append("image", formData.image);
    if (formData.pdf) form.append("pdf", formData.pdf);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/machines`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (response.status === 401) {
        localStorage.clear();
        setFormError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create machine");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to create machine");
      }

      setMachines((prev) => [...prev, data.data]);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error creating machine:", err);
      setFormError(err.message || "Failed to create machine. Please try again.");
    }
  };

  const handleEditMachine = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      setFormError("Authentication required. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      setFormError("Invalid user ID format. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("method", formData.method);
    form.append("description", formData.description);
    if (formData.image) form.append("image", formData.image);
    if (formData.pdf) form.append("pdf", formData.pdf);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/machines/${selectedMachine._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (response.status === 401) {
        localStorage.clear();
        setFormError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update machine");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update machine");
      }

      setMachines((prev) => prev.map((machine) => (machine._id === data.data._id ? data.data : machine)));
      setIsEditModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error updating machine:", err);
      setFormError(err.message || "Failed to update machine. Please try again.");
    }
  };

  const handleDeleteMachine = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/machines/${selectedMachine._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.clear();
        setError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete machine");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete machine");
      }

      setMachines((prev) => prev.filter((machine) => machine._id !== selectedMachine._id));
      setIsDeleteModalOpen(false);
      setSelectedMachine(null);
    } catch (err) {
      console.error("Error deleting machine:", err);
      setError(err.message || "Failed to delete machine. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", method: "Poussage", description: "", image: null, pdf: null });
    setFormError("");
    setSelectedMachine(null);
  };

  const openEditModal = (machine) => {
    setSelectedMachine(machine);
    setFormData({
      name: machine.name,
      method: machine.method,
      description: machine.description || "",
      image: null,
      pdf: null,
    });
    setIsEditModalOpen(true);
    setDropdownOpen(null);
  };

  const openViewModal = (machine) => {
    setSelectedMachine(machine);
    setIsViewModalOpen(true);
    setDropdownOpen(null);
  };

  const openDeleteModal = (machine) => {
    setSelectedMachine(machine);
    setIsDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase()) || machine.method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = !filterMethod || machine.method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  const getMethodBadgeVariant = (method) => {
    switch (method) {
      case "Poussage": return "success";
      case "Casement": return "warning";
      case "Transport": return "default";
      default: return "secondary";
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-6">
          <div className="flex items-center justify-center h-screen">
            <Card className="p-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="h-6 w-6" />
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
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Server className="h-8 w-8" />
                  <h1 className="text-3xl sm:text-4xl font-bold">Machine Management</h1>
                </div>
                <p className="text-emerald-100 text-lg">Manage system machines and their documentation</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{machines.length}</div>
                  <div className="text-sm text-emerald-100">Total Machines</div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search machines by name or method..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={filterMethod} onValueChange={setFilterMethod}>
                <SelectItem value="">All Methods</SelectItem>
                {methods.map((method) => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </Select>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add New Machine
            </Button>
          </div>

          {/* Machines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))
            ) : filteredMachines.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No machines found</h3>
                  <p className="text-gray-600 mb-6">{searchTerm || filterMethod ? "Try adjusting your search or filter criteria." : "Get started by adding your first machine."}</p>
                  {!searchTerm && !filterMethod && (
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" /> Add First Machine
                    </Button>
                  )}
                </Card>
              </div>
            ) : (
              filteredMachines.map((machine) => (
                <Card key={machine._id} className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">{machine.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <CardTitle className="text-base">{machine.name}</CardTitle>
                          <p className="text-sm text-gray-600">{machine.method}</p>
                        </div>
                      </div>
                      <DropdownMenu open={dropdownOpen === machine._id} onOpenChange={(open) => setDropdownOpen(open ? machine._id : null)}>
                        <DropdownMenuTrigger onClick={() => setDropdownOpen(dropdownOpen === machine._id ? null : machine._id)}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-600"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent isOpen={dropdownOpen === machine._id}>
  <DropdownMenuItem
    onClick={() => openDeleteModal(machine)}
    className="gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm py-3"
  >
    <Trash2 className="h-5 w-5" />
    <span className="text-base font-medium">Delete Machine</span>
  </DropdownMenuItem>
</DropdownMenuContent>

                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={getMethodBadgeVariant(machine.method)}>{machine.method}</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {machine.description && (
                        <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span className="truncate">{machine.description.slice(0, 30)}...</span></div>
                      )}
                      {machine.addedBy?.name && (
                        <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>Added by: {machine.addedBy.name}</span></div>
                      )}
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>Created: {new Date(machine.createdAt).toLocaleDateString()}</span></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => openViewModal(machine)} className="flex-1 gap-1"><Eye className="h-3 w-3" /> View</Button>
                      <Button variant="outline" size="sm" onClick={() => openEditModal(machine)} className="flex-1 gap-1"><Edit className="h-3 w-3" /> Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Create Machine Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Create New Machine</DialogTitle>
                <DialogDescription>Add a new machine to the system with its documentation.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateMachine} className="space-y-4 p-6 pt-0">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700"><AlertCircle className="h-4 w-4" /><span className="text-sm">{formError}</span></div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Machine Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter machine name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Method *</Label>
                  <Select value={formData.method} onValueChange={(value) => setFormData((prev) => ({ ...prev, method: value }))}>
                    {methods.map((method) => (<SelectItem key={method} value={method}>{method}</SelectItem>))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter machine description" rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image (JPEG, JPG, PNG)</Label>
                  <Input id="image" name="image" type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdf">PDF Documentation</Label>
                  <Input id="pdf" name="pdf" type="file" accept="application/pdf" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 gap-2"><Check className="h-4 w-4" /> Create Machine</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Machine Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Edit className="h-5 w-5" /> Edit Machine</DialogTitle>
                <DialogDescription>Update machine information and documentation.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditMachine} className="space-y-4 p-6 pt-0">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700"><AlertCircle className="h-4 w-4" /><span className="text-sm">{formError}</span></div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Machine Name *</Label>
                  <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter machine name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-method">Method *</Label>
                  <Select value={formData.method} onValueChange={(value) => setFormData((prev) => ({ ...prev, method: value }))}>
                    {methods.map((method) => (<SelectItem key={method} value={method}>{method}</SelectItem>))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter machine description" rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Image (JPEG, JPG, PNG)</Label>
                  <Input id="edit-image" name="image" type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                  {selectedMachine?.image && (
                    <p className="text-xs text-gray-500">Current: <a href={`${process.env.REACT_APP_API_URL}${selectedMachine.image}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">View Image</a></p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pdf">PDF Documentation</Label>
                  <Input id="edit-pdf" name="pdf" type="file" accept="application/pdf" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                  {selectedMachine?.pdf && (
                    <p className="text-xs text-gray-500">Current: <a href={`${process.env.REACT_APP_API_URL}${selectedMachine.pdf}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">View PDF</a></p>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 gap-2"><Check className="h-4 w-4" /> Update Machine</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Machine Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Eye className="h-5 w-5" /> Machine Details</DialogTitle>
                <DialogDescription>Complete information for {selectedMachine?.name}</DialogDescription>
              </DialogHeader>
              {selectedMachine && (
                <div className="p-6 pt-0 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">{selectedMachine.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800">{selectedMachine.name}</h3>
                      <p className="text-emerald-600">{selectedMachine.method}</p>
                      <div className="flex gap-2 mt-2"><Badge variant={getMethodBadgeVariant(selectedMachine.method)}>{selectedMachine.method}</Badge></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedMachine.description && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><FileText className="h-5 w-5 text-gray-600" /><div><p className="text-sm text-gray-600">Description</p><p className="font-medium">{selectedMachine.description}</p></div></div>
                    )}
                    {selectedMachine.addedBy?.name && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><User className="h-5 w-5 text-gray-600" /><div><p className="text-sm text-gray-600">Added By</p><p className="font-medium">{selectedMachine.addedBy.name}</p></div></div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><Calendar className="h-5 w-5 text-gray-600" /><div><p className="text-sm text-gray-600">Created</p><p className="font-medium">{new Date(selectedMachine.createdAt).toLocaleDateString()}</p></div></div>
                    {selectedMachine.image && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><Image className="h-5 w-5 text-gray-600" /><div><p className="text-sm text-gray-600">Image</p><a href={`${process.env.REACT_APP_API_URL}${selectedMachine.image}`} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 hover:underline">View Image</a></div></div>
                    )}
                  </div>
                  {selectedMachine.pdf && (
                    <div className="p-3 bg-gray-50 rounded-xl"><p className="text-sm text-gray-600 mb-1">PDF Documentation</p><a href={`${process.env.REACT_APP_API_URL}${selectedMachine.pdf}`} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 hover:underline">View PDF</a></div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={() => setIsViewModalOpen(false)} className="flex-1">Close</Button>
                    <Button onClick={() => { setIsViewModalOpen(false); openEditModal(selectedMachine); }} className="flex-1 gap-2"><Edit className="h-4 w-4" /> Edit Machine</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600"><AlertCircle className="h-5 w-5" /> Confirm Deletion</DialogTitle>
                <DialogDescription>This action cannot be undone. This will permanently delete the machine.</DialogDescription>
              </DialogHeader>
              {selectedMachine && (
                <div className="p-6 pt-0 space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800">Are you sure you want to delete <span className="font-semibold">{selectedMachine.name}</span>?</p>
                    <p className="text-sm text-red-600 mt-1">Method: {selectedMachine.method}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteMachine} className="flex-1 gap-2"><Trash2 className="h-4 w-4" /> Delete Machine</Button>
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

export default MachinesPage;