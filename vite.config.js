export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://backend-health-care-xr5d.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
};