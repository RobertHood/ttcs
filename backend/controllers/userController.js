const User = require('../models/usersModel.js');
const jwt = require("jsonwebtoken");
const course = require('../models/courseModel.js');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }
        res.status(200).json({ success: true, message: 'All users', data: users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
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
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
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
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
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
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const {_id} = req.query;
    const {
        username, 
        email, 
        role, 
        verified
    } = req.body;
    
    console.log("Update user request:", { _id, body: req.body });
    
    try {
        // Simple validation
        if (!email || !username) {
            return res.status(400).json({
                success: false, 
                message: 'Email and username are required'
            });
        }

        // Create update object with only fields we want to change
        const updateData = { 
            profileName: username,
            email: email
        };
        
        // Add optional fields only if they were provided
        if (role !== undefined) {
            updateData.role = role === 'admin' ? 'admin' : 'user';
        }
        
        if (verified !== undefined) {
            updateData.verified = verified;
        }
        
        // Use findByIdAndUpdate to directly update only the fields we want
        // This avoids validation issues with existing fields like "level"
        const result = await User.findByIdAndUpdate(
            _id, 
            updateData,
            { 
                new: true, // Return the updated document
                runValidators: false // Don't run validators on fields we're not updating
            }
        );
        
        if (!result) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'User updated successfully', 
            data: result 
        });
    } catch(error) {
        console.log("Error updating user:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
}

exports.getMe = async (req, res) => {
    try {
    const token = req.cookies.Authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'No token' });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.userID).populate('CourseInProgress').populate('courseEnrolled'); 

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user }); 
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

exports.addXP = async (req, res) => {
    const userId = req.user._id;
    const { xp } = req.body;
  try {
    const user = await User.findById(userId);
    user.userXP = (user.userXP || 0) + xp;
    await user.save();
    res.json({ success: true, xp: user.userXP });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addCourseInProgress = async (req, res) => {
  try {
    const userId = req.user.userID;
    const { courseId } = req.body;
    const user = await User.findById(userId);
    if (!user.CourseInProgress.includes(courseId)) {
      user.CourseInProgress.push(courseId);
      await user.save();
    }

    res.json({ success: true, CourseInProgress: user.CourseInProgress });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};