import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

interface RecentActivity {
  type: string;
  description: string;
  projectName: string;
  timestamp: string;
}

interface UserStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionRate: number;
  projectsProgress: Record<string, number>;
  recentActivities: RecentActivity[];
  tasksCompletedOverTime: Record<string, number>;
}

function Analytics() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'PROJECT_CREATED':
        return (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
        );
      case 'TASK_COMPLETED':
        return (
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'TASK_CREATED':
        return (
          <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p>Failed to load statistics</p>
      </div>
    );
  }

  const chartData = Object.entries(stats.tasksCompletedOverTime).slice(-7);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics & Insights</h1>
          <p className="text-base-content/70">Track your productivity and project progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/60 text-sm">Total Projects</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalProjects}</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/60 text-sm">Total Tasks</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalTasks}</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-info/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/60 text-sm">Completed</p>
                  <p className="text-3xl font-bold mt-1">{stats.completedTasks}</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/60 text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold mt-1">{stats.completionRate}%</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tasks Completed Chart */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Tasks Completed (Last 7 Days)</h2>
              <div className="flex items-end justify-between gap-2 h-64">
                {chartData.map(([date, count]) => {
                  const maxCount = Math.max(...chartData.map(([, c]) => c), 1);
                  const heightPercent = (count / maxCount) * 100;
                  const dateObj = new Date(date);
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-base-300 rounded-lg relative" style={{ height: '200px' }}>
                        <div 
                          className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-secondary rounded-lg transition-all duration-500 hover:opacity-80"
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-base-content/60">{dayName}</p>
                        <p className="text-sm font-semibold">{count}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Project Progress */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Project Progress</h2>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {Object.entries(stats.projectsProgress).length > 0 ? (
                  Object.entries(stats.projectsProgress).map(([projectName, progress]) => (
                    <div key={projectName}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{projectName}</span>
                        <span className="text-sm text-base-content/60">{progress}%</span>
                      </div>
                      <div className="w-full bg-base-300 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-base-content/60">
                    <p>No projects yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-base-content/60">
                        {activity.projectName} • {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-base-content/60">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
