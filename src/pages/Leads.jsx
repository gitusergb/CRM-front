import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchLeads, deleteLead } from '../store/slices/leadSlice.js';
import api from '../services/api.js';

const Leads = () => {
  const dispatch = useDispatch();
  const { leads, loading } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({ status: '', search: '' });

  useEffect(() => {
    dispatch(fetchLeads(filters));
  }, [dispatch, filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await dispatch(deleteLead(id));
      dispatch(fetchLeads(filters));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      NEW: '#6c757d',
      CONTACTED: '#17a2b8',
      QUALIFIED: '#007bff',
      PROPOSAL: '#ffc107',
      NEGOTIATION: '#fd7e14',
      CLOSED_WON: '#28a745',
      CLOSED_LOST: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Leads</h1>
        <Link to="/leads/new" style={styles.button}>
          + New Lead
        </Link>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search leads..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={styles.input}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={styles.select}
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="PROPOSAL">Proposal</option>
          <option value="NEGOTIATION">Negotiation</option>
          <option value="CLOSED_WON">Closed Won</option>
          <option value="CLOSED_LOST">Closed Lost</option>
        </select>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div style={styles.loading}>Loading leads...</div>
      ) : leads.length === 0 ? (
        <div style={styles.empty}>No leads found</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Status</th>
                <th>Value</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link to={`/leads/${lead.id}`} style={styles.link}>
                      {lead.firstName} {lead.lastName}
                    </Link>
                  </td>
                  <td>{lead.company || '-'}</td>
                  <td>{lead.email || '-'}</td>
                  <td>
                    <span
                      style={{
                        ...styles.status,
                        backgroundColor: getStatusColor(lead.status),
                      }}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td>${lead.value?.toLocaleString() || '0'}</td>
                  <td>
                    {lead.assignedTo
                      ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}`
                      : 'Unassigned'}
                  </td>
                  <td>
                    <Link to={`/leads/${lead.id}`} style={styles.actionBtn}>
                      View
                    </Link>
                    {(user?.role === 'ADMIN' || user?.role === 'MANAGER' || lead.createdById === user?.id) && (
                      <button
                        onClick={() => handleDelete(lead.id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    )}
                  </td>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: '500',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '500',
  },
  status: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  actionBtn: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.85rem',
    marginRight: '0.5rem',
  },
  deleteBtn: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
};

export default Leads;

