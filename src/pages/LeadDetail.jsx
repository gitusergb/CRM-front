import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLead, updateLead } from '../store/slices/leadSlice.js';
import api from '../services/api.js';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentLead, loading } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const [activities, setActivities] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    dispatch(fetchLead(id));
    fetchActivities();
  }, [id, dispatch]);

  useEffect(() => {
    if (currentLead) {
      setFormData({
        firstName: currentLead.firstName,
        lastName: currentLead.lastName,
        email: currentLead.email || '',
        phone: currentLead.phone || '',
        company: currentLead.company || '',
        title: currentLead.title || '',
        status: currentLead.status,
        source: currentLead.source || '',
        value: currentLead.value || 0,
        notes: currentLead.notes || '',
        assignedToId: currentLead.assignedToId || '',
      });
    }
  }, [currentLead]);

  const fetchActivities = async () => {
    try {
      const response = await api.get(`/activities/lead/${id}`);
      setActivities(response.data.data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateLead({ id, data: formData }));
    setShowEditForm(false);
    dispatch(fetchLead(id));
  };

  const handleAddActivity = () => {
    navigate(`/leads/${id}/activity`);
  };

  if (loading) {
    return <div style={styles.loading}>Loading lead...</div>;
  }

  if (!currentLead) {
    return <div style={styles.error}>Lead not found</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <Link to="/leads" style={styles.backLink}>← Back to Leads</Link>
        <h1 style={styles.title}>
          {currentLead.firstName} {currentLead.lastName}
        </h1>
        <button
          onClick={() => setShowEditForm(!showEditForm)}
          style={styles.button}
        >
          {showEditForm ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {showEditForm ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div>
              <label>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={styles.input}
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={styles.input}
              />
            </div>
            <div>
              <label>Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                style={styles.input}
              />
            </div>
            <div>
              <label>Status</label>
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
              <label>Value</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>
          <div>
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={styles.textarea}
              rows={4}
            />
          </div>
          <button type="submit" style={styles.submitBtn}>Save Changes</button>
        </form>
      ) : (
        <div style={styles.details}>
          <div style={styles.infoCard}>
            <h2>Contact Information</h2>
            <p><strong>Email:</strong> {currentLead.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {currentLead.phone || 'N/A'}</p>
            <p><strong>Company:</strong> {currentLead.company || 'N/A'}</p>
            <p><strong>Title:</strong> {currentLead.title || 'N/A'}</p>
          </div>
          <div style={styles.infoCard}>
            <h2>Lead Details</h2>
            <p><strong>Status:</strong> {currentLead.status}</p>
            <p><strong>Value:</strong> ${currentLead.value?.toLocaleString() || '0'}</p>
            <p><strong>Source:</strong> {currentLead.source || 'N/A'}</p>
            <p><strong>Assigned To:</strong> {
              currentLead.assignedTo
                ? `${currentLead.assignedTo.firstName} ${currentLead.assignedTo.lastName}`
                : 'Unassigned'
            }</p>
            <p><strong>Created By:</strong> {
              currentLead.createdBy
                ? `${currentLead.createdBy.firstName} ${currentLead.createdBy.lastName}`
                : 'N/A'
            }</p>
          </div>
          {currentLead.notes && (
            <div style={styles.infoCard}>
              <h2>Notes</h2>
              <p>{currentLead.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Activities Section */}
      <div style={styles.activitiesSection}>
        <div style={styles.activitiesHeader}>
          <h2>Activities</h2>
          <button onClick={handleAddActivity} style={styles.button}>
            + Add Activity
          </button>
        </div>
        {activities.length === 0 ? (
          <p style={styles.empty}>No activities yet</p>
        ) : (
          <div style={styles.activitiesList}>
            {activities.map((activity) => (
              <div key={activity.id} style={styles.activityItem}>
                <div style={styles.activityHeader}>
                  <strong>{activity.title}</strong>
                  <span style={styles.activityType}>{activity.type}</span>
                </div>
                {activity.description && <p>{activity.description}</p>}
                <small style={styles.activityMeta}>
                  By {activity.user.firstName} {activity.user.lastName} on{' '}
                  {new Date(activity.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  backLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
  title: {
    flex: 1,
    fontSize: '2rem',
    color: '#333',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: '#dc3545',
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginTop: '0.5rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginTop: '0.5rem',
    fontFamily: 'inherit',
  },
  submitBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  activitiesSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  activitiesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  activityItem: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  activityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  activityType: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '12px',
    fontSize: '0.85rem',
  },
  activityMeta: {
    color: '#666',
    fontSize: '0.85rem',
  },
  empty: {
    color: '#666',
    textAlign: 'center',
    padding: '2rem',
  },
};

export default LeadDetail;

