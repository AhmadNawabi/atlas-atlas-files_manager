import express from 'express';
import routes from './routes/index';

const app = express();
const port = process.env.port || 5000;

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
