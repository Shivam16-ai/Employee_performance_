import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { User, UserRole, Goal, PerformanceReview, Department, PerformanceCycle, TimelineEvent } from './types';
import { Header } from './components/common/Header';
import { CommandPalette } from './components/common/CommandPalette';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { AddEmployeeModal } from './components/admin/AddEmployeeModal';
import { CreateCycleModal } from './components/admin/CreateCycleModal';
import { CreateGoalModal } from './components/manager/CreateGoalModal';
import { ReviewEvaluationModal } from './components/manager/ReviewEvaluationModal';
import { UpdateProgressModal } from './components/employee/UpdateProgressModal';
import { AcknowledgeReviewModal } from './components/employee/AcknowledgeReviewModal';
import { Shield, Target, UserCheck, RotateCcw } from 'lucide-react';

export default function App() {
  // Navigation & Session State
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'admin' | 'manager' | 'employee'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());

  // Database State from StorageService
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [departments, setDepartments] = useState<Department[]>(() => StorageService.getDepartments());
  const [cycles, setCycles] = useState<PerformanceCycle[]>(() => StorageService.getCycles());
  const [goals, setGoals] = useState<Goal[]>(() => StorageService.getGoals());
  const [reviews, setReviews] = useState<PerformanceReview[]>(() => StorageService.getReviews());
  const [timeline, setTimeline] = useState<TimelineEvent[]>(() => StorageService.getTimeline());

  // Modal Control States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isCreateCycleOpen, setIsCreateCycleOpen] = useState(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);

  // Contextual Modals
  const [selectedReviewEmployee, setSelectedReviewEmployee] = useState<User | null>(null);
  const [selectedGoalToUpdate, setSelectedGoalToUpdate] = useState<Goal | null>(null);
  const [selectedReviewToAcknowledge, setSelectedReviewToAcknowledge] = useState<PerformanceReview | null>(null);

  // Sync state helper
  const reloadData = () => {
    setUsers(StorageService.getUsers());
    setDepartments(StorageService.getDepartments());
    setCycles(StorageService.getCycles());
    setGoals(StorageService.getGoals());
    setReviews(StorageService.getReviews());
    setTimeline(StorageService.getTimeline());
  };

  // Switch role seamlessly
  const handleRoleSwitch = (role: UserRole) => {
    let targetUser: User | undefined;
    if (role === 'admin') {
      targetUser = users.find(u => u.role === 'admin') || users[0];
    } else if (role === 'manager') {
      targetUser = users.find(u => u.role === 'manager') || users[1];
    } else {
      targetUser = users.find(u => u.role === 'employee' && u.id.includes('jenkins')) || users[2];
    }

    if (targetUser) {
      setCurrentUser(targetUser);
      StorageService.setCurrentUser(targetUser.id);
      setIsLoggedIn(true);
      setCurrentView(role);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user.id);
    setIsLoggedIn(true);
    setCurrentView(user.role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('landing');
  };

  // Data Actions
  const handleAddEmployee = (newEmployee: User) => {
    StorageService.addEmployee(newEmployee);
    reloadData();
  };

  const handleAddCycle = (newCycle: PerformanceCycle) => {
    StorageService.addCycle(newCycle);
    reloadData();
  };

  const handleAddGoal = (newGoal: Goal) => {
    StorageService.addGoal(newGoal);
    reloadData();
  };

  const handlePublishReview = (review: PerformanceReview) => {
    StorageService.publishReview(review);
    reloadData();
  };

  const handleUpdateProgress = (goalId: string, progress: number, milestoneId?: string) => {
    StorageService.updateGoalProgress(goalId, progress, milestoneId);
    reloadData();
  };

  const handleAcknowledgeReview = (reviewId: string, comment?: string) => {
    StorageService.acknowledgeReview(reviewId, comment);
    reloadData();
  };

  const handleResetData = () => {
    if (confirm('Reset EPMS demonstration data to fresh initial state?')) {
      StorageService.resetToDefault();
      reloadData();
      handleRoleSwitch('admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col font-sans">
      {/* Universal Top Bar Header */}
      {currentView !== 'login' && (
        <Header
          currentView={currentView}
          onNavigate={(v) => setCurrentView(v as any)}
          currentUser={currentUser}
          onRoleSwitch={handleRoleSwitch}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {currentView === 'landing' && (
          <LandingPage
            onExplore={() => {
              if (isLoggedIn) {
                setCurrentView(currentUser.role);
              } else {
                handleRoleSwitch('admin');
              }
            }}
            onLogin={() => setCurrentView('login')}
            onRoleSwitch={handleRoleSwitch}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            users={users}
            onLoginSuccess={handleLoginSuccess}
            onBackToLanding={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            users={users}
            departments={departments}
            cycles={cycles}
            goals={goals}
            reviews={reviews}
            timeline={timeline}
            onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
            onOpenCreateCycle={() => setIsCreateCycleOpen(true)}
          />
        )}

        {currentView === 'manager' && (
          <ManagerDashboard
            currentUser={currentUser}
            users={users}
            goals={goals}
            reviews={reviews}
            timeline={timeline}
            onOpenCreateGoal={() => setIsCreateGoalOpen(true)}
            onOpenReviewModal={(emp) => setSelectedReviewEmployee(emp)}
          />
        )}

        {currentView === 'employee' && (
          <EmployeeDashboard
            currentUser={currentUser}
            goals={goals}
            reviews={reviews}
            timeline={timeline}
            onOpenUpdateProgress={(g) => setSelectedGoalToUpdate(g)}
            onOpenAcknowledgeReview={(r) => setSelectedReviewToAcknowledge(r)}
          />
        )}
      </main>

      {/* Quick Role Switcher Floating Bar (Only in authenticated workspaces) */}
      {isLoggedIn && currentView !== 'landing' && currentView !== 'login' && (
        <aside
          aria-label="Evaluation Role Switcher"
          className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center gap-1.5 p-1.5 rounded-full bg-[#0c1222]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs font-mono"
        >
          <span className="text-[10px] text-slate-400 px-2 tracking-wider">
            SWITCH ROLE:
          </span>
          <button
            onClick={() => handleRoleSwitch('admin')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1 transition-all ${
              currentUser.role === 'admin' && currentView === 'admin'
                ? 'bg-[#c59b6d] text-[#060a14] font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3 h-3 text-[#c59b6d]" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('manager')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1 transition-all ${
              currentUser.role === 'manager' && currentView === 'manager'
                ? 'bg-[#38bdf8] text-[#060a14] font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Target className="w-3 h-3 text-[#38bdf8]" />
            <span>Manager</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('employee')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1 transition-all ${
              currentUser.role === 'employee' && currentView === 'employee'
                ? 'bg-[#f8f6f0] text-[#060a14] font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-3 h-3 text-[#f8f6f0]" />
            <span>Employee</span>
          </button>

          <button
            onClick={handleResetData}
            title="Reset demonstration data"
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </aside>
      )}

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(v) => setCurrentView(v as any)}
        onRoleSwitch={handleRoleSwitch}
        currentRole={currentUser.role}
        onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
        onOpenCreateGoal={() => setIsCreateGoalOpen(true)}
        onOpenCreateCycle={() => setIsCreateCycleOpen(true)}
      />

      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onAddEmployee={handleAddEmployee}
        departments={departments}
      />

      <CreateCycleModal
        isOpen={isCreateCycleOpen}
        onClose={() => setIsCreateCycleOpen(false)}
        onAddCycle={handleAddCycle}
        totalEmployees={users.length}
      />

      <CreateGoalModal
        isOpen={isCreateGoalOpen}
        onClose={() => setIsCreateGoalOpen(false)}
        onAddGoal={handleAddGoal}
        teamMembers={users.filter(u => u.role === 'employee')}
      />

      {selectedReviewEmployee && (
        <ReviewEvaluationModal
          isOpen={!!selectedReviewEmployee}
          onClose={() => setSelectedReviewEmployee(null)}
          onPublishReview={handlePublishReview}
          employee={selectedReviewEmployee}
          manager={currentUser}
          employeeGoals={goals.filter(g => g.assignedEmployeeId === selectedReviewEmployee.id)}
          existingReview={reviews.find(r => r.employeeId === selectedReviewEmployee.id)}
        />
      )}

      {selectedGoalToUpdate && (
        <UpdateProgressModal
          isOpen={!!selectedGoalToUpdate}
          onClose={() => setSelectedGoalToUpdate(null)}
          onUpdate={handleUpdateProgress}
          goal={selectedGoalToUpdate}
        />
      )}

      {selectedReviewToAcknowledge && (
        <AcknowledgeReviewModal
          isOpen={!!selectedReviewToAcknowledge}
          onClose={() => setSelectedReviewToAcknowledge(null)}
          onAcknowledge={handleAcknowledgeReview}
          review={selectedReviewToAcknowledge}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
