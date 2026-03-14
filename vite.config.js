// vite.config.js
export default {
  server: {
    proxy: {
      "/api": "https://backend-health-care-wrp.vercel.app",
    },
  },
};