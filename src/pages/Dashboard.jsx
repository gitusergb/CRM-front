import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import api from '../services/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  if (!stats) {
    return <div style={styles.error}>Failed to load dashboard data</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div>
      <h1 style={styles.title}>Dashboard</h1>

      {/* Overview Cards */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Leads</h3>
          <p style={styles.cardValue}>{stats.overview.totalLeads}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Value</h3>
          <p style={styles.cardValue}>${stats.overview.totalValue.toLocaleString()}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Conversion Rate</h3>
          <p style={styles.cardValue}>{stats.overview.conversionRate}%</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Recent Activities</h3>
          <p style={styles.cardValue}>{stats.overview.recentActivities}</p>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.charts}>
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Leads by Status</h2>
          <BarChart width={500} height={300} data={stats.leadsByStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Leads by Stage</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={stats.leadsByStage}
              cx={250}
              cy={150}
              labelLine={false}
              label={({ stage, count }) => `${stage}: ${count}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {stats.leadsByStage.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Trend Chart */}
      {stats.trend && stats.trend.length > 0 && (
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Leads Trend (Last 30 Days)</h2>
          <LineChart width={1000} height={300} data={stats.trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" name="Leads Created" />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Value" />
          </LineChart>
        </div>
      )}

      {/* Top Users (Admin/Manager only) */}
      {stats.topUsers && stats.topUsers.length > 0 && (
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Top Performing Users</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Leads Won</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {stats.topUsers.map((item, index) => (
                <tr key={index}>
                  <td>{item.user.firstName} {item.user.lastName}</td>
                  <td>{item.leadsWon}</td>
                  <td>${item.totalValue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: '#dc3545',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  charts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  chartCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  chartTitle: {
    fontSize: '1.3rem',
    marginBottom: '1rem',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
};

export default Dashboard;

