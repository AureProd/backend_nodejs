import express from 'express';

const app = express();
const port: number = 3000;

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
