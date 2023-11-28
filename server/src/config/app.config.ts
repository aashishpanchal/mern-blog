export const AppConfig = () => {
  const nodeEnv = process.env['NODE_ENV'] || 'development';

  const isDev = nodeEnv === 'development';

  return {
    isDev,
    nodeEnv,
    name: process.env.NAME,
    host: process.env.HOST,
    port: Number(process.env.PORT),
    // database config
    dbUrl: process.env.DATABASE_URL,
    // jwt config
    jwt: {
      secret: process.env.JWT_SECRET,
      accessExp: process.env.JWT_ACCESS_EXP,
      refreshExp: process.env.JWT_REFRESH_EXP,
    },
    // mail config
    mail: {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
      from: process.env.MAIL_FROM,
    },
    // others config
    totpExp: '5m',
  };
};
