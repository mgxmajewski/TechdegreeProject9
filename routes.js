'use strict';

const express = require('express');
const { User, Course } = require('./models');
const router = express.Router();
const { authenticateUser } = require('./middleware/auth-user');


function asyncHandler(cb){
    return async (req,res, next) => {
        try {
            await cb(req, res, next);
        } catch(err) {
            next(err);
        }
    }
}


router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    console.log(req.body)
    try {
        await User.create(req.body);
        res.status(201).location('/').json({ "message": "Account successfully created!" }).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

router.get('/courses', asyncHandler(async (req, res) => {
    let courses = await Course.findAll();
    res.json(courses);
}));


module.exports = router;
