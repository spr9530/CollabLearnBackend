const UserInfo = require("../models/UserSchema");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose')

const checkUser = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token is not valid' });
        
        res.json({user})
        console.log(user)
    });
}
const adduser = async (req, res) => {
    const { userName, password } = req.body;
    const user = new UserInfo({
        userName,
        password
    })
    await user.save();
}

const userLoggin = async (req, res) => {

    const { userName, password } = req.body;

    try {
        const user = await UserInfo.findOne({ userName: userName })
        console.log(user)
        if (user && user.password === password) {
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
            res.json({ token, user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log(error)
    }
}

const getUserInfo = async(req,res) =>{
    const user = req.user;
    if(user){
        try{
            const userInfo = await UserInfo.findOne({ _id: user.userId})

            res.json({userInfo})
        }catch(error){
            res.status(500).json({error})
        }

    }
}

const updateUserInfo = async(req,res) =>{

    const user = req.user;
    const data = req.body;
    if(user){
        try{
            const userInfo = await UserInfo.findOneAndUpdate({ _id: user.userId}, { $set: { rooms: data.rooms } }, {new:true})
            res.json({userInfo})
        }catch(error){
            res.json({error})
        }
    }
}


module.exports = { checkUser, adduser, userLoggin, getUserInfo, updateUserInfo }