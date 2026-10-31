import { EmployeeRepository, CreateEmployeeInput, UpdateEmployeeInput, EmployeeFilterOptions } from '../repositories/employeeRepository.js';
import { DepartmentRepository } from '../repositories/departmentRepository.js';
import { AppError } from '../middleware/errorHandler.js';

export class EmployeeService {
  static async createEmployee(input: CreateEmployeeInput) {
    // 1. Verify code uniqueness
    const existingCode = await EmployeeRepository.findByCode(input.employeeCode);
    if (existingCode) {
      throw new AppError(`Employee code '${input.employeeCode}' already in use`, 409);
    }

    // 2. Verify email uniqueness
    const existingEmail = await EmployeeRepository.findByEmail(input.email);
    if (existingEmail) {
      throw new AppError(`Email '${input.email}' already registered`, 409);
    }

    // 3. Verify department exists and is active
    const department = await DepartmentRepository.findById(input.departmentId);
    if (!department) {
      throw new AppError(`Department '${input.departmentId}' not found`, 404);
    }
    if (!department.isActive) {
      throw new AppError(`Department '${department.name}' is inactive`, 400);
    }

    // 4. Verify manager if provided
    if (input.managerId) {
      const manager = await EmployeeRepository.findById(input.managerId);
      if (!manager) {
        throw new AppError(`Manager '${input.managerId}' not found`, 404);
      }
    }

    return EmployeeRepository.create(input);
  }

  static async getEmployeeById(id: string, includeFullProfile = false) {
    const employee = await EmployeeRepository.findById(id, includeFullProfile);
    if (!employee) {
      throw new AppError(`Employee '${id}' not found`, 404);
    }
    return employee;
  }

  static async listEmployees(options: EmployeeFilterOptions = {}) {
    return EmployeeRepository.findMany(options);
  }

  static async updateEmployee(id: string, input: UpdateEmployeeInput) {
    const employee = await this.getEmployeeById(id);

    // Prevent self-referential manager assignment
    if (input.managerId !== undefined) {
      if (input.managerId === id) {
        throw new AppError('An employee cannot be their own manager', 400);
      }
      if (input.managerId !== null) {
        const manager = await EmployeeRepository.findById(input.managerId);
        if (!manager) {
          throw new AppError(`Manager '${input.managerId}' not found`, 404);
        }
      }
    }

    // Verify email uniqueness if changing
    if (input.email && input.email !== employee.email) {
      const existing = await EmployeeRepository.findByEmail(input.email);
      if (existing) {
        throw new AppError(`Email '${input.email}' already in use`, 409);
      }
    }

    // Verify department if changing
    if (input.departmentId && input.departmentId !== employee.departmentId) {
      const dept = await DepartmentRepository.findById(input.departmentId);
      if (!dept) {
        throw new AppError(`Department '${input.departmentId}' not found`, 404);
      }
    }

    return EmployeeRepository.update(id, input);
  }

  static async getDirectReports(managerId: string) {
    await this.getEmployeeById(managerId);
    return EmployeeRepository.getDirectReports(managerId);
  }
}
