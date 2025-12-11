import React, { useState, useEffect } from 'react';
import { UserProfile, AttendanceRecord, ShiftType } from '../types';
import { checkIn, checkOut, getActiveShift } from '../services/attendanceService'; // Adjust path
import { Clock, CheckCircle, Play, StopCircle, Sun, Moon, Sunset } from 'lucide-react';

interface Props {
    user: UserProfile;
    onUpdate: () => void;
}

const ShiftManager: React.FC<Props> = ({ user, onUpdate }) => {
    const [activeShift, setActiveShift] = useState<AttendanceRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedShift, setSelectedShift] = useState<ShiftType>('MORNING');

    useEffect(() => {
        loadActiveShift();
    }, [user.id]);

    const loadActiveShift = async () => {
        const shift = await getActiveShift(user.id);
        setActiveShift(shift);
        setLoading(false);
    };

    const handleCheckIn = async () => {
        setLoading(true);
        await checkIn(user.id, selectedShift);
        await loadActiveShift();
        onUpdate();
    };

    const handleCheckOut = async () => {
        setLoading(true);
        await checkOut(user.id);
        await loadActiveShift();
        onUpdate();
    };

    if (loading) return <div className="p-6 bg-white rounded-3xl animate-pulse h-48"></div>;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Clock className="w-6 h-6 text-emerald-500" />
                    Shift Management
                </h2>
                {activeShift && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        ACTIVE
                    </span>
                )}
            </div>

            {!activeShift ? (
                <div className="relative z-10">
                    <p className="text-slate-500 mb-4 text-sm font-medium">Select your shift to start working:</p>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {(['MORNING', 'EVENING', 'NIGHT'] as ShiftType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedShift(type)}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedShift === type ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                            >
                                {type === 'MORNING' && <Sun className="w-5 h-5" />}
                                {type === 'EVENING' && <Sunset className="w-5 h-5" />}
                                {type === 'NIGHT' && <Moon className="w-5 h-5" />}
                                <span className="text-xs font-bold">{type}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleCheckIn}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Play className="w-5 h-5 fill-current" /> Check In
                    </button>
                </div>
            ) : (
                <div className="relative z-10">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl mb-6">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Session</div>
                        <div className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                            {new Date(activeShift.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                            <CheckCircle className="w-4 h-4" /> Checked in as {activeShift.shift} Staff
                        </div>
                    </div>

                    <button
                        onClick={handleCheckOut}
                        className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <StopCircle className="w-5 h-5 fill-current" /> End Shift
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShiftManager;
