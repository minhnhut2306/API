const userModel = require("./UserModel");
const addressModel = require("./AddressModel");
//get userProfile
const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate('addresses');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

// update userProfile
const updateProfile = async (req, res) => {
    try {
      const { name, bio, gender, birthday, phone, email } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
        user.name = name;
        user.bio = bio;
        user.gender = gender;
        user.birthday = birthday;
        user.phone = phone;
        user.email = email;
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

// get all address
const getAddress = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id });
        res.json(addresses);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
}

// post new address
const addAddress = async (req, res) => {
    try {
        const { contact_name, contact_phone,country, city, district, quarter, houseNumber, alley} = req.body;
        const address = new Address({
            contact_name,
            contact_phone,
            country,
            city,
            district,
            quarter,
            houseNumber,
            alley,
            user: req.user.id
        });
        await address.save();
        res.json(address);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
      }
}

// update address
const updateAddress = async (req, res) => {
    try {
        const { contact_name, contact_phone,country, city, district, quarter, houseNumber, alley} = req.body;
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });
        address.contact_name = contact_name;
        address.contact_phone = contact_phone;
        address.country = country;
        address.city = city;
        address.district = district;
        address.quarter = quarter;
        address.houseNumber = houseNumber;
        address.alley = alley;
        await address.save();
        res.json(address);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
      }
}

// delete address
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });
        await address.remove();
        res.json({ message: 'Address deleted successfully' });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
      }
}
module.exports = {
    getProfile,
    updateProfile,
    getAddress,
    addAddress,
    updateAddress,
    deleteAddress
};