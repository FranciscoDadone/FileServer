// COMPLETE THE FIELD IF YOU ARE NOT USING PM2
const {
    MONGO_URI
} = process.env;

const MONGO_URI2 = 'mongodb+srv://fileserver:xXlQmYB5zo0OiokJ@cluster0.hazwq.mongodb.net/fileserver?retryWrites=true&w=majority';

module.exports = {
    mongoURI: MONGO_URI || MONGO_URI2
};