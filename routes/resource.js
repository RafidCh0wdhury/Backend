const express = require('express');

const {
  uploadResource,
  getAllResources,
  getMyResources,
  deleteResource,
} = require("../controllers/resource");

const router = express.Router();

router.post("/resource", uploadResource);
router.get("/all-resources/:userId", getAllResources);
router.get("/my-resources/:userId", getMyResources);
router.delete("/delete-resource/:resourceId", deleteResource)

module.exports = router;