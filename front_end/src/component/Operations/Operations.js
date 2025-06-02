"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../app/Layout"
import dayjs from "dayjs"

// Custom UI Components
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled,
  type = "button",
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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
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
    value={value}
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
      className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 ${className}`}
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

// Main Operations Component
const Operations = () => {
  const [operations, setOperations] = useState([])
  const [machines, setMachines] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMethod, setFilterMethod] = useState("")
  const [filterPoste, setFilterPoste] = useState("")
  const [filterState, setFilterState] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [formData, setFormData] = useState({
    ficheId: "",
    interventionDateTime: dayjs().format("YYYY-MM-DDTHH:mm"),
    decapingMethod: "Poussage",
    machineId: "",
    poste: "",
    panneau: "",
    tranche: "",
    niveau: "",
    machineState: "",
    operatingHours: "",
    downtime: "",
    observations: "",
    skippedVolume: "",
    profondeur: "",
    nombreTrous: "",
    longueur: "",
    largeur: "",
  })
  const [formError, setFormError] = useState("")
  const navigate = useNavigate()

  const methods = ["Poussage", "Casement", "Transport"]
  const machineStates = ["En marche", "À l'arrêt"]

  // Fetch operations and machines
  const fetchOperations = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Aucun jeton d'authentification trouvé. Veuillez vous connecter.")
      localStorage.clear()
      navigate("/login")
      return
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/operations`, {
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
        throw new Error(errorData.message || "Échec de la récupération des opérations")
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Échec de la récupération des opérations")
      }

      setOperations(data.data)
    } catch (err) {
      console.error("Erreur lors de la récupération des opérations:", err)
      setError(err.message || "Échec du chargement des opérations. Veuillez réessayer.")
    }
  }

  const fetchMachines = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Aucun jeton d'authentification trouvé. Veuillez vous connecter.")
      localStorage.clear()
      navigate("/login")
      return
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/machines`, {
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
        throw new Error(errorData.message || "Échec de la récupération des machines")
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Échec de la récupération des machines")
      }

      setMachines(data.data)
    } catch (err) {
      console.error("Erreur lors de la récupération des machines:", err)
      setError(err.message || "Échec du chargement des machines. Veuillez réessayer.")
    }
  }

  useEffect(() => {
    Promise.all([fetchOperations(), fetchMachines()]).finally(() => setIsLoading(false))
  }, [])

  // Automated calculations
  const calculateMetrics = () => {
    const operatingHours = Number.parseFloat(formData.operatingHours) || 0
    const downtime = Number.parseFloat(formData.downtime) || 0
    const profondeur = Number.parseFloat(formData.profondeur) || 0
    const nombreTrous = Number.parseInt(formData.nombreTrous) || 0
    const longueur = Number.parseFloat(formData.longueur) || 0
    const largeur = Number.parseFloat(formData.largeur) || 0

    const totalHours = operatingHours + downtime
    const metrage = profondeur * nombreTrous
    const decapedVolume = longueur * largeur * profondeur
    const yieldValue = operatingHours ? metrage / operatingHours : 0
    const availability = totalHours ? (operatingHours / totalHours) * 100 : 0
    const workCycle = operatingHours && downtime ? `${operatingHours}h marche / ${downtime}h arrêt` : ""

    return {
      metrage: metrage.toFixed(2),
      yield: yieldValue.toFixed(2),
      decapedVolume: decapedVolume.toFixed(2),
      availability: availability.toFixed(2),
      workCycle,
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.ficheId) {
      setFormError("L'ID de la fiche est requis.")
      return false
    }
    if (!formData.interventionDateTime) {
      setFormError("La date d'intervention est requise.")
      return false
    }
    if (!formData.decapingMethod || !methods.includes(formData.decapingMethod)) {
      setFormError("Une méthode de décapage valide est requise.")
      return false
    }
    if (!formData.machineId) {
      setFormError("La machine est requise.")
      return false
    }
    const selectedMachine = machines.find((m) => m._id === formData.machineId)
    if (!selectedMachine) {
      setFormError("Machine sélectionnée non trouvée.")
      return false
    }
    if (selectedMachine.method !== formData.decapingMethod) {
      setFormError(`La machine ${selectedMachine.name} ne prend pas en charge ${formData.decapingMethod}.`)
      return false
    }
    if (formData.operatingHours && isNaN(Number.parseFloat(formData.operatingHours))) {
      setFormError("Les heures de fonctionnement doivent être un nombre.")
      return false
    }
    if (formData.downtime && isNaN(Number.parseFloat(formData.downtime))) {
      setFormError("Le temps d'arrêt doit être un nombre.")
      return false
    }
    if (formData.skippedVolume && isNaN(Number.parseFloat(formData.skippedVolume))) {
      setFormError("Le volume sauté doit être un nombre.")
      return false
    }
    if (formData.profondeur && isNaN(Number.parseFloat(formData.profondeur))) {
      setFormError("La profondeur doit être un nombre.")
      return false
    }
    if (formData.nombreTrous && isNaN(Number.parseInt(formData.nombreTrous))) {
      setFormError("Le nombre de trous doit être un entier.")
      return false
    }
    if (formData.longueur && isNaN(Number.parseFloat(formData.longueur))) {
      setFormError("La longueur doit être un nombre.")
      return false
    }
    if (formData.largeur && isNaN(Number.parseFloat(formData.largeur))) {
      setFormError("La largeur doit être un nombre.")
      return false
    }
    setFormError("")
    return true
  }

  const handleCreateOperation = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    if (!token || !userId) {
      setFormError("Authentification requise. Veuillez vous reconnecter.")
      localStorage.clear()
      navigate("/login")
      return
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/operations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ficheId: formData.ficheId,
          interventionDateTime: dayjs(formData.interventionDateTime).toISOString(),
          decapingMethod: formData.decapingMethod,
          machineId: formData.machineId,
          poste: formData.poste,
          panneau: formData.panneau,
          tranche: formData.tranche,
          niveau: formData.niveau,
          machineState: formData.machineState,
          operatingHours: Number.parseFloat(formData.operatingHours) || 0,
          downtime: Number.parseFloat(formData.downtime) || 0,
          observations: formData.observations,
          skippedVolume: Number.parseFloat(formData.skippedVolume) || 0,
          profondeur: Number.parseFloat(formData.profondeur) || 0,
          nombreTrous: Number.parseInt(formData.nombreTrous) || 0,
          longueur: Number.parseFloat(formData.longueur) || 0,
          largeur: Number.parseFloat(formData.largeur) || 0,
          metrics: calculateMetrics(),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Échec de la création de l'opération.")
      }

      if (!data.success) {
        throw new Error(data.message || "Échec de la création de l'opération.")
      }

      setOperations((prev) => [...prev, data.data])
      setIsCreateModalOpen(false)
      resetForm()
    } catch (err) {
      console.error("Erreur lors de la création de l'opération:", err)
      setFormError(err.message || "Échec de la création de l'opération. Veuillez réessayer.")
    }
  }

  const handleEditOperation = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    if (!token || !userId) {
      setFormError("Authentification requise. Veuillez vous reconnecter.")
      localStorage.clear()
      navigate("/login")
      return
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/operations/${selectedOperation._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ficheId: formData.ficheId,
          interventionDateTime: dayjs(formData.interventionDateTime).toISOString(),
          decapingMethod: formData.decapingMethod,
          machineId: formData.machineId,
          poste: formData.poste,
          panneau: formData.panneau,
          tranche: formData.tranche,
          niveau: formData.niveau,
          machineState: formData.machineState,
          operatingHours: Number.parseFloat(formData.operatingHours) || 0,
          downtime: Number.parseFloat(formData.downtime) || 0,
          observations: formData.observations,
          skippedVolume: Number.parseFloat(formData.skippedVolume) || 0,
          profondeur: Number.parseFloat(formData.profondeur) || 0,
          nombreTrous: Number.parseInt(formData.nombreTrous) || 0,
          longueur: Number.parseFloat(formData.longueur) || 0,
          largeur: Number.parseFloat(formData.largeur) || 0,
          metrics: calculateMetrics(),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Échec de la mise à jour de l'opération.")
      }

      if (!data.success) {
        throw new Error(data.message || "Échec de la mise à jour de l'opération.")
      }

      setOperations((prev) => prev.map((op) => (op._id === data.data._id ? data.data : op)))
      setIsEditModalOpen(false)
      resetForm()
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'opération:", err)
      setFormError(err.message || "Échec de la mise à jour de l'opération. Veuillez réessayer.")
    }
  }

  const handleDeleteOperation = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Authentification requise. Veuillez vous reconnecter.")
      localStorage.clear()
      navigate("/login")
      return
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/operations/${selectedOperation._id}`, {
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
        throw new Error(errorData.message || "Échec de la suppression de l'opération")
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Échec de la suppression de l'opération")
      }

      setOperations((prev) => prev.filter((op) => op._id !== selectedOperation._id))
      setIsDeleteModalOpen(false)
      setSelectedOperation(null)
    } catch (err) {
      console.error("Erreur lors de la suppression de l'opération:", err)
      setError(err.message || "Échec de la suppression de l'opération. Veuillez réessayer.")
    }
  }

  const resetForm = () => {
    setFormData({
      ficheId: "",
      interventionDateTime: dayjs().format("YYYY-MM-DDTHH:mm"),
      decapingMethod: "Poussage",
      machineId: "",
      poste: "",
      panneau: "",
      tranche: "",
      niveau: "",
      machineState: "",
      operatingHours: "",
      downtime: "",
      observations: "",
      skippedVolume: "",
      profondeur: "",
      nombreTrous: "",
      longueur: "",
      largeur: "",
    })
    setFormError("")
    setSelectedOperation(null)
  }

  const openEditModal = (operation) => {
    setSelectedOperation(operation)
    setFormData({
      ficheId: operation.ficheId,
      interventionDateTime: dayjs(operation.interventionDateTime).format("YYYY-MM-DDTHH:mm"),
      decapingMethod: operation.decapingMethod,
      machineId: operation.machine._id,
      poste: operation.poste || "",
      panneau: operation.panneau || "",
      tranche: operation.tranche || "",
      niveau: operation.niveau || "",
      machineState: operation.machineState || "",
      operatingHours: operation.operatingHours?.toString() || "",
      downtime: operation.downtime?.toString() || "",
      observations: operation.observations || "",
      skippedVolume: operation.skippedVolume?.toString() || "",
      profondeur: operation.profondeur?.toString() || "",
      nombreTrous: operation.nombreTrous?.toString() || "",
      longueur: operation.longueur?.toString() || "",
      largeur: operation.largeur?.toString() || "",
    })
    setIsEditModalOpen(true)
    setDropdownOpen(null)
  }

  const openViewModal = (operation) => {
    setSelectedOperation(operation)
    setIsViewModalOpen(true)
    setDropdownOpen(null)
  }

  const openDeleteModal = (operation) => {
    setSelectedOperation(operation)
    setIsDeleteModalOpen(true)
    setDropdownOpen(null)
  }

  const filteredOperations = operations.filter((op) => {
    const matchesSearch =
      op.ficheId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.poste?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMethod = !filterMethod || op.decapingMethod === filterMethod
    const matchesPoste = !filterPoste || op.poste?.toLowerCase() === filterPoste.toLowerCase()
    const matchesState = !filterState || op.machineState === filterState
    const matchesDate = !filterDate || dayjs(op.interventionDateTime).isSame(dayjs(filterDate), "day")
    return matchesSearch && matchesMethod && matchesPoste && matchesState && matchesDate
  })

  const getMethodBadgeVariant = (method) => {
    switch (method) {
      case "Poussage":
        return "success"
      case "Casement":
        return "warning"
      case "Transport":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStateBadgeVariant = (state) => {
    switch (state) {
      case "En marche":
        return "success"
      case "À l'arrêt":
        return "destructive"
      default:
        return "secondary"
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
                  <span>🔧</span>
                  <h1 className="text-3xl sm:text-4xl font-bold">Gestion des Opérations</h1>
                </div>
                <p className="text-emerald-100 text-lg">Suivre et gérer les opérations minières</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{operations.length}</div>
                  <div className="text-sm text-emerald-100">Total des Opérations</div>
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
                  placeholder="Rechercher par ID Fiche, Machine ou Poste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterMethod} onValueChange={(value) => setFilterMethod(value)}>
                <SelectItem value="all">Toutes les Méthodes</SelectItem>
                {methods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </Select>
              <Input
                placeholder="Filtrer par Poste"
                value={filterPoste}
                onChange={(e) => setFilterPoste(e.target.value)}
                className="w-full sm:w-40"
              />
              <Select value={filterState} onValueChange={(value) => setFilterState(value)}>
                <SelectItem value="all">Tous les États</SelectItem>
                {machineStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full sm:w-40"
              />
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <span>+</span> Ajouter une Nouvelle Opération
            </Button>
          </div>

          {/* Operation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))
            ) : filteredOperations.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <span className="text-4xl text-gray-400 mb-4 block">🔧</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune opération trouvée</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterMethod || filterPoste || filterState || filterDate
                      ? "Essayez d'ajuster vos critères de recherche ou de filtre."
                      : "Commencez par ajouter votre première opération."}
                  </p>
                  {!searchTerm && !filterMethod && !filterPoste && !filterState && !filterDate && (
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                      <span>+</span> Ajouter la Première Opération
                    </Button>
                  )}
                </Card>
              </div>
            ) : (
              filteredOperations.map((op) => (
                <Card key={op._id} className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {op.ficheId.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-base">{op.ficheId}</CardTitle>
                          <p className="text-sm text-gray-600">{op.decapingMethod}</p>
                        </div>
                      </div>
                      <DropdownMenu
                        open={dropdownOpen === op._id}
                        onOpenChange={(open) => setDropdownOpen(open ? op._id : null)}
                      >
                        <DropdownMenuTrigger onClick={() => setDropdownOpen(dropdownOpen === op._id ? null : op._id)}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span>⋮</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent isOpen={dropdownOpen === op._id}>
                          <DropdownMenuItem onClick={() => openViewModal(op)} className="gap-2">
                            <span>👁</span> Voir les Détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(op)} className="gap-2">
                            <span>✎</span> Modifier l'Opération
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(op)}
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <span>🗑</span> Supprimer l'Opération
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={getMethodBadgeVariant(op.decapingMethod)}>{op.decapingMethod}</Badge>
                      {op.machineState && (
                        <Badge variant={getStateBadgeVariant(op.machineState)}>{op.machineState}</Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>Date: {dayjs(op.interventionDateTime).format("DD/MM/YYYY HH:mm")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Machine: {op.machine.name}</span>
                      </div>
                      {op.poste && (
                        <div className="flex items-center gap-2">
                          <span>Poste: {op.poste}</span>
                        </div>
                      )}
                      {op.metrics?.metrage && (
                        <div className="flex items-center gap-2">
                          <span>Métrage: {op.metrics.metrage} m</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => openViewModal(op)} className="flex-1 gap-1">
                        <span>👁</span> Voir
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditModal(op)} className="flex-1 gap-1">
                        <span>✎</span> Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Create Operation Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>+</span> Créer une Nouvelle Opération
                </DialogTitle>
                <DialogDescription>Ajouter une nouvelle opération au système.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateOperation} className="space-y-4 p-6 pt-0">
                {formError && (
                  <div className="bg-red-100 border border-red-400 rounded-xl p-3 flex items-center gap-2 text-red-700">
                    <span>⚠️</span>
                    <span className="text-sm">{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ficheId">ID Fiche *</Label>
                    <Input
                      id="ficheId"
                      name="ficheId"
                      value={formData.ficheId}
                      onChange={handleInputChange}
                      placeholder="Entrer l'ID de la fiche"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interventionDateTime">Date d'Intervention *</Label>
                    <Input
                      id="interventionDateTime"
                      name="interventionDateTime"
                      type="datetime-local"
                      value={formData.interventionDateTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="decapingMethod">Méthode de Décapage *</Label>
                    <Select
                      value={formData.decapingMethod}
                      onValueChange={(value) => handleSelectChange("decapingMethod", value)}
                    >
                      {methods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="machineId">Machine *</Label>
                    <Select
                      value={formData.machineId}
                      onValueChange={(value) => handleSelectChange("machineId", value)}
                    >
                      <SelectItem value="">Sélectionner une Machine</SelectItem>
                      {machines
                        .filter((m) => !formData.decapingMethod || m.method === formData.decapingMethod)
                        .map((machine) => (
                          <SelectItem key={machine._id} value={machine._id}>
                            {machine.name}
                          </SelectItem>
                        ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poste">Poste</Label>
                    <Input
                      id="poste"
                      name="poste"
                      value={formData.poste}
                      onChange={handleInputChange}
                      placeholder="Entrer le poste"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panneau">Panneau</Label>
                    <Input
                      id="panneau"
                      name="panneau"
                      value={formData.panneau}
                      onChange={handleInputChange}
                      placeholder="Entrer le panneau"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tranche">Tranche</Label>
                    <Input
                      id="tranche"
                      name="tranche"
                      value={formData.tranche}
                      onChange={handleInputChange}
                      placeholder="Entrer la tranche"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="niveau">Niveau</Label>
                    <Input
                      id="niveau"
                      name="niveau"
                      value={formData.niveau}
                      onChange={handleInputChange}
                      placeholder="Entrer le niveau"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="machineState">État de la Machine</Label>
                    <Select
                      value={formData.machineState}
                      onValueChange={(value) => handleSelectChange("machineState", value)}
                    >
                      <SelectItem value="">Sélectionner l'État</SelectItem>
                      {machineStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operatingHours">Heures de Fonctionnement</Label>
                    <Input
                      id="operatingHours"
                      name="operatingHours"
                      type="number"
                      value={formData.operatingHours}
                      onChange={handleInputChange}
                      placeholder="Entrer les heures"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="downtime">Temps d'Arrêt</Label>
                    <Input
                      id="downtime"
                      name="downtime"
                      type="number"
                      value={formData.downtime}
                      onChange={handleInputChange}
                      placeholder="Entrer les heures"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skippedVolume">Volume Sauté (m³)</Label>
                    <Input
                      id="skippedVolume"
                      name="skippedVolume"
                      type="number"
                      value={formData.skippedVolume}
                      onChange={handleInputChange}
                      placeholder="Entrer le volume"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profondeur">Profondeur (m)</Label>
                    <Input
                      id="profondeur"
                      name="profondeur"
                      type="number"
                      value={formData.profondeur}
                      onChange={handleInputChange}
                      placeholder="Entrer la profondeur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombreTrous">Nombre de Trous</Label>
                    <Input
                      id="nombreTrous"
                      name="nombreTrous"
                      type="number"
                      value={formData.nombreTrous}
                      onChange={handleInputChange}
                      placeholder="Entrer le nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longueur">Longueur (m)</Label>
                    <Input
                      id="longueur"
                      name="longueur"
                      type="number"
                      value={formData.longueur}
                      onChange={handleInputChange}
                      placeholder="Entrer la longueur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="largeur">Largeur (m)</Label>
                    <Input
                      id="largeur"
                      name="largeur"
                      type="number"
                      value={formData.largeur}
                      onChange={handleInputChange}
                      placeholder="Entrer la largeur"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="observations">Observations</Label>
                    <Textarea
                      id="observations"
                      name="observations"
                      value={formData.observations}
                      onChange={handleInputChange}
                      placeholder="Entrer les observations"
                      rows={4}
                    />
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium text-emerald-800 mb-2">Métriques Calculées</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-2 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Métrage</p>
                        <p className="font-medium">{calculateMetrics().metrage} m</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Rendement</p>
                        <p className="font-medium">{calculateMetrics().yield} m/h</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Volume Décapé</p>
                        <p className="font-medium">{calculateMetrics().decapedVolume} m³</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Disponibilité</p>
                        <p className="font-medium">{calculateMetrics().availability}%</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl col-span-2">
                        <p className="text-sm text-gray-600">Cycle de Travail</p>
                        <p className="font-medium">{calculateMetrics().workCycle}</p>
                      </div>
                    </div>
                  </div>
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
                    <span>✔</span> Créer l'Opération
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Operation Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>✎</span> Modifier l'Opération
                </DialogTitle>
                <DialogDescription>Mettre à jour les détails de l'opération.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditOperation} className="space-y-4 p-6 pt-4">
                {formError && (
                  <div className="bg-red-100 border border-red-400 rounded-xl p-3 flex items-center gap-2 text-red-700">
                    <span>⚠️</span>
                    <span className="text-sm">{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ficheId">ID Fiche *</Label>
                    <Input
                      id="ficheId"
                      name="ficheId"
                      value={formData.ficheId}
                      onChange={handleInputChange}
                      placeholder="Entrer l'ID de la fiche"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interventionDateTime">Date d'Intervention *</Label>
                    <Input
                      id="interventionDateTime"
                      name="interventionDateTime"
                      type="datetime-local"
                      value={formData.interventionDateTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="decapingMethod">Méthode de Décapage *</Label>
                    <Select
                      value={formData.decapingMethod}
                      onValueChange={(value) => handleSelectChange("decapingMethod", value)}
                    >
                      {methods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="machineId">Machine *</Label>
                    <Select
                      value={formData.machineId}
                      onValueChange={(value) => handleSelectChange("machineId", value)}
                    >
                      <SelectItem value="">Sélectionner une Machine</SelectItem>
                      {machines
                        .filter((m) => !formData.decapingMethod || m.method === formData.decapingMethod)
                        .map((machine) => (
                          <SelectItem key={machine._id} value={machine._id}>
                            {machine.name}
                          </SelectItem>
                        ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poste">Poste</Label>
                    <Input
                      id="poste"
                      name="poste"
                      value={formData.poste}
                      onChange={handleInputChange}
                      placeholder="Poste"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panneau">Panneau</Label>
                    <Input
                      id="panneau"
                      name="panneau"
                      value={formData.panneau}
                      onChange={handleInputChange}
                      placeholder="Panneau"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tranche">Tranche</Label>
                    <Input
                      id="tranche"
                      name="tranche"
                      value={formData.tranche}
                      onChange={handleInputChange}
                      placeholder="Tranche"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="niveau">Niveau</Label>
                    <Input
                      id="niveau"
                      name="niveau"
                      value={formData.niveau}
                      onChange={handleInputChange}
                      placeholder="Niveau"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="machineState">État de la Machine</Label>
                    <Select
                      value={formData.machineState}
                      onValueChange={(value) => handleSelectChange("machineState", value)}
                    >
                      <SelectItem value="">Sélectionner l'État</SelectItem>
                      {machineStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operatingHours">Heures de Fonctionnement</Label>
                    <Input
                      id="operatingHours"
                      name="operatingHours"
                      type="number"
                      value={formData.operatingHours}
                      onChange={handleInputChange}
                      placeholder="Heures"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="downtime">Temps d'Arrêt</Label>
                    <Input
                      id="downtime"
                      name="downtime"
                      type="number"
                      value={formData.downtime}
                      onChange={handleInputChange}
                      placeholder="Heures"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skippedVolume">Volume Sauté (m³)</Label>
                    <Input
                      id="skippedVolume"
                      name="skippedVolume"
                      type="number"
                      value={formData.skippedVolume}
                      onChange={handleInputChange}
                      placeholder="Volume"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profondeur">Profondeur (m)</Label>
                    <Input
                      id="profondeur"
                      name="profondeur"
                      type="number"
                      value={formData.profondeur}
                      onChange={handleInputChange}
                      placeholder="Profondeur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombreTrous">Nombre de Trous</Label>
                    <Input
                      id="nombreTrous"
                      name="nombreTrous"
                      type="number"
                      value={formData.nombreTrous}
                      onChange={handleInputChange}
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longueur">Longueur (m)</Label>
                    <Input
                      id="longueur"
                      name="longueur"
                      type="number"
                      value={formData.longueur}
                      onChange={handleInputChange}
                      placeholder="Longueur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="largeur">Largeur (m)</Label>
                    <Input
                      id="largeur"
                      name="largeur"
                      type="number"
                      value={formData.largeur}
                      onChange={handleInputChange}
                      placeholder="Largeur"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="observations">Observations</Label>
                    <Textarea
                      id="observations"
                      name="observations"
                      value={formData.observations}
                      onChange={handleInputChange}
                      placeholder="Observations"
                      rows={4}
                    />
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium text-emerald-800 mb-2">Métriques Calculées</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-2 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Métrage</p>
                        <p className="font-medium">{calculateMetrics().metrage} m</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Rendement</p>
                        <p className="font-medium">{calculateMetrics().yield} m/h</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Volume Décapé</p>
                        <p className="font-medium">{calculateMetrics().decapedVolume} m³</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Disponibilité</p>
                        <p className="font-medium">{calculateMetrics().availability}%</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl col-span-2">
                        <p className="text-sm text-gray-600">Cycle de Travail</p>
                        <p className="font-medium">{calculateMetrics().workCycle}</p>
                      </div>
                    </div>
                  </div>
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
                    <span>✔</span> Mettre à Jour l'Opération
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Operation Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>👁</span> Détails de l'Opération
                </DialogTitle>
                <DialogDescription>Informations complètes pour {selectedOperation?.ficheId}</DialogDescription>
              </DialogHeader>
              {selectedOperation && (
                <div className="p-6 pt-0 space-y-6">
                  {/* Header Section */}
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                      {selectedOperation.ficheId.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800">{selectedOperation.ficheId}</h3>
                      <p className="text-emerald-600">{selectedOperation.decapingMethod}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={getMethodBadgeVariant(selectedOperation.decapingMethod)}>
                          {selectedOperation.decapingMethod}
                        </Badge>
                        {selectedOperation.machineState && (
                          <Badge variant={getStateBadgeVariant(selectedOperation.machineState)}>
                            {selectedOperation.machineState}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* General Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                      <div className="h-5 w-1 bg-emerald-500 rounded-full"></div>
                      Informations Générales
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span>📅</span>
                        <div>
                          <p className="text-sm text-gray-600">Date d'Intervention</p>
                          <p className="font-medium">
                            {dayjs(selectedOperation.interventionDateTime).format("DD/MM/YYYY HH:mm")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span>🔧</span>
                        <div>
                          <p className="text-sm text-gray-600">Machine</p>
                          <p className="font-medium">{selectedOperation.machine?.name || "N/A"}</p>
                        </div>
                      </div>
                      {selectedOperation.poste && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">Poste</p>
                            <p className="font-medium">{selectedOperation.poste}</p>
                          </div>
                        </div>
                      )}
                      {selectedOperation.panneau && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">Panneau</p>
                            <p className="font-medium">{selectedOperation.panneau}</p>
                          </div>
                        </div>
                      )}
                      {selectedOperation.tranche && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">Tranche</p>
                            <p className="font-medium">{selectedOperation.tranche}</p>
                          </div>
                        </div>
                      )}
                      {selectedOperation.niveau && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">Niveau</p>
                            <p className="font-medium">{selectedOperation.niveau}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operational Metrics */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                      <div className="h-5 w-1 bg-emerald-500 rounded-full"></div>
                      Métriques Opérationnelles
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedOperation.operatingHours !== undefined && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">Heures de Fonctionnement</p>
                            <p className="font-medium">{selectedOperation.operatingHours} h</p>
                          </div>
                        </div>
                      )}
                      {selectedOperation.downtime !== undefined && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">Temps d'Arrêt</p>
                            <p className="font-medium">{selectedOperation.downtime} h</p>
                          </div>
                        </div>
                      )}
                      {selectedOperation.skippedVolume !== undefined && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">Volume Sauté</p>
                            <p className="font-medium">{selectedOperation.skippedVolume} m³</p>
                          </div>
                        </div>
                      )}
                      {selectedOperation.profondeur !== undefined && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">Profondeur</p>
                            <p className="font-medium">{selectedOperation.profondeur} m</p>
                          </div>
                        </div>
                      )}
                      {selectedOperation.nombreTrous !== undefined && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">Nombre de Trous</p>
                            <p className="font-medium">{selectedOperation.nombreTrous}</p>
                          </div>
                        </div>
                      )}
                      {selectedOperation.longueur !== undefined && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">Longueur</p>
                            <p className="font-medium">{selectedOperation.longueur} m</p>
                          </div>
                        </div>
                      )}
                      {selectedOperation.largeur !== undefined && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">Largeur</p>
                            <p className="font-medium">{selectedOperation.largeur} m</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Calculated Metrics */}
                  {selectedOperation.metrics && Object.keys(selectedOperation.metrics).length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                        <div className="h-5 w-1 bg-emerald-500 rounded-full"></div>
                        Métriques Calculées
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedOperation.metrics.metrage && (
                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                            <div>
                              <p className="text-sm text-gray-600">Métrage</p>
                              <p className="font-medium text-emerald-700">{selectedOperation.metrics.metrage} m</p>
                            </div>
                          </div>
                        )}
                        {selectedOperation.metrics.yield && (
                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                            <div>
                              <p className="text-sm text-gray-600">Rendement</p>
                              <p className="font-medium text-emerald-700">{selectedOperation.metrics.yield} m/h</p>
                            </div>
                          </div>
                        )}
                        {selectedOperation.metrics.decapedVolume && (
                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                            <div>
                              <p className="text-sm text-gray-600">Volume Décapé</p>
                              <p className="font-medium text-emerald-700">
                                {selectedOperation.metrics.decapedVolume} m³
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedOperation.metrics.availability && (
                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                            <div>
                              <p className="text-sm text-gray-600">Disponibilité</p>
                              <p className="font-medium text-emerald-700">{selectedOperation.metrics.availability}%</p>
                            </div>
                          </div>
                        )}
                        {selectedOperation.metrics.workCycle && (
                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl sm:col-span-2">
                            <div>
                              <p className="text-sm text-gray-600">Cycle de Travail</p>
                              <p className="font-medium text-emerald-700">{selectedOperation.metrics.workCycle}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Observations */}
                  {selectedOperation.observations && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2">Observations</p>
                      <p className="font-medium">{selectedOperation.observations}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={() => setIsViewModalOpen(false)} className="flex-1">
                      Fermer
                    </Button>
                    <Button
                      onClick={() => {
                        setIsViewModalOpen(false)
                        openEditModal(selectedOperation)
                      }}
                      className="flex-1 gap-2"
                    >
                      <span>✎</span> Modifier l'Opération
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
                  Cette action ne peut pas être annulée. Cela supprimera définitivement l'opération.
                </DialogDescription>
              </DialogHeader>
              {selectedOperation && (
                <div className="p-6 pt-0 space-y-4">
                  <div className="bg-red-100 border border-red-400 rounded-xl p-4">
                    <p className="text-sm text-red-700">
                      Êtes-vous sûr de vouloir supprimer{" "}
                      <span className="font-semibold">{selectedOperation.ficheId}</span> ?
                    </p>
                    <p className="text-sm text-red-600 mt-1">Méthode: {selectedOperation.decapingMethod}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteOperation} className="flex-1 gap-2">
                      <span>🗑</span> Supprimer l'Opération
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

export default Operations
