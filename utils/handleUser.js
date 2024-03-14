const { createHash } = require('crypto');
const User = require('../Models/UserModel')

const hashUsername = async (username) => {
    return createHash('sha256').update(username).digest('hex');
}

const findOrCreateUser = async (ip) => {
    const hashedUsername = await hashUsername(ip);
    let user = await User.findOne({ userName: hashedUsername });
    if (user) return user
    else {
        user = User.create({ userName: hashedUsername });
        return user
    }
}

module.exports = findOrCreateUser