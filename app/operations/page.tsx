"use client"

import type React from "react"

import { useState, useEffect } from "react"

export default function OperationsPage() {
  const [formData, setFormData] = useState({
    ficheId: "",
    interventionDate: "",
    decapingMethod: "",
    machine: "",
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

  const [availableMachines, setAvailableMachines] = useState<string[]>([])
  const [calculatedMetrics, setCalculatedMetrics] = useState({
    metrage: 0,
    yield: 0,
    decapedVolume: 0,
    availability: 0,
    workCycle: "0/0",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const decapingMethods = ["Poussage", "Casement", "Transport"]
  const machinesByMethod = {
    Poussage: ["D11"],
    Casement: ["750011", "750012", "PH1", "PH2", "200B1", "Libhere"],
    Transport: ["Transwine", "Procaneq"],
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Mettre à jour les machines disponibles quand la méthode change
    if (name === "decapingMethod") {
      setAvailableMachines(machinesByMethod[value as keyof typeof machinesByMethod] || [])
      setFormData((prev) => ({ ...prev, machine: "" }))
    }
  }

  // Calculer les métriques automatiquement
  useEffect(() => {
    const profondeur = Number.parseFloat(formData.profondeur) || 0
    const nombreTrous = Number.parseFloat(formData.nombreTrous) || 1
    const longueur = Number.parseFloat(formData.longueur) || 0
    const largeur = Number.parseFloat(formData.largeur) || 0
    const operatingHours = Number.parseFloat(formData.operatingHours) || 1
    const downtime = Number.parseFloat(formData.downtime) || 0

    const metrage = profondeur * nombreTrous
    const yieldValue = metrage / operatingHours
    const decapedVolume = longueur * largeur * profondeur
    const availability = operatingHours / (operatingHours + downtime)
    const workCycle = `${operatingHours}/${downtime}`

    setCalculatedMetrics({
      metrage: isNaN(metrage) ? 0 : metrage,
      yield: isNaN(yieldValue) ? 0 : yieldValue,
      decapedVolume: isNaN(decapedVolume) ? 0 : decapedVolume,
      availability: isNaN(availability) ? 0 : availability,
      workCycle,
    })
  }, [
    formData.profondeur,
    formData.nombreTrous,
    formData.longueur,
    formData.largeur,
    formData.operatingHours,
    formData.downtime,
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulation d'envoi de données
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitMessage("Opération enregistrée avec succès!")
      setFormData({
        ficheId: "",
        interventionDate: "",
        decapingMethod: "",
        machine: "",
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
      setAvailableMachines([])
    } catch (error) {
      setSubmitMessage("Erreur lors de l'enregistrement de l'opération")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Fiche d'Opération</h1>
            <p className="text-green-100 mt-1">Enregistrement des opérations de travail</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Fiche *</label>
                <input
                  type="text"
                  name="ficheId"
                  value={formData.ficheId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Identifiant unique"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'Intervention *</label>
                <input
                  type="date"
                  name="interventionDate"
                  value={formData.interventionDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Méthode de Décapage *</label>
                <select
                  name="decapingMethod"
                  value={formData.decapingMethod}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionner une méthode</option>
                  {decapingMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Machine *</label>
                <select
                  name="machine"
                  value={formData.machine}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.decapingMethod}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="">Sélectionner une machine</option>
                  {availableMachines.map((machine) => (
                    <option key={machine} value={machine}>
                      {machine}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poste</label>
                <input
                  type="text"
                  name="poste"
                  value={formData.poste}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Panneau</label>
                <input
                  type="text"
                  name="panneau"
                  value={formData.panneau}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tranche</label>
                <input
                  type="text"
                  name="tranche"
                  value={formData.tranche}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                <input
                  type="text"
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">État Machine</label>
                <input
                  type="text"
                  name="machineState"
                  value={formData.machineState}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Heures et volumes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heures d'Opération</label>
                <input
                  type="number"
                  step="0.1"
                  name="operatingHours"
                  value={formData.operatingHours}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temps d'Arrêt</label>
                <input
                  type="number"
                  step="0.1"
                  name="downtime"
                  value={formData.downtime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volume Sauté</label>
                <input
                  type="number"
                  step="0.1"
                  name="skippedVolume"
                  value={formData.skippedVolume}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dimensions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profondeur (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="profondeur"
                    value={formData.profondeur}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de Trous</label>
                  <input
                    type="number"
                    name="nombreTrous"
                    value={formData.nombreTrous}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longueur (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="longueur"
                    value={formData.longueur}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Largeur (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="largeur"
                    value={formData.largeur}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Métriques calculées */}
            <div className="bg-white border-2 border-green-200 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Métriques Calculées</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{calculatedMetrics.metrage.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Métrage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{calculatedMetrics.yield.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Rendement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{calculatedMetrics.decapedVolume.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Volume Décapé</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(calculatedMetrics.availability * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Disponibilité</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{calculatedMetrics.workCycle}</div>
                  <div className="text-sm text-gray-600">Cycle de Travail</div>
                </div>
              </div>
            </div>

            {/* Observations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observations</label>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Notes et observations sur l'opération..."
              />
            </div>

            {/* Message de soumission */}
            {submitMessage && (
              <div
                className={`p-4 rounded-md ${submitMessage.includes("succès") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {submitMessage}
              </div>
            )}

            {/* Boutons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enregistrement en cours..." : "Enregistrer l'Opération"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
