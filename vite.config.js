// vite.config.js
export default {
  server: {
    proxy: {
      "/api": "https://backend-health-care-97bf.vercel.app",
    },
  },
};