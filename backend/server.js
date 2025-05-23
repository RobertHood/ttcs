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
const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');
const courseRouter = require('./routers/courseRouter');
const dashboardRouter = require('./routers/dashboardRouter');

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

app.use(cors({
  origin: 'http://localhost:5173', // Cổng của frontend
  credentials: true, 
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Range'], // Cho phép Range header
  exposedHeaders: ['Content-Range', 'Accept-Ranges']
}));


app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

app.use(helmet());
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/ielts', ieltsRouter);
app.use('/api/english',englishRouter);
app.use('/api/user', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/courses', courseRouter);
app.use('/api/dashboard', dashboardRouter);



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});