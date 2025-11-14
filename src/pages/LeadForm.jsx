import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createLead } from '../store/slices/leadSlice.js';
import api from '../services/api.js';

const LeadForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    status: 'NEW',
    source: '',
    value: 0,
    notes: '',
    assignedToId: '',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await dispatch(createLead(formData));
      if (createLead.fulfilled.match(result)) {
        navigate(`/leads/${result.payload.id}`);
      }
    } catch (error) {
      console.error('Failed to create lead:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Create New Lead</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGrid}>
          <div>
            <label style={styles.label}>First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={styles.input}
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="PROPOSAL">Proposal</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="CLOSED_WON">Closed Won</option>
              <option value="CLOSED_LOST">Closed Lost</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>Value</label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Source</label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Assign To</label>
            <select
              value={formData.assignedToId}
              onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
              style={styles.input}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label style={styles.label}>Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            style={styles.textarea}
            rows={4}
          />
        </div>
        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/leads')}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Creating...' : 'Create Lead'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#333',
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
    marginTop: '0.5rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default LeadForm;

