const { registerSchema, loginSchema, changePasswordSchema } = require("../middlewares/validator");
const { doHash } = require("../utils/hashing");
const { doHashValidation } = require("../utils/hashing");
const { hmacProcess } = require("../utils/hashing");
const { acceptCodeSchema } = require("../middlewares/validator");
const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const transport = require("../middlewares/sendMail");


exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const {error, value} = registerSchema.validate({
            email,
            password
        });

        if (error) {
            return res.status(400).json({
                status: "fail",
                message: error.details[0].message
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: "fail",
                message: "User already exists"
            });
        }

        const hashedPassword = await doHash(password,12);

        const newUser = new User({
            email,
            password: hashedPassword,
        });

        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({
            success:true, message:"User created successfully",
            result,
        })
    }catch (error) {
        console.error(error);
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const {error, value} = loginSchema.validate({email,password});
        if (error) {
            return res.status(400).json({
                status: "fail",
                message: error.details[0].message
            });
        }

        const existingUser = await User.findOne({ email }).select("+password");

        if (!existingUser) {
            return res.status(400).json({
                status: "fail",
                message: "User does not exists"
            });
        }
        
        const result = await doHashValidation(password, existingUser.password);
        if (!result) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({
            userID: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,
        },process.env.TOKEN_SECRET, {
            expiresIn: "7d",
        });

        res.cookie('Authorization', 'Bearer ' + token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: 'lax',
        }).json({
            status: "success",
            message: "User logged in successfully",
            token
        });
    }catch(error) {
        console.error(error);
    }
};

exports.logout = async (req, res) => {
    res.clearCookie('Authorization', {
        httpOnly: process.env.NODE_ENV === 'production' ? true : false,
        secure: process.env.NODE_ENV === 'production' ? true : false,
    }).clearCookie('role',{
        httpOnly: process.env.NODE_ENV === 'production' ? true : false,
        secure: process.env.NODE_ENV === 'production' ? true : false,
    }).clearCookie('createdAt',{
        httpOnly: process.env.NODE_ENV === 'production' ? true : false,
        secure: process.env.NODE_ENV === 'production' ? true : false,
    }).clearCookie('username',{
        httpOnly: process.env.NODE_ENV === 'production' ? true : false,
        secure: process.env.NODE_ENV === 'production' ? true : false,
    }).json({
        status: "success",
        message: "User logged out successfully",
    });
}

exports.sendVerificationCode = async (req, res) => {
    const {email} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                status: "fail",
                message: "User does not exist"
            });
        }
        if (existingUser.verified) {
            return res.status(400).json({
                status: "fail",
                message: "User already verified"
            });
        }

        const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

        let info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: "Verification Code",
            text: `Your verification code is ${codeValue}`,
    });

        if(info.accepted[0] === existingUser.email) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HASHING_KEY);
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = Date.now() + 10 * 60 * 1000; // 10 minutes
            await existingUser.save();
            return res.status(200).json({
                status: "success",
                message: "Verification code sent successfully",
                sentCode: `${codeValue}`
            });
        }
        res.status(400).json({
            status: "fail",
            message: "Code sent failed",
        });
    }catch (error) {
        console.error(error);
    }
};

exports.verifyVerificationCode = async (req, res) => {
	const { email, providedCode } = req.body;
	try {
		const { error, value } = acceptCodeSchema.validate({ email, providedCode });
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		const codeValue = providedCode.toString();
		const existingUser = await User.findOne({ email }).select(
			'+verificationCode +verificationCodeValidation'
		);

		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: 'User does not exists!' });
		}
		if (existingUser.verified) {
			return res
				.status(400)
				.json({ success: false, message: 'you are already verified!' });
		}

		if (
			!existingUser.verificationCode ||
			!existingUser.verificationCodeValidation
		) {
			return res
				.status(400)
				.json({ success: false, message: 'something is wrong with the code!' });
		}

		if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
			return res
				.status(400)
				.json({ success: false, message: 'code has been expired!' });
		}

		const hashedCodeValue = hmacProcess(
			codeValue,
			process.env.HASHING_KEY
		);

		if (hashedCodeValue === existingUser.verificationCode) {
			existingUser.verified = true;
			existingUser.verificationCode = undefined;
			existingUser.verificationCodeValidation = undefined;
			await existingUser.save();
			return res
				.status(200)
				.json({ success: true, message: 'your account has been verified!' });
		}
		return res
			.status(400)
			.json({ success: false, message: 'unexpected occured!!' });
	} catch (error) {
		console.log(error);
	}
};

