const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /invoices - Returns info on all invoices
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, comp_code FROM invoices');
    return res.json({ invoices: result.rows });
  } catch (err) {
    return next(err);
  }
});

// GET /invoices/:id - Returns info on a specific invoice
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT i.id, i.amt, i.paid, i.add_date, i.paid_date, c.code, c.name, c.description ' +
      'FROM invoices AS i ' +
      'JOIN companies AS c ON (i.comp_code = c.code) ' +
      'WHERE i.id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    return res.json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// POST /invoices - Adds a new invoice
router.post('/', async (req, res, next) => {
  const { comp_code, amt } = req.body;
  try {
    const result = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *', [comp_code, amt]);
    return res.status(201).json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// PUT /invoices/:id - Updates an invoice
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { amt } = req.body;
  try {
    const result = await db.query('UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING *', [amt, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    return res.json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// DELETE /invoices/:id - Deletes an invoice
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM invoices WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    return res.json({ status: 'deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
