const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating user"],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: [true, "Email already exist"]
    },
    name: {
        type: String,
        required: [true, "Name is required for Creating an account"],
    },
    password: {
        type: String,
        required: [true, "Password is required of creating an account"],
        minlength: [6, "Password should be contain moure the 6 chracter"],
        select: false
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    },
}, {
    timestamps: true
})

// check for password if it need to hash
userSchema.pre("save", async function () {
    // If password is not modifi the go for next
    if (!this.isModified("password")) {
        return
    }

    // if password is modified then hash tha password
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    return
})

//  return if the hash passwowrd is same as user given 
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// export the model
const userModel = mongoose.model('user', userSchema)
module.exports = userModel