exports.changePassword = async(req, res) =>{
    const {userID, verified} = req.user;
    const {oldPassword, newPassword} = req.body;
    try {
        const { error, value } = changePasswordSchema.validate({ oldPassword, newPassword });
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}
        if(!verified){
            return res
                .status(400)
                .json({status : "fail", message: 'You are not verified user'});
        }
        const existingUser = await User.findOne({_id:userID}).select('+password');
        if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: 'User does not exists!' });
		}
        const result = await doHashValidation(oldPassword, existingUser.password);
        if(!result){
            return res
                .status(401)
                .json({success : false, message: ' Invalid credentials'})
        }
        const hashedPassword = await doHash(newPassword, 12);
        existingUser.password = hashedPassword;
        await existingUser.save();
        return res
            .status(200)
            .json({success : true, message: 'Password updated!!'});
    } catch (error) {
        console.log(error);
    }
}

exports.sendForgotPasswordCode = async (req, res) => {
    const {email} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                status: "fail",
                message: "User does not exist"
            });
        }


        const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

        let info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: "Forgot Password Code",
            text: `Your password reset code is ${codeValue}`,
    });

        if(info.accepted[0] === existingUser.email) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HASHING_KEY);
            existingUser.forgotPasswordCode = hashedCodeValue;
            existingUser.forgotPasswordCodeValidation = Date.now() + 10 * 60 * 1000; // 10 minutes
            await existingUser.save();
            return res.status(200).json({
                status: "success",
                message: "Forgot Password code sent successfully",
                sentCode: `${codeValue}`
            });
        }
        res.status(400).json({
            status: "fail",
            message: "Code sent failed",
        });
    }catch (error) {
        console.error(error);
    }
};

exports.verifyForgotPasswordCode = async (req, res) => {
	const { email, providedCode, newPassword } = req.body;
	try {
		const { error, value } = acceptCodeSchema.validate({ email, providedCode });
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		const codeValue = providedCode.toString();
		const existingUser = await User.findOne({ email }).select(
			'+forgotPasswordCode +forgotPasswordCodeValidation'
		);

		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: 'User does not exists!' });
		}
	

		if (
			!existingUser.forgotPasswordCode ||
			!existingUser.forgotPasswordCodeValidation
		) {
			return res
				.status(400)
				.json({ success: false, message: 'something is wrong with the code!' });
		}

		if (Date.now() - existingUser.forgotPasswordCodeValidation > 5 * 60 * 1000) {
			return res
				.status(400)
				.json({ success: false, message: 'code has been expired!' });
		}

		const hashedCodeValue = hmacProcess(
			codeValue,
			process.env.HASHING_KEY
		);

		if (hashedCodeValue === existingUser.forgotPasswordCode) {
			const hashedPassword = await doHash(newPassword,12);
            existingUser.password = hashedPassword;
			existingUser.forgotPasswordCode = undefined;
			existingUser.forgotPasswordCodeValidation = undefined;
			await existingUser.save();
			return res
				.status(200)
				.json({ success: true, message: 'Password updated' });
		}
		return res
			.status(400)
			.json({ success: false, message: 'unexpected occured!!' });
	} catch (error) {
		console.log(error);
	}
};

exports.deleteUser = async (req, res) => {
	const { _id } = req.body;
	try {
		const existingUser = await User.findOne({ _id});
		if (!existingUser) {
			return res
				.status(404)
				.json({ success: false, message: 'No user found' });
		}

		await User.deleteOne({ _id });
		res.status(200).json({ success: true, message: 'deleted' });
	} catch (error) {
		console.log(error);
	}
};

// LẤY PROFILE USER
exports.getProfile = async (req, res) => {
    try {
        const { userID } = req.user;
        const user = await User.findById(userID).select('-password -verificationCode -verificationCodeValidation -forgotPasswordCode -forgotPasswordCodeValidation');
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.json({ status: 'success', data: user });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error' });
    }
};

// CẬP NHẬT PROFILE USER
exports.updateProfile = async (req, res) => {
    try {
        const { userID } = req.user;
        const updateFields = req.body;
        const user = await User.findByIdAndUpdate(userID, updateFields, { new: true, runValidators: true }).select('-password -verificationCode -verificationCodeValidation -forgotPasswordCode -forgotPasswordCodeValidation');
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.json({ status: 'success', data: user });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error' });
    }
};