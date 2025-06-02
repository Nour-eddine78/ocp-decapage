"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Plus, Calendar, Check, AlertCircle, Download, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../app/Layout";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

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
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };
  const sizes = { sm: "px-3 py-2 text-sm", default: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-emerald-100 text-emerald-800",
    secondary: "bg-gray-100 text-gray-700",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-emerald-600 text-emerald-600",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
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
        <span>{value || "Sélectionner..."}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
          {children}
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
    className={`flex min-h-[60px] w-full rounded-xl border border-gray-300 bg-white p-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`}
    {...props}
  />
);

// Main Reports Component
const Reports = () => {
  const [operations, setOperations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    dateRange: "monthly",
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    description: "",
    method: "",
    selectedOperationId: "",
    ficheId: "",
    filterType: "all" // all, method, id, date, ficheId
  });

  const [selectedOperation, setSelectedOperation] = useState(null);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const methods = ["Poussage", "Casement", "Transport", "Tous"];
  const dateRanges = [
    { value: "daily", label: "Quotidien" },
    { value: "weekly", label: "Hebdomadaire" },
    { value: "monthly", label: "Mensuel" },
    { value: "quarterly", label: "Trimestriel" },
    { value: "yearly", label: "Annuel" },
    { value: "custom", label: "Personnalisé" },
  ];

  const filterTypes = [
    { value: "all", label: "Toutes les opérations" },
    { value: "method", label: "Par méthode" },
    { value: "id", label: "Par ID" },
    { value: "date", label: "Par date" },
    { value: "ficheId", label: "Par ID Fiche" }
  ];

  const fetchData = async (signal) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Aucun jeton d'authentification trouvé. Veuillez vous connecter.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      if (!isMounted) return;
      setIsLoading(true);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/operations`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal,
      });

      if (response.status === 401) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API (${response.status}): ${errorText.substring(0, 100)}...`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Échec de la récupération des opérations");
      }

      if (isMounted) {
        setOperations(data.data || []);
      }
    } catch (err) {
      // Ignorer les erreurs d'annulation car elles sont normales lors du démontage
      if (err.name === "AbortError") {
        return;
      }
      console.error("Erreur lors de la récupération des opérations:", err);
      if (isMounted) {
        setError(err.message || "Échac du chargement des opérations. Veuillez réessayer.");
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    setIsMounted(true);

    const fetchWithAbort = async () => {
      try {
        await fetchData(controller.signal);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        throw err;
      }
    };

    fetchWithAbort();

    return () => {
      controller.abort();
      setIsMounted(false);
    };
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "dateRange") {
      const now = dayjs();
      let startDate, endDate;

      switch (value) {
        case "daily":
          startDate = now.startOf("day");
          endDate = now.endOf("day");
          break;
        case "weekly":
          startDate = now.startOf("week");
          endDate = now.endOf("week");
          break;
        case "monthly":
          startDate = now.startOf("month");
          endDate = now.endOf("month");
          break;
        case "quarterly":
          startDate = now.startOf("quarter");
          endDate = now.endOf("quarter");
          break;
        case "yearly":
          startDate = now.startOf("year");
          endDate = now.endOf("year");
          break;
        default:
          return;
      }

      setFormData((prev) => ({
        ...prev,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setFormError("Le titre du rapport est requis.");
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      setFormError("Les dates de début et de fin sont requises.");
      return false;
    }
    if (!dayjs(formData.startDate).isValid() || !dayjs(formData.endDate).isValid()) {
      setFormError("Les dates fournies ne sont pas valides.");
      return false;
    }
    if (dayjs(formData.startDate).isAfter(dayjs(formData.endDate))) {
      setFormError("La date de début doit être antérieure à la date de fin.");
      return false;
    }
    setFormError("");
    return true;
  };

  const filterByDate = (items, dateField, startDate, endDate) =>
    items.filter((item) => {
      if (!item || !dayjs(item[dateField]).isValid()) {
        return false;
      }
      const itemDate = dayjs(item[dateField]);
      return itemDate.isBetween(dayjs(startDate), dayjs(endDate), null, "[]");
    });

  const filterByMethod = (items, method) =>
    items.filter((item) => method === "Tous" || item.decapingMethod === method);

  const calculateMetrics = (operation) => {
    const operatingHours = Number.parseFloat(operation.operatingHours) || 0;
    const downtime = Number.parseFloat(operation.downtime) || 0;
    const profondeur = Number.parseFloat(operation.profondeur) || 0;
    const nombreTrous = Number.parseInt(operation.nombreTrous) || 0;
    const longueur = Number.parseFloat(operation.longueur) || 0;
    const largeur = Number.parseFloat(operation.largeur) || 0;

    const totalHours = operatingHours + downtime;
    const metrage = profondeur * nombreTrous;
    const decapedVolume = longueur * largeur * profondeur;
    const yieldValue = operatingHours ? metrage / operatingHours : 0;
    const availability = totalHours ? (operatingHours / totalHours) * 100 : 0;
    const workCycle = operatingHours && downtime ? `${operatingHours}h marche / ${downtime}h arrêt` : "N/A";

    return {
      metrage: metrage.toFixed(2),
      yield: yieldValue.toFixed(2),
      decapedVolume: decapedVolume.toFixed(2),
      availability: availability.toFixed(2),
      workCycle,
    };
  };

  const sanitizeText = (text) => {
    return text.replace(/[<>{}]/g, "");
  };

  const generatePDFReport = async (data, selectedOperation) => {
    try {
      const doc = new jsPDF();
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width;
      const pageHeight = pageSize.height;

      // Header avec logo
      try {
        // Utiliser une URL relative correcte
        const logoPath = require('../../assets/logo1.png');
        doc.addImage(logoPath, 'PNG', 20, 20, 40, 40);
      } catch (err) {
        console.warn('Impossible de charger le logo:', err);
        // Si le logo ne peut pas être chargé, on continue sans lui
      }
      
      // Titre de l'application
      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129);
      doc.text("Application gestion de Décapage", 70, 30);
      
      // Titre du rapport
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(sanitizeText(formData.title), 20, 70);

      // Informations de filtrage
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Filtré par: ${filterTypes.find(t => t.value === formData.filterType).label}`, 20, 80);
      
      if (formData.filterType === "method") {
        doc.text(`Méthode: ${formData.method}`, 20, 90);
      } else if (formData.filterType === "id") {
        doc.text(`ID de l'opération: ${formData.selectedOperationId}`, 20, 90);
      } else if (formData.filterType === "date") {
        doc.text(`Période: ${formData.startDate} - ${formData.endDate}`, 20, 90);
      }
      
      doc.text(`Généré le: ${dayjs().format("DD/MM/YYYY HH:mm")}`, 20, 100);

      let yPosition = 110;

      if (data.length > 0) {
        const tableData = data.map((operation, index) => {
          const metrics = calculateMetrics(operation);
          return [
            `${index + 1}. ${operation.ficheId || "N/A"}`,
            dayjs(operation.interventionDateTime).format("DD/MM/YYYY HH:mm"),
            operation.decapingMethod || "N/A",
            operation.machine?.name || "N/A",
            operation.operatingHours || "0",
            operation.downtime || "0",
            metrics.metrage || "0",
            metrics.yield || "0",
            `${metrics.availability}%`,
            metrics.workCycle || "N/A",
            operation.observations || "N/A"
          ];
        });

        // Table des opérations
        doc.setFontSize(14);
        doc.setTextColor(16, 185, 129);
        doc.text("Détails des Opérations", 20, yPosition);
        yPosition += 15;

        // Configuration du tableau
        const tableConfig = {
          startY: yPosition,
          head: [[
            "ID",
            "Date",
            "Méthode",
            "Machine",
            "Heures",
            "Temps d'arrêt",
            "Métrage",
            "Rendement",
            "Dispo.",
            "Cycle",
            "Observations"
          ]],
          body: tableData,
          theme: "striped",
          headStyles: { fillColor: [16, 185, 129] },
          margin: { top: 10 },
          styles: { fontSize: 8 },
          columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'center' },
            2: { halign: 'left' },
            3: { halign: 'left' },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right' },
            7: { halign: 'right' },
            8: { halign: 'right' },
            9: { halign: 'right' },
            10: { halign: 'left', cellWidth: 50 }
          },
          didDrawCell: (data) => {
            if (data.column.index === 10) { // Observations
              const cell = data.cell;
              if (cell.text) {
                const lines = doc.splitTextToSize(cell.text, 50);
                if (lines.length > 1) {
                  cell.styles.lineHeight = 1.5;
                  cell.raw = {
                    ...cell.raw,
                    height: lines.length * 5
                  };
                }
              }
            }
          }
        };

        autoTable(doc, tableConfig);
        yPosition = doc.lastAutoTable.finalY + 20;

        // Statistiques générales
        doc.setFontSize(12);
        doc.setTextColor(16, 185, 129);
        doc.text("Statistiques Générales", 20, yPosition);
        yPosition += 15;

        const totalOperatingHours = data.reduce((sum, op) => sum + (Number(op.operatingHours) || 0), 0);
        const totalDowntime = data.reduce((sum, op) => sum + (Number(op.downtime) || 0), 0);
        const totalMetrage = data.reduce((sum, op) => sum + (Number(calculateMetrics(op).metrage) || 0), 0);
        const totalOperations = data.length;

        const summaryData = [
          ["Total des heures de fonctionnement", totalOperatingHours.toFixed(2)],
          ["Total du temps d'arrêt", totalDowntime.toFixed(2)],
          ["Nombre total d'opérations", totalOperations],
          ["Métrage total", totalMetrage.toFixed(2)],
          ["Moyenne d'heures par opération", totalOperations ? (totalOperatingHours / totalOperations).toFixed(2) : "0"],
          ["Moyenne de metrage par opération", totalOperations ? (totalMetrage / totalOperations).toFixed(2) : "0"]
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [["Statistique", "Valeur"]],
          body: summaryData,
          theme: "striped",
          headStyles: { fillColor: [16, 185, 129] },
          margin: { top: 10 },
          styles: { fontSize: 8 },
          columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'right' }
          }
        });

        // Footer avec crédits
        doc.setFontSize(8);
        doc.setTextColor(128);
        doc.text("Développé par Nour-eddine HMAMI", 20, pageHeight - 10);
      } else {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Aucune opération trouvée pour cette période.", 20, yPosition);
      }

      const filename = `rapport_operations_${dayjs().format("YYYYMMDD_HHmm")}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("Erreur détaillée:", err);
      throw new Error(`Erreur lors de la génération du PDF: ${err.message}`);
    }
  };

  const generateReport = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let filteredData = operations;

      // Filtrer selon le type de filtre sélectionné
      switch (formData.filterType) {
        case "method":
          filteredData = filterByMethod(operations, formData.method);
          break;
        case "id":
          filteredData = operations.filter(op => op._id === formData.selectedOperationId);
          break;
        case "date":
          const startDate = dayjs(formData.startDate);
          const endDate = dayjs(formData.endDate);
          filteredData = filterByDate(operations, "interventionDateTime", startDate, endDate);
          break;
        case "ficheId":
          filteredData = operations.filter(op => op.ficheId === formData.ficheId);
          break;
        default:
          break;
      }

      await generatePDFReport(filteredData, selectedOperation);
      setIsModalOpen(false);
      setFormData({
        title: "",
        dateRange: "monthly",
        startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
        endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
        description: "",
        method: "",
        selectedOperationId: "",
        filterType: "all"
      });
      setSelectedOperation(null);
    } catch (err) {
      console.error("Erreur lors de la génération du rapport:", err);
      setFormError(err.message);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
            <h3 className="mt-2 text-lg font-medium text-red-600">Erreur</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => window.location.reload()}
                variant="destructive"
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-800">Rapports d'Opérations</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" />
              Générer un Rapport
            </Button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-emerald-800">Générer un Rapport</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={generateReport} className="space-y-4">
                {formError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                    {formError}
                  </div>
                )}

                <div>
                  <Label htmlFor="title">Titre du Rapport</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Entrez un titre pour le rapport"
                  />
                </div>

                <div>
                  <Label htmlFor="filterType">Type de Filtrage</Label>
                  <Select
                    value={formData.filterType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, filterType: value }))}
                  >
                    {filterTypes.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        onClick={() => setFormData(prev => ({ ...prev, filterType: type.value }))}
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {formData.filterType === "method" && (
                  <div>
                    <Label htmlFor="method">Méthode</Label>
                    <Select
                      value={formData.method}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, method: value }))}
                    >
                      {methods.map((method) => (
                        <SelectItem
                          key={method}
                          value={method}
                          onClick={() => setFormData(prev => ({ ...prev, method: method }))}
                        >
                          {method}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}

                {formData.filterType === "id" && (
                  <div>
                    <Label htmlFor="operationId">ID de l'Opération</Label>
                    <Select
                      value={formData.selectedOperationId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, selectedOperationId: value }))}
                    >
                      <SelectItem value="" onClick={() => setFormData(prev => ({ ...prev, selectedOperationId: "" }))}>
                        Sélectionner une opération
                      </SelectItem>
                      {operations.map((op) => (
                        <SelectItem
                          key={op._id}
                          value={op._id}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, selectedOperationId: op._id }));
                            setSelectedOperation(op);
                          }}
                        >
                          {op.ficheId} - {op.decapingMethod}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}

                {formData.filterType === "ficheId" && (
                  <div>
                    <Label htmlFor="ficheId">ID de la Fiche</Label>
                    <Input
                      id="ficheId"
                      name="ficheId"
                      value={formData.ficheId}
                      onChange={handleInputChange}
                      placeholder="Entrez l'ID de la fiche"
                    />
                  </div>
                )}

                {formData.filterType === "date" && (
                  <div>
                    <Label htmlFor="dateRange">Période</Label>
                    <Select
                      value={formData.dateRange}
                      onValueChange={(value) => handleSelectChange("dateRange", value)}
                    >
                      {dateRanges.map((range) => (
                        <SelectItem
                          key={range.value}
                          value={range.value}
                          onClick={() => handleSelectChange("dateRange", range.value)}
                        >
                          {range.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="secondary"
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="default">
                    Générer
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {operations.length > 0 ? (
            operations
              .sort((a, b) => 
                dayjs(b.interventionDateTime).diff(dayjs(a.interventionDateTime))
              )
              .map((operation) => {
              const metrics = calculateMetrics(operation);
              return (
                <div key={operation._id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/50 p-4 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-emerald-800">
                        {operation.ficheId} - {operation.decapingMethod}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {dayjs(operation.interventionDateTime).format("DD/MM/YYYY HH:mm")}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">
                      {operation.machine?.name || "N/A"}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      Heures: {operation.operatingHours}h - Temps d'arrêt: {operation.downtime}h
                    </p>
                    <p className="text-sm">
                      Métrage: {metrics.metrage} - Rendement: {metrics.yield}
                    </p>
                    <p className="text-sm">
                      Disponibilité: {metrics.availability}% - Cycle: {metrics.workCycle}
                    </p>
                    {operation.observations && (
                      <p className="text-sm">
                        Observations: {operation.observations}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/50 p-4">
              <p className="text-gray-600">Aucune opération trouvée.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
