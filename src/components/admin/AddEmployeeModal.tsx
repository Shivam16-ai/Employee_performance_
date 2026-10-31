import React, { useState } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';
import { User, UserRole, Department } from '../../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (user: User) => void;
  departments: Department[];
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  departments
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState(departments[0]?.name || 'Engineering & Technology');
  const [role, setRole] = useState<UserRole>('employee');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !designation) return;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      designation,
      department,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      performanceScore: 4.0,
      activeGoalsCount: 0,
      reviewStatus: 'not_started'
    };

    onAddEmployee(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0c1222] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#c59b6d]/15 text-[#c59b6d]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">
                Add Enterprise Personnel
              </h3>
              <p className="text-[11px] text-slate-400">
                Register a new team member and assign organizational access permissions.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Enterprise Corporate Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. maya.lin@apex-epms.com"
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white focus:outline-none focus:border-[#38bdf8]"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Role Authority
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="employee">Individual Contributor</option>
                <option value="manager">People Manager</option>
                <option value="admin">HR Executive / Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Designation / Corporate Title
            </label>
            <input
              type="text"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Staff Distributed Engineer"
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-[#060a14] bg-[#f8f6f0] hover:bg-white rounded-lg transition-colors"
            >
              Save & Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
