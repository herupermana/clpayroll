
import { Employee, EmployeeType } from './types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    name: 'John Doe',
    role: 'Software Engineer',
    type: EmployeeType.MONTHLY,
    employmentStatus: 'PERMANENT',
    baseSalary: 12000000,
    allowance: 1500000,
    bpjsPercentage: 4,
    bpjsBase: 9500000, // BPJS calculated from a specific base, not the full 12M
    status: 'ACTIVE',
    joinDate: '2023-01-15',
    whatsapp: '081234567890',
    emergencyCall: '081299998888',
    address: 'Jl. Sudirman No. 12, Jakarta',
    bankAccount: 'BCA 123456789',
    taxAccount: 'NPWP 01.234.567.8-901.000'
  },
  {
    id: 'EMP-002',
    name: 'Jane Smith',
    role: 'Marketing Lead',
    type: EmployeeType.MONTHLY,
    employmentStatus: 'PERMANENT',
    baseSalary: 10000000,
    allowance: 1200000,
    bpjsPercentage: 4,
    bpjsBase: 9500000,
    status: 'ACTIVE',
    joinDate: '2023-03-20',
    whatsapp: '081233334444',
    emergencyCall: '081277776666',
    address: 'Apartment Park View, Suite 501',
    bankAccount: 'Mandiri 987654321',
    taxAccount: 'NPWP 02.111.222.3-444.000'
  },
  {
    id: 'EMP-003',
    name: 'Robert Brown',
    role: 'Warehouse Assistant',
    type: EmployeeType.DAILY,
    employmentStatus: 'CONTRACT',
    baseSalary: 150000,
    allowance: 20000,
    bpjsPercentage: 2,
    bpjsBase: 4500000, // Monthly base for daily workers
    status: 'ACTIVE',
    joinDate: '2023-11-01',
    expiredDate: '2024-11-01',
    whatsapp: '085511112222',
    emergencyCall: '085533334444',
    address: 'Jl. Gatot Subroto No. 45',
    bankAccount: 'BNI 555666777',
    taxAccount: 'NPWP 03.999.888.7-666.000'
  }
];

export const BPJS_CONFIG = {
  HEALTH_INSURANCE: 1, // %
  EMPLOYMENT_SECURITY: 3 // %
};

export const OVERTIME_MULTIPLIER = 1.5;
