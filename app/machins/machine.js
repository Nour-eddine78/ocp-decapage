"use client"

import { useState } from "react"


function Machine() {
  const [machines, setMachines] = useState([
    {
      id: 1,
      nom: "Fraiseuse CNC",
      methode: "Usinage",
      description: "Machine de fraisage à commande numérique pour la fabrication de pièces métalliques de précision",
    },
    {
      id: 2,
      nom: "Imprimante 3D",
      methode: "Fabrication additive",
      description: "Imprimante 3D pour prototypage rapide et production de pièces en plastique",
    },
  ])

  const [formData, setFormData] = useState({
    nom: "",
    methode: "",
    description: "",
  })

  const [editingMachine, setEditingMachine] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.nom || !formData.methode || !formData.description) {
      alert("Veuillez remplir tous les champs")
      return
    }

    if (editingMachine) {
      // Mise à jour d'une machine existante
      setMachines((prev) =>
        prev.map((machine) => (machine.id === editingMachine.id ? { ...machine, ...formData } : machine)),
      )
    } else {
      // Ajout d'une nouvelle machine
      const newMachine = {
        id: Date.now(),
        ...formData,
      }
      setMachines((prev) => [...prev, newMachine])
    }

    // Réinitialiser le formulaire
    setFormData({ nom: "", methode: "", description: "" })
    setEditingMachine(null)
    setIsModalOpen(false)
  }

  const handleEdit = (machine) => {
    setEditingMachine(machine)
    setFormData({
      nom: machine.nom,
      methode: machine.methode,
      description: machine.description,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setMachines((prev) => prev.filter((machine) => machine.id !== id))
    setShowDeleteConfirm(null)
  }

  const handleCancel = () => {
    setFormData({ nom: "", methode: "", description: "" })
    setEditingMachine(null)
    setIsModalOpen(false)
  }

  const openAddModal = () => {
    setEditingMachine(null)
    setFormData({ nom: "", methode: "", description: "" })
    setIsModalOpen(true)
  }

  // Icônes SVG
  const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )

  const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  )

  const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )

  const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Machines</h1>
            <p className="text-gray-600 mt-2">Gérez votre parc de machines industrielles</p>
          </div>

          <button
            onClick={openAddModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-sm"
          >
            <PlusIcon />
            Ajouter une machine
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Liste des Machines</h2>
            <p className="text-gray-600 mt-1">
              {machines.length} machine{machines.length > 1 ? "s" : ""} enregistrée{machines.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="p-6">
            {machines.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">Aucune machine enregistrée</p>
                <p className="text-gray-400 mt-2">Cliquez sur "Ajouter une machine" pour commencer</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Méthode</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 hidden md:table-cell">
                        Description
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {machines.map((machine) => (
                      <tr key={machine.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-medium text-gray-900">{machine.nom}</td>
                        <td className="py-4 px-4 text-gray-700">{machine.methode}</td>
                        <td className="py-4 px-4 text-gray-700 hidden md:table-cell max-w-xs">
                          <div className="truncate" title={machine.description}>
                            {machine.description}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(machine)}
                              className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors duration-200"
                              title="Modifier"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(machine.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200"
                              title="Supprimer"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal pour ajouter/modifier */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingMachine ? "Modifier la machine" : "Ajouter une nouvelle machine"}
                  </h3>
                  <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <CloseIcon />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">
                  {editingMachine
                    ? "Modifiez les informations de la machine ci-dessous."
                    : "Remplissez les informations de la nouvelle machine ci-dessous."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la machine
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    placeholder="Ex: Fraiseuse CNC"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="methode" className="block text-sm font-medium text-gray-700 mb-2">
                    Méthode
                  </label>
                  <input
                    type="text"
                    id="methode"
                    value={formData.methode}
                    onChange={(e) => handleInputChange("methode", e.target.value)}
                    placeholder="Ex: Usinage"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Décrivez la machine et ses capacités..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    {editingMachine ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer la machine "{machines.find((m) => m.id === showDeleteConfirm)?.nom}
                  " ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Machine
