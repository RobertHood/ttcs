const jwt = require('jsonwebtoken');

exports.verifyUser = (req, res, next) => {
    let token;
    if(req.headers.client === 'not-browser'){
        token = req.headers.authorization;
    } else{
        token = req.cookies['Authorization'];
    }
    if (!token){
        return res.status(403).json({ success: false, message: 'Unauthorized'});
    }
    try{
        const userToken = token.split(' ')[1];
        const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
        console.log('Decoded token:', jwtVerified);
        if(jwtVerified){
            req.user = jwtVerified;
            next();
        }
        else{
            throw new Error('error in the token');
        }
    } catch(error){
        console.error(error);
        return res.status(403).json({ success: false, message: 'Invalid token'});
    }
};

exports.verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ success: false, message: 'User not authenticated' });
    }
    
    console.log('User role:', req.user.role);
    
    if (!req.user.role || req.user.role.toLowerCase() !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
}; 