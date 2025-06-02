"use client"
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import dayjs from "dayjs"
import toast from "react-hot-toast"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import jsPDF from "jspdf"
import "jspdf-autotable"
import {
  AlertCircle,
  BarChart2,
  Download,
  FileText,
  Plus,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  Search,
  Check,
  Activity,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  Clock,
  Zap,
  Target,
  Calendar,
} from "lucide-react"
import Layout from "../app/Layout"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

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
      "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-600 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    destructive:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  }
  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Input = ({ className = "", type = "text", id, ...props }) => (
  <input
    type={type}
    id={id}
    className={`flex h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`}
    {...props}
  />
)

const Label = ({ children, className = "", htmlFor, ...props }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-label="Close dialog"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
        aria-expanded={isOpen}
        {...props}
      >
        <span>{value || "Select..."}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
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

const SelectItem = ({ children, value, onClick }) => (
  <div
    className="px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer first:rounded-t-xl last:rounded-b-xl"
    onClick={onClick}
    role="option"
    aria-selected={false}
  >
    {children}
  </div>
)

const DropdownMenu = ({ children }) => <div className="relative">{children}</div>

const DropdownMenuTrigger = ({ children, onClick }) => (
  <button onClick={onClick} aria-haspopup="true">
    {children}
  </button>
)

const DropdownMenuContent = ({ children, isOpen, className = "" }) => {
  if (!isOpen) return null
  return (
    <div
      className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10 ${className}`}
      role="menu"
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, onClick, className = "" }) => (
  <button
    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${className}`}
    onClick={onClick}
    role="menuitem"
  >
    {children}
  </button>
)

const Tabs = ({ children, value, onValueChange, className = "" }) => (
  <div className={className}>
    {React.Children.map(children, (child) => React.cloneElement(child, { value, onValueChange }))}
  </div>
)

const TabsList = ({ children, className = "" }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500 ${className}`}>
    {children}
  </div>
)

const TabsTrigger = ({ children, value: triggerValue, value: currentValue, onValueChange, className = "" }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      currentValue === triggerValue ? "bg-white text-gray-950 shadow-sm" : "text-gray-600 hover:text-gray-900"
    } ${className}`}
    onClick={() => onValueChange(triggerValue)}
  >
    {children}
  </button>
)

const TabsContent = ({ children, value: contentValue, value: currentValue, className = "" }) => {
  if (currentValue !== contentValue) return null
  return (
    <div
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  )
}

// Authentication Hook
const useAuth = () => {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "viewer")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          toast.error("Please log in to continue.")
          navigate("/login")
          return
        }
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserRole(response.data.data.role || "viewer")
        localStorage.setItem("userRole", response.data.data.role)
      } catch (error) {
        toast.error("Session expired. Please log in again.")
        localStorage.clear()
        navigate("/login")
      }
    }
    fetchUser()
  }, [navigate])

  const canPerform = (roles) => roles.includes(userRole)

  return { userRole, canPerform }
}

