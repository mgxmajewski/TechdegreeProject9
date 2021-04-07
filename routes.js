'use strict';

const express = require('express');
const { User, Course } = require('./models');
const router = express.Router();
const { authenticateUser } = require('./middleware/auth-user');
const { asyncHandler } = require('./middleware/async-handler');

// Route that get current user (authorized).
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

// Route get all courses.
router.get('/courses', asyncHandler(async (req, res) => {
    let courses = await Course.findAll({
        include: {
            model: User,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
    res.json(courses);
}));

// Route to get one course by id.
router.get('/courses/:id', asyncHandler(async (req, res) => {
    let course = await Course.findByPk(req.params.id,
        {
            include: {
                model: User,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password']
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    res.json(course);
}));

// Route that creates a new course.
router.post('/courses', asyncHandler(async (req, res) => {
    console.log(req.body)
    try {
        const course = await Course.create(req.body);
        const courseId = course.dataValues.id
        console.log(courseId)

        res.status(201).location(`/courses/${courseId}`).json({ "message": "Course successfully created!" }).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// Route that creates a new course.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    // console.log(req.body)

    const user = req.currentUser.id;
    console.log(user)
    try {
        let course = await Course.findByPk(req.params.id);
        console.log(user === course.userId)
        if (user === course.userId) {
            await course.update(req.body);
            res.status(204).end();
        }

    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error
        }
    }
}));

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    // console.log(req.body)
    const user = req.currentUser.id;
    try {
        let course = await Course.findByPk(req.params.id);
        if (user === course.userId) {
            await course.destroy(req.body);
            res.status(204).end();
        }

    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error
        }
    }
}));



module.exports = router;
