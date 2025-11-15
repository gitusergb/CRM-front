/**
 * Frontend configuration
 */
const config = {
  api: {
    // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://crm-backend-u7wi.onrender.com/api',
  },
  socket: {
    // url: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
    url: import.meta.env.VITE_SOCKET_URL || 'https://crm-backend-u7wi.onrender.com',
  },
};

export default config;


