const express = require('express');
const router = express.Router();
const db = require('../db');
// const { check, validationResult } = require('express-validator/check');

// GET /companies - Returns a list of companies
router.get('/', async (req, res, next) => {
    try {
        const result = await db.query('SELECT code, name FROM companies');
        return res.json({ companies: result.rows });
    } catch (err) {
        return next(err);
    }
});

// GET /companies/:code - Returns a specific company
// GET /companies/:code - Returns info on a specific company including associated invoices
router.get('/:code', async (req, res, next) => {
    const { code } = req.params;
    try {
      const companyQuery = db.query('SELECT code, name, description FROM companies WHERE code = $1', [code]);
      const invoicesQuery = db.query('SELECT id FROM invoices WHERE comp_code = $1', [code]);
      const [companyResult, invoicesResult] = await Promise.all([companyQuery, invoicesQuery]);
  
      if (companyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }
  
      const company = companyResult.rows[0];
      const invoices = invoicesResult.rows.map(row => row.id);
  
      return res.json({ company: { ...company, invoices } });
    } catch (err) {
      return next(err);
    }
  });
  

// POST /companies - adds a new company
router.post('/', async (req, res, next) => {
    // Validate the request body using express validators
    const { code, name, description } = req.body;
    try {
        const result = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description]);
        return res.status(201).json({ company: result.rows[0]});
    }   catch (err) {
        return next(err);
    }
    });

// PUT /companies/:code - updates an existing company
router.put('/:code', async (req, res, next) => {
    const { code } = req.params;
    const { name, description } = req.body;
    try {
        const result = await db.query('UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING *', [name, description, code]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found'});
        }
        return res.json({ company: result.rows[0] });
        } catch (err) {
        return next(err);
    }
});

// DELETE /companies/:code - deletes a company
router.delete('/:code', async (req, res, next) => {
    const { code } = req.params;
    try {
        const result = await db.query('DELETE FROM companies WHERE code = $1', [code]);
        if (result.rowCount === 0 ) {
            return res.status(404).json({ error: 'Company not found' });
        } 
        return res.json({ status: 'deleted' });
    }   catch (err) {
        return next(err);
    }
    });

    module.exports = routers;