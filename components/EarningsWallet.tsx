import React, { useState, useEffect } from 'react';
import { UserProfile, AttendanceRecord } from '../types';
import { getAttendanceHistory } from '../services/attendanceService';
import { Wallet, TrendingUp, Calendar, ChevronRight } from 'lucide-react';

interface Props {
    user: UserProfile;
    lastUpdate: number; // Prop to trigger refresh
}

const EarningsWallet: React.FC<Props> = ({ user, lastUpdate }) => {
    const [history, setHistory] = useState<AttendanceRecord[]>([]);
    const [totalEarnings, setTotalEarnings] = useState(0);

    useEffect(() => {
        loadData();
    }, [user.id, lastUpdate]);

    const loadData = async () => {
        const records = await getAttendanceHistory(user.id);
        setHistory(records);
        const total = records.reduce((sum, rec) => sum + (rec.earnings || 0), 0);
        setTotalEarnings(total);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Wallet className="w-6 h-6 text-indigo-500" />
                    My Earnings
                </h2>
                <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                    Verification Pending
                </div>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6 relative overflow-hidden shadow-lg shadow-indigo-200 dark:shadow-none">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                    <TrendingUp className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <div className="text-indigo-100 text-sm font-medium mb-1">Total Available Balance</div>
                    <div className="text-4xl font-black">₹{totalEarnings.toLocaleString()}</div>
                    <div className="mt-4 flex gap-2">
                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                            Withdraw
                        </button>
                        <button className="bg-indigo-700/50 text-indigo-100 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700/70 transition-colors">
                            Statement
                        </button>
                    </div>
                </div>
            </div>

            {/* History */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Shifts</h3>
                <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">No shifts completed yet.</div>
                    ) : (
                        history.map(record => (
                            <div key={record.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">{record.shift} SHIFT</div>
                                        <div className="text-xs text-slate-400">{record.date}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-emerald-600 text-sm text-nowrap">
                                        {record.status === 'COMPLETED' ? `+ ₹${record.earnings}` : 'Ongoing'}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        {record.status === 'COMPLETED' ? `${record.hoursWorked} hrs` : 'Active'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default EarningsWallet;
