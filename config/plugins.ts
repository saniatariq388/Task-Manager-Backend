import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        accessTokenLifespan: 60,        // ⚡ 1 minute (testing)
        // idleSessionLifespan:300,         // ⚡ 4 minutes (testing)
        // maxSessionLifespan:600,           // ⚡ 4 minutes (testing)
        idleRefreshTokenLifespan:300, // ⚡ 4 minutes (testing)
        maxRefreshTokenLifespan: 600,   // ⚡ 4 minutes (testing)
        httpOnly: true,
        cookie: {
          name: 'strapi_up_refresh',
          sameSite: 'lax',
          path: '/',
          secure: env('NODE_ENV') === 'production',
        },
      },
    },
  },
  upload: {
    config: {
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes: deniedExecutableTypes,
      },
    },
  },
});

export default config;