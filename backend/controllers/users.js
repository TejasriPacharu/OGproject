const User = require("../models/User");

//getAllUsers
//getUserByID
//createUser
//editUser
//deleteUser

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getUserByID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const editUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserByID,
    createUser,
    editUser,
    deleteUser
};
    