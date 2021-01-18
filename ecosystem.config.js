// FILL THE MONGO_URI FIELD

module.exports = {
    apps : [
        {
          name: "fileserver",
          script: "./bin/www",
          exec_mode: "cluster",
          watch: false,
          env: {
              "PORT": 80,
              "NODE_ENV": "production",
              "MONGO_URI": ""
          }
        }
    ]
  }
  