const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 12;

const Schema = mongoose.Schema;

var addressSchema = new Schema({
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    country: {
        type: String,
    },

});

var phoneSchema = new Schema({
    home: {
        type: String,
    },
    mobile: {
        type: String,
    },
    business: {
        type: String,
    },
})

var contactSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    address: {
        type: addressSchema,
    },
    phoneNumber: {
        type: phoneSchema,
    }
})

var doctorSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    address: {
        type: addressSchema,
    },
    phoneNumber: {
        type: phoneSchema,
    },
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
        validate: (value) => {
            return true; //TODO: Add validator for email
        },
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