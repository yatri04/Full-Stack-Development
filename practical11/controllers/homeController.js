// controllers/homeController.js

// Controller function for /home
exports.getHomePage = (req, res) => {
    res.status(200).send("Welcome to your dashboard!");
};