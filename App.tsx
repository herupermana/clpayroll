
import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import PayrollProcessor from './components/PayrollProcessor';
import SalarySlip from './components/SalarySlip';
import Settings from './components/Settings';
import { Employee, PayrollRecord, AppSettings } from './types';
import { INITIAL_EMPLOYEES } from './constants.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [employees, setEmployees] = React.useState<Employee[]>(INITIAL_EMPLOYEES);
  const [records, setRecords] = React.useState<PayrollRecord[]>([]);
  
  // Settings management with localStorage persistence
  const [settings, setSettings] = React.useState<AppSettings>(() => {
    const saved = localStorage.getItem('paystream_settings');
    return saved ? JSON.parse(saved) : {
      bpjsPercentage: 4,
      defaultDailyBpjsBase: 4500000,
      defaultMonthlyBpjsBase: 9500000
    };
  });

  React.useEffect(() => {
    localStorage.setItem('paystream_settings', JSON.stringify(settings));
  }, [settings]);

  const handleAddRecord = (record: PayrollRecord) => {
    setRecords(prev => [record, ...prev]);
  };

  const handleDeleteEmployees = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} employee(s)?`)) {
      setEmployees(prev => prev.filter(emp => !ids.includes(emp.id)));
    }
  };

  const handleBulkUpdateStatus = (ids: string[], status: 'ACTIVE' | 'INACTIVE') => {
    setEmployees(prev => prev.map(emp => 
      ids.includes(emp.id) ? { ...emp, status } : emp
    ));
  };

  const handleSaveEmployee = (newEmp: Employee) => {
    setEmployees(prev => {
      const index = prev.findIndex(e => e.id === newEmp.id);
      if (index > -1) {
        // Update existing
        const updated = [...prev];
        updated[index] = newEmp;
        return updated;
      } else {
        // Create new
        return [newEmp, ...prev];
      }
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard records={records} employeesCount={employees.length} />;
      case 'employees':
        return (
          <EmployeeList 
            employees={employees} 
            onDeleteEmployees={handleDeleteEmployees}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onSaveEmployee={handleSaveEmployee}
            settings={settings}
          />
        );
      case 'payroll':
        const activeEmployees = employees.filter(e => e.status === 'ACTIVE');
        return (
          <div className="space-y-8">
            <PayrollProcessor 
              employees={activeEmployees} 
              existingRecords={records}
              onAddRecord={handleAddRecord}
            />
            
            {records.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
                  <span>Latest Salary Slip Preview</span>
                </h3>
                <div className="max-w-4xl mx-auto">
                  <SalarySlip record={records[0]} />
                </div>
              </div>
            )}
          </div>
        );
      case 'settings':
        return <Settings settings={settings} onUpdateSettings={setSettings} />;
      default:
        return <Dashboard records={records} employeesCount={employees.length} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
