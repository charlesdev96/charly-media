module.exports = {
  apps: [
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
    {
      name: "post-microservice",
      script: "dist/apps/post-microservice/main.js",
      watch: false,
    },
    {
      name: "chat-microservice",
      script: "dist/apps/chat-microservice/main.js",
      watch: false,
    },
    {
      name: "main",
      script: "dist/apps/api-gateway/main.js",
      watch: false,
    },
  ],
};
