"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../app/Layout"

// Custom UI Components
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
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    default:
      "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    destructive:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  }
  const sizes = { sm: "px-3 py-2 text-sm", default: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" }
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
  )
}

const Input = ({ className = "", type = "text", ...props }) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`}
    {...props}
  />
)

const Label = ({ children, className = "", ...props }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
)

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-emerald-100 text-emerald-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/50 ${className}`}
    {...props}
  >
    {children}
  </div>
)

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-bold text-emerald-800 ${className}`} {...props}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

const DialogHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
)

const DialogTitle = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-bold text-emerald-800 ${className}`} {...props}>
    {children}
  </h2>
)

const DialogDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
)

const DialogContent = ({ children, className = "", ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
)

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        <span>{value || "Sélectionner..."}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                onValueChange(child.props.value)
                setIsOpen(false)
              },
            }),
          )}
        </div>
      )}
    </div>
  )
}

const SelectItem = ({ children, value, onClick, ...props }) => (
  <div
    className="px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer first:rounded-t-xl last:rounded-b-xl"
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
)

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`}
    {...props}
  />
)

const DropdownMenu = ({ children, open, onOpenChange }) => <div className="relative">{children}</div>

const DropdownMenuTrigger = ({ children, onClick, ...props }) => (
  <button onClick={onClick} {...props}>
    {children}
  </button>
)

const DropdownMenuContent = ({ children, isOpen, className = "", ...props }) => {
  if (!isOpen) return null
  return (
    <div
      className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, onClick, className = "", ...props }) => (
  <button
    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
)

// Main Incidents Component
const Incidents = () => {
  const [incidents, setIncidents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [formData, setFormData] = useState({
    incidentDateTime: "",
    zone: "",
    niveau: "",
    machine: "",
    severityLevel: "Faible",
    description: "",
    declarant: "",
    operationStopped: false,
    zoneSecured: false,
    injuries: false,
    injuredNames: [],
    injuryTypes: [],
    injuryTimes: [],
    status: "Ouvert",
    attachments: [],
  })
  const [formError, setFormError] = useState("")
  const [users, setUsers] = useState([])
  const [machines, setMachines] = useState([])
  const navigate = useNavigate()

  const severityLevels = ["Faible", "Moyen", "Élevé", "Critique"]
  const statuses = ["Ouvert", "En cours", "Résolu", "Fermé"]
  const levels = ["Niveau 1", "Niveau 2", "Niveau 3"]

  // Fetch incidents
  const fetchIncidents = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Aucun jeton d'authentification trouvé. Veuillez vous connecter.")
      localStorage.clear()
      navigate("/login")
      return
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/incidents`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 401) {
        localStorage.clear()
        setError("Session expirée. Veuillez vous reconnecter.")
        navigate("/login")
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Échec de la récupération des incidents")
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Échec de la récupération des incidents")
      }

      setIncidents(data.data)
      setIsLoading(false)
    } catch (err) {
      console.error("Erreur lors de la récupération des incidents:", err)
      setError(err.message || "Échec du chargement des incidents. Veuillez réessayer.")
      setIsLoading(false)
    }
  }

  // Fetch users and machines
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Aucun jeton d'authentification trouvé. Veuillez vous connecter.")
        localStorage.clear()
        navigate("/login")
        return
      }

      try {
        // Fetch users
        const usersResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (usersResponse.status === 401) {
          localStorage.clear()
          setError("Session expirée. Veuillez vous reconnecter.")
          navigate("/login")
          return
        }
        if (!usersResponse.ok) {
          throw new Error("Échec de la récupération des utilisateurs")
        }
        const usersData = await usersResponse.json()
        if (usersData.success) setUsers(usersData.data)

        // Fetch machines
        const machinesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/machines`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (machinesResponse.status === 401) {
          localStorage.clear()
          setError("Session expirée. Veuillez vous reconnecter.")
          navigate("/login")
          return
        }
        if (!machinesResponse.ok) {
          throw new Error("Échec de la récupération des machines")
        }
        const machinesData = await machinesResponse.json()
        if (machinesData.success) setMachines(machinesData.data)

        // Fetch incidents
        await fetchIncidents()
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err)
        setError(err.message || "Échec du chargement des données. Veuillez réessayer.")
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      [field]: value
        ? value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item)
        : [],
    }))
  }

  const handleFileChange = (e) => {
    const { files } = e.target
    if (files) {
      setFormData((prev) => ({ ...prev, attachments: Array.from(files) }))
    }
  }

  const validateForm = () => {
    if (!formData.incidentDateTime || !formData.severityLevel || !formData.status) {
      setFormError("La date de l'incident, le niveau de gravité et le statut sont requis.")
      return false
    }
    if (!severityLevels.includes(formData.severityLevel)) {
      setFormError("Niveau de gravité invalide sélectionné.")
      return false
    }
    if (!statuses.includes(formData.status)) {
      setFormError("Statut invalide sélectionné.")
      return false
    }
    if (formData.niveau && !levels.includes(formData.niveau)) {
      setFormError("Niveau invalide sélectionné.")
      return false
    }
    if (formData.attachments.length > 0) {
      for (const file of formData.attachments) {
        if (!["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type)) {
          setFormError("Les pièces jointes doivent être au format JPEG, JPG, PNG ou PDF.")
          return false
        }
        if (file.size > 5 * 1024 * 1024) {
          setFormError("Chaque pièce jointe doit être inférieure à 5 Mo.")
          return false
        }
      }
    }
    setFormError("")
    return true
  }

  const handleCreateIncident = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const token = localStorage.getItem("token")
    if (!token) {
      setFormError("Authentification requise. Veuillez vous reconnecter.")
      localStorage.clear()
      navigate("/login")
      return
    }

    const form = new FormData()
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item, index) => form.append(`${key}[${index}]`, item))
      } else if (key === "attachments") {
        formData.attachments.forEach((file) => form.append("attachments", file))
      } else {
        form.append(key, formData[key])
      }
    })

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/incidents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })

      if (response.status === 401) {
        localStorage.clear()
        setFormError("Session expirée. Veuillez vous reconnecter.")
        navigate("/login")
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Échec de la création de l'incident")
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Échec de la création de l'incident")
      }

      setIncidents((prev) => [...prev, data.data])
      setIsCreateModalOpen(false)
      resetForm()
    } catch (err) {
      console.error("Erreur lors de la création de l'incident:", err)
      setFormError(err.message || "Échec de la création de l'incident. Veuillez réessayer.")
    }
  }

  const handleEditIncident = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const token = localStorage.getItem("token")
    if (!token) {
      setFormError("Authentification requise. Veuillez vous reconnecter.")
      localStorage.clear()
      navigate("/login")
      return
    }

    const form = new FormData()
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item, index) => form.append(`${key}[${index}]`, item))
      } else if (key === "attachments") {
        formData.attachments.forEach((file) => form.append("attachments", file))
      } else {
        form.append(key, formData[key])
      }
    })

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/incidents/${selectedIncident._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })

      if (response.status === 401) {
        localStorage.clear()
        setFormError("Session expirée. Veuillez vous reconnecter.")
        navigate("/login")
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Échec de la mise à jour de l'incident")
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Échec de la mise à jour de l'incident")
      }

      setIncidents((prev) => prev.map((incident) => (incident._id === data.data._id ? data.data : incident)))
      setIsEditModalOpen(false)
      resetForm()
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'incident:", err)
      setFormError(err.message || "Échec de la mise à jour de l'incident. Veuillez réessayer.")
    }
  }

  const handleDeleteIncident = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Authentification requise. Veuillez vous reconnecter.")
      localStorage.clear()
      navigate("/login")
      return
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/incidents/${selectedIncident._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 401) {
        localStorage.clear()
        setError("Session expirée. Veuillez vous reconnecter.")
        navigate("/login")
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Échec de la suppression de l'incident")
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Échec de la suppression de l'incident")
      }

      setIncidents((prev) => prev.filter((incident) => incident._id !== selectedIncident._id))
      setIsDeleteModalOpen(false)
      setSelectedIncident(null)
    } catch (err) {
      console.error("Erreur lors de la suppression de l'incident:", err)
      setError(err.message || "Échec de la suppression de l'incident. Veuillez réessayer.")
    }
  }

  const resetForm = () => {
    setFormData({
      incidentDateTime: "",
      zone: "",
      niveau: "",
      machine: "",
      severityLevel: "Faible",
      description: "",
      declarant: "",
      operationStopped: false,
      zoneSecured: false,
      injuries: false,
      injuredNames: [],
      injuryTypes: [],
      injuryTimes: [],
      status: "Ouvert",
      attachments: [],
    })
    setFormError("")
    setSelectedIncident(null)
  }

  const openEditModal = (incident) => {
    setSelectedIncident(incident)
    setFormData({
      incidentDateTime: incident.incidentDateTime ? new Date(incident.incidentDateTime).toISOString().slice(0, 16) : "",
      zone: incident.zone || "",
      niveau: incident.niveau || "",
      machine: incident.machine?._id || "",
      severityLevel: incident.severityLevel,
      description: incident.description || "",
      declarant: incident.declarant?._id || "",
      operationStopped: incident.operationStopped || false,
      zoneSecured: incident.zoneSecured || false,
      injuries: incident.injuries || false,
      injuredNames: incident.injuredNames || [],
      injuryTypes: incident.injuryTypes || [],
      injuryTimes: incident.injuryTimes
        ? incident.injuryTimes.map((time) => (time ? new Date(time).toISOString().slice(0, 16) : ""))
        : [],
      status: incident.status,
      attachments: [],
    })
    setIsEditModalOpen(true)
    setDropdownOpen(null)
  }

  const openViewModal = (incident) => {
    setSelectedIncident(incident)
    setIsViewModalOpen(true)
    setDropdownOpen(null)
  }

  const openDeleteModal = (incident) => {
    setSelectedIncident(incident)
    setIsDeleteModalOpen(true)
    setDropdownOpen(null)
  }

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.zone?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = !filterSeverity || incident.severityLevel === filterSeverity
    const matchesStatus = !filterStatus || incident.status === filterStatus
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityBadgeVariant = (severity) => {
    switch (severity) {
      case "Critique":
        return "destructive"
      case "Élevé":
        return "warning"
      case "Moyen":
        return "secondary"
      case "Faible":
        return "success"
      default:
        return "default"
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Résolu":
        return "success"
      case "Fermé":
        return "secondary"
      case "En cours":
        return "warning"
      case "Ouvert":
        return "default"
      default:
        return "default"
    }
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-6">
          <div className="flex items-center justify-center h-screen">
            <Card className="p-6">
              <div className="flex items-center gap-3 text-red-600">
                <span>⚠️</span>
                <p className="text-lg font-semibold">{error}</p>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    )
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
                  <span>⚠️</span>
                  <h1 className="text-3xl sm:text-4xl font-bold">Gestion des Incidents</h1>
                </div>
                <p className="text-emerald-100 text-lg">Suivre et gérer les incidents du système</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{incidents.length}</div>
                  <div className="text-sm text-emerald-100">Total des Incidents</div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <Input
                  placeholder="Rechercher des incidents par description ou zone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectItem value="all">Tous les Niveaux de Gravité</SelectItem>
                {severityLevels.map((severity) => (
                  <SelectItem key={severity} value={severity}>
                    {severity}
                  </SelectItem>
                ))}
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectItem value="all">Tous les Statuts</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <span>+</span> Signaler un Nouvel Incident
            </Button>
          </div>

          {/* Incidents Grid */}
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
            ) : filteredIncidents.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <span className="text-4xl text-gray-400 mb-4 block">⚠️</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun incident trouvé</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterSeverity || filterStatus
                      ? "Essayez d'ajuster vos critères de recherche ou de filtre."
                      : "Commencez par signaler votre premier incident."}
                  </p>
                  {!searchTerm && !filterSeverity && !filterStatus && (
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                      <span>+</span> Signaler le Premier Incident
                    </Button>
                  )}
                </Card>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <Card
                  key={incident._id}
                  className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {incident.description?.charAt(0).toUpperCase() || "I"}
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {incident.description?.slice(0, 30) || "Incident"}...
                          </CardTitle>
                          <p className="text-sm text-gray-600">{incident.zone || "Aucune Zone"}</p>
                        </div>
                      </div>
                      <DropdownMenu
                        open={dropdownOpen === incident._id}
                        onOpenChange={(open) => setDropdownOpen(open ? incident._id : null)}
                      >
                        <DropdownMenuTrigger
                          onClick={() => setDropdownOpen(dropdownOpen === incident._id ? null : incident._id)}
                        >
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span>⋮</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent isOpen={dropdownOpen === incident._id}>
                          <DropdownMenuItem onClick={() => openViewModal(incident)} className="gap-2">
                            <span>👁</span> Voir les Détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(incident)} className="gap-2">
                            <span>✎</span> Modifier l'Incident
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(incident)}
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <span>🗑</span> Supprimer l'Incident
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={getSeverityBadgeVariant(incident.severityLevel)}>{incident.severityLevel}</Badge>
                      <Badge variant={getStatusBadgeVariant(incident.status)}>{incident.status}</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {incident.description && (
                        <div className="flex items-center gap-2">
                          <span>📄</span>
                          <span className="truncate">{incident.description.slice(0, 30)}...</span>
                        </div>
                      )}
                      {incident.declarant?.name && (
                        <div className="flex items-center gap-2">
                          <span>👤</span>
                          <span>Signalé par: {incident.declarant.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>Signalé: {new Date(incident.createdAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewModal(incident)}
                        className="flex-1 gap-1"
                      >
                        <span>👁</span> Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(incident)}
                        className="flex-1 gap-1"
                      >
                        <span>✎</span> Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Create Incident Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>+</span> Signaler un Nouvel Incident
                </DialogTitle>
                <DialogDescription>Soumettre un nouveau rapport d'incident pour le système.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateIncident} className="space-y-4 p-6 pt-0">
                {formError && (
                  <div className="bg-red-100 border border-red-400 rounded-xl p-3 flex items-center gap-2 text-red-700">
                    <span>⚠️</span>
                    <span className="text-sm">{formError}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="incidentDateTime">Date et Heure de l'Incident *</Label>
                  <Input
                    id="incidentDateTime"
                    name="incidentDateTime"
                    type="datetime-local"
                    value={formData.incidentDateTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone</Label>
                  <Input
                    id="zone"
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    placeholder="Entrer la zone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="niveau">Niveau</Label>
                  <Select value={formData.niveau} onValueChange={(value) => handleSelectChange("niveau", value)}>
                    <SelectItem value="">Sélectionner le Niveau...</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machine">Machine</Label>
                  <Select value={formData.machine} onValueChange={(value) => handleSelectChange("machine", value)}>
                    <SelectItem value="">Sélectionner la Machine...</SelectItem>
                    {machines.map((machine) => (
                      <SelectItem key={machine._id} value={machine._id}>
                        {machine.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severityLevel">Niveau de Gravité *</Label>
                  <Select
                    value={formData.severityLevel}
                    onValueChange={(value) => handleSelectChange("severityLevel", value)}
                  >
                    {severityLevels.map((severity) => (
                      <SelectItem key={severity} value={severity}>
                        {severity}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Entrer la description de l'incident"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="declarant">Déclarant</Label>
                  <Select value={formData.declarant} onValueChange={(value) => handleSelectChange("declarant", value)}>
                    <SelectItem value="">Sélectionner le Déclarant...</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operationStopped">Opération Arrêtée</Label>
                  <input
                    id="operationStopped"
                    name="operationStopped"
                    type="checkbox"
                    checked={formData.operationStopped}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoneSecured">Zone Sécurisée</Label>
                  <input
                    id="zoneSecured"
                    name="zoneSecured"
                    type="checkbox"
                    checked={formData.zoneSecured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="injuries">Blessures Signalées</Label>
                  <input
                    id="injuries"
                    name="injuries"
                    type="checkbox"
                    checked={formData.injuries}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </div>
                {formData.injuries && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="injuredNames">Noms des Blessés (séparés par des virgules)</Label>
                      <Input
                        id="injuredNames"
                        name="injuredNames"
                        value={formData.injuredNames.join(",")}
                        onChange={(e) => handleArrayInputChange(e, "injuredNames")}
                        placeholder="Entrer les noms"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="injuryTypes">Types de Blessures (séparés par des virgules)</Label>
                      <Input
                        id="injuryTypes"
                        name="injuryTypes"
                        value={formData.injuryTypes.join(",")}
                        onChange={(e) => handleArrayInputChange(e, "injuryTypes")}
                        placeholder="Entrer les types de blessures"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="injuryTimes">
                        Heures des Blessures (séparées par des virgules, format: YYYY-MM-DDTHH:mm)
                      </Label>
                      <Input
                        id="injuryTimes"
                        name="injuryTimes"
                        value={formData.injuryTimes.join(",")}
                        onChange={(e) => handleArrayInputChange(e, "injuryTimes")}
                        placeholder="Entrer les heures des blessures"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="status">Statut *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachments">Pièces Jointes (JPEG, JPG, PNG, PDF)</Label>
                  <Input
                    id="attachments"
                    name="attachments"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <span>✔</span> Signaler l'Incident
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Incident Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>✎</span> Modifier l'Incident
                </DialogTitle>
                <DialogDescription>Modifier les informations et pièces jointes de l'incident.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditIncident} className="space-y-4 p-6 pt-0">
                {formError && (
                  <div className="bg-red-100 border border-red-400 rounded-xl p-3 flex items-center gap-2 text-red-700">
                    <span>⚠️</span>
                    <span className="text-sm">{formError}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="incidentDateTime">Date et Heure de l'Incident *</Label>
                  <Input
                    id="incidentDateTime"
                    name="incidentDateTime"
                    type="datetime-local"
                    value={formData.incidentDateTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone</Label>
                  <Input
                    id="zone"
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    placeholder="Entrer la zone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="niveau">Niveau</Label>
                  <Select value={formData.niveau} onValueChange={(value) => handleSelectChange("niveau", value)}>
                    <SelectItem value="">Sélectionner le Niveau...</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machine">Machine</Label>
                  <Select value={formData.machine} onValueChange={(value) => handleSelectChange("machine", value)}>
                    <SelectItem value="">Sélectionner la Machine...</SelectItem>
                    {machines.map((machine) => (
                      <SelectItem key={machine._id} value={machine._id}>
                        {machine.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severityLevel">Niveau de Gravité *</Label>
                  <Select
                    value={formData.severityLevel}
                    onValueChange={(value) => handleSelectChange("severityLevel", value)}
                  >
                    {severityLevels.map((severity) => (
                      <SelectItem key={severity} value={severity}>
                        {severity}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Entrer la description de l'incident"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="declarant">Déclarant</Label>
                  <Select value={formData.declarant} onValueChange={(value) => handleSelectChange("declarant", value)}>
                    <SelectItem value="">Sélectionner le Déclarant...</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operationStopped">Opération Arrêtée</Label>
                  <input
                    id="operationStopped"
                    name="operationStopped"
                    type="checkbox"
                    checked={formData.operationStopped}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoneSecured">Zone Sécurisée</Label>
                  <input
                    id="zoneSecured"
                    name="zoneSecured"
                    type="checkbox"
                    checked={formData.zoneSecured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="injuries">Blessures Signalées</Label>
                  <input
                    id="injuries"
                    name="injuries"
                    type="checkbox"
                    checked={formData.injuries}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </div>
                {formData.injuries && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="injuredNames">Noms des Blessés (séparés par des virgules)</Label>
                      <Input
                        id="injuredNames"
                        name="injuredNames"
                        value={formData.injuredNames.join(",")}
                        onChange={(e) => handleArrayInputChange(e, "injuredNames")}
                        placeholder="Entrer les noms"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="injuryTypes">Types de Blessures (séparés par des virgules)</Label>
                      <Input
                        id="injuryTypes"
                        name="injuryTypes"
                        value={formData.injuryTypes.join(",")}
                        onChange={(e) => handleArrayInputChange(e, "injuryTypes")}
                        placeholder="Entrer les types de blessures"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="injuryTimes">
                        Heures des Blessures (séparées par des virgules, format: YYYY-MM-DDTHH:mm)
                      </Label>
                      <Input
                        id="injuryTimes"
                        name="injuryTimes"
                        value={formData.injuryTimes.join(",")}
                        onChange={(e) => handleArrayInputChange(e, "injuryTimes")}
                        placeholder="Entrer les heures des blessures"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="status">Statut *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachments">Pièces Jointes (JPEG, JPG, PNG, PDF)</Label>
                  <Input
                    id="attachments"
                    name="attachments"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {selectedIncident?.attachments?.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Actuel:{" "}
                      {selectedIncident.attachments.map((att, i) => (
                        <a
                          key={i}
                          href={`${process.env.REACT_APP_API_URL}${att}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline"
                        >
                          Pièce jointe {i + 1}{" "}
                        </a>
                      ))}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <span>✔</span> Mettre à Jour l'Incident
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Incident Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>👁</span> Détails de l'Incident
                </DialogTitle>
                <DialogDescription>Informations complètes pour l'incident sélectionné.</DialogDescription>
              </DialogHeader>
              {selectedIncident && (
                <div className="p-6 pt-0 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                      {selectedIncident.description?.charAt(0).toUpperCase() || "I"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800">
                        {selectedIncident.description?.slice(0, 30) || "Incident"}...
                      </h3>
                      <p className="text-emerald-600">{selectedIncident.zone || "Aucune Zone"}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={getSeverityBadgeVariant(selectedIncident.severityLevel)}>
                          {selectedIncident.severityLevel}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(selectedIncident.status)}>
                          {selectedIncident.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedIncident.description && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span>📄</span>
                        <div>
                          <p className="text-sm text-gray-600">Description</p>
                          <p className="font-medium">{selectedIncident.description}</p>
                        </div>
                      </div>
                    )}
                    {selectedIncident.declarant?.name && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span>👤</span>
                        <div>
                          <p className="text-sm text-gray-600">Signalé Par</p>
                          <p className="font-medium">{selectedIncident.declarant.name}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <span>📅</span>
                      <div>
                        <p className="text-sm text-gray-600">Signalé</p>
                        <p className="font-medium">
                          {new Date(selectedIncident.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    {selectedIncident.incidentDateTime && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span>📅</span>
                        <div>
                          <p className="text-sm text-gray-600">Heure de l'Incident</p>
                          <p className="font-medium">
                            {new Date(selectedIncident.incidentDateTime).toLocaleString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedIncident.operationStopped && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span>✔</span>
                        <div>
                          <p className="text-sm text-gray-600">Opération Arrêtée</p>
                          <p className="font-medium">Oui</p>
                        </div>
                      </div>
                    )}
                    {selectedIncident.zoneSecured && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span>✔</span>
                        <div>
                          <p className="text-sm text-gray-600">Zone Sécurisée</p>
                          <p className="font-medium">Oui</p>
                        </div>
                      </div>
                    )}
                    {selectedIncident.injuries && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span>⚠️</span>
                        <div>
                          <p className="text-sm text-gray-600">Blessures</p>
                          <p className="font-medium">Oui</p>
                        </div>
                      </div>
                    )}
                    {selectedIncident.injuredNames?.length > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span>👤</span>
                        <div>
                          <p className="text-sm text-gray-600">Noms des Blessés</p>
                          <p className="font-medium">{selectedIncident.injuredNames.join(", ")}</p>
                        </div>
                      </div>
                    )}
                    {selectedIncident.injuryTypes?.length > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span>📄</span>
                        <div>
                          <p className="text-sm text-gray-600">Types de Blessures</p>
                          <p className="font-medium">{selectedIncident.injuryTypes.join(", ")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedIncident.attachments?.length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Pièces Jointes</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedIncident.attachments.map((att, i) => (
                          <a
                            key={i}
                            href={`${process.env.REACT_APP_API_URL}${att}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-emerald-600 hover:underline"
                          >
                            Pièce jointe {i + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={() => setIsViewModalOpen(false)} className="flex-1">
                      Fermer
                    </Button>
                    <Button
                      onClick={() => {
                        setIsViewModalOpen(false)
                        openEditModal(selectedIncident)
                      }}
                      className="flex-1 gap-2"
                    >
                      <span>✎</span> Modifier l'Incident
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
                  <span>⚠️</span> Confirmer la Suppression
                </DialogTitle>
                <DialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera définitivement l'incident.
                </DialogDescription>
              </DialogHeader>
              {selectedIncident && (
                <div className="p-6 pt-0 space-y-4">
                  <div className="bg-red-100 border border-red-400 rounded-xl p-4">
                    <p className="text-sm text-red-700">Êtes-vous sûr de vouloir supprimer cet incident ?</p>
                    <p className="text-sm text-red-600 mt-1">
                      Description: {selectedIncident.description?.slice(0, 30) || "Incident"}...
                    </p>
                    <p className="text-sm text-red-600 mt-1">Gravité: {selectedIncident.severityLevel}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteIncident} className="flex-1 gap-2">
                      <span>🗑</span> Supprimer l'Incident
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  )
}

export default Incidents
