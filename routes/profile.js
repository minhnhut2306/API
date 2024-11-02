var express = require("express");
var router = express.Router();
const ProfileController = require("../controllers/ProfileController");


// http://localhost:6677/profile
// get userProfile
router.get("/getUserProfile", async (req, res, next) => {
    try {
        const profile = await ProfileController.getProfile();
        return res.status(200).json({ status: true, data: profile });
    } catch (error) {
        console.log("Get categories error: ", error.massage);
        return res.status(500).json({ status: false, data: error.massage });
    }
})

// http://localhost:6677/profile/updateUserProfile
// update userProfile
router.post("/updateUserProfile", async (req, res, next) => {
    try {
        const { name, bio, gender, birthday, phone, email } = req.body;
        const profile = await ProfileController.updateProfile(name, bio, gender, birthday, phone, email);
        return res.status(200).json({ status: true, data: profile });
    } catch (error) {
        console.log("Get categories error: ", error.massage);
        return res.status(500).json({ status: false, data: error.massage });
    }
})

// http://localhost:6677/profile/getAddress
// get all Address
router.get("/getAddress", async (req, res, next) => {
    try {
        const address = await ProfileController.getAddress();
        return res.status(200).json({ status: true, data: address });
    } catch (error) {
        console.log("Get categories error: ", error.massage);
        return res.status(500).json({ status: false, data: error.massage });
    }
})

//http://localhost:6677/profile/addAddress
// add Address  
router.post("/addAddress", async (req, res, next) => {
    try {
        const { contact_name, contact_phone, country, city, district, quarter, houseNumber, alley } = req.body;
        const address = await ProfileController.addAddress(contact_name, contact_phone, country, city, district, quarter, houseNumber, alley);
        return res.status(200).json({ status: true, data: address });
    } catch (error) {
        console.log("Get categories error: ", error.massage);
        return res.status(500).json({ status: false, data: error.massage });
    }
})

//http://localhost:6677/profile/updateAddress
// update Address
router.put("/updateAddress", async (req, res, next) => {
    try {
        const { contact_name, contact_phone, country, city, district, quarter, houseNumber, alley } = req.body;
        const address = await ProfileController.updateAddress(contact_name, contact_phone, country, city, district, quarter, houseNumber, alley);
        return res.status(200).json({ status: true, data: address });
    } catch (error) {
        console.log("Get categories error: ", error.massage);
        return res.status(500).json({ status: false, data: error.massage });
    }
})

// http://localhost:6677/profile/deleteAddress
// delete Address
router.delete("/deleteAddress", async (req, res, next) => {
    try {
        const address = await ProfileController.deleteAddress(req.params.id);
        return res.status(200).json({ status: true, data: address });
    } catch (error) {
        console.log("Get categories error: ", error.massage);
        return res.status(500).json({ status: false, data: error.massage });
    }
})
module.exports = router;