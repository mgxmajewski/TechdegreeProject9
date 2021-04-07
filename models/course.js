'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {}
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    // custom error message
                    msg: 'Please provide a value for "title"',
                }
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    // custom error message
                    msg: 'Please provide a value for "description"',
                }
            },
        },
        estimatedTime: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    // custom error message
                    msg: 'Please provide a value for "estimatedTime"',
                }
            },
        },
        materialsNeeded: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    // custom error message
                    msg: 'Please provide a value for "materialsNeeded"',
                }
            },
        }
    }, {
        sequelize,
        modelName: 'Course',
    });
    Course.associate = (models) => {
        Course.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Course;
}
