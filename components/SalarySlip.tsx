
import React from 'react';
import { Printer, Download, Share2 } from 'lucide-react';
import { PayrollRecord } from '../types';

interface SalarySlipProps {
  record: PayrollRecord;
}

const SalarySlip: React.FC<SalarySlipProps> = ({ record }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-300">
      <div className="flex justify-end space-x-2 mb-6 no-print">
        <button 
          onClick={() => window.print()}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all"
        >
          <Printer size={20} />
        </button>
        <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all">
          <Download size={20} />
        </button>
      </div>

      <div className="p-8 border-2 border-slate-100 rounded-xl slip-content">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">PAYSTREAM CO.</h2>
            <p className="text-sm text-slate-500 italic">Technology Solutions Provider</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-indigo-600">SALARY SLIP</h3>
            <p className="text-sm text-slate-500">Ref: {record.id}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Employee Details</p>
            <table className="w-full text-sm">
              <tbody>
                <tr><td className="py-1 text-slate-500">Name:</td><td className="py-1 font-semibold text-slate-800">{record.employeeName}</td></tr>
                <tr><td className="py-1 text-slate-500">Type:</td><td className="py-1 font-semibold text-slate-800">{record.type}</td></tr>
                <tr><td className="py-1 text-slate-500">Period:</td><td className="py-1 font-semibold text-slate-800 text-[11px]">{record.startDate} - {record.endDate}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Work Info</p>
            <table className="w-full text-sm ml-auto">
              <tbody>
                <tr><td className="py-1 text-slate-500 text-right pr-4">Total Work Days:</td><td className="py-1 font-semibold text-slate-800">{record.workDays} Days</td></tr>
                <tr><td className="py-1 text-slate-500 text-right pr-4">Overtime Hours:</td><td className="py-1 font-semibold text-slate-800">{record.overtimeHours} Hrs</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-12 mb-8">
          {/* Earnings */}
          <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
            <h4 className="text-sm font-bold text-emerald-700 uppercase mb-3 pb-2 border-b border-emerald-200/50">Earnings (+)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Basic Salary</span>
                <span className="font-semibold text-slate-800">Rp {record.basicSalaryTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Allowances</span>
                <span className="font-semibold text-slate-800">Rp {record.allowanceTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Overtime Pay</span>
                <span className="font-semibold text-slate-800">Rp {record.overtimeTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-rose-50/30 p-4 rounded-xl border border-rose-100">
            <h4 className="text-sm font-bold text-rose-700 uppercase mb-3 pb-2 border-b border-rose-200/50">Deductions (-)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">BPJS Health/Emp</span>
                <span className="font-semibold text-slate-800">Rp {record.bpjsDeduction.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 rounded-xl p-6 flex justify-between items-center text-white">
          <div>
            <p className="text-xs text-indigo-300 uppercase font-bold tracking-widest">Net Take Home Pay</p>
            <p className="text-3xl font-bold">Rp {record.netSalary.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 italic">This is a computer generated slip.</p>
            <p className="text-[10px] text-slate-400 italic">No signature required.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlip;
