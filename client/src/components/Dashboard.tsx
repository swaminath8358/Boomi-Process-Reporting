import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { DashboardSummary } from '../types';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiService.getDashboardSummary();
        setSummary(data);
      } catch (err: any) {
        setError(apiService.handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-gray-600 dark:text-gray-300">
        No dashboard data available
      </div>
    );
  }

  const { todayStats, weeklyStats, monthlyStats, environmentBreakdown } = summary;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Overview of Boomi integration processes
        </p>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-green-600 dark:text-green-400">✓</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Success Today
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {todayStats.success}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-red-600 dark:text-red-400">✗</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Failed Today
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {todayStats.failed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-blue-600 dark:text-blue-400">⟳</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    In Progress
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {todayStats.inProgress}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-yellow-600 dark:text-yellow-400">⚠</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Warnings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {todayStats.warning}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Breakdown */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Environment Breakdown
          </h3>
          <div className="mt-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {Object.entries(environmentBreakdown).map(([env, stats]) => (
                <div key={env} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    {env}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Total:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {stats.total}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 dark:text-green-400">Success:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {stats.success}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600 dark:text-red-400">Failed:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {stats.failed}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly and Monthly Stats */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Weekly Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Total Processes:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {weeklyStats.total}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Success Rate:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {weeklyStats.total > 0 
                  ? `${Math.round((weeklyStats.success / weeklyStats.total) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Avg Execution Time:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.round(weeklyStats.avgExecutionTime / 1000)}s
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Monthly Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Total Processes:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {monthlyStats.total}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Success Rate:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {monthlyStats.total > 0 
                  ? `${Math.round((monthlyStats.success / monthlyStats.total) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Avg Execution Time:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.round(monthlyStats.avgExecutionTime / 1000)}s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;