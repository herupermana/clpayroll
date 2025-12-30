
export enum EmployeeType {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY'
}

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';
export type EmploymentStatus = 'CONTRACT' | 'PERMANENT';

export interface Employee {
  id: string;
  name: string;
  role: string;
  type: EmployeeType;
  employmentStatus: EmploymentStatus;
  baseSalary: number;
  allowance: number;
  bpjsPercentage: number;
  bpjsBase: number; // Dedicated field for BPJS calculation reference
  status: EmployeeStatus;
  
  // New Fields
  joinDate: string;
  expiredDate?: string;
  whatsapp: string;
  emergencyCall: string;
  address: string;
  bankAccount: string;
  taxAccount: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  type: EmployeeType;
  startDate: string;
  endDate: string;
  workDays: number;
  overtimeHours: number;
  overtimeRate: number;
  basicSalaryTotal: number;
  allowanceTotal: number;
  overtimeTotal: number;
  bpjsDeduction: number;
  netSalary: number;
  status: 'PENDING' | 'PAID';
}

export interface PayrollStats {
  totalPayout: number;
  employeeCount: number;
  pendingCount: number;
}
