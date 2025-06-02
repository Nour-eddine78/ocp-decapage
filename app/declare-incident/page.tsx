"use client"

import type React from "react"

import { useState } from "react"

export default function DeclareIncidentPage() {
  const [formData, setFormData] = useState({
    incidentDateTime: "",
    zone: "",
    niveau: "",
    machineId: "",
    severityLevel: "",
    description: "",
    declarantId: "",
    attachments: [],
    operationStopped: false,
    zoneSecured: false,
    injuries: false,
    injuredNames: [""],
    injuryTypes: [""],
    injuryTimes: [""],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const severityLevels = ["Faible", "Moyen", "Élevé", "Critique"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleArrayChange = (index: number, field: "injuredNames" | "injuryTypes" | "injuryTimes", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field: "injuredNames" | "injuryTypes" | "injuryTimes") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (index: number, field: "injuredNames" | "injuryTypes" | "injuryTimes") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulation d'envoi de données
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitMessage("Incident déclaré avec succès!")
      setFormData({
        incidentDateTime: "",
        zone: "",
        niveau: "",
        machineId: "",
        severityLevel: "",
        description: "",
        declarantId: "",
        attachments: [],
        operationStopped: false,
        zoneSecured: false,
        injuries: false,
        injuredNames: [""],
        injuryTypes: [""],
        injuryTimes: [""],
      })
    } catch (error) {
      setSubmitMessage("Erreur lors de la déclaration de l'incident")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Déclaration d'Incident</h1>
            <p className="text-green-100 mt-1">Veuillez remplir tous les champs obligatoires</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date et Heure de l'Incident *</label>
                <input
                  type="datetime-local"
                  name="incidentDateTime"
                  value={formData.incidentDateTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de Gravité *</label>
                <select
                  name="severityLevel"
                  value={formData.severityLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionner un niveau</option>
                  {severityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zone</label>
                <input
                  type="text"
                  name="zone"
                  value={formData.zone}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Machine</label>
                <input
                  type="text"
                  name="machineId"
                  value={formData.machineId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Déclarant</label>
                <input
                  type="text"
                  name="declarantId"
                  value={formData.declarantId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Décrivez l'incident en détail..."
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="operationStopped"
                  checked={formData.operationStopped}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Opération arrêtée</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="zoneSecured"
                  checked={formData.zoneSecured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Zone sécurisée</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="injuries"
                  checked={formData.injuries}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Blessures</label>
              </div>
            </div>

            {/* Section Blessures */}
            {formData.injuries && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations sur les Blessures</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Noms des Blessés</label>
                    {formData.injuredNames.map((name, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => handleArrayChange(index, "injuredNames", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Nom du blessé"
                        />
                        {formData.injuredNames.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, "injuredNames")}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem("injuredNames")}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      + Ajouter un blessé
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Types de Blessures</label>
                    {formData.injuryTypes.map((type, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={type}
                          onChange={(e) => handleArrayChange(index, "injuryTypes", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Type de blessure"
                        />
                        {formData.injuryTypes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, "injuryTypes")}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem("injuryTypes")}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      + Ajouter un type
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heures des Blessures</label>
                    {formData.injuryTimes.map((time, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="datetime-local"
                          value={time}
                          onChange={(e) => handleArrayChange(index, "injuryTimes", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        {formData.injuryTimes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, "injuryTimes")}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem("injuryTimes")}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      + Ajouter une heure
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                {isSubmitting ? "Déclaration en cours..." : "Déclarer l'Incident"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
