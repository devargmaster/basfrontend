import React, { useState, useEffect } from 'react';
import { getUserLogs } from '../utils/api.js';

export default function LogsSummary() {
  const [recentLogs, setRecentLogs] = useState([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    successRate: 0,
    failedLogins: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogsSummary();
  }, []);

  const fetchLogsSummary = async () => {
    try {
      // Obtener logs de las últimas 24 horas
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      
      const logs = await getUserLogs({
        fromDate: yesterday.toISOString(),
        toDate: today.toISOString(),
        limit: 10
      });

      setRecentLogs(logs.slice(0, 5)); // Solo los 5 más recientes

      // Calcular estadísticas
      const totalToday = logs.length;
      const successful = logs.filter(log => log.success).length;
      const successRate = totalToday > 0 ? Math.round((successful / totalToday) * 100) : 0;
      const failedLogins = logs.filter(log => log.action === 'Login Failed').length;

      setStats({
        totalToday,
        successRate,
        failedLogins
      });
    } catch (error) {
      console.error('Error fetching logs summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    const icons = {
      'Login Success': '🟢',
      'Login Failed': '🔴',
      'Create': '➕',
      'Update': '✏️',
      'Delete': '🗑️',
      'Read': '👁️'
    };
    return icons[action] || '⚪';
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        📊 Resumen de Actividad (24h)
      </h3>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.totalToday}</div>
          <div className="text-xs text-gray-600">Acciones totales</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.successRate}%</div>
          <div className="text-xs text-gray-600">Tasa de éxito</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.failedLogins}</div>
          <div className="text-xs text-gray-600">Logins fallidos</div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Actividad Reciente</h4>
        {recentLogs.length > 0 ? (
          <div className="space-y-2">
            {recentLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span>{getActionIcon(log.action)}</span>
                  <span className="text-gray-900">{log.userName}</span>
                  <span className="text-gray-500">{log.action}</span>
                </div>
                <span className="text-gray-400">{formatTime(log.timestamp)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay actividad reciente</p>
        )}
      </div>

      {/* Enlace para ver más */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => window.location.hash = '#logs'}
          className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Ver todos los logs →
        </button>
      </div>
    </div>
  );
}
