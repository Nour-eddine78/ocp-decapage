"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../app/Layout";
import { Server, Wrench, AlertTriangle, BarChart, TrendingUp, Activity, Clock } from "lucide-react";

const DashboardCard = ({ title, value, icon: Icon, color, trend, subtitle, isLoading = false }) => (
  <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-emerald-100/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-emerald-200">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
        <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trend.startsWith("+") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          <TrendingUp className={`h-3 w-3 ${trend.startsWith("-") ? "rotate-180" : ""}`} />
          {trend}
        </div>
      )}
    </div>
    <div className="space-y-2">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
      {isLoading ? (
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
      ) : (
        <p className="text-2xl sm:text-3xl font-bold text-emerald-800 group-hover:text-emerald-700 transition-colors">
          {value}
        </p>
      )}
      {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, time, status }) => (
  <div className="flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-gray-50/80 hover:bg-emerald-50/80 transition-all duration-200 group">
    <div
      className={`p-2 rounded-lg ${
        status === "success"
          ? "bg-green-100 text-green-600"
          : status === "warning"
          ? "bg-yellow-100 text-yellow-600"
          : status === "error"
          ? "bg-red-100 text-red-600"
          : "bg-blue-100 text-blue-600"
      }`}
    >
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
        {title}
      </p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
    <div
      className={`h-2 w-2 rounded-full ${
        status === "success"
          ? "bg-green-400"
          : status === "warning"
          ? "bg-yellow-400"
          : status === "error"
          ? "bg-red-400"
          : "bg-blue-400"
      }`}
    ></div>
  </div>
);

export default function Dashboard() {
  const [role, setRole] = useState(localStorage.getItem("role") || "Viewer");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    machines: 0,
    operations: 0,
    incidents: 0,
    performances: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      setRole(localStorage.getItem("role") || "Viewer");
      setUserId(localStorage.getItem("userId") || "");

      if (!token) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const [machinesRes, operationsRes, incidentsRes, performancesRes, recentRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/machines/count`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/api/operations/count`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/api/incidents/count`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/api/performances/score`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/api/incidents/recent`, { headers }),
        ]);

        if (
          machinesRes.status === 401 ||
          operationsRes.status === 401 ||
          incidentsRes.status === 401 ||
          performancesRes.status === 401 ||
          recentRes.status === 401
        ) {
          localStorage.clear();
          navigate("/login");
          throw new Error("Unauthorized access");
        }

        const [machinesData, operationsData, incidentsData, performancesData, recentData] = await Promise.all([
          machinesRes.json(),
          operationsRes.json(),
          incidentsRes.json(),
          performancesRes.json(),
          recentRes.json(),
        ]);

        if (!machinesData.success || !operationsData.success || !incidentsData.success || !performancesData.success || !recentData.success) {
          const errors = [];
          if (!machinesData.success) errors.push(`Machines count: ${machinesData.message}`);
          if (!operationsData.success) errors.push(`Operations count: ${operationsData.message}`);
          if (!incidentsData.success) errors.push(`Incidents count: ${incidentsData.message}`);
          if (!performancesData.success) errors.push(`Performance score: ${performancesData.message}`);
          if (!recentData.success) errors.push(`Recent incidents: ${recentData.message}`);
          throw new Error(errors.join("; "));
        }

        setMetrics({
          machines: machinesData.data.count || 0,
          operations: operationsData.data.count || 0,
          incidents: incidentsData.data.count || 0,
          performances: performancesData.data.score || 0,
        });

        setRecentActivities(
          recentData.data.map((incident) => ({
            icon: incident.status === "open" ? AlertTriangle : incident.status === "in-progress" ? Wrench : Server,
            title: incident.title,
            time: new Date(incident.createdAt).toLocaleString(),
            status: incident.status === "open" ? "error" : incident.status === "in-progress" ? "warning" : "success",
          })) || []
        );

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data. Please try again.");
        setIsLoading(false);
        if (err.message === "Unauthorized access") {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [navigate]);

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Bienvenue de retour, {role}</h1>
              <p className="text-emerald-100 text-base sm:text-lg">Vue d’ensemble de votre système et indicateurs clés pour aujourd’hui</p>
            </div>
            <div className="flex items-center gap-4 text-emerald-100">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">
                Dernière mise à jour: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <DashboardCard
            title="Active Machines"
            value={metrics.machines}
            icon={Server}
            color="from-emerald-500 to-green-500"
            trend="+12%"
            subtitle="vs last month"
            isLoading={isLoading}
          />
          <DashboardCard
            title="Ongoing Operations"
            value={metrics.operations}
            icon={Wrench}
            color="from-blue-500 to-indigo-500"
            trend="+8%"
            subtitle="active processes"
            isLoading={isLoading}
          />
          <DashboardCard
            title="Open Incidents"
            value={metrics.incidents}
            icon={AlertTriangle}
            color="from-red-500 to-orange-500"
            trend="-3%"
            subtitle="priority issues"
            isLoading={isLoading}
          />
          <DashboardCard
            title="Performance Score"
            value={`${metrics.performances}%`}
            icon={BarChart}
            color="from-purple-500 to-pink-500"
            trend="+15%"
            subtitle="overall efficiency"
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-emerald-100/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-emerald-800 flex items-center gap-2">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                Activité récente
              </h2>
              <button className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                Voir tout
              </button>
            </div>
            <div className="space-y-3">
              {isLoading ? (
                <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : recentActivities.length ? (
                recentActivities.map((activity, index) => <ActivityItem key={index} {...activity} />)
              ) : (
                <p className="text-sm text-gray-500">Aucune activité récente.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-emerald-100/50">
              <h3 className="text-base sm:text-lg font-bold text-emerald-800 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/incidents/new")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all duration-200 group"
                >
                  <AlertTriangle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-sm">Signaler un incident</span>
                </button>
                <button
                  onClick={() => navigate("/reports/new")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all duration-200 group"
                >
                  <BarChart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-sm">Générer un rapport</span>
                </button>
                <button
                  onClick={() => navigate("/operations/new")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-all duration-200 group"
                >
                  <Wrench className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-sm">Planifier une maintenance</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}