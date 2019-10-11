const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const saltRounds = 12;

const Schema = mongoose.Schema;

var addressSchema = new Schema({
    street: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    postalCode: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },

});

var phoneSchema = new Schema({
    home: {
        type: String,
        trim: true,
    },
    mobile: {
        type: String,
        trim: true,
    },
    business: {
        type: String,
        trim: true,
    },
})

var contactSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    address: {
        type: addressSchema,
    },
    phoneNumber: {
        type: phoneSchema,
    },
    email: {
        type: String,
        trim: true,
        maxlength: 320,
        unique: true,
        validate: [(value) => {
            return validator.isEmail(value);
        }, "Invalid email."], 
    },
})

var doctorSchema = new Schema({
    contact: contactSchema,
    notes: {
        type: String,
    }
})

var userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        maxlength: 320,
        required: true,
        unique: true,
        validate: [(value) => {
            return validator.isEmail(value);
        }, "Invalid email."],
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
    doctors: {
        type: [doctorSchema],
    },
    bloodType: {
        type: String,
        trim: true,
    },
    allergies: {
        type: [String],
    },
    medications: {
        type: [String],
    },
    illnesses: {
        type: [String],
    },
    surgeries: {
        type: [String],
    },
    organ_donor: {
        type: Boolean,
    },
    weight: {
        type: [Number],
    },
});

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

module.exports = mongoose.model('Users', userSchema);