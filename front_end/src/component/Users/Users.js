"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../app/Layout";
import {
  Users,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Search,
  MoreVertical,
  Check,
  Shield,
  Phone,
  Building,
  MapPin,
  Calendar,
} from "lucide-react";

// Custom UI Components (adapted from UsersPage.js)
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    default:
      "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-600 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    destructive:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", type = "text", ...props }) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "", ...props }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-emerald-100 text-emerald-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

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

const CardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
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

const DialogDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

const DialogContent = ({ children, className = "", ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        <span>{value || "Select..."}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                onValueChange(child.props.value);
                setIsOpen(false);
              },
            }),
          )}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ children, value, onClick, ...props }) => (
  <div
    className="px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer first:rounded-t-xl last:rounded-b-xl"
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`}
    {...props}
  />
);

const DropdownMenu = ({ children, open, onOpenChange }) => {
  return <div className="relative">{children}</div>;
};

const DropdownMenuTrigger = ({ children, onClick, ...props }) => (
  <button onClick={onClick} {...props}>
    {children}
  </button>
);

const DropdownMenuContent = ({ children, isOpen, className = "", ...props }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, className = "", ...props }) => (
  <button
    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

// Main Users Component
const UsersM = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer",
    phoneNumber: "",
    address: "",
    team: "",
    site: "",
    password: "",
    active: true,
  });
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const roles = ["superadmin", "admin", "manager", "operator", "viewer"];

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        setError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.role) {
      setFormError("Name, email, and role are required.");
      return false;
    }
    if (isCreateModalOpen && !formData.password) {
      setFormError("Password is required for new users.");
      return false;
    }
    if (formData.email && !/.+@.+\..+/.test(formData.email)) {
      setFormError("Invalid email format.");
      return false;
    }
    if (!roles.includes(formData.role)) {
      setFormError("Invalid role selected.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        setError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to create user");
      }

      setUsers((prev) => [...prev, data.data]);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error creating user:", err);
      setFormError(err.message || "Failed to create user. Please try again.");
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const updateData = { ...formData };
    if (!updateData.password) delete updateData.password; // Omit password if not updated

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        setError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update user");
      }

      setUsers((prev) =>
        prev.map((user) => (user._id === data.data._id ? data.data : user))
      );
      setIsEditModalOpen(false);
      resetForm();
      window.location.reload();
    } catch (err) {
      console.error("Error updating user:", err);
      setFormError(err.message || "Failed to update user. Please try again.");
    }
  };

  const handleDeleteUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${selectedUser._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        setError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message || "Failed to delete user. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "viewer",
      phoneNumber: "",
      address: "",
      team: "",
      site: "",
      password: "",
      active: true,
    });
    setFormError("");
    setSelectedUser(null);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      team: user.team || "",
      site: user.site || "",
      password: "",
      active: user.active,
    });
    setIsEditModalOpen(true);
    setDropdownOpen(null);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
    setDropdownOpen(null);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "superadmin":
        return "destructive";
      case "admin":
        return "warning";
      case "manager":
        return "success";
      case "operator":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusBadgeVariant = (active) => {
    return active ? "success" : "secondary";
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
                  <Users className="h-8 w-8" />
                  <h1 className="text-3xl sm:text-4xl font-bold">User Management</h1>
                </div>
                <p className="text-emerald-100 text-lg">
                  Manage system users, roles, and permissions
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{users.length}</div>
                  <div className="text-sm text-emerald-100">Total Users</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{users.filter((u) => u.active).length}</div>
                  <div className="text-sm text-emerald-100">Active Users</div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectItem value="">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add New User
            </Button>
          </div>

          {/* Users Grid */}
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
            ) : filteredUsers.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterRole
                      ? "Try adjusting your search or filter criteria."
                      : "Get started by adding your first user."}
                  </p>
                  {!searchTerm && !filterRole && (
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add First User
                    </Button>
                  )}
                </Card>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user._id} className="group hover:shadow-2xl  transition-all ">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-base">{user.name}</CardTitle>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenu
                        open={dropdownOpen === user._id}
                        onOpenChange={(open) => setDropdownOpen(open ? user._id : null)}
                      >
                        <DropdownMenuTrigger onClick={() => setDropdownOpen(dropdownOpen === user._id ? null : user._id)}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-600">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent isOpen={dropdownOpen === user._id}>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(user)}
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(user.active)}>
                        {user.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {user.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      )}
                      {user.team && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>{user.team}</span>
                        </div>
                      )}
                      {user.lastLogin && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => openViewModal(user)} className="flex-1 gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditModal(user)} className="flex-1 gap-1">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Create User Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Create New User
                </DialogTitle>
                <DialogDescription>Add a new user to the system with their role and permissions.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4 p-6 pt-0">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                    >
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="team">Team</Label>
                    <Input
                      id="team"
                      name="team"
                      value={formData.team}
                      onChange={handleInputChange}
                      placeholder="Team name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site">Site Location</Label>
                    <Input
                      id="site"
                      name="site"
                      value={formData.site}
                      onChange={handleInputChange}
                      placeholder="Site location"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter secure password"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="active"
                    name="active"
                    type="checkbox"
                    checked={formData.active}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="active">Active</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <Check className="h-4 w-4" />
                    Create User
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit User Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit User
                </DialogTitle>
                <DialogDescription>Update user information and permissions.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditUser} className="space-y-4 p-6 pt-0">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name *</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email Address *</Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                    >
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input
                      id="edit-phone"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-team">Team</Label>
                    <Input
                      id="edit-team"
                      name="team"
                      value={formData.team}
                      onChange={handleInputChange}
                      placeholder="Enter team name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-site">Site Location</Label>
                    <Input
                      id="edit-site"
                      name="site"
                      value={formData.site}
                      onChange={handleInputChange}
                      placeholder="Enter site location"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea
                    id="edit-address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-password">Password (Optional)</Label>
                  <Input
                    id="edit-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password (leave blank to keep current)"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="edit-active"
                    name="active"
                    type="checkbox"
                    checked={formData.active}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="edit-active">Active</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <Check className="h-4 w-4" />
                    Update User
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* View User Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  User Details
                </DialogTitle>
                <DialogDescription>Complete information for {selectedUser?.name}</DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="p-6 pt-0 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800">{selectedUser.name}</h3>
                      <p className="text-emerald-600">{selectedUser.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                          {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(selectedUser.active)}>
                          {selectedUser.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedUser.phoneNumber && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Phone className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{selectedUser.phoneNumber}</p>
                        </div>
                      </div>
                    )}

                    {selectedUser.team && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Building className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Team</p>
                          <p className="font-medium">{selectedUser.team}</p>
                        </div>
                      </div>
                    )}

                    {selectedUser.site && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <MapPin className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Site</p>
                          <p className="font-medium">{selectedUser.site}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {selectedUser.address && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="font-medium">{selectedUser.address}</p>
                    </div>
                  )}

                  {selectedUser.lastLogin && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Last Login</p>
                      <p className="font-medium">{new Date(selectedUser.lastLogin).toLocaleString()}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={() => setIsViewModalOpen(false)} className="flex-1">
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        openEditModal(selectedUser);
                      }}
                      className="flex-1 gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit User
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Confirm Deletion
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the user account.
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="p-6 pt-0 space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800">
                      Are you sure you want to delete <span className="font-semibold">{selectedUser.name}</span>?
                    </p>
                    <p className="text-sm text-red-600 mt-1">Email: {selectedUser.email}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteUser} className="flex-1 gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete User
                    </Button>
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

export default UsersM;