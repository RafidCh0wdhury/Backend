const Download = require("../models/download"); // Import the Download model
const Resource = require("../models/resource"); // Import the Resource model

exports.downloadResource = async (req, res) => {
    const { userId, resourceId } = req.body; // Assuming userId and resourceId are passed in the request body

    try {
        // Check if the resource exists
        const resource = await Resource.findByPk(resourceId);
        if (!resource) {
            return res.status(404).send({ message: "Resource not found." });
        }

        // Check if the user has already downloaded this resource
        let download = await Download.findOne({
            where: { userId: userId, resourceId: resourceId }
        });

        if (download) {
            // If download exists, update the downloadedAt field
            download.downloadedAt = new Date(); // or Sequelize.NOW
            await download.save();
            return res.status(200).send({
                message: "Download time updated successfully.",
                downloadId: download.id
            });
        } else {
            // If download doesn't exist, create a new entry
            download = await Download.create({
                userId: userId,
                resourceId: resourceId,
                downloadedAt: new Date(), // or use Sequelize.NOW as default
            });
            return res.status(201).send({
                message: "Resource downloaded successfully.",
                downloadId: download.id, // You can return the download ID if needed
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "An error occurred while downloading the resource." });
    }
};
