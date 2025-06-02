"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../app/Layout";
import { Users, Server, Zap, FileText, Shield, Database, Globe, Settings, TrendingUp, Activity } from "lucide-react";

const DashboardCard = ({ title, value, icon: Icon, color, trend, subtitle, isLoading = false, onClick }) => (
  <div
    className={`group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-emerald-100/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-emerald-200 ${onClick ? "cursor-pointer" : ""}`}
    onClick={onClick}
  >
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

export default function SuperadminDashboard() {
  const [role, setRole] = useState(localStorage.getItem("role") || "superadmin");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    users: 0,
    machines: 0,
    systemUptime: "0h 0m",
    reports: 0,
  });
  const [userActivity, setUserActivity] = useState([]);
  const [monitoring, setMonitoring] = useState({ cpu: 0, memory: 0, storage: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      setRole(localStorage.getItem("role") || "superadmin");
      setUserId(localStorage.getItem("userId") || "");

      if (!token) {
        setError("No authentication token found. Please log in.");
        localStorage.clear();
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const [usersRes, machinesRes, uptimeRes, reportsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/users/count`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/api/machines/count`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/api/users/system/uptime`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/api/reports/count`, { headers }),
        ]);

        if (
          usersRes.status === 401 ||
          machinesRes.status === 401 ||
          uptimeRes.status === 401 ||
          reportsRes.status === 401
        ) {
          localStorage.clear();
          setError("Session expired. Please log in again.");
          navigate("/login");
          throw new Error("Unauthorized access");
        }

        const [usersData, machinesData, uptimeData, reportsData] = await Promise.all([
          usersRes.json(),
          machinesRes.json(),
          uptimeRes.json(),
          reportsRes.json(),
        ]);

        if (
          !usersData.success ||
          !machinesData.success ||
          !uptimeData.success ||
          !reportsData.success
        ) {
          const errors = [];
          if (!usersData.success) errors.push(`Users count: ${usersData.message}`);
          if (!machinesData.success) errors.push(`Machines count: ${machinesData.message}`);
          if (!uptimeData.success) errors.push(`Uptime: ${uptimeData.message}`);
          if (!reportsData.success) errors.push(`Reports count: ${reportsData.message}`);
          throw new Error(errors.join("; "));
        }

        setMetrics({
          users: usersData.data.count || 0,
          machines: machinesData.data.count || 0,
          systemUptime: uptimeData.data.uptime || "0h 0m",
          reports: reportsData.data.count || 0,
        });

        // Mock user activity (since no endpoint exists)
        setUserActivity(
          usersData.data.users?.map((user) => ({
            action: `${user.name} logged in`,
            time: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "",
          })) || []
        );

        setMonitoring({
          cpu: uptimeData.data.cpu || 0,
          memory: uptimeData.data.memory || 0,
          storage: uptimeData.data.storage || 0,
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching superadmin dashboard data:", err);
        setError(err.message || "Failed to load dashboard data. Please try again.");
        setIsLoading(false);
        if (err.message.includes("Unauthorized")) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleUserManagement = () => {
    navigate("/admin/users");
  };

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
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Tableau de bord Superadmin</h1>
              </div>
              <p className="text-emerald-100 text-base sm:text-lg">
              Administration du système et gestion complète des utilisateurs
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold">{metrics.systemUptime}</div>
                <div className="text-xs sm:text-sm text-emerald-100">Temps de fonctionnement</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold">24/7</div>
                <div className="text-xs sm:text-sm text-emerald-100">Surveillance continue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <DashboardCard
            title="Nombre total d'utilisateurs"
            value={metrics.users}
            icon={Users}
            color="from-emerald-500 to-green-500"
            trend="+12%"
            subtitle="comptes actifs"
            isLoading={isLoading}
            onClick={handleUserManagement}
          />
          <DashboardCard
            title="Machines actives"
            value={metrics.machines}
            icon={Server}
            color="from-blue-500 to-indigo-500"
            trend="+6%"
            subtitle="systèmes en ligne"
            isLoading={isLoading}
          />
          <DashboardCard
            title="Temps de fonctionnement"
            value={metrics.systemUptime}
            icon={Zap}
            color="from-yellow-500 to-orange-500"
            trend="+0.1%"
            subtitle="ce mois-ci"
            isLoading={isLoading}
          />
          <DashboardCard
            title="Rapports en attente"
            value={metrics.reports}
            icon={FileText}
            color="from-purple-500 to-pink-500"
            trend="-8%"
            subtitle="en attente de révision"
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-emerald-100/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-emerald-800 flex items-center gap-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                Gestion des utilisateurs
              </h2>
              <button
                onClick={handleUserManagement}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Users className="h-4 w-4" />
                Gérer les utilisateurs
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-emerald-700">{metrics.users}</div>
                <div className="text-xs sm:text-sm text-emerald-600">Utilisateurs actifs</div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Activité récente</h4>
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  ) : userActivity.length ? (
                    userActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs sm:text-sm text-gray-700 truncate">{activity.action}</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Aucune activité récente.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-emerald-100/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-emerald-800 flex items-center gap-2">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
                Surveillance du système
              </h2>
              <button
                onClick={() => navigate("/monitoring")}
                className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Voir les détails
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div
                    className={
                      isLoading ? "text-sm text-gray-600" : "text-base sm:text-lg font-bold text-green-600"
                    }
                  >
                    {monitoring.cpu}%
                  </div>
                  <div className="text-xs text-gray-500">Processeur</div>
                </div>
                <div className="text-center">
                  <div
                    className={
                      isLoading ? "text-sm text-gray-600" : "text-base sm:text-lg font-bold text-blue-600"
                    }
                  >
                    {monitoring.memory}%
                  </div>
                  <div className="text-xs text-gray-500">Mémoire</div>
                </div>
                <div className="text-center">
                  <div
                    className={
                      isLoading ? "text-sm text-gray-600" : "text-base sm:text-lg font-bold text-purple-600"
                    }
                  >
                    {monitoring.storage}%
                  </div>
                  <div className="text-xs text-gray-500">Stockage</div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </Layout>
  );
}