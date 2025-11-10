import express from 'express';
import routes from './routes/index.js';

const app = express();
const PORT = Process.env.PORT || 5000;

app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
