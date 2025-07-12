module.exports = {
  apps: [
    {
      name: "api-gateway",
      script: "dist/apps/api-gateway/main.js",
      watch: false,
    },
    {
      name: "auth-microservice",
      script: "dist/apps/auth-microservice/main.js",
      watch: false,
    },
    {
      name: "user-microservice",
      script: "dist/apps/user-microservice/main.js",
      watch: false,
    },
  ],
};
