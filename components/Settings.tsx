
import React from 'react';
import { Settings as SettingsIcon, Save, ShieldCheck, Landmark, Info, CheckCircle2 } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = React.useState<AppSettings>(settings);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
          <p className="text-slate-500 text-sm">Configure global payroll defaults and calculation rules.</p>
        </div>
        {isSaved && (
          <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl animate-in fade-in zoom-in-95 duration-300 border border-emerald-100">
            <CheckCircle2 size={18} />
            <span className="text-sm font-semibold">Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* BPJS Global Rules */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Global BPJS Configuration</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Payroll Deduction Rules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">BPJS Deduction Percentage (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="bpjsPercentage"
                  value={localSettings.bpjsPercentage}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
              <p className="text-[11px] text-slate-400 italic">This percentage is applied to the BPJS calculation base to determine the monthly deduction.</p>
            </div>
            
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex items-start space-x-3">
              <Info className="text-indigo-500 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-xs font-semibold text-indigo-900 mb-1">Calculation Logic</p>
                <p className="text-[11px] text-indigo-700 leading-relaxed">
                  The deduction is calculated using the formula: <br/>
                  <code className="bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-800 font-bold">(BPJS Base * BPJS Percentage) / 100</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Default Values for New Employees */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Landmark size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">New Employee Defaults</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Onboarding Configurations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Default Daily BPJS Base (Rp)</label>
              <input 
                type="number" 
                name="defaultDailyBpjsBase"
                value={localSettings.defaultDailyBpjsBase}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                placeholder="e.g. 4500000"
                required
              />
              <p className="text-[11px] text-slate-400">Pre-populated base for employees with Daily rate type.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Default Monthly BPJS Base (Rp)</label>
              <input 
                type="number" 
                name="defaultMonthlyBpjsBase"
                value={localSettings.defaultMonthlyBpjsBase}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                placeholder="e.g. 9500000"
                required
              />
              <p className="text-[11px] text-slate-400">Pre-populated base for employees with Monthly rate type.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button 
            type="submit"
            className="flex items-center space-x-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            <Save size={20} />
            <span>Apply & Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
