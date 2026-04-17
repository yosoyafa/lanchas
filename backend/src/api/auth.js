const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || !await bcrypt.compare(password, admin.passwordHash)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
