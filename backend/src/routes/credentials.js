const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Credential = require('../models/Credential');

// get all credentials for user
router.get('/', auth, async (req, res) => {
  try {
    const creds = await Credential.find({ user: req.user.id });
    const credsWithDecrypted = creds.map(cred => ({
      _id: cred._id,
      user: cred.user,
      portal: cred.portal,
      email: cred.email,
      password: cred.getDecryptedPassword(),
      createdAt: cred.createdAt,
      updatedAt: cred.updatedAt,
    }));
    res.json(credsWithDecrypted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// create credential
router.post('/', auth, async (req, res) => {
  const { portal, email, password } = req.body;
  if (!portal || !email || !password) {
    return res.status(400).json({ message: 'Portal, email, and password are required' });
  }
  try {
    const cred = new Credential({
      user: req.user.id,
      portal,
      email,
      password,
    });
    await cred.save();
    const credWithDecrypted = {
      _id: cred._id,
      user: cred.user,
      portal: cred.portal,
      email: cred.email,
      password: cred.getDecryptedPassword(),
      createdAt: cred.createdAt,
      updatedAt: cred.updatedAt,
    };
    res.json(credWithDecrypted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// update credential
router.put('/:id', auth, async (req, res) => {
  const { portal, email, password } = req.body;
  const update = {};
  if (portal !== undefined) update.portal = portal;
  if (email !== undefined) update.email = email;
  if (password !== undefined) update.password = password;
  try {
    let cred = await Credential.findById(req.params.id);
    if (!cred) return res.status(404).json({ message: 'Credential not found' });
    if (cred.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    cred = await Credential.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    const credWithDecrypted = {
      _id: cred._id,
      user: cred.user,
      portal: cred.portal,
      email: cred.email,
      password: cred.getDecryptedPassword(),
      createdAt: cred.createdAt,
      updatedAt: cred.updatedAt,
    };
    res.json(credWithDecrypted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// delete credential
router.delete('/:id', auth, async (req, res) => {
  try {
    let cred = await Credential.findById(req.params.id);
    if (!cred) return res.status(404).json({ message: 'Credential not found' });
    if (cred.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    await Credential.findByIdAndDelete(req.params.id);
    res.json({ message: 'Credential removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;