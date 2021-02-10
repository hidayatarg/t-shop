const app = require("./app");
const dotenv = require("dotenv");

const port = process.env.PORT || 3000;

// setting config file
dotenv.config({ path: "./config/config.env" });

app.listen(port, () => {
  console.log(
    `server started on PORT: ${port} in ${process.env.NODE_ENV} mode`
  );
});
