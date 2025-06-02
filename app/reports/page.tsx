"use client"

import { useState, useEffect } from "react"

interface ReportData {
  incidents: {
    total: number
    bySeverity: { [key: string]: number }
    byStatus: { [key: string]: number }
    withInjuries: number
    operationsStopped: number
    byMonth: { month: string; count: number }[]
  }
  operations: {
    total: number
    byMethod: { [key: string]: number }
    totalVolume: number
    averageMetrics: {
      metrage: number
      yield: number
      availability: number
    }
    byMonth: { month: string; count: number }[]
  }
  safety: {
    daysSinceLastIncident: number
    safetyRate: number
    mttr: number
  }
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedType, setSelectedType] = useState("complete")
  const [exportFormat, setExportFormat] = useState("pdf")

  const periods = [
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "quarter", label: "Ce trimestre" },
    { value: "year", label: "Cette année" },
  ]

  const reportTypes = [
    { value: "complete", label: "Rapport Complet" },
    { value: "incidents", label: "Incidents Seulement" },
    { value: "operations", label: "Opérations Seulement" },
    { value: "safety", label: "Sécurité Seulement" },
  ]

  const generateReport = async () => {
    setLoading(true)

    // Simulation de génération de rapport
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Données simulées
    setReportData({
      incidents: {
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
        withInjuries: 6,
        operationsStopped: 15,
        byMonth: [
          { month: "Jan", count: 8 },
          { month: "Fév", count: 6 },
          { month: "Mar", count: 12 },
          { month: "Avr", count: 9 },
          { month: "Mai", count: 10 },
        ],
      },
      operations: {
        total: 156,
        byMethod: {
          Poussage: 45,
          Casement: 78,
          Transport: 33,
        },
        totalVolume: 19650,
        averageMetrics: {
          metrage: 125.8,
          yield: 15.2,
          availability: 0.85,
        },
        byMonth: [
          { month: "Jan", count: 28 },
          { month: "Fév", count: 32 },
          { month: "Mar", count: 35 },
          { month: "Avr", count: 31 },
          { month: "Mai", count: 30 },
        ],
      },
      safety: {
        daysSinceLastIncident: 7,
        safetyRate: 87.5,
        mttr: 24.5,
      },
    })

    setLoading(false)
  }

  const exportReport = async (format: "pdf" | "excel") => {
    if (!reportData) return

    // Simulation d'export
    const fileName = `rapport_${selectedType}_${selectedPeriod}_${new Date().toISOString().split("T")[0]}.${format === "pdf" ? "pdf" : "xlsx"}`

    // Créer un blob avec les données (simulation)
    const reportContent = generateReportContent(reportData, format)
    const blob = new Blob([reportContent], {
      type: format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const generateReportContent = (data: ReportData, format: "pdf" | "excel") => {
    if (format === "pdf") {
      // Simulation de contenu PDF
      return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Rapport Industriel - ${new Date().toLocaleDateString("fr-FR")}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`
    } else {
      // Simulation de contenu Excel (CSV pour simplicité)
      let csvContent = "Type,Valeur,Période\n"
      csvContent += `Total Incidents,${data.incidents.total},${selectedPeriod}\n`
      csvContent += `Total Opérations,${data.operations.total},${selectedPeriod}\n`
      csvContent += `Taux de Sécurité,${data.safety.safetyRate}%,${selectedPeriod}\n`

      Object.entries(data.incidents.bySeverity).forEach(([severity, count]) => {
        csvContent += `Incidents ${severity},${count},${selectedPeriod}\n`
      })

      return csvContent
    }
  }

  useEffect(() => {
    generateReport()
  }, [selectedPeriod, selectedType])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Génération de Rapports</h1>

          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de Rapport</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format d'Export</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
              </select>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={generateReport}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Génération..." : "Générer le Rapport"}
            </button>

            {reportData && (
              <>
                <button
                  onClick={() => exportReport("pdf")}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  📄 Exporter PDF
                </button>
                <button
                  onClick={() => exportReport("excel")}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  📊 Exporter Excel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contenu du rapport */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Génération du rapport en cours...</p>
          </div>
        ) : reportData ? (
          <div className="space-y-6">
            {/* Résumé exécutif */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé Exécutif</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{reportData.incidents.total}</div>
                  <div className="text-sm text-gray-600">Total Incidents</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{reportData.operations.total}</div>
                  <div className="text-sm text-gray-600">Total Opérations</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{reportData.safety.safetyRate}%</div>
                  <div className="text-sm text-gray-600">Taux de Sécurité</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{reportData.safety.daysSinceLastIncident}</div>
                  <div className="text-sm text-gray-600">Jours sans Incident</div>
                </div>
              </div>
            </div>

            {/* Analyse des incidents */}
            {(selectedType === "complete" || selectedType === "incidents") && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Analyse des Incidents</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Par Niveau de Gravité</h3>
                    <div className="space-y-2">
                      {Object.entries(reportData.incidents.bySeverity).map(([severity, count]) => (
                        <div key={severity} className="flex justify-between items-center">
                          <span className="text-gray-700">{severity}</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: `${(count / reportData.incidents.total) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Par Statut</h3>
                    <div className="space-y-2">
                      {Object.entries(reportData.incidents.byStatus).map(([status, count]) => (
                        <div key={status} className="flex justify-between items-center">
                          <span className="text-gray-700">{status}</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(count / reportData.incidents.total) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{reportData.incidents.withInjuries}</div>
                    <div className="text-sm text-gray-600">Incidents avec blessures</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">{reportData.incidents.operationsStopped}</div>
                    <div className="text-sm text-gray-600">Opérations arrêtées</div>
                  </div>
                </div>
              </div>
            )}

            {/* Analyse des opérations */}
            {(selectedType === "complete" || selectedType === "operations") && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Analyse des Opérations</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Par Méthode de Décapage</h3>
                    <div className="space-y-2">
                      {Object.entries(reportData.operations.byMethod).map(([method, count]) => (
                        <div key={method} className="flex justify-between items-center">
                          <span className="text-gray-700">{method}</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(count / reportData.operations.total) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Métriques Moyennes</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Métrage moyen</span>
                        <span className="font-medium text-gray-900">
                          {reportData.operations.averageMetrics.metrage.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Rendement moyen</span>
                        <span className="font-medium text-gray-900">
                          {reportData.operations.averageMetrics.yield.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Disponibilité</span>
                        <span className="font-medium text-gray-900">
                          {(reportData.operations.averageMetrics.availability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Volume total</span>
                        <span className="font-medium text-gray-900">
                          {reportData.operations.totalVolume.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Métriques de sécurité */}
            {(selectedType === "complete" || selectedType === "safety") && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Métriques de Sécurité</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {reportData.safety.daysSinceLastIncident}
                    </div>
                    <div className="text-sm text-gray-600">Jours sans incident</div>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{reportData.safety.safetyRate}%</div>
                    <div className="text-sm text-gray-600">Taux de sécurité</div>
                  </div>
                  <div className="text-center p-6 bg-yellow-50 rounded-lg">
                    <div className="text-4xl font-bold text-yellow-600 mb-2">{reportData.safety.mttr}h</div>
                    <div className="text-sm text-gray-600">MTTR moyen</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tendances */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tendances Mensuelles</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Évolution des Incidents</h3>
                  <div className="space-y-2">
                    {reportData.incidents.byMonth.map((item) => (
                      <div key={item.month} className="flex justify-between items-center">
                        <span className="text-gray-700">{item.month}</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{
                                width: `${(item.count / Math.max(...reportData.incidents.byMonth.map((m) => m.count))) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Évolution des Opérations</h3>
                  <div className="space-y-2">
                    {reportData.operations.byMonth.map((item) => (
                      <div key={item.month} className="flex justify-between items-center">
                        <span className="text-gray-700">{item.month}</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${(item.count / Math.max(...reportData.operations.byMonth.map((m) => m.count))) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommandations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recommandations</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Réduction des incidents critiques</h4>
                    <p className="text-gray-600 text-sm">
                      Mettre en place des formations supplémentaires pour réduire les incidents de niveau critique.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Amélioration de la disponibilité</h4>
                    <p className="text-gray-600 text-sm">
                      Optimiser la maintenance préventive pour augmenter la disponibilité des machines.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Maintien des bonnes pratiques</h4>
                    <p className="text-gray-600 text-sm">
                      Continuer les efforts de sécurité qui ont permis d'atteindre un taux de 87.5%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Cliquez sur "Générer le Rapport" pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  )
}
