export default {
  routes: [
    {
      method: 'POST',
      path: '/mobile-auth/refresh',
      handler: 'mobile-auth.refresh',
      config: { auth: false },
    },
  ],
};