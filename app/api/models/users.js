const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const appConfig = require('../../../config/appConfig');
const saltRounds = appConfig.saltRounds;
const Schema = mongoose.Schema;
const moment = require('moment');

var contactSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    address: {
        street: {
            type: String,
            trim: true,
            default: '',
        },
        city: {
            type: String,
            trim: true,
            default: '',
        },
        state: {
            type: String,
            trim: true,
            default: '',
        },
        postal: {
            type: String,
            trim: true,
            default: '',
        },
        country: {
            type: String,
            trim: true,
            default: '',
        },
    },
    phone: {
        type: String,
        trim: true,
    },
    additionalInfo: {
        type: String,
        trim: true,
        default: '',
        maxlength: 500,
    },
});

var bodyStatusSchema = new Schema({
    general: {
        type: String,
        trim: true,
        default: 'normal',
    },
    arms: {
        type: String,
        trim: true,
        default: 'normal',
    },
    legs: {
        type: String,
        trim: true,
        default: 'normal',
    },
});

var userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        maxlength: 320,
        required: true,
        unique: true,
        validate: [
            value => {
                return validator.isEmail(value);
            },
            'Invalid email.',
        ],
    },
    password: {
        type: String,
        trim: true,
        require: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    contact: {
        type: contactSchema,
    },
    authToken: {
        access_token: {
            type: String,
            trim: true,
            default: '',
        },
        expires_in: {
            type: Number,
            trim: true,
            default: 0,
        },
        refresh_token: {
            type: String,
            trim: true,
            default: '',
        },
        scope: {
            type: String,
            trim: true,
            default: '',
        },
        token_type: {
            type: String,
            trim: true,
            default: '',
        },
        user_id: {
            type: String,
            trim: true,
            default: '',
        },
    },
    bodyStatus: {
        type: bodyStatusSchema,
    },
    weight: {
        type: [Number],
    },
    workoutExpiry: {
        type: Number,
        default: 0,
    },
    workoutPlan: {
        type: Mixed,
        default: {},
    },
});

userSchema.pre('save', async function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    try {
        console.log('entering update password');
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Users', userSchema);
