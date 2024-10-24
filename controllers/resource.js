const cloudinary = require("cloudinary").v2;
const { Op } = require("sequelize");
const dotenv = require("dotenv");
const User = require("../models/user");
const Resource = require("../models/resource");
const MyList = require("../models/mylist");
const fs = require("fs");
const multer = require("multer");

dotenv.config();

exports.uploadResource = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "temp");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage }).single("pdf");

  upload(req, res, function (err) {
    if (err) {
      return res.send(err);
    }

    console.log("file uploaded to server");
    console.log(req.file);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    const path = req.file.path;
    const uniqueFilename = new Date().toISOString();
    const { userId, resourceName, resourceClass } = req.body;

    cloudinary.uploader.upload(
      path,
      { public_id: `note/${uniqueFilename}`, tags: `note` },
      async function (err, image) {
        if (err)
          return res.send("file format is wrong! Only image file supported");
        console.log("file uploaded to Cloudinary");

        fs.unlinkSync(path);

        const resource = {
          userId,
          resourceName,
          resourcePath: image.secure_url,
          resourceClass,
        };

        const response = await Resource.create(resource);

        res.status(201).json(response);
      }
    );
  });
};

exports.getAllResources = async (req, res, next) => {
  const { userId } = req.params; // Assuming userId is passed as a route parameter
  try {
    // Fetch resources that do not belong to the userId
    const resources = await Resource.findAll({
      where: {
        userId: {
          [Op.ne]: userId, // Op.ne is Sequelize's way to say 'not equal'
        },
      },
      include: [
        {
          model: User,
          attributes: ["name"], // Specify the fields you want from the User model
        },
      ],
    });

    return res.status(200).send(resources);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "An error occurred while fetching resources." });
  }
};

exports.getMyResources = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const resources = await Resource.findAll({
      where: {
        userId: {
          [Op.eq]: userId,
        },
      },
    });

    return res.status(200).send(resources);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "An error occurred while fetching resources." });
  }
};

exports.deleteResource = async (req, res) => {
  const id = req.params.resourceId;
  await Resource.destroy({
    where: {
      id: id,
    },
  })
    .then((result) =>
      res.send({ message: "Resource deleted successfully!" }).status(200)
    )
    .catch((err) =>
      res.send({ message: "Resource couldn't be deleted!" }).status(404)
    );
};

exports.addToList = async (req, res) => {
  const { userId, resourceId } = req.body;

  const data = {
    userId,
    resourceId,
  };

  try {
    const response = await MyList.create(data);
    return res.status(201).json(response); // Ensure you're returning JSON
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMyList = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  try {
    const myListItems = await MyList.findAll({
      where: {
        userId: {
          [Op.eq]: userId,
        },
      },
      include: [
        {
          model: Resource,
          attributes: ["resourceName", "resourceClass", "resourcePath"], // Specify the fields you want from the User model
        },
      ],
    });

    console.log(myListItems, "ssssssssss");

    return res.status(200).send(myListItems);
  } catch (err) {
    return res
      .status(500)
      .send({ message: "An error occurred while fetching resources." });
  }
};

exports.deleteFromList = async (req, res) => {};
