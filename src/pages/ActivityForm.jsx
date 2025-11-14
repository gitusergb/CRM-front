import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const ActivityForm = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'NOTE',
    title: '',
    description: '',
    scheduledAt: '',
    completedAt: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/activities/lead/${leadId}`, formData);
      navigate(`/leads/${leadId}`);
    } catch (error) {
      console.error('Failed to create activity:', error);
      alert('Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Add Activity</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label style={styles.label}>Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
            style={styles.input}
          >
            <option value="NOTE">Note</option>
            <option value="CALL">Call</option>
            <option value="MEETING">Meeting</option>
            <option value="UPDATE">Update</option>
            <option value="EMAIL">Email</option>
          </select>
        </div>
        <div>
          <label style={styles.label}>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={styles.textarea}
            rows={4}
          />
        </div>
        <div>
          <label style={styles.label}>Scheduled At</label>
          <input
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Completed At</label>
          <input
            type="datetime-local"
            value={formData.completedAt}
            onChange={(e) => setFormData({ ...formData, completedAt: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => navigate(`/leads/${leadId}`)}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Creating...' : 'Create Activity'}
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
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
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
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
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

export default ActivityForm;

