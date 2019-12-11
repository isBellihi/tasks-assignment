const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.set('useFindAndModify', false);

var Taskschema = new Schema({
    title: {
        type: String
    },
    status: {
        type: String
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deadline: {
        type: Date
    }
}, {
    timestamps: true
});

const Userschema = new Schema({
    name: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: 'worker',
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
}, {
    timestamps: true
});


Userschema.plugin(passportLocalMongoose);
Taskschema.plugin(passportLocalMongoose);

exports.User = mongoose.model('User', Userschema);
exports.Task = mongoose.model('Task', Taskschema);;