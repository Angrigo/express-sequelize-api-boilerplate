require('@babel/register')({extensions: ['.js', '.ts']});

import app from './app';

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
    console.log(`Process ${process.pid} is listening to all incoming requests on port ${PORT}`);
  });