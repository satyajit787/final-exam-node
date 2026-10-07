const Task = require('../models/Task');
const User = require('../models/User');
const Category = require('../models/Category');

// Helper: Ensure some default categories exist
const getCategories = async () => {
    let categories = await Category.find();
    if (categories.length === 0) {
        categories = await Category.insertMany([
            { name: 'Work' },
            { name: 'Personal' },
            { name: 'Study' },
            { name: 'Health' }
        ]);
    }
    return categories;
};

// 1. Get logged-in user's tasks
exports.getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id })
            .populate('category')
            .populate('user', 'username role')
            .sort({ createdAt: -1 });

        res.render('taskList', {
            title: 'My Tasks',
            tasks,
            isAllTasksView: false
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// 2. Get all users' tasks (Admin only)
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('category')
            .populate('user', 'username role')
            .sort({ createdAt: -1 });

        res.render('taskList', {
            title: 'All User Tasks (Admin View)',
            tasks,
            isAllTasksView: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// 3. Render Add Task Form
exports.getNewTaskForm = async (req, res) => {
    try {
        const categories = await getCategories();
        res.render('taskForm', {
            title: 'Create New Task',
            task: null,
            categories,
            actionUrl: '/tasks/new'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// 4. Create Task (POST)
exports.createTask = async (req, res) => {
    try {
        const { title, description, category, status } = req.body;

        const task = new Task({
            title,
            description,
            category,
            status: status || 'Pending',
            user: req.user.id
        });

        await task.save();

        // Update User's task array reference
        await User.findByIdAndUpdate(req.user.id, {
            $push: { tasks: task._id }
        });

        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating task');
    }
};

// 5. Render Edit Task Form
exports.getEditTaskForm = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found');
        }

        // Permission check: regular users can only edit their own task
        if (req.user.role !== 'admin' && task.user.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized to edit this task');
        }

        const categories = await getCategories();
        res.render('taskForm', {
            title: 'Edit Task',
            task,
            categories,
            actionUrl: `/tasks/edit/${task._id}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// 6. Update Task (POST)
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found');
        }

        // Permission check
        if (req.user.role !== 'admin' && task.user.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized to update this task');
        }

        const { title, description, category, status } = req.body;
        task.title = title;
        task.description = description;
        task.category = category;
        task.status = status;

        await task.save();
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating task');
    }
};

// 7. Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found');
        }

        // Permission check
        if (req.user.role !== 'admin' && task.user.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized to delete this task');
        }

        // Remove from user's tasks array
        await User.findByIdAndUpdate(task.user, {
            $pull: { tasks: task._id }
        });

        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting task');
    }
};
