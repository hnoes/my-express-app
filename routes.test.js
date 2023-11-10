const request = require('supertest');
const app = require('./app'); // Replace with the path to your Express app
const slugify = require('slugify'); // Install slugify if not already installed

// Define test data
const testCompany = {
  name: 'Test Company',
  description: 'A test company',
};

describe('Company Routes', () => {
  it('GET /companies should return a list of companies', async () => {
    const response = await request(app).get('/companies');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('companies');
  });

  it('POST /companies should add a new company', async () => {
    const response = await request(app)
      .post('/companies')
      .send(testCompany);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('company');
  });
});

describe('Slugify Company Names', () => {
  it('Should slugify a company name', () => {
    const companyName = 'Test Company Name';
    const expectedCode = slugify(companyName, { lower: true, strict: true });
    const generatedCode = slugifyCompanyCode(companyName);
    
    expect(generatedCode).toEqual(expectedCode);
  });
});
