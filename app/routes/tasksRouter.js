const express = require('express');
const router = express.Router();
const Task = require('../models').Task;
const User = require('../models').User;

router.get('/', (req, res) => {
    Task.find({})
        .populate('assignedTo')
        .then(tasks => {
            res.json(tasks);
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({
                error,
                message: "Internal server error"
            });
        });
});

router.get('/:id', (req, res) => {
    Task.findOne({ _id: req.params.id })
        .populate('assignedTo')
        .then(tasks => {
            res.json(tasks);
        })
        .catch(error => {
            res.statusCode = 500;
            res.json({
                error,
                message: "Internal server error"
            });
        });
});

router.post('/', (req, res) => {
    Task.create(req.body)
        .then(async task => {
            if (req.body.assignedTo) {
                const user = await User.findOne({ _id: req.body.assignedTo })
                user.tasks.push(task._id);
                await user.save();
            }
            res.json(task);
        })
        .catch(error => {
            res.statusCode = 500;
            res.json({
                error,
                message: "Internal server error"
            });
        });
});

router.put('/:id', async(req, res) => {
    try {
        let task = await Task.findOne({ _id: req.params.id });
        if (req.body.assignedTo) {
            let user = await User.findOne({ _id: task.assignedTo })
            user.tasks = user.tasks.filter(a => a.toString() !== task._id.toString());
            await user.save();
            user = await User.findOne({ _id: req.body.assignedTo })
            user.tasks.push(task._id);
            await user.save();
        }
        Task.findOneAndUpdate({ _id: task._id }, { $set: req.body }, { new: true }).then(ts => {
            return res.json(ts);
        }).catch(error => {
            res.statusCode = 500;
            res.json({
                error,
                message: "Internal server error"
            });
        });
    } catch (error) {
        res.statusCode = 500;
        res.json({
            error,
            message: "Internal server error"
        });
    }
});

router.delete('/:id', (req, res) => {
    Task.findOneAndRemove({ _id: req.params.id }, { $set: req.body })
        .then(task => {
            res.json(task);
        })
        .catch(error => {
            res.statusCode = 500;
            res.json({
                error,
                message: "Internal server error"
            });
        });
});

module.exports = router;