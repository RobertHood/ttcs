const { validateUserSchema } = require('../middlewares/validator.js');
const User = require('../models/usersModel.js');
const jwt = require("jsonwebtoken");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }
        res.status(200).json({ success: true, message: 'All users', data: users });
    } catch (error) {
        console.log(error);
    }
}

exports.getUserByEmail = async (req, res) => {
    const { email } = req.query;
    try {
        const user = await User.find({ email: {$regex: email, $options: "i"} });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User found', data: user });
    }
    catch (error) {
        console.log(error);
    }
}

exports.getUserByRole = async (req, res) => {
    const { role } = req.query;
    try {
        const users = await User.find({ role: {$regex: role, $options: "i"} });
        if (!users) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }
        res.status(200).json({ success: true, message: 'Users found', data: users });
    }
    catch (error) {
        console.log(error);
    }
}

exports.getUserById = async (req, res) => {
    const { _id } = req.query;
    try {
        const user = await User.findOne({ _id });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User found', data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const {_id} = req.query;
    try {
        const existingUser = await User.findOne({_id});
        if (!existingUser){
            return res.status(404).json({success: false, message: "User already unavailable"});
        }

        await User.deleteOne({_id});
        res.status(200).json({success: true, message: "User deleted"});
    }catch(error){
        console.log(error);
    }
};

exports.updateUser = async (req, res) => {
    const {_id} = req.query;
    const {username, email, role, verified} = req.body;
    try {
        const {error, value} = validateUserSchema.validate({
            username,
            email
        });
        if (error) {
            return res. status(401).json ({success: false, message: error.details[0].message});
        }

        const existingUser = await User.findOne({_id});
        if (!existingUser) {
			return res
				.status(404)
				.json({ success: false, message: 'Post unavailable' });
		}
		existingUser.username = username;
		existingUser.email = email;
		existingUser.role = role;
		existingUser.verified = verified;

		const result = await existingUser.save();
		res.status(200).json({ success: true, message: 'Updated', data: result });
    }catch(error){
        console.log(error);
    }
}

exports.getMe = async (req, res) => {
    const token = req.cookies.Authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false });
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).json({ success: false });
    res.json({ success: true, user });
  });
}