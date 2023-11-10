/** Database setup for BizTime. */
const { Client } = require ('pg');

const dbConfig = {
    user: 'hilarienoes',
    host: 'localhost',
    database: 'biztime',
    password: 'your_password',
    port: 5432, // default PostgreSQL port
};

// Create a new client instance and connect to the database
const client = new Client(dbConfig);

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch((err) => console.error('Failed to connect to the database', err));

module.exports = client;