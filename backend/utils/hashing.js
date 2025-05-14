const {hash} = require('bcryptjs');
const {compare} = require('bcryptjs');
const {createHmac} = require('crypto');
exports.doHash = async (password, saltRounds) => {
    try {
        const hashedPassword = await hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error; // Rethrow the error for handling in the calling function
    }
}

exports.doHashValidation = (value, hashedValue) => {
    const result = compare(value, hashedValue);
    return result;
}

exports.hmacProcess = (value,key) =>{
    const result = createHmac("sha256", key).update(value).digest("hex");
    return result;
}