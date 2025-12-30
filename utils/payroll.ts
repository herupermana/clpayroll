
import { Employee, EmployeeType, PayrollRecord } from '../types';
import { OVERTIME_MULTIPLIER } from '../constants.tsx';

export const calculatePayroll = (
  employee: Employee,
  startDate: string,
  endDate: string,
  workDays: number,
  overtimeHours: number
): PayrollRecord => {
  const isMonthly = employee.type === EmployeeType.MONTHLY;
  
  // Calculate basic salary based on type
  const basicSalaryTotal = isMonthly ? employee.baseSalary : (employee.baseSalary * workDays);
  
  // Allowance logic
  const allowanceTotal = isMonthly ? employee.allowance : (employee.allowance * workDays);
  
  // Overtime rate
  const hourlyRate = isMonthly 
    ? (employee.baseSalary / 173) 
    : (employee.baseSalary / 8);
  
  const overtimeRate = hourlyRate * OVERTIME_MULTIPLIER;
  const overtimeTotal = overtimeHours * overtimeRate;
  
  // Gross Salary (for reference, but no longer used for BPJS calculation base)
  const grossSalary = basicSalaryTotal + allowanceTotal + overtimeTotal;
  
  // BPJS Deduction: decoupled from gross/base salary, uses employee.bpjsBase
  // This allows manual control over the reference salary for deductions
  const bpjsDeduction = (employee.bpjsBase * employee.bpjsPercentage) / 100;
  
  // Net Salary
  const netSalary = grossSalary - bpjsDeduction;

  return {
    id: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    employeeId: employee.id,
    employeeName: employee.name,
    type: employee.type,
    startDate,
    endDate,
    workDays,
    overtimeHours,
    overtimeRate,
    basicSalaryTotal,
    allowanceTotal,
    overtimeTotal,
    bpjsDeduction,
    netSalary,
    status: 'PENDING'
  };
};

export const exportToCSV = (records: PayrollRecord[]) => {
  const headers = [
    "ID", "Employee Name", "Type", "Start Date", "End Date", 
    "Work Days", "OT Hours", "Basic Salary", "Allowance", 
    "Overtime Pay", "BPJS Deduction", "Net Salary", "Status"
  ];
  
  const rows = records.map(r => [
    r.id, r.employeeName, r.type, r.startDate, r.endDate,
    r.workDays, r.overtimeHours, r.basicSalaryTotal, r.allowanceTotal,
    r.overtimeTotal, r.bpjsDeduction, r.netSalary, r.status
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n"
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `payroll_report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
