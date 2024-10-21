/* third party packages */
// cors error, raw node js
const cors = require('cors');
const multer = require("multer");
const express = require("express");
const bodyParser = require("body-parser");

const User = require("./models/user");
const Resource = require("./models/resource");


const userRoutes = require("./routes/user")
const resourceRoutes = require("./routes/resource")

const sequelize = require("./util/database"); 
// ORM --full meaning ki? dekhe niba

//middleware -> ekta funciton jeta execute hoy prottek ta request e, backend server
// const verifyToken = require("./middlewares/authentication");

// import 
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: 1024* 1024 }));

// app.use(verifyToken())

app.use(userRoutes)
app.use(resourceRoutes)

User.hasMany(Resource, { foreignKey: 'userId' });
Resource.belongsTo(User, { foreignKey: 'userId' });




sequelize
  .sync()
  .then((data) => {
    app.listen(3002);
  })
  .catch((err) => {
    console.log(err);
  });