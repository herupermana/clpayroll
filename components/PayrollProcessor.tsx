
import React from 'react';
// Added missing Clock import to resolve the error on line 172
import { Calendar, CheckCircle2, FileText, Download, Calculator, FileDown, Clock } from 'lucide-react';
import { Employee, PayrollRecord } from '../types';
import { calculatePayroll, exportToCSV } from '../utils/payroll';

interface PayrollProcessorProps {
  employees: Employee[];
  existingRecords: PayrollRecord[];
  onAddRecord: (record: PayrollRecord) => void;
}

const PayrollProcessor: React.FC<PayrollProcessorProps> = ({ employees, existingRecords, onAddRecord }) => {
  const [selectedEmpId, setSelectedEmpId] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [workDays, setWorkDays] = React.useState(0);
  const [overtimeHours, setOvertimeHours] = React.useState(0);

  const selectedEmployee = employees.find(e => e.id === selectedEmpId);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !startDate || !endDate) return;

    const newRecord = calculatePayroll(
      selectedEmployee,
      startDate,
      endDate,
      workDays,
      overtimeHours
    );
    
    onAddRecord(newRecord);
    // Reset form partially
    setSelectedEmpId('');
    setWorkDays(0);
    setOvertimeHours(0);
  };

  const handleExport = () => {
    if (existingRecords.length === 0) {
      alert("No data to export. Please add records to the batch first.");
      return;
    }

    const confirmExport = window.confirm(
      `Are you sure you want to export the current batch of ${existingRecords.length} records to a CSV file?`
    );

    if (confirmExport) {
      exportToCSV(existingRecords);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-8">
            <div className="flex items-center space-x-2 mb-6">
              <Calculator className="text-indigo-600" size={24} />
              <h3 className="text-lg font-semibold text-slate-800">Calculator</h3>
            </div>
            
            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Employee</label>
                <select 
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  required
                >
                  <option value="">Choose an employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.type})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">From</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">To</label>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Days</label>
                  <input 
                    type="number"
                    value={workDays}
                    onChange={(e) => setWorkDays(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Overtime (Hrs)</label>
                  <input 
                    type="number"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                    min="0"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
              >
                Add to Payroll Batch
              </button>
            </form>
          </div>
        </div>

        {/* Results Table */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="text-indigo-600" size={24} />
                <h3 className="text-lg font-semibold text-slate-800">Payroll Batch Review</h3>
              </div>
              <button 
                onClick={handleExport}
                className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                <FileDown size={18} />
                <span>Export to Excel (CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Net Salary</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {existingRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                        No records in current batch. Use the calculator to start.
                      </td>
                    </tr>
                  ) : (
                    existingRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-800">{record.employeeName}</p>
                          <p className="text-xs text-slate-500">{record.type}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">Rp {record.netSalary.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400">ID: {record.id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                            <Clock size={12} />
                            <span>{record.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm underline decoration-indigo-200 underline-offset-4">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollProcessor;
