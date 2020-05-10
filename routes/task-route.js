const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Task = require("../models/task-model");


router.get("/", async (req, res) => {
  try {

    //tâches effectuées en fin de liste
    const t1 = await Task.find({ done: "false" });
    const t2 = await Task.find({ done: "true" });
    const t3 = t1.concat(t2);
    return res.status(200).json(t3);

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


router.post("/create", async (req, res) => {
  try {
    if (req.fields.title && req.fields.done) {
      if (req.fields.title.trim().length === 0) return res.status(400).json({ error: "Empty" }); 
      if (req.fields.title.length > 30) return res.status(400).json({ error: "Title must be less than 30 characters" }); 

      const t = await Task.findOne({ title: req.fields.title}); //doublon
      if (!t) {

        const newTask = new Task({
          title: req.fields.title,
          done: req.fields.done,
        });

        await newTask.save();
        return res.status(200).json(newTask);

      } else return res.status(400).json({ error: "Task already existed" });
    } else return res.status(400).json({ error: "Missing parameters" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


router.put("/check/:id", async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const t = await Task.findById(req.params.id);
      if (t) {

        t.done = !t.done;
        await t.save();
        return res.status(200).json({ message: "Task updated" });

      } else return res.status(404).json({ error: "Task not found" });
    } else return res.status(400).json({ error: "Wrong id" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


router.delete("/delete/:id", async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const t = await Task.findById(req.params.id);
      if (t) {

        await t.remove();
        return res.status(200).json({ message: "Task removed" });

      } else return res.status(404).json({ error: "Task not found" });
    } else return res.status(400).json({ error: "Wrong id" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


module.exports = router;