'use strict';

const express = require('express');
const { User } = require('./models');
const router = express.Router();


function asyncHandler(cb){
    return async (req,res, next) => {
        try {
            await cb(req, res, next);
        } catch(err) {
            next(err);
        }
    }
}

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

module.exports = router;
