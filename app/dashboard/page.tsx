"use client"

import { useState, useEffect } from "react"

interface IncidentMetrics {
  total: number
  bySeverity: { [key: string]: number }
  byStatus: { [key: string]: number }
  daysSinceLastIncident: number
  safetyRate: number
  mttr: number
  withInjuries: number
  operationsStopped: number
}

interface OperationMetrics {
  total: number
  byMethod: { [key: string]: number }
  byMachine: { [key: string]: number }
  averageMetrics: {
    metrage: number
    yield: number
    availability: number
    operatingHours: number
    downtime: number
  }
  totalVolume: number
}

export default function DashboardPage() {
  const [incidentMetrics, setIncidentMetrics] = useState<IncidentMetrics>({
    total: 0,
    bySeverity: {},
    byStatus: {},
    daysSinceLastIncident: 0,
    safetyRate: 0,
    mttr: 0,
    withInjuries: 0,
    operationsStopped: 0,
  })

  const [operationMetrics, setOperationMetrics] = useState<OperationMetrics>({
    total: 0,
    byMethod: {},
    byMachine: {},
    averageMetrics: {
      metrage: 0,
      yield: 0,
      availability: 0,
      operatingHours: 0,
      downtime: 0,
    },
    totalVolume: 0,
  })

  const [loading, setLoading] = useState(true)

  // Simulation de données - remplacer par de vrais appels API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Simulation d'un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Données simulées pour les incidents
      setIncidentMetrics({
        total: 45,
        bySeverity: {
          Faible: 18,
          Moyen: 15,
          Élevé: 8,
          Critique: 4,
        },
        byStatus: {
          Ouvert: 12,
          "En cours": 8,
          Résolu: 20,
          Fermé: 5,
        },
        daysSinceLastIncident: 7,
        safetyRate: 87.5,
        mttr: 24.5,
        withInjuries: 6,
        operationsStopped: 15,
      })

      // Données simulées pour les opérations
      setOperationMetrics({
        total: 156,
        byMethod: {
          Poussage: 45,
          Casement: 78,
          Transport: 33,
        },
        byMachine: {
          D11: 45,
          "750011": 25,
          "750012": 23,
          PH1: 15,
          PH2: 15,
          Transwine: 20,
          Procaneq: 13,
        },
        averageMetrics: {
          metrage: 125.8,
          yield: 15.2,
          availability: 0.85,
          operatingHours: 8.5,
          downtime: 1.5,
        },
        totalVolume: 19650,
      })

      setLoading(false)
    }

    fetchData()
  }, [])

  const StatCard = ({
    title,
    value,
    subtitle,
    color = "green",
    icon,
  }: {
    title: string
    value: string | number
    subtitle?: string
    color?: "green" | "red" | "blue" | "yellow"
    icon?: string
  }) => {
    const colorClasses = {
      green: "bg-green-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {icon && (
            <div
              className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center text-white text-xl`}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    )
  }

  const ProgressBar = ({
    label,
    value,
    max,
    color = "green",
  }: {
    label: string
    value: number
    max: number
    color?: "green" | "red" | "blue" | "yellow"
  }) => {
    const percentage = (value / max) * 100
    const colorClasses = {
      green: "bg-green-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
    }

    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
          <span>{label}</span>
          <span>{value}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${colorClasses[color]}`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    )
  }

  const PieChart = ({ data, title }: { data: { [key: string]: number }; title: string }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0)
    const colors = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"]

    let currentAngle = 0
    const segments = Object.entries(data).map(([key, value], index) => {
      const percentage = (value / total) * 100
      const angle = (value / total) * 360
      const startAngle = currentAngle
      currentAngle += angle

      return {
        key,
        value,
        percentage,
        color: colors[index % colors.length],
        startAngle,
        angle,
      }
    })

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center space-x-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {segments.map((segment, index) => {
                const radius = 40
                const circumference = 2 * Math.PI * radius
                const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`
                const strokeDashoffset = -(
                  (segments.slice(0, index).reduce((sum, s) => sum + s.percentage, 0) / 100) *
                  circumference
                )

                return (
                  <circle
                    key={segment.key}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={segment.color}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                )
              })}
            </svg>
          </div>
          <div className="flex-1">
            {segments.map((segment) => (
              <div key={segment.key} className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }}></div>
                <span className="text-sm text-gray-700 flex-1">{segment.key}</span>
                <span className="text-sm font-medium text-gray-900">{segment.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Gestion</h1>
              <p className="text-gray-600 mt-1">Vue d'ensemble des incidents et opérations</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Dernière mise à jour</p>
              <p className="text-lg font-semibold text-green-600">{new Date().toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Incidents"
            value={incidentMetrics.total}
            subtitle="Tous statuts confondus"
            icon="⚠️"
            color="red"
          />
          <StatCard
            title="Total Opérations"
            value={operationMetrics.total}
            subtitle="Opérations enregistrées"
            icon="⚙️"
            color="blue"
          />
          <StatCard
            title="Jours sans incident"
            value={incidentMetrics.daysSinceLastIncident}
            subtitle="Depuis le dernier incident"
            icon="🛡️"
            color="green"
          />
          <StatCard
            title="Taux de sécurité"
            value={`${incidentMetrics.safetyRate}%`}
            subtitle="Opérations sécurisées"
            icon="✅"
            color="green"
          />
        </div>

        {/* Métriques de sécurité */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs de Sécurité</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Incidents avec blessures</span>
                <span className="text-lg font-bold text-red-600">{incidentMetrics.withInjuries}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Opérations arrêtées</span>
                <span className="text-lg font-bold text-yellow-600">{incidentMetrics.operationsStopped}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">MTTR (heures)</span>
                <span className="text-lg font-bold text-blue-600">{incidentMetrics.mttr}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Opérationnelle</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Métrage moyen</span>
                <span className="text-lg font-bold text-green-600">
                  {operationMetrics.averageMetrics.metrage.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rendement moyen</span>
                <span className="text-lg font-bold text-green-600">
                  {operationMetrics.averageMetrics.yield.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Disponibilité</span>
                <span className="text-lg font-bold text-green-600">
                  {(operationMetrics.averageMetrics.availability * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Temps de Travail</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Heures d'opération</span>
                <span className="text-lg font-bold text-green-600">
                  {operationMetrics.averageMetrics.operatingHours.toFixed(1)}h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Temps d'arrêt</span>
                <span className="text-lg font-bold text-red-600">
                  {operationMetrics.averageMetrics.downtime.toFixed(1)}h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Volume total</span>
                <span className="text-lg font-bold text-blue-600">{operationMetrics.totalVolume.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PieChart data={incidentMetrics.bySeverity} title="Incidents par Niveau de Gravité" />
          <PieChart data={incidentMetrics.byStatus} title="Incidents par Statut" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PieChart data={operationMetrics.byMethod} title="Opérations par Méthode" />
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation des Machines</h3>
            <div className="space-y-3">
              {Object.entries(operationMetrics.byMachine).map(([machine, count]) => (
                <ProgressBar
                  key={machine}
                  label={machine}
                  value={count}
                  max={Math.max(...Object.values(operationMetrics.byMachine))}
                  color="green"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Tableau de comparaison */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse Comparative</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Métrique
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Ratio Incidents/Opérations
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((incidentMetrics.total / operationMetrics.total) * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Bon
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-green-600">↓ -5%</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Incidents critiques</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {incidentMetrics.bySeverity["Critique"] || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Attention
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-red-600">↑ +2</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Disponibilité moyenne
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(operationMetrics.averageMetrics.availability * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Excellent
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-green-600">↑ +3%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              <span className="mr-2">⚠️</span>
              Déclarer un Incident
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <span className="mr-2">⚙️</span>
              Nouvelle Opération
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <span className="mr-2">📊</span>
              Rapport Détaillé
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
