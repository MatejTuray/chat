const env = process.env.NODE_ENV || "dev";
if (env === "dev") {
    process.env.PORT = 5000;
    process.env.MONGODB_URI = "mongodb://admin:admin1@ds235388.mlab.com:35388/chatify-dev"
}
else if (env === "test") {
    process.env.PORT = 5000;
    process.env.MONGODB_URI = "mongodb://admin:admin1@ds235388.mlab.com:35388/chatify-dev"
}
module.exports = { env }