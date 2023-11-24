export const jwtLoad = () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    access_exp: process.env.JWT_ACCESS_EXP,
    refresh_exp: process.env.JWT_REFRESH_EXP,
  },
});
