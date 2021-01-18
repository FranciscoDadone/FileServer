// COMPLETE THE FIELD IF YOU ARE NOT USING PM2
const {
    MONGO_URI
} = process.env;

const MONGO_URI2 = '';

module.exports = {
    mongoURI: MONGO_URI || MONGO_URI2
};