// Main Performances Component
const Performances = () => {
  const navigate = useNavigate()
  const { userRole, canPerform } = useAuth()
  const [performances, setPerformances] = useState([])
  const [filteredPerformances, setFilteredPerformances] = useState([])
  const [machines, setMachines] = useState([])
  const [users, setUsers] = useState([])
  const [operations, setOperations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMachineId, setFilterMachineId] = useState("")
  const [filterOperatorId, setFilterOperatorId] = useState("")
  const [filterZone, setFilterZone] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [sortField, setSortField] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false)
  const [isWorkCycleModalOpen, setIsWorkCycleModalOpen] = useState(false)
  const [selectedPerformance, setSelectedPerformance] = useState(null)
  const [selectedMachine, setSelectedMachine] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [formData, setFormData] = useState({
    machineId: "",
    date: "",
    availability: "",
    rendement: "",
    mtbf: "",
    operatorId: "",
    zone: "",
  })
  const [formError, setFormError] = useState("")
  const [performanceScore, setPerformanceScore] = useState(0)
  const [alerts, setAlerts] = useState([])

  // Fetch data on mount
  useEffect(() => {
    fetchPerformances()
    fetchMachines()
    fetchUsers()
    fetchOperations()
    fetchPerformanceScore()
    fetchAlerts()
  }, [])

  const fetchPerformances = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found. Please log in.")
      }
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/performances`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch performances")
      }
      setPerformances(response.data.data)
      setFilteredPerformances(response.data.data)
    } catch (error) {
      console.error("Error fetching performances:", error)
      setError(error.message || "Failed to load performances.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMachines = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/machines`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch machines")
      }
      setMachines(response.data.data)
    } catch (error) {
      console.error("Error fetching machines:", error)
      setError(error.message || "Failed to load machines.")
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch users")
      }
      setUsers(response.data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error.message || "Failed to load users.")
    }
  }

  const fetchOperations = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/operations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch operations")
      }
      setOperations(response.data.data)
    } catch (error) {
      console.error("Error fetching operations:", error)
    }
  }

  const fetchPerformanceScore = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/performances/score`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch performance score")
      }
      setPerformanceScore(response.data.data.score)
    } catch (error) {
      console.error("Error fetching performance score:", error)
    }
  }

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/performances/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch alerts")
      }
      setAlerts(response.data.data)
    } catch (error) {
      console.error("Error fetching alerts:", error)
    }
  }

  // Machine Rankings
  const machineRankings = useMemo(() => {
    const machineStats = machines.map((machine) => {
      const machinePerformances = performances.filter((p) => p.machine?._id === machine._id)
      const avgAvailability = machinePerformances.length
        ? machinePerformances.reduce((sum, p) => sum + (p.availability || 0), 0) / machinePerformances.length
        : 0
      const avgRendement = machinePerformances.length
        ? machinePerformances.reduce((sum, p) => sum + (p.rendement || 0), 0) / machinePerformances.length
        : 0
      const avgMtbf = machinePerformances.length
        ? machinePerformances.reduce((sum, p) => sum + (p.mtbf || 0), 0) / machinePerformances.length
        : 0
      const breakdowns = machinePerformances.filter((p) => p.availability < 80).length
      const overallScore = (avgAvailability + avgRendement) / 2

      return {
        machine,
        avgAvailability: avgAvailability.toFixed(1),
        avgRendement: avgRendement.toFixed(1),
        avgMtbf: avgMtbf.toFixed(1),
        breakdowns,
        overallScore: overallScore.toFixed(1),
        recordsCount: machinePerformances.length,
      }
    })

    return machineStats.sort((a, b) => b.overallScore - a.overallScore)
  }, [machines, performances])

  // Work Cycle Data
  const workCycleData = useMemo(() => {
    const machineWorkCycles = machines.map((machine) => {
      const machineOperations = operations.filter((op) => op.machine?._id === machine._id)
      const totalOperatingHours = machineOperations.reduce((sum, op) => sum + (op.operatingHours || 0), 0)
      const totalDowntime = machineOperations.reduce((sum, op) => sum + (op.downtime || 0), 0)
      const totalHours = totalOperatingHours + totalDowntime
      const efficiency = totalHours > 0 ? (totalOperatingHours / totalHours) * 100 : 0

      return {
        machine: machine.name,
        operatingHours: totalOperatingHours.toFixed(1),
        downtime: totalDowntime.toFixed(1),
        efficiency: efficiency.toFixed(1),
        totalOperations: machineOperations.length,
      }
    })

    return machineWorkCycles.filter((cycle) => cycle.totalOperations > 0)
  }, [machines, operations])

  // Filter and sort performances
  useEffect(() => {
    let filtered = [...performances]
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.zone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.machine?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.operator?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (filterMachineId) {
      filtered = filtered.filter((p) => p.machine?._id === filterMachineId)
    }
    if (filterOperatorId) {
      filtered = filtered.filter((p) => p.operator?._id === filterOperatorId)
    }
    if (filterZone) {
      filtered = filtered.filter((p) => p.zone?.toLowerCase() === filterZone.toLowerCase())
    }
    if (filterDate) {
      filtered = filtered.filter((p) => dayjs(p.date).isSame(dayjs(filterDate), "day"))
    }
    filtered = filtered.sort((a, b) => {
      let aValue = a[sortField] ?? (sortField === "machine" ? a.machine?.name : a.operator?.name)
      let bValue = b[sortField] ?? (sortField === "machine" ? b.machine?.name : b.operator?.name)
      if (sortField === "machine" || sortField === "operator") {
        aValue = aValue || ""
        bValue = bValue || ""
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      aValue = aValue || 0
      bValue = bValue || 0
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })
    setFilteredPerformances(filtered)
  }, [searchTerm, filterMachineId, filterOperatorId, filterZone, filterDate, sortField, sortOrder, performances])

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      machineId: "",
      date: "",
      availability: "",
      rendement: "",
      mtbf: "",
      operatorId: "",
      zone: "",
    })
    setFormError("")
    setSelectedPerformance(null)
  }, [])

  const validateForm = useCallback(() => {
    if (!formData.machineId) {
      setFormError("Machine is required.")
      return false
    }
    if (!formData.date || !dayjs(formData.date).isValid()) {
      setFormError("Valid date is required.")
      return false
    }
    if (formData.availability && (formData.availability < 0 || formData.availability > 100)) {
      setFormError("Availability must be between 0 and 100.")
      return false
    }
    if (formData.rendement && (formData.rendement < 0 || formData.rendement > 100)) {
      setFormError("Rendement must be between 0 and 100.")
      return false
    }
    if (formData.mtbf && formData.mtbf < 0) {
      setFormError("MTBF cannot be negative.")
      return false
    }
    setFormError("")
    return true
  }, [formData])

  const handleCreatePerformance = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!canPerform(["superadmin", "admin", "manager", "operator"])) {
      toast.error("You do not have permission to create performance records.")
      return
    }

    setFormLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required. Please log in again.")
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/performances`,
        {
          machineId: formData.machineId,
          date: formData.date,
          availability: formData.availability ? Number(formData.availability) : null,
          rendement: formData.rendement ? Number(formData.rendement) : null,
          mtbf: formData.mtbf ? Number(formData.mtbf) : null,
          operatorId: formData.operatorId || null,
          zone: formData.zone || null,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create performance.")
      }

      setPerformances((prev) => [...prev, response.data.data])
      setIsCreateModalOpen(false)
      resetForm()
      toast.success("Performance record created successfully!")
      fetchAlerts() // Refresh alerts
    } catch (error) {
      console.error("Error creating performance:", error)
      setFormError(error.message || "Failed to create performance.")
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.")
        localStorage.clear()
        navigate("/login")
      }
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditPerformance = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!canPerform(["superadmin", "admin", "manager", "operator"])) {
      toast.error("You do not have permission to edit performance records.")
      return
    }

    setFormLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required. Please log in again.")
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/performances/${selectedPerformance._id}`,
        {
          machineId: formData.machineId,
          date: formData.date,
          availability: formData.availability ? Number(formData.availability) : null,
          rendement: formData.rendement ? Number(formData.rendement) : null,
          mtbf: formData.mtbf ? Number(formData.mtbf) : null,
          operatorId: formData.operatorId || null,
          zone: formData.zone || null,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update performance.")
      }

      setPerformances((prev) => prev.map((p) => (p._id === response.data.data._id ? response.data.data : p)))
      setIsEditModalOpen(false)
      resetForm()
      toast.success("Performance record updated successfully!")
      fetchAlerts() // Refresh alerts
    } catch (error) {
      console.error("Error updating performance:", error)
      setFormError(error.message || "Failed to update performance.")
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.")
        localStorage.clear()
        navigate("/login")
      }
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeletePerformance = async () => {
    if (!canPerform(["superadmin", "admin", "manager"])) {
      toast.error("You do not have permission to delete performance records.")
      return
    }

    setFormLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required. Please log in again.")
      }

      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/performances/${selectedPerformance._id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete performance.")
      }

      setPerformances((prev) => prev.filter((p) => p._id !== selectedPerformance._id))
      setIsDeleteModalOpen(false)
      setSelectedPerformance(null)
      toast.success("Performance record deleted successfully!")
      fetchAlerts() // Refresh alerts
    } catch (error) {
      console.error("Error deleting performance:", error)
      setFormError(error.message || "Failed to delete performance.")
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.")
        localStorage.clear()
        navigate("/login")
      }
    } finally {
      setFormLoading(false)
    }
  }

  const openViewModal = (performance) => {
    setSelectedPerformance(performance)
    setIsViewModalOpen(true)
    setDropdownOpen(null)
  }

  const openEditModal = (performance) => {
    setSelectedPerformance(performance)
    setFormData({
      machineId: performance.machine?._id || "",
      date: performance.date ? dayjs(performance.date).format("YYYY-MM-DDTHH:mm") : "",
      availability: performance.availability || "",
      rendement: performance.rendement || "",
      mtbf: performance.mtbf || "",
      operatorId: performance.operator?._id || "",
      zone: performance.zone || "",
    })
    setIsEditModalOpen(true)
    setDropdownOpen(null)
  }

  const openDeleteModal = (performance) => {
    setSelectedPerformance(performance)
    setIsDeleteModalOpen(true)
    setDropdownOpen(null)
  }

  const openHistoryModal = (machineId) => {
    setSelectedMachine(machineId)
    setIsHistoryModalOpen(true)
    setDropdownOpen(null)
  }





  // Performance Chart Data
  const availabilityChartData = useMemo(() => {
    const machinePerformances = filterMachineId
      ? performances.filter((p) => p.machine?._id === filterMachineId)
      : performances
    const sortedData = machinePerformances.sort((a, b) => new Date(a.date) - new Date(b.date))
    return {
      labels: sortedData.map((p) => dayjs(p.date).format("DD/MM/YYYY")),
      datasets: [
        {
          label: "Availability (%)",
          data: sortedData.map((p) => p.availability || 0),
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Rendement (%)",
          data: sortedData.map((p) => p.rendement || 0),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    }
  }, [performances, filterMachineId])

  const workCycleChartData = useMemo(() => {
    return {
      labels: workCycleData.map((cycle) => cycle.machine),
      datasets: [
        {
          label: "Operating Hours",
          data: workCycleData.map((cycle) => Number.parseFloat(cycle.operatingHours)),
          backgroundColor: "rgba(16, 185, 129, 0.8)",
        },
        {
          label: "Downtime Hours",
          data: workCycleData.map((cycle) => Number.parseFloat(cycle.downtime)),
          backgroundColor: "rgba(239, 68, 68, 0.8)",
        },
      ],
    }
  }, [workCycleData])

  const efficiencyChartData = useMemo(() => {
    return {
      labels: workCycleData.map((cycle) => cycle.machine),
      datasets: [
        {
          label: "Efficiency (%)",
          data: workCycleData.map((cycle) => Number.parseFloat(cycle.efficiency)),
          backgroundColor: workCycleData.map((cycle) =>
            Number.parseFloat(cycle.efficiency) >= 80
              ? "rgba(16, 185, 129, 0.8)"
              : Number.parseFloat(cycle.efficiency) >= 60
                ? "rgba(245, 158, 11, 0.8)"
                : "rgba(239, 68, 68, 0.8)",
          ),
        },
      ],
    }
  }, [workCycleData])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "Percentage (%)" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
    plugins: {
      legend: { display: true },
      tooltip: { backgroundColor: "#1F2937", titleColor: "#FFFFFF", bodyColor: "#FFFFFF" },
    },
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Hours" },
      },
      x: {
        title: { display: true, text: "Machines" },
      },
    },
    plugins: {
      legend: { display: true },
      tooltip: { backgroundColor: "#1F2937", titleColor: "#FFFFFF", bodyColor: "#FFFFFF" },
    },
  }

  const getPerformanceAlert = (performance) => {
    if (performance.availability < 80 || performance.rendement < 70) {
      return "warning"
    }
    return "success"
  }

  const handleSort = (field) => {
    setSortField(field)
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc")
  }

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
                  <Activity className="h-8 w-8" />
                  <h1 className="text-3xl sm:text-4xl font-bold">Machine Performance</h1>
                </div>
                <p className="text-emerald-100 text-lg">Monitor and analyze machine performance metrics</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{performances.length}</div>
                  <div className="text-sm text-emerald-100">Total Records</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{performanceScore}</div>
                  <div className="text-sm text-emerald-100">Performance Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Alerts */}
          {alerts.length > 0 && (
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="h-5 w-5" />
                  Performance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">{alert.message}</span>
                      </div>
                      <Badge variant="warning">{alert.severity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>


            {/* Overview Tab */}
            <TabsContent value="overview">
              {/* Dashboard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-emerald-600" />
                      Active Machines
                    </CardTitle>
                    <p className="text-3xl font-bold text-emerald-600">
                      {new Set(performances.map((p) => p.machine?._id)).size}
                    </p>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                      Avg Availability
                    </CardTitle>
                    <p className="text-3xl font-bold text-emerald-600">
                      {performances.length
                        ? (
                            performances.reduce((sum, p) => sum + (p.availability || 0), 0) / performances.length
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-emerald-600" />
                      Avg Rendement
                    </CardTitle>
                    <p className="text-3xl font-bold text-emerald-600">
                      {performances.length
                        ? (performances.reduce((sum, p) => sum + (p.rendement || 0), 0) / performances.length).toFixed(
                            1,
                          )
                        : 0}
                      %
                    </p>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      Avg MTBF
                    </CardTitle>
                    <p className="text-3xl font-bold text-emerald-600">
                      {performances.length
                        ? (performances.reduce((sum, p) => sum + (p.mtbf || 0), 0) / performances.length).toFixed(1)
                        : 0}
                      hrs
                    </p>
                  </CardHeader>
                </Card>
              </div>

              {/* Chart */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line data={availabilityChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Search by machine, operator, or zone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      aria-label="Search performance records"
                    />
                  </div>
                  <Select value={filterMachineId} onValueChange={setFilterMachineId}>
                    <SelectItem value="">All Machines</SelectItem>
                    {machines.map((machine) => (
                      <SelectItem key={machine._id} value={machine._id}>
                        {machine.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select value={filterOperatorId} onValueChange={setFilterOperatorId}>
                    <SelectItem value="">All Operators</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    id="zoneFilter"
                    placeholder="Filter by Zone"
                    value={filterZone}
                    onChange={(e) => setFilterZone(e.target.value)}
                    className="w-full sm:w-auto"
                    aria-label="Filter by zone"
                  />
                  <Input
                    id="dateFilter"
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full sm:w-auto"
                    aria-label="Filter by date"
                  />
                </div>
                <div className="mt-4 sm:mt-0 flex gap-2">
                  <Button
                    onClick={() => {
                      resetForm()
                      setIsCreateModalOpen(true)
                    }}
                    disabled={!canPerform(["superadmin", "admin", "manager", "operator"])}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Performance
                  </Button>

                </div>
              </div>

              {/* Performance Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("machine")}>
                            Machine {sortField === "machine" && (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("date")}>
                            Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("availability")}>
                            Availability {sortField === "availability" && (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("rendement")}>
                            Rendement (%) {sortField === "rendement" && (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("mtbf")}>
                            MTBF (hrs) {sortField === "mtbf" && (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("operator")}>
                            Operator {sortField === "operator" && (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-4 py-3">Zone</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index} className="animate-pulse">
                              {Array.from({ length: 8 }).map((_, i) => (
                                <td key={i} className="px-4 py-4">
                                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : filteredPerformances.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                              No performance records found.
                            </td>
                          </tr>
                        ) : (
                          filteredPerformances.map((performance) => (
                            <tr
                              key={performance._id}
                              className={`border-b hover:bg-gray-50 ${getPerformanceAlert(performance) === "warning" ? "bg-yellow-50" : ""}`}
                            >
                              <td className="px-4 py-4">{performance.machine?.name || "N/A"}</td>
                              <td className="px-4 py-4">{dayjs(performance.date).format("DD/MM/YYYY")}</td>
                              <td className="px-4 py-4">
                                <Badge variant={getPerformanceAlert(performance)}>
                                  {performance.availability || "-"}%
                                </Badge>
                              </td>
                              <td className="px-4 py-4">{performance.rendement || "-"}%</td>
                              <td className="px-4 py-4">{performance.mtbf || "-"}</td>
                              <td className="px-4 py-4">{performance.operator?.name || "None"}</td>
                              <td className="px-4 py-4">{performance.zone || "-"}</td>
                              <td className="px-4 py-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() =>
                                        setDropdownOpen(dropdownOpen === performance._id ? null : performance._id)
                                      }
                                      aria-label="More actions"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent isOpen={dropdownOpen === performance._id}>
                                    <DropdownMenuItem
                                      onClick={() => openViewModal(performance)}
                                      className="flex items-center gap-2"
                                    >
                                      <Eye className="h-4 w-4" /> View Details
                                    </DropdownMenuItem>
                                    {canPerform(["superadmin", "admin", "manager", "operator"]) && (
                                      <DropdownMenuItem
                                        onClick={() => openEditModal(performance)}
                                        className="flex items-center gap-2"
                                      >
                                        <Edit className="h-4 w-4" /> Edit
                                      </DropdownMenuItem>
                                    )}
                                    {canPerform(["superadmin", "admin", "manager"]) && (
                                      <DropdownMenuItem
                                        onClick={() => openDeleteModal(performance)}
                                        className="flex items-center gap-2 text-red-600 hover:text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" /> Delete
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() => openHistoryModal(performance.machine?._id)}
                                      className="flex items-center gap-2"
                                    >
                                      <BarChart2 className="h-4 w-4" /> View Machine History
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Machine Ranking Tab */}
            <TabsContent value="ranking">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-800">Machine Performance Ranking</h2>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ranking Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Performance Ranking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {machineRankings.map((ranking, index) => (
                        <div
                          key={ranking.machine._id}
                          className={`flex items-center justify-between p-4 rounded-xl border ${
                            index === 0
                              ? "bg-yellow-50 border-yellow-200"
                              : index === 1
                                ? "bg-gray-50 border-gray-200"
                                : index === 2
                                  ? "bg-orange-50 border-orange-200"
                                  : "bg-white border-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                index === 0
                                  ? "bg-yellow-500 text-white"
                                  : index === 1
                                    ? "bg-gray-500 text-white"
                                    : index === 2
                                      ? "bg-orange-500 text-white"
                                      : "bg-emerald-500 text-white"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold">{ranking.machine.name}</h3>
                              <p className="text-sm text-gray-600">{ranking.recordsCount} records</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-600">{ranking.overallScore}</div>
                            <div className="text-xs text-gray-500">Overall Score</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Breakdown Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5" />
                      Breakdown Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {machineRankings
                        .filter((ranking) => ranking.breakdowns > 0)
                        .sort((a, b) => b.breakdowns - a.breakdowns)
                        .map((ranking) => (
                          <div
                            key={ranking.machine._id}
                            className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                          >
                            <div>
                              <h3 className="font-semibold text-red-800">{ranking.machine.name}</h3>
                              <p className="text-sm text-red-600">Avg Availability: {ranking.avgAvailability}%</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-red-600">{ranking.breakdowns}</div>
                              <div className="text-xs text-red-500">Breakdowns</div>
                            </div>
                          </div>
                        ))}
                      {machineRankings.filter((ranking) => ranking.breakdowns > 0).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <TrendingUp className="h-12 w-12 mx-auto mb-2 text-green-500" />
                          <p>No breakdowns recorded!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Work Cycles Tab */}
            <TabsContent value="cycles">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-emerald-800">Work Cycle Visualization</h2>
                </div>

                {/* Work Cycle Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Operating Hours vs Downtime</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <Bar data={workCycleChartData} options={barChartOptions} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Machine Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <Bar
                          data={efficiencyChartData}
                          options={{
                            ...barChartOptions,
                            scales: {
                              ...barChartOptions.scales,
                              y: {
                                ...barChartOptions.scales.y,
                                max: 100,
                                title: { display: true, text: "Efficiency (%)" },
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Work Cycle Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Work Cycle Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th className="px-4 py-3">Machine</th>
                            <th className="px-4 py-3">Operating Hours</th>
                            <th className="px-4 py-3">Downtime Hours</th>
                            <th className="px-4 py-3">Efficiency (%)</th>
                            <th className="px-4 py-3">Total Operations</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workCycleData.map((cycle) => (
                            <tr key={cycle.machine} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-4 font-medium">{cycle.machine}</td>
                              <td className="px-4 py-4">{cycle.operatingHours}h</td>
                              <td className="px-4 py-4">{cycle.downtime}h</td>
                              <td className="px-4 py-4">
                                <Badge
                                  variant={
                                    Number.parseFloat(cycle.efficiency) >= 80
                                      ? "success"
                                      : Number.parseFloat(cycle.efficiency) >= 60
                                        ? "warning"
                                        : "destructive"
                                  }
                                >
                                  {cycle.efficiency}%
                                </Badge>
                              </td>
                              <td className="px-4 py-4">{cycle.totalOperations}</td>
                              <td className="px-4 py-4">
                                {Number.parseFloat(cycle.efficiency) >= 80 ? (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <TrendingUp className="h-4 w-4" />
                                    Optimal
                                  </span>
                                ) : Number.parseFloat(cycle.efficiency) >= 60 ? (
                                  <span className="flex items-center gap-1 text-yellow-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    Moderate
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-red-600">
                                    <TrendingDown className="h-4 w-4" />
                                    Poor
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-emerald-800">Complete Machine History</h2>
                  <Select value={selectedMachine || ""} onValueChange={setSelectedMachine}>
                    <SelectItem value="default">Select Machine</SelectItem>
                    {machines.map((machine) => (
                      <SelectItem key={machine._id} value={machine._id}>
                        {machine.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {selectedMachine && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Machine Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Machine Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const machine = machines.find((m) => m._id === selectedMachine)
                          const machinePerfs = performances.filter((p) => p.machine?._id === selectedMachine)
                          const avgAvailability = machinePerfs.length
                            ? (
                                machinePerfs.reduce((sum, p) => sum + (p.availability || 0), 0) / machinePerfs.length
                              ).toFixed(1)
                            : 0
                          const avgRendement = machinePerfs.length
                            ? (
                                machinePerfs.reduce((sum, p) => sum + (p.rendement || 0), 0) / machinePerfs.length
                              ).toFixed(1)
                            : 0
                          const avgMtbf = machinePerfs.length
                            ? (machinePerfs.reduce((sum, p) => sum + (p.mtbf || 0), 0) / machinePerfs.length).toFixed(1)
                            : 0

                          return (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h3 className="text-xl font-bold text-emerald-800">{machine?.name}</h3>
                                <p className="text-gray-600">{machine?.method}</p>
                              </div>
                              <div className="grid grid-cols-1 gap-3">
                                <div className="bg-emerald-50 p-3 rounded-lg">
                                  <div className="text-sm text-gray-600">Avg Availability</div>
                                  <div className="text-lg font-bold text-emerald-600">{avgAvailability}%</div>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <div className="text-sm text-gray-600">Avg Rendement</div>
                                  <div className="text-lg font-bold text-blue-600">{avgRendement}%</div>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg">
                                  <div className="text-sm text-gray-600">Avg MTBF</div>
                                  <div className="text-lg font-bold text-purple-600">{avgMtbf}h</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <div className="text-sm text-gray-600">Total Records</div>
                                  <div className="text-lg font-bold text-gray-600">{machinePerfs.length}</div>
                                </div>
                              </div>
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>

                    {/* Performance Timeline */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Performance Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {performances
                            .filter((p) => p.machine?._id === selectedMachine)
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((perf) => (
                              <div
                                key={perf._id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <div>
                                    <div className="font-medium">{dayjs(perf.date).format("DD/MM/YYYY")}</div>
                                    <div className="text-sm text-gray-600">
                                      {perf.operator?.name || "No operator"} • {perf.zone || "No zone"}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant={getPerformanceAlert(perf)}>{perf.availability || "-"}%</Badge>
                                  <Badge variant="secondary">{perf.rendement || "-"}%</Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {!selectedMachine && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BarChart2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Machine</h3>
                      <p className="text-gray-600">Choose a machine from the dropdown to view its complete history.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-emerald-800">Advanced Analytics</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <Doughnut
                          data={{
                            labels: ["Excellent (>90%)", "Good (80-90%)", "Fair (70-80%)", "Poor (<70%)"],
                            datasets: [
                              {
                                data: [
                                  performances.filter((p) => (p.availability || 0) > 90).length,
                                  performances.filter((p) => (p.availability || 0) >= 80 && (p.availability || 0) <= 90)
                                    .length,
                                  performances.filter((p) => (p.availability || 0) >= 70 && (p.availability || 0) < 80)
                                    .length,
                                  performances.filter((p) => (p.availability || 0) < 70).length,
                                ],
                                backgroundColor: [
                                  "rgba(16, 185, 129, 0.8)",
                                  "rgba(59, 130, 246, 0.8)",
                                  "rgba(245, 158, 11, 0.8)",
                                  "rgba(239, 68, 68, 0.8)",
                                ],
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: "bottom" },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Performance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <Line
                          data={{
                            labels: Array.from({ length: 12 }, (_, i) => dayjs().month(i).format("MMM")),
                            datasets: [
                              {
                                label: "Average Availability",
                                data: Array.from({ length: 12 }, (_, month) => {
                                  const monthPerfs = performances.filter((p) => dayjs(p.date).month() === month)
                                  return monthPerfs.length
                                    ? (
                                        monthPerfs.reduce((sum, p) => sum + (p.availability || 0), 0) /
                                        monthPerfs.length
                                      ).toFixed(1)
                                    : 0
                                }),
                                borderColor: "#10B981",
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                                tension: 0.3,
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 100,
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800">Best Performer</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {machineRankings[0]?.machine.name || "N/A"}
                        </div>
                        <div className="text-sm text-green-600">Score: {machineRankings[0]?.overallScore || "0"}</div>
                      </div>

                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="h-5 w-5 text-red-600" />
                          <span className="font-semibold text-red-800">Needs Attention</span>
                        </div>
                        <div className="text-lg font-bold text-red-600">
                          {machineRankings[machineRankings.length - 1]?.machine.name || "N/A"}
                        </div>
                        <div className="text-sm text-red-600">
                          Score: {machineRankings[machineRankings.length - 1]?.overallScore || "0"}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-800">Highest MTBF</span>
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {(() => {
                            const highest = machineRankings.reduce(
                              (max, current) =>
                                Number.parseFloat(current.avgMtbf) > Number.parseFloat(max.avgMtbf) ? current : max,
                              machineRankings[0] || {},
                            )
                            return highest?.machine?.name || "N/A"
                          })()}
                        </div>
                        <div className="text-sm text-blue-600">
                          {(() => {
                            const highest = machineRankings.reduce(
                              (max, current) =>
                                Number.parseFloat(current.avgMtbf) > Number.parseFloat(max.avgMtbf) ? current : max,
                              machineRankings[0] || {},
                            )
                            return highest?.avgMtbf || "0"
                          })()} hours
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">Total Alerts</span>
                        </div>
                        <div className="text-lg font-bold text-yellow-600">{alerts.length}</div>
                        <div className="text-sm text-yellow-600">Active alerts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Create Performance Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Add Performance
                </DialogTitle>
                <DialogDescription>Record new machine performance metrics.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePerformance} className="space-y-4 p-6 pt-0">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="machineId">Machine *</Label>
                    <Select
                      value={formData.machineId}
                      onValueChange={(value) => handleSelectChange("machineId", value)}
                    >
                      <SelectItem value="">Select Machine</SelectItem>
                      {machines.map((machine) => (
                        <SelectItem key={machine._id} value={machine._id}>
                          {machine.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date & Time *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability (%)</Label>
                    <Input
                      id="availability"
                      name="availability"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.availability}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rendement">Rendement (%)</Label>
                    <Input
                      id="rendement"
                      name="rendement"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.rendement}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mtbf">MTBF (hours)</Label>
                    <Input
                      id="mtbf"
                      name="mtbf"
                      type="number"
                      min="0"
                      value={formData.mtbf}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operatorId">Operator</Label>
                    <Select
                      value={formData.operatorId}
                      onValueChange={(value) => handleSelectChange("operatorId", value)}
                    >
                      <SelectItem value="">Select Operator</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="zone">Zone</Label>
                    <Input id="zone" name="zone" value={formData.zone} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="w-full"
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full" disabled={formLoading}>
                    {formLoading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Add Performance
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Performance Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" /> Edit Performance
                </DialogTitle>
                <DialogDescription>Update machine performance metrics.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditPerformance} className="space-y-4 p-6 pt-0">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="machineId">Machine *</Label>
                    <Select
                      value={formData.machineId}
                      onValueChange={(value) => handleSelectChange("machineId", value)}
                    >
                      <SelectItem value="">Select Machine</SelectItem>
                      {machines.map((machine) => (
                        <SelectItem key={machine._id} value={machine._id}>
                          {machine.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date & Time *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability (%)</Label>
                    <Input
                      id="availability"
                      name="availability"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.availability}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rendement">Rendement (%)</Label>
                    <Input
                      id="rendement"
                      name="rendement"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.rendement}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mtbf">MTBF (hours)</Label>
                    <Input
                      id="mtbf"
                      name="mtbf"
                      type="number"
                      min="0"
                      value={formData.mtbf}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operatorId">Operator</Label>
                    <Select
                      value={formData.operatorId}
                      onValueChange={(value) => handleSelectChange("operatorId", value)}
                    >
                      <SelectItem value="">Select Operator</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="zone">Zone</Label>
                    <Input id="zone" name="zone" value={formData.zone} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-full"
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full" disabled={formLoading}>
                    {formLoading ? (
                      "Updating..."
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Update Performance
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Performance Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" /> Performance Details
                </DialogTitle>
                <DialogDescription>View machine performance metrics.</DialogDescription>
              </DialogHeader>
              {selectedPerformance && (
                <div className="p-6 pt-0 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                      {selectedPerformance.machine?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800">{selectedPerformance.machine?.name}</h3>
                      <p className="text-emerald-600">{selectedPerformance.operator?.name || "No Operator"}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={getPerformanceAlert(selectedPerformance)}>
                          {selectedPerformance.availability || "-"}% Availability
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">{dayjs(selectedPerformance.date).format("DD/MM/YYYY HH:mm")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Zone</p>
                        <p className="font-medium">{selectedPerformance.zone || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Availability</p>
                        <p className="font-medium">{selectedPerformance.availability || "-"}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Rendement</p>
                        <p className="font-medium">{selectedPerformance.rendement || "-"}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">MTBF</p>
                        <p className="font-medium">{selectedPerformance.mtbf || "-"} hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Operator</p>
                        <p className="font-medium">{selectedPerformance.operator?.name || "None"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={() => setIsViewModalOpen(false)} className="w-full">
                      Close
                    </Button>
                    {canPerform(["superadmin", "admin", "manager", "operator"]) && (
                      <Button
                        onClick={() => {
                          setIsViewModalOpen(false)
                          openEditModal(selectedPerformance)
                        }}
                        className="w-full"
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit Performance
                      </Button>
                    )}
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
                  <AlertCircle className="h-5 w-5" /> Confirm Deletion
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the performance record.
                </DialogDescription>
              </DialogHeader>
              {selectedPerformance && (
                <div className="p-6 pt-0 space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800">
                      Are you sure you want to delete the performance record for{" "}
                      <strong>{selectedPerformance.machine?.name}</strong>?
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      Date: {dayjs(selectedPerformance.date).format("DD/MM/YYYY HH:mm")}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="w-full"
                      disabled={formLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeletePerformance}
                      className="w-full"
                      disabled={formLoading}
                    >
                      {formLoading ? (
                        "Deleting..."
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Performance
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Machine History Modal */}
          <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" /> Machine Performance History
                </DialogTitle>
                <DialogDescription>View all performance records for the selected machine.</DialogDescription>
              </DialogHeader>
              <div className="p-6 pt-0 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {machines.find((m) => m._id === selectedMachine)?.name || "Machine"}
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const doc = new jsPDF()
                      doc.setFontSize(16)
                      doc.text(`Performance History: ${machines.find((m) => m._id === selectedMachine)?.name}`, 20, 20)
                      doc.setFontSize(12)
                      doc.text(`Generated on: ${dayjs().format("DD/MM/YYYY HH:mm")}`, 20, 30)
                      const headers = ["Date", "Availability", "Rendement (%)", "MTBF (hrs)", "Operator", "Zone"]
                      const data = performances
                        .filter((p) => p.machine?._id === selectedMachine)
                        .map((p) => [
                          dayjs(p.date).format("DD/MM/YYYY"),
                          p.availability || "-",
                          p.rendement || "-",
                          p.mtbf || "-",
                          p.operator?.name || "None",
                          p.zone || "-",
                        ])
                      doc.autoTable({
                        startY: 40,
                        head: [headers],
                        body: data,
                        theme: "striped",
                        headStyles: { fillColor: [0, 128, 128] },
                      })
                      doc.save(`performance_history_${selectedMachine}.pdf`)
                      toast.success("Machine history exported as PDF!")
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" /> Export PDF
                  </Button>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Availability</th>
                        <th className="px-4 py-3">Rendement (%)</th>
                        <th className="px-4 py-3">MTBF (hrs)</th>
                        <th className="px-4 py-3">Operator</th>
                        <th className="px-4 py-3">Zone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performances
                        .filter((p) => p.machine?._id === selectedMachine)
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((p) => (
                          <tr
                            key={p._id}
                            className={`border-b hover:bg-gray-50 ${getPerformanceAlert(p) === "warning" ? "bg-yellow-50" : ""}`}
                          >
                            <td className="px-4 py-4">{dayjs(p.date).format("DD/MM/YYYY")}</td>
                            <td className="px-4 py-4">
                              <Badge variant={getPerformanceAlert(p)}>{p.availability || "-"}%</Badge>
                            </td>
                            <td className="px-4 py-4">{p.rendement || "-"}%</td>
                            <td className="px-4 py-4">{p.mtbf || "-"}</td>
                            <td className="px-4 py-4">{p.operator?.name || "None"}</td>
                            <td className="px-4 py-4">{p.zone || "-"}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <Button variant="secondary" onClick={() => setIsHistoryModalOpen(false)} className="w-full">
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  )
}

export default Performances
