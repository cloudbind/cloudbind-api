const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const dontenv = require('dotenv').config();
const db = require('./configs/connection');
var cron = require('node-cron');

// Importing Routes
const authRoutes = require('./routes/auth.route');
const fileRoutes = require('./routes/file.route');
const friendRoutes = require('./routes/friend.route');
const gDriveRoutes = require('./routes/gDrive.route');
const groupRoutes = require('./routes/group.route');
const userRoutes = require('./routes/user.route');

// Initializing an express app
const app = express();

// Server Port
const PORT = process.env.PORT;

// Formatting incoming data and allowing cross origin requests
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging incoming requests
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', fileRoutes);
app.use('/api/friend', friendRoutes);
app.use('/api/gdrive', gDriveRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/user', userRoutes);

// Test API
app.get('/api', (req, res) => {
    res.status(200).json({
        name: `${process.env.APP_NAME}`,
        apiVersion: JSON.parse(fs.readFileSync('./package.json').toString())
            .version
    });
});

// Keep deployed url active
cron.schedule('*/1 * * * *', async () => {
    const res = await axios.get('https://cloudbind-api.onrender.com/api');
    console.log(res);
});

// Listening on the port
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
