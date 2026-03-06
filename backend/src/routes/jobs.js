const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// get all jobs for user
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// create new job
router.post('/', auth, async (req, res) => {
  const { title, company, url, status, notes, portal } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  try {
    const job = new Job({
      user: req.user.id,
      title,
      company,
      url,
      status,
      notes,
      portal,
    });
    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// update job
router.put('/:id', auth, async (req, res) => {
  const { title, company, url, status, notes, portal } = req.body;
  const update = { title, company, url, status, notes, portal };
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    job = await Job.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// delete job
router.delete('/:id', auth, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;