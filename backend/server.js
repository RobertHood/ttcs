const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

const authRouter = require('./routers/authRouter');
const ieltsRouter = require('./routers/ieltsRouter');
const englishRouter = require('./routers/engRouter');


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, "index.html"));
// });

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected successfully!');
}
).catch((err) => {
    console.error('MongoDB connection error:', err);
}
);

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/ielts', ieltsRouter);
app.use('/api/english',englishRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});