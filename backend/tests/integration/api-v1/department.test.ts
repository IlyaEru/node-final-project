import request from 'supertest';

import app from '../../../src/app';
import { faker } from '@faker-js/faker';
import setUpTestDb from '../../utils/setupTestDb';
import mongoose from 'mongoose';
import Department from '../../../src/api/v1/department/department.model';
import Employee from '../../../src/api/v1/employee/employee.model';
setUpTestDb();

const userData = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  fullName: faker.name.fullName(),
};

const departmentData = {
  name: faker.commerce.department(),
  manager: new mongoose.Types.ObjectId(),
};

describe('Department API', () => {
  let accessToken: string;
  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register').send(userData).expect(201);
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: userData.username, email: userData.email })
      .expect(200);
    accessToken = res.body.tokens.access.token;
  });
  describe('GET /api/v1/departments', () => {
    it('should return an array of departments', async () => {
      const resp = await request(app)
        .get('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(resp.body).toBeDefined();
      expect(resp.body.departments).toBeDefined();
    });

    it('should return 403 without token', async () => {
      await request(app).get('/api/v1/departments').expect(403);
    });
  });

  describe('POST /api/v1/departments', () => {
    it('should create a department', async () => {
      const resp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(departmentData)
        .expect(201);
      expect(resp.body).toBeDefined();
      expect(resp.body.department).toBeDefined();
      expect(resp.body.department.name).toEqual(
        departmentData.name.toLowerCase(),
      );
      expect(JSON.stringify(resp.body.department.manager)).toEqual(
        JSON.stringify(departmentData.manager),
      );

      const dbDepartment = await Department.findOne({
        _id: resp.body.department._id,
      });
      expect(dbDepartment).toBeDefined();
      if (dbDepartment) {
        expect(dbDepartment.name).toEqual(departmentData.name.toLowerCase());
        expect(JSON.stringify(dbDepartment.manager)).toEqual(
          JSON.stringify(departmentData.manager),
        );
        expect(dbDepartment.employees).toEqual([]);
      }
    });

    it('should return 403 without token', async () => {
      await request(app)
        .post('/api/v1/departments')
        .send(departmentData)
        .expect(403);
    });

    it('should return 400 if name is not provided', async () => {
      const resp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ manager: departmentData.manager });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('name is required');
    });

    it('should return 400 if name is taken', async () => {
      await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(departmentData)
        .expect(201);

      const resp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(departmentData);

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual(
        'Department name is already taken',
      );
    });

    it('should return 400 if name is a bad type', async () => {
      const resp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 123, manager: departmentData.manager });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('name must be a string');
    });

    it('should return 400 if name is a wrong length', async () => {
      const shortResp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'a', manager: departmentData.manager });

      expect(shortResp.status).toEqual(400);
      expect(shortResp.body.error.message).toEqual(
        'name length must be at least 3 characters long',
      );

      const longResp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'a'.repeat(51), manager: departmentData.manager });

      expect(longResp.status).toEqual(400);
      expect(longResp.body.error.message).toEqual(
        'name length must be less than or equal to 40 characters long',
      );
    });

    it('should return 400 if manager is not provided', async () => {
      const resp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: departmentData.name });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('manager is required');
    });

    it('should return 400 if manager is a bad type', async () => {
      const resp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: departmentData.name, manager: '123' });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('Invalid manager id');
    });

    it('should return 400 if manager is not a valid id', async () => {
      const resp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: departmentData.name, manager: '123' });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('Invalid manager id');
    });
  });

  describe('GET /api/v1/departments/:id', () => {
    let departmentId: string;
    beforeEach(async () => {
      const resp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(departmentData)
        .expect(201);

      departmentId = resp.body.department._id;
    });

    it('should return a department', async () => {
      const resp = await request(app)
        .get(`/api/v1/departments/${departmentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(resp.body.department).toBeDefined();
      expect(resp.body.department.name).toEqual(
        departmentData.name.toLowerCase(),
      );
      expect(JSON.stringify(resp.body.department.manager)).toEqual(
        JSON.stringify(departmentData.manager),
      );
    });

    it('should return 403 without token', async () => {
      await request(app).get(`/api/v1/departments/${departmentId}`).expect(403);
    });

    it('should return 400 if id is not a valid id', async () => {
      const resp = await request(app)
        .get('/api/v1/departments/123')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(resp.body.error.message).toEqual('Invalid id');
    });

    it('should return 404 if department is not found', async () => {
      const resp = await request(app)
        .get(`/api/v1/departments/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(resp.body.error.message).toEqual('Department not found');
    });
  });

  describe('PUT /api/v1/departments/:id', () => {
    let departmentId: string;
    beforeEach(async () => {
      const resp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(departmentData)
        .expect(201);

      departmentId = resp.body.department._id;
    });

    it('should update a department', async () => {
      const resp = await request(app)
        .put(`/api/v1/departments/${departmentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Updated Department' })
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(resp.body.department).toBeDefined();
      expect(resp.body.department.name).toEqual('updated department');
    });

    it('should return 403 without token', async () => {
      await request(app)
        .put(`/api/v1/departments/${departmentId}`)
        .send({ name: 'Updated Department' })
        .expect(403);
    });

    it('should return 400 if id is not a valid id', async () => {
      const resp = await request(app)
        .put('/api/v1/departments/123')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Updated Department' })
        .expect(400);

      expect(resp.body.error.message).toEqual('Invalid id');
    });

    it('should return 404 if department is not found', async () => {
      const resp = await request(app)
        .put(`/api/v1/departments/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Updated Department' })
        .expect(404);

      expect(resp.body.error.message).toEqual('Department not found');
    });

    it('should return 400 if name is a bad type', async () => {
      const resp = await request(app)
        .put(`/api/v1/departments/${departmentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 123, manager: departmentData.manager })
        .expect(400);

      expect(resp.body.error.message).toEqual('name must be a string');
    });

    it('should return 400 if name is too long', async () => {
      const resp = await request(app)
        .put(`/api/v1/departments/${departmentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: '123456789012345678901234567890123456789012345678901',
          manager: departmentData.manager,
        })
        .expect(400);

      expect(resp.body.error.message).toEqual(
        'name length must be less than or equal to 40 characters long',
      );
    });

    it('should return 400 if manager is a bad type', async () => {
      const resp = await request(app)
        .put(`/api/v1/departments/${departmentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: departmentData.name, manager: 123 })
        .expect(400);

      expect(resp.body.error.message).toEqual('manager must be a string');

      const resp2 = await request(app)
        .put(`/api/v1/departments/${departmentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: departmentData.name, manager: '123' })
        .expect(400);

      expect(resp2.body.error.message).toEqual('Invalid manager id');
    });

    it('should add employees to department', async () => {
      const employee1Data = {
        firstName: 'John',
        lastName: 'Doe',
        startingWorkYear: 2010,
      };
      const employee2Data = {
        firstName: 'Jane',
        lastName: 'Doe',
        startingWorkYear: 2010,
      };

      const employee1 = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(employee1Data)

        .expect(201);

      const employee2 = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(employee2Data)

        .expect(201);

      const resp = await request(app)
        .put(`/api/v1/departments/${departmentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          employees: [employee1.body.employee._id, employee2.body.employee._id],
        })
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(resp.body.department).toBeDefined();
      expect(resp.body.department.employees).toBeDefined();
      expect(resp.body.department.employees.length).toEqual(2);
      expect(resp.body.department.employees[0]).toEqual(
        employee1.body.employee._id.toString(),
      );
    });
  });

  describe('DELETE /api/v1/departments/:id', () => {
    let departmentId: string;
    beforeEach(async () => {
      const resp = await request(app)
        .post('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(departmentData)
        .expect(201);

      departmentId = resp.body.department._id;
    });

    it('should delete a department', async () => {
      const resp = await request(app)
        .delete(`/api/v1/departments/${departmentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should return 403 without token', async () => {
      await request(app)
        .delete(`/api/v1/departments/${departmentId}`)
        .expect(403);
    });

    it('should return 400 if id is not a valid id', async () => {
      const resp = await request(app)
        .delete('/api/v1/departments/123')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(resp.body.error.message).toEqual('Invalid id');
    });

    it('should return 404 if department is not found', async () => {
      const resp = await request(app)
        .delete(`/api/v1/departments/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(resp.body.error.message).toEqual('Department not found');
    });

    it('should delete employees from department', async () => {
      const employee1Data = {
        firstName: 'John',
        lastName: 'Doe',
        startingWorkYear: 2010,
      };
      const employee2Data = {
        firstName: 'Jane',
        lastName: 'Doe',
        startingWorkYear: 2010,
      };

      const employee1 = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(employee1Data)

        .expect(201);

      const employee2 = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(employee2Data)

        .expect(201);

      const resp = await request(app)
        .put(`/api/v1/departments/${departmentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          employees: [employee1.body.employee._id, employee2.body.employee._id],
        })
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(resp.body.department).toBeDefined();
      expect(resp.body.department.employees).toBeDefined();

      const dbEmployee1 = await Employee.findById(employee1.body.employee._id);
      const dbEmployee2 = await Employee.findById(employee2.body.employee._id);

      if (!dbEmployee1 || !dbEmployee2) {
        throw new Error('Employee not found');
      }

      expect(JSON.stringify(dbEmployee1.department)).toEqual(
        JSON.stringify(departmentId),
      );
      expect(JSON.stringify(dbEmployee2.department)).toEqual(
        JSON.stringify(departmentId),
      );

      await request(app)
        .delete(`/api/v1/departments/${departmentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      const dbEmployee1AfterDelete = await Employee.findById(
        employee1.body.employee._id,
      );
      const dbEmployee2AfterDelete = await Employee.findById(
        employee2.body.employee._id,
      );

      expect(dbEmployee1AfterDelete).toBeNull();
      expect(dbEmployee2AfterDelete).toBeNull();
    });
  });
});
