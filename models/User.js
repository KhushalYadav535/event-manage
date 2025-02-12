const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
{
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // New field for user role
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ }, // Email validation
    password: { type: String, required: true, minlength: 8 },
    isActive: { type: Boolean, default: true } // New field for user active status
}, { timestamps: true }); // Automatically adds `createdAt` & `updatedAt`

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords for login
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
