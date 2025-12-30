
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Clock, BrainCircuit } from 'lucide-react';
import { PayrollRecord } from '../types';
import { getPayrollInsights } from '../services/geminiService';

interface DashboardProps {
  records: PayrollRecord[];
  employeesCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ records, employeesCount }) => {
  const [insights, setInsights] = React.useState<string>('Click the button to generate AI insights...');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const totalPayout = records.reduce((acc, curr) => acc + curr.netSalary, 0);
  const totalOvertime = records.reduce((acc, curr) => acc + curr.overtimeTotal, 0);

  const chartData = records.slice(-5).map(r => ({
    name: r.employeeName,
    net: r.netSalary,
    overtime: r.overtimeTotal
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    const result = await getPayrollInsights(records);
    setInsights(result);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Payout" value={`Rp ${totalPayout.toLocaleString()}`} icon={DollarSign} color="indigo" />
        <StatCard title="Total Employees" value={employeesCount.toString()} icon={Users} color="emerald" />
        <StatCard title="Overtime Payout" value={`Rp ${totalOvertime.toLocaleString()}`} icon={Clock} color="orange" />
        <StatCard title="Average Net Pay" value={`Rp ${(records.length ? totalPayout / records.length : 0).toLocaleString()}`} icon={TrendingUp} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Latest Salary Distribution</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="net" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <BrainCircuit size={120} className="text-indigo-400" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                <BrainCircuit className="text-indigo-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">Payroll AI Assistant</h3>
            </div>
            
            <div className="flex-1 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 h-[220px] overflow-y-auto custom-scrollbar">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {isGenerating ? "Analyzing payroll data and generating strategic insights..." : insights}
                </p>
              </div>
            </div>

            <button 
              onClick={handleGenerateInsights}
              disabled={isGenerating || records.length === 0}
              className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <BrainCircuit size={18} />
                  <span>Generate AI Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: any;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
};

export default Dashboard;
