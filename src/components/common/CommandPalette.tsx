import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Shield, Award, Target, FileText, PlusCircle, Compass, X } from 'lucide-react';
import { UserRole } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onRoleSwitch: (role: UserRole) => void;
  currentRole: UserRole;
  onOpenAddEmployee?: () => void;
  onOpenCreateGoal?: () => void;
  onOpenCreateCycle?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onRoleSwitch,
  currentRole,
  onOpenAddEmployee,
  onOpenCreateGoal,
  onOpenCreateCycle
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    // Views
    { id: 'v_landing', title: 'Go to Landing Page', category: 'Navigation', icon: Compass, action: () => onNavigate('landing') },
    { id: 'v_admin', title: 'Open Admin / HR Workspace', category: 'Workspaces', icon: Shield, action: () => { onRoleSwitch('admin'); onNavigate('admin'); } },
    { id: 'v_manager', title: 'Open Manager Workspace', category: 'Workspaces', icon: Target, action: () => { onRoleSwitch('manager'); onNavigate('manager'); } },
    { id: 'v_employee', title: 'Open Employee Workspace', category: 'Workspaces', icon: Award, action: () => { onRoleSwitch('employee'); onNavigate('employee'); } },
    
    // Quick Actions
    { id: 'act_add_emp', title: 'Add New Employee (HR Admin)', category: 'Actions', icon: PlusCircle, action: () => { onRoleSwitch('admin'); onNavigate('admin'); onOpenAddEmployee?.(); } },
    { id: 'act_create_goal', title: 'Create Employee Goal (Manager)', category: 'Actions', icon: Target, action: () => { onRoleSwitch('manager'); onNavigate('manager'); onOpenCreateGoal?.(); } },
    { id: 'act_create_cycle', title: 'Launch Performance Cycle', category: 'Actions', icon: FileText, action: () => { onRoleSwitch('admin'); onNavigate('admin'); onOpenCreateCycle?.(); } },
    
    // Switch User Profiles
    { id: 'sw_admin', title: 'Switch Persona: Elena Vance (HR VP)', category: 'Personas', icon: UserCheck, action: () => { onRoleSwitch('admin'); onNavigate('admin'); } },
    { id: 'sw_manager', title: 'Switch Persona: Marcus Chen (Engineering Director)', category: 'Personas', icon: UserCheck, action: () => { onRoleSwitch('manager'); onNavigate('manager'); } },
    { id: 'sw_employee', title: 'Switch Persona: Sarah Jenkins (Senior Architect)', category: 'Personas', icon: UserCheck, action: () => { onRoleSwitch('employee'); onNavigate('employee'); } }
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-[#0c1222] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
          <Search className="w-4 h-4 text-[#38bdf8]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, navigate workspaces, or switch roles (e.g. 'Sarah', 'Goal', 'Admin')..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command list */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or actions found for "{query}".
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#15203b] text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-slate-800/80 text-[#38bdf8] group-hover:text-white group-hover:bg-[#38bdf8]/20 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                        {cmd.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {cmd.category}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider group-hover:text-[#c59b6d]">
                    Select
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#080d19] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">ESC</kbd> Close</span>
          </div>
          <span className="text-[#c59b6d]">Active Role: {currentRole.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
