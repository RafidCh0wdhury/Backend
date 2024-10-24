const express = require('express');

const {
  uploadResource,
  getAllResources,
  getMyResources,
  deleteResource,
  addToList,
  getMyList,
  deleteFromList,
} = require("../controllers/resource");

const router = express.Router();

router.get("/get-my-list/:userId", getMyList);
router.get("/my-resources/:userId", getMyResources);
router.get("/all-resources/:userId", getAllResources);

router.post("/resource", uploadResource);
router.post("/add-to-list", addToList);

router.delete("/delete-resource/:resourceId", deleteResource);
router.delete("/delete-from-list/:resourceId", deleteFromList);

module.exports = router;