const withPWA = require("next-pwa")({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    runtimeCaching: require("next-pwa/cache"),
})

module.exports = withPWA({})