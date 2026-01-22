const Task = require("../models/Task");

// Get Tasks (With Search & Filter)
exports.getTasks = async (req, res) => {
  try {
    const keyword = req.query.keyword ? {
      title: { $regex: req.query.keyword, $options: "i" } // Search Logic
    } : {};

    // Sirf logged-in user ke tasks dikhao jo search se match karein
    const tasks = await Task.find({ ...keyword, user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const task = await Task.create({
      title, description, priority, dueDate,
      user: req.user._id
    });
    res.status(201).json(task);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Update Task (Drag Drop / Edit)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if(task.user.toString() !== req.user._id.toString()) return res.status(401).json({message: "Not authorized"});
    
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if(task.user.toString() !== req.user._id.toString()) return res.status(401).json({message: "Not authorized"});

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};