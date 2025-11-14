/**
 * Frontend configuration
 */
const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  },
  socket: {
    url: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  },
};

export default config;


