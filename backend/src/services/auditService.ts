import { AuditRepository, CreateAuditLogInput, AuditFilterOptions } from '../repositories/auditRepository.js';

export class AuditService {
  static async log(input: CreateAuditLogInput) {
    return AuditRepository.create(input);
  }

  static async getLogs(options: AuditFilterOptions = {}) {
    return AuditRepository.findMany(options);
  }
}
