export default {
  async refresh(ctx: any) {
    const { refreshToken } = ctx.request.body;

    if (!refreshToken) {
      return ctx.badRequest('refreshToken is required');
    }

    // Strapi ke apne working refresh route ko fake cookie ke saath internally call karo
    ctx.cookies.set('strapi_up_refresh', refreshToken, { httpOnly: true, path: '/' });
    ctx.request.header.cookie = `strapi_up_refresh=${refreshToken}`;

    try {
      const authController = strapi.plugin('users-permissions').controller('auth');
      await authController.refresh(ctx, async () => {}); // Strapi ka apna, already-working refresh logic reuse karo

      // Strapi ne jo naya rotated refresh cookie set kiya, usko nikaal ke JSON body mein bhi daalo
      const setCookieHeader = ctx.response.get('Set-Cookie');
      let newRefreshToken: string | null = null;

      if (setCookieHeader) {
        const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
        const match = cookies.join(';').match(/strapi_up_refresh=([^;]+)/);
        if (match) newRefreshToken = decodeURIComponent(match[1]);
      }

      if (ctx.body && typeof ctx.body === 'object') {
        ctx.body = { ...ctx.body, refreshToken: newRefreshToken };
      }
    } catch (err) {
      ctx.unauthorized('Invalid or expired refresh token');
    }
  },
};