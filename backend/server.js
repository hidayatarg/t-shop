const app = require('./app');
const dotenv = require('dotenv');

const port = process.env.PORT || 3000;

// Handle UncaughtExceptions
// a is not defined => log(a)
process.on('uncaughtException', err => {
  console.log(`Error ${err.message}`);
  console.log('Shutting down due to uncaught exception');
  process.exit(1);
});

// setting config file
dotenv.config({ path: './config/config.env' });

var server = app.listen(port, () => {
  console.log(`server started on PORT: ${port} in ${process.env.NODE_ENV} mode`);
});

// UnhandledRejection
process.on('unhandledRejection', err => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Unhandled Promise Rejection');
  server.close(() => {
    process.exit(1);
  })
});