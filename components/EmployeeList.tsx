
import React from 'react';
import { Plus, Search, Edit2, Trash2, Ban, CheckCircle, Trash, X, Phone, Calendar, Briefcase, CreditCard, Home, ShieldCheck } from 'lucide-react';
import { Employee, EmployeeType, EmployeeStatus, EmploymentStatus, AppSettings } from '../types';

interface EmployeeListProps {
  employees: Employee[];
  onDeleteEmployees: (ids: string[]) => void;
  onBulkUpdateStatus: (ids: string[], status: EmployeeStatus) => void;
  onSaveEmployee: (employee: Employee) => void;
  settings: AppSettings;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ 
  employees, 
  onDeleteEmployees, 
  onBulkUpdateStatus,
  onSaveEmployee,
  settings
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null);

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredEmployees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmployees.map(emp => emp.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-3">
            <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {selectedIds.size}
            </span>
            <span className="text-sm font-semibold text-indigo-900">Employees selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => { onBulkUpdateStatus(Array.from(selectedIds), 'ACTIVE'); setSelectedIds(new Set()); }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors"
            >
              <CheckCircle size={14} />
              <span>Activate</span>
            </button>
            <button 
              onClick={() => { onBulkUpdateStatus(Array.from(selectedIds), 'INACTIVE'); setSelectedIds(new Set()); }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors"
            >
              <Ban size={14} />
              <span>Deactivate</span>
            </button>
            <button 
              onClick={() => { onDeleteEmployees(Array.from(selectedIds)); setSelectedIds(new Set()); }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors shadow-sm"
            >
              <Trash size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    checked={filteredEmployees.length > 0 && selectedIds.size === filteredEmployees.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status & Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((emp) => (
                <tr 
                  key={emp.id} 
                  className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.has(emp.id) ? 'bg-indigo-50/30' : ''}`}
                >
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      checked={selectedIds.has(emp.id)}
                      onChange={() => toggleSelect(emp.id)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 font-bold text-indigo-600">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex space-x-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          emp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {emp.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          emp.employmentStatus === 'PERMANENT' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {emp.employmentStatus}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{emp.type} RATE</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-slate-600">
                      <Phone size={12} className="mr-1.5 text-slate-400" />
                      {emp.whatsapp}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {emp.joinDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(emp)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteEmployees([emp.id])}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEmployees.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full text-slate-400 mb-4">
              <Search size={24} />
            </div>
            <p className="text-slate-500 font-medium">No employees found matching your search.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <EmployeeModal 
          employee={editingEmployee} 
          onClose={() => setIsModalOpen(false)} 
          onSave={onSaveEmployee} 
          settings={settings}
        />
      )}
    </div>
  );
};

const EmployeeModal: React.FC<{
  employee: Employee | null;
  onClose: () => void;
  onSave: (emp: Employee) => void;
  settings: AppSettings;
}> = ({ employee, onClose, onSave, settings }) => {
  const [formData, setFormData] = React.useState<Partial<Employee>>(
    employee || {
      status: 'ACTIVE',
      type: EmployeeType.MONTHLY,
      employmentStatus: 'PERMANENT',
      bpjsPercentage: settings.bpjsPercentage,
      bpjsBase: settings.defaultMonthlyBpjsBase,
      joinDate: new Date().toISOString().split('T')[0]
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      id: formData.id || `EMP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    } as Employee;
    onSave(finalData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = type === 'number' ? parseFloat(value) : value;
    
    // Auto-adjust default BPJS base if changing type for a NEW employee
    if (!employee && name === 'type') {
      const newBpjsBase = value === EmployeeType.DAILY 
        ? settings.defaultDailyBpjsBase 
        : settings.defaultMonthlyBpjsBase;
      
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        bpjsBase: newBpjsBase
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 flex items-center">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg mr-3">
              <Plus size={20} />
            </div>
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Personal & Contact */}
            <div className="space-y-6">
              <SectionHeader icon={ShieldCheck} title="Identity" />
              <div>
                <Label>Full Name</Label>
                <Input name="name" value={formData.name || ''} onChange={handleChange} required placeholder="e.g. John Doe" />
              </div>
              <div>
                <Label>Professional Role</Label>
                <Input name="role" value={formData.role || ''} onChange={handleChange} required placeholder="e.g. Sr. Developer" />
              </div>
              <div>
                <Label>WhatsApp Number</Label>
                <Input name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} required placeholder="08..." />
              </div>
              <div>
                <Label>Emergency Contact</Label>
                <Input name="emergencyCall" value={formData.emergencyCall || ''} onChange={handleChange} required placeholder="Name & Phone" />
              </div>
              <div>
                <Label>Home Address</Label>
                <textarea 
                  name="address" 
                  value={formData.address || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm h-24 resize-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Street, City..."
                />
              </div>
            </div>

            {/* Column 2: Employment */}
            <div className="space-y-6">
              <SectionHeader icon={Briefcase} title="Employment" />
              <div>
                <Label>Employment Type</Label>
                <Select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange}>
                  <option value="PERMANENT">PERMANENT</option>
                  <option value="CONTRACT">CONTRACT</option>
                </Select>
              </div>
              <div>
                <Label>Join Date</Label>
                <Input type="date" name="joinDate" value={formData.joinDate || ''} onChange={handleChange} required />
              </div>
              {formData.employmentStatus === 'CONTRACT' && (
                <div>
                  <Label>Contract Expired Date</Label>
                  <Input type="date" name="expiredDate" value={formData.expiredDate || ''} onChange={handleChange} />
                </div>
              )}
              <div>
                <Label>Payroll Rate Type</Label>
                <Select name="type" value={formData.type} onChange={handleChange}>
                  <option value={EmployeeType.MONTHLY}>MONTHLY RATE</option>
                  <option value={EmployeeType.DAILY}>DAILY RATE</option>
                </Select>
              </div>
              <div>
                <Label>Active Status</Label>
                <Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </Select>
              </div>
            </div>

            {/* Column 3: Financial */}
            <div className="space-y-6">
              <SectionHeader icon={CreditCard} title="Financial" />
              <div>
                <Label>Base Salary / Day Rate (Rp)</Label>
                <Input type="number" name="baseSalary" value={formData.baseSalary || 0} onChange={handleChange} required />
              </div>
              <div>
                <Label>Fixed Allowance (Rp)</Label>
                <Input type="number" name="allowance" value={formData.allowance || 0} onChange={handleChange} required />
              </div>
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <Label className="text-indigo-700">BPJS Calculation Base (Rp)</Label>
                <Input 
                  type="number" 
                  name="bpjsBase" 
                  value={formData.bpjsBase || 0} 
                  onChange={handleChange} 
                  required 
                  className="bg-white border-indigo-200"
                  placeholder="Reference for BPJS"
                />
                <p className="text-[10px] text-indigo-500 mt-2 italic leading-tight">
                  BPJS deduction is calculated from this base, not your Base Salary.
                </p>
              </div>
              <div>
                <Label>Bank Account Information</Label>
                <Input name="bankAccount" value={formData.bankAccount || ''} onChange={handleChange} required placeholder="Bank Name & Number" />
              </div>
              <div>
                <Label>Tax Account (NPWP)</Label>
                <Input name="taxAccount" value={formData.taxAccount || ''} onChange={handleChange} required placeholder="NPWP Registration" />
              </div>
              <div>
                <Label>BPJS Deduction (%)</Label>
                <Input type="number" name="bpjsPercentage" value={formData.bpjsPercentage || 0} onChange={handleChange} required step="0.1" />
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-end space-x-4 pt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
            >
              {employee ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// SectionHeader component for organizing form sections
const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 mb-4">
    <Icon size={16} className="text-indigo-500" />
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</span>
  </div>
);

// Label component with optional children
const Label = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <label className={`block text-xs font-bold text-slate-700 mb-1.5 ml-1 ${className}`}>{children}</label>
);

// Input component for standardized form fields
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${props.className}`} 
  />
);

// Select component for standardized dropdowns
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select 
    {...props} 
    className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${props.className}`} 
  />
);

export default EmployeeList;
