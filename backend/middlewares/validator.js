const Joi = require('joi');

exports.registerSchema = Joi.object({
    email: Joi.string().min(10).email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'org'] },
    }).required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
    }),

    /*
    ^: Start of the string.
    (?=.*[a-z]): At least one lowercase letter.
    (?=.*[A-Z]): At least one uppercase letter.
    (?=.*\d): At least one digit.
    (?=.*[@$!%*?&]): At least one special character (e.g., @, $, !, %, *, ?, &).
    [A-Za-z\d@$!%*?&]{8,}: Minimum of 8 characters, allowing letters, digits, and special characters.
    $: End of the string.
    */

    password: Joi.string().min(8).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'))
    .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
});

exports.loginSchema = Joi.object({
    email: Joi.string().min(10).email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'org'] },
    }).required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
    }),

    /*
    ^: Start of the string.
    (?=.*[a-z]): At least one lowercase letter.
    (?=.*[A-Z]): At least one uppercase letter.
    (?=.*\d): At least one digit.
    (?=.*[@$!%*?&]): At least one special character (e.g., @, $, !, %, *, ?, &).
    [A-Za-z\d@$!%*?&]{8,}: Minimum of 8 characters, allowing letters, digits, and special characters.
    $: End of the string.
    */

    password: Joi.string().min(8).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'))
    .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
});

exports.acceptCodeSchema = Joi.object({
    email: Joi.string().min(10).email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'org'] }
    }),
    providedCode: Joi.number().required()
});

exports.changePasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$')),
    oldPassword: Joi.string().min(8).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$')),
})

exports.acceptFPCodeSchema = Joi.object({
    email: Joi.string().min(10).email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'org'] }
    }),
    providedCode: Joi.number().required(),
    newPassword: Joi.string().min(8).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$')),
});

exports.createPostSchema = Joi.object({
	title: Joi.string().min(3).max(60).required(),
	description: Joi.string().min(3).max(600).required(),
	userID: Joi.string().required(),
});

exports.createCourseSchema = Joi.object({
    headerImage: Joi.string().required(),
    title: Joi.string().min(3).max(60).required(),
    description: Joi.string().min(3).max(600).required(),
    category: Joi.string().required(),
    instructor: Joi.string().required(),
    duration: Joi.number().required(),
});