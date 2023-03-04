import request from 'supertest';

import app from '../../../src/app';
import { faker } from '@faker-js/faker';
import setUpTestDb from '../../utils/setupTestDb';
import mongoose from 'mongoose';
import Employee from '../../../src/api/v1/employee/employee.model';
import Department from '../../../src/api/v1/department/department.model';
import dayjs from 'dayjs';
import Shift from '../../../src/api/v1/shift/shift.model';

setUpTestDb();

const userData = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  fullName: faker.name.fullName(),
};

const employeeData = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  startingWorkYear: faker.date.past().getFullYear(),
};

describe('Employee API', () => {
  let accessToken: string;
  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register').send(userData).expect(201);
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: userData.username, email: userData.email })
      .expect(200);
    accessToken = res.body.tokens.access.token;
  });
  describe('GET /api/v1/employees', () => {
    it('should return an array of employees', async () => {
      const resp = await request(app)
        .get('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(resp.body).toBeDefined();
      expect(resp.body.employees).toBeDefined();
    });

    it('should return 403 without token', async () => {
      await request(app).get('/api/v1/employees').expect(403);
    });
  });

  describe('POST /api/v1/employees', () => {
    it('should create a employee', async () => {
      const resp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(employeeData)
        .expect(201);
      expect(resp.body).toBeDefined();
      expect(resp.body.employee).toBeDefined();
      expect(resp.body.employee._id).toBeDefined();
      expect(resp.body.employee.firstName).toEqual(employeeData.firstName);
      expect(resp.body.employee.lastName).toEqual(employeeData.lastName);
      expect(resp.body.employee.startingWorkYear).toEqual(
        employeeData.startingWorkYear,
      );
      expect(resp.body.employee.department).toBeUndefined();

      const dbEmployee = await Employee.findOne({
        _id: resp.body.employee._id,
      });
      expect(dbEmployee).toBeDefined();
      if (dbEmployee) {
        expect(dbEmployee.firstName).toEqual(employeeData.firstName);
        expect(dbEmployee.lastName).toEqual(employeeData.lastName);
        expect(dbEmployee.startingWorkYear).toEqual(
          employeeData.startingWorkYear,
        );
        expect(dbEmployee.department).toBeUndefined();
      }
    });

    it('should return 403 without token', async () => {
      await request(app)
        .post('/api/v1/employees')
        .send(employeeData)
        .expect(403);
    });

    it('should return 400 if firstName is not provided', async () => {
      const resp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, firstName: undefined });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('firstName is required');
    });

    it('should return 400 if lastName is not provided', async () => {
      const resp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, lastName: undefined });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('lastName is required');
    });

    it('should return 400 if startingWorkYear is not provided', async () => {
      const resp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, startingWorkYear: undefined });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('startingWorkYear is required');
    });

    it('should return 400 if firstName is a bad type', async () => {
      const resp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, firstName: 123 });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('firstName must be a string');
    });

    it('should return 400 if lastName is a bad type', async () => {
      const resp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, lastName: 123 });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('lastName must be a string');
    });

    it('should return 400 if startingWorkYear is a bad type', async () => {
      const resp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, startingWorkYear: { '123': '123' } });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual(
        'startingWorkYear must be a number',
      );
    });

    it('should return 400 if firstName is a wrong length', async () => {
      const shortResp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, firstName: 'a' });

      expect(shortResp.status).toEqual(400);
      expect(shortResp.body.error.message).toEqual(
        'firstName length must be at least 3 characters long',
      );

      const longResp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, firstName: 'a'.repeat(51) });

      expect(longResp.status).toEqual(400);
      expect(longResp.body.error.message).toEqual(
        'firstName length must be less than or equal to 40 characters long',
      );
    });

    it('should return 400 if lastName is a wrong length', async () => {
      const shortResp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, lastName: 'a' });

      expect(shortResp.status).toEqual(400);
      expect(shortResp.body.error.message).toEqual(
        'lastName length must be at least 3 characters long',
      );

      const longResp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, lastName: 'a'.repeat(51) });

      expect(longResp.status).toEqual(400);
      expect(longResp.body.error.message).toEqual(
        'lastName length must be less than or equal to 40 characters long',
      );
    });

    it('should return 400 if startingWorkYear is bigger than 2100 ot shorter than 1900', async () => {
      const shortResp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, startingWorkYear: 1899 });

      expect(shortResp.status).toEqual(400);
      expect(shortResp.body.error.message).toEqual(
        'startingWorkYear must be greater than or equal to 1900',
      );

      const longResp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, startingWorkYear: 2101 });

      expect(longResp.status).toEqual(400);
      expect(longResp.body.error.message).toEqual(
        'startingWorkYear must be less than or equal to 2100',
      );
    });

    it('should return 400 if department is not a valid id', async () => {
      const resp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, department: '123' });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('Invalid department id');
    });

    it('should add the employee to department', async () => {
      const departmentData = {
        name: 'Department',
        manager: new mongoose.Types.ObjectId(),
      };
      const department = await Department.create(departmentData);
      expect(department.employees.length).toEqual(0);
      const employee = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, department: department._id });

      expect(employee.status).toEqual(201);
      expect(employee.body.employee.department).toEqual(
        department._id.toString(),
      );

      const afterEmployeeDepartment = await Department.findById(department._id);

      expect(afterEmployeeDepartment?.employees.length).toEqual(1);
    });
  });

  describe('GET /api/v1/employees/:id', () => {
    let employeeId: string;

    beforeEach(async () => {
      const resp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(employeeData)
        .expect(201);

      employeeId = resp.body.employee._id;
    });

    it('should return a employee', async () => {
      const resp = await request(app)
        .get(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(resp.body.employee).toBeDefined();
      expect(resp.body.employee.firstName).toEqual(employeeData.firstName);
      expect(resp.body.employee.lastName).toEqual(employeeData.lastName);
      expect(resp.body.employee.startingWorkYear).toEqual(
        employeeData.startingWorkYear,
      );
    });

    it('should return 403 without token', async () => {
      await request(app).get(`/api/v1/employees/${employeeId}`).expect(403);
    });

    it('should return 400 if id is not a valid id', async () => {
      const resp = await request(app)
        .get('/api/v1/employees/123')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(resp.body.error.message).toEqual('Invalid id');
    });

    it('should return 404 if employee is not found', async () => {
      const resp = await request(app)
        .get(`/api/v1/employees/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(resp.body.error.message).toEqual('Employee not found');
    });
  });

  describe('PUT /api/v1/employees/:id', () => {
    let employeeId: string;
    beforeEach(async () => {
      const resp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(employeeData)
        .expect(201);

      employeeId = resp.body.employee._id;
    });

    it('should update a employee', async () => {
      const preUpdateResp = await request(app)
        .get(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(preUpdateResp.body.employee.firstName).toEqual(
        employeeData.firstName,
      );

      const resp = await request(app)
        .put(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ firstName: 'Updated Employee' })
        .expect(200);

      expect(resp.body.updatedEmployee).toBeDefined();
      expect(resp.body.updatedEmployee.firstName).toEqual('Updated Employee');
      expect(resp.body.updatedEmployee.firstName).not.toEqual(
        employeeData.firstName,
      );
      expect(resp.body.updatedEmployee.lastName).toEqual(employeeData.lastName);
      expect(resp.body.updatedEmployee.startingWorkYear).toEqual(
        employeeData.startingWorkYear,
      );

      const afterUpdateResp = await request(app)
        .get(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(afterUpdateResp.body.employee.firstName).toEqual(
        'Updated Employee',
      );
    });

    it('should return 403 without token', async () => {
      await request(app)
        .put(`/api/v1/employees/${employeeId}`)
        .send({ name: 'Updated Employee' })
        .expect(403);
    });

    it('should return 400 if id is not a valid id', async () => {
      const resp = await request(app)
        .put('/api/v1/employees/123')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Updated Employee' })
        .expect(400);

      expect(resp.body.error.message).toEqual('Invalid id');
    });

    it('should return 404 if employee is not found', async () => {
      const resp = await request(app)
        .put(`/api/v1/employees/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)

        .expect(404);

      expect(resp.body.error.message).toEqual('Employee not found');
    });

    it('should return 400 if firstName is a bad type', async () => {
      const resp = await request(app)
        .put(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ firstName: 123, lastName: employeeData.lastName })
        .expect(400);

      expect(resp.body.error.message).toEqual('firstName must be a string');
    });

    it('should return 400 if firstName is bad length', async () => {
      const longResp = await request(app)
        .put(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          firstName: 'a'.repeat(51),
        })
        .expect(400);

      expect(longResp.body.error.message).toEqual(
        'firstName length must be less than or equal to 40 characters long',
      );

      const shortResp = await request(app)
        .put(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          firstName: 'a'.repeat(1),
        })
        .expect(400);

      expect(shortResp.body.error.message).toEqual(
        'firstName length must be at least 3 characters long',
      );
    });

    it('should return 400 if lastName is a bad type', async () => {
      const resp = await request(app)
        .put(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ lastName: 123 })
        .expect(400);

      expect(resp.body.error.message).toEqual('lastName must be a string');
    });

    it('should return 400 if lastName is bad length', async () => {
      const longResp = await request(app)
        .put(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          lastName: 'a'.repeat(51),
        })
        .expect(400);

      expect(longResp.body.error.message).toEqual(
        'lastName length must be less than or equal to 40 characters long',
      );

      const shortResp = await request(app)
        .put(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          lastName: 'a'.repeat(1),
        })
        .expect(400);

      expect(shortResp.body.error.message).toEqual(
        'lastName length must be at least 3 characters long',
      );
    });

    it('should remove the employee from the old department', async () => {
      const department1Data = {
        name: 'Department1',
        manager: new mongoose.Types.ObjectId(),
      };
      const department2Data = {
        name: 'Department 2',
        manager: new mongoose.Types.ObjectId(),
      };
      const department1 = await Department.create(department1Data);
      const department2 = await Department.create(department2Data);

      const employee = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, department: department1._id });

      const afterEmployeeDepartment = await Department.findById(
        department1._id,
      );

      expect(afterEmployeeDepartment?.employees.length).toEqual(1);

      await request(app)
        .put(`/api/v1/employees/${employee.body.employee._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ department: department2._id });

      const afterUpdateDepartment1 = await Department.findById(department1._id);
      const afterUpdateDepartment2 = await Department.findById(department2._id);

      expect(afterUpdateDepartment1?.employees.length).toEqual(0);
      expect(afterUpdateDepartment2?.employees.length).toEqual(1);
    });
  });

  describe('DELETE /api/v1/employees/:id', () => {
    let employeeId: string;
    beforeEach(async () => {
      const resp = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(employeeData)
        .expect(201);

      employeeId = resp.body.employee._id;
    });

    it('should delete a employee', async () => {
      const preDeleteResp = await request(app)
        .get(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(preDeleteResp.body.employee).toBeDefined();

      const resp = await request(app)
        .delete(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      const afterDeleteResp = await request(app)
        .get(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(afterDeleteResp.body.error.message).toEqual('Employee not found');
    });

    it('should delete the employee from the department', async () => {
      const departmentData = {
        name: 'Department1',
        manager: new mongoose.Types.ObjectId(),
      };
      const department = await Department.create(departmentData);

      const employee = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...employeeData, department: department._id });

      const dbDepartment = await Department.findById(department._id);

      expect(dbDepartment?.employees.length).toEqual(1);

      await request(app)
        .delete(`/api/v1/employees/${employee.body.employee._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      const afterDeleteDepartment = await Department.findById(department._id);

      expect(afterDeleteDepartment?.employees.length).toEqual(0);
    });

    it('should return 403 without token', async () => {
      await request(app).delete(`/api/v1/employees/${employeeId}`).expect(403);
    });

    it('should return 400 if id is not a valid id', async () => {
      const resp = await request(app)
        .delete('/api/v1/employees/123')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(resp.body.error.message).toEqual('Invalid id');
    });

    it('should return 404 if employee is not found', async () => {
      const resp = await request(app)
        .delete(`/api/v1/employees/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(resp.body.error.message).toEqual('Employee not found');
    });

    it('should also delete the employee from its shifts', async () => {
      const shiftDate = dayjs(faker.date.past()).toISOString();
      const shiftData = {
        date: shiftDate,
        startTime: dayjs(shiftDate).add(1, 'hour'),
        endTime: dayjs(shiftDate).add(2, 'hour'),
      };
      const shift = await Shift.create(shiftData);

      await request(app)
        .put(`/api/v1/shifts/${shift._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ employees: [employeeId] });

      const preDeleteDBShift = await Shift.findById(shift._id);

      expect(preDeleteDBShift?.employees.length).toEqual(1);
      expect(preDeleteDBShift?.employees[0].toString()).toEqual(employeeId);

      await request(app)
        .delete(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      const afterDeleteDBShift = await Shift.findById(shift._id);

      expect(afterDeleteDBShift?.employees.length).toEqual(0);
    });

    it('should delete the employee from department manager', async () => {
      const department1Data = {
        name: 'Department1',
        manager: employeeId,
      };
      const department1 = await Department.create(department1Data);

      const preDeleteDBDepartment = await Department.findById(department1._id);

      expect(preDeleteDBDepartment?.manager.toString()).toEqual(employeeId);

      await request(app)
        .delete(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      const afterDeleteDBDepartment = await Department.findById(
        department1._id,
      );

      expect(afterDeleteDBDepartment?.manager).toBeNull();
    });
  });
});
