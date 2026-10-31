import { DepartmentRepository, CreateDepartmentInput, UpdateDepartmentInput, DepartmentFilterOptions } from '../repositories/departmentRepository.js';
import { AppError } from '../middleware/errorHandler.js';

export class DepartmentService {
  static async createDepartment(input: CreateDepartmentInput) {
    const existing = await DepartmentRepository.findByName(input.name);
    if (existing) {
      throw new AppError(`Department with name '${input.name}' already exists`, 409);
    }
    return DepartmentRepository.create(input);
  }

  static async getDepartmentById(id: string) {
    const department = await DepartmentRepository.findById(id);
    if (!department) {
      throw new AppError(`Department '${id}' not found`, 404);
    }
    return department;
  }

  static async listDepartments(options: DepartmentFilterOptions = {}) {
    return DepartmentRepository.findMany(options);
  }

  static async updateDepartment(id: string, input: UpdateDepartmentInput) {
    await this.getDepartmentById(id);
    if (input.name) {
      const existing = await DepartmentRepository.findByName(input.name);
      if (existing && existing.id !== id) {
        throw new AppError(`Department with name '${input.name}' already exists`, 409);
      }
    }
    return DepartmentRepository.update(id, input);
  }
}
