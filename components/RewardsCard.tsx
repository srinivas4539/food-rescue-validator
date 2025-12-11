import React from 'react';
import { Award, Star, TrendingUp, Trophy } from 'lucide-react';

interface RewardsCardProps {
    points: number;
    badges: string[];
}

const BADGE_CONFIG: Record<string, { color: string; label: string; icon: any }> = {
    BRONZE: { color: 'bg-amber-700', label: 'Bronze Donor', icon: Award },
    SILVER: { color: 'bg-slate-400', label: 'Silver Hero', icon: Star },
    GOLD: { color: 'bg-yellow-400', label: 'Gold Champion', icon: Trophy },
    PLATINUM: { color: 'bg-purple-600', label: 'Platinum Legend', icon: Trophy },
};

const RewardsCard: React.FC<RewardsCardProps> = ({ points, badges }) => {
    const currentBadgeKey = badges.length > 0 ? badges[badges.length - 1] : null;
    const currentBadge = currentBadgeKey ? BADGE_CONFIG[currentBadgeKey] : null;

    // Calculate Progress to next level
    let nextLevel = 100;
    let nextBadge = "BRONZE";

    if (points >= 100) { nextLevel = 500; nextBadge = "SILVER"; }
    if (points >= 500) { nextLevel = 1000; nextBadge = "GOLD"; }
    if (points >= 1000) { nextLevel = 5000; nextBadge = "PLATINUM"; }
    if (points >= 5000) { nextLevel = 10000; nextBadge = "ULTIMATE"; }

    const progress = Math.min((points / nextLevel) * 100, 100);

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="w-32 h-32" />
            </div>

            <div className="relative z-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Rewards & Impact
                </h2>

                <div className="flex items-end justify-between mb-4">
                    <div>
                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Total Points</p>
                        <div className="text-4xl font-black text-white flex items-baseline gap-1">
                            {points}
                            <span className="text-sm font-medium text-indigo-300">pts</span>
                        </div>
                    </div>

                    {currentBadge ? (
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg ${currentBadge.color} text-white`}>
                            <currentBadge.icon className="w-4 h-4" />
                            {currentBadge.label}
                        </div>
                    ) : (
                        <div className="text-xs text-indigo-300 font-medium bg-indigo-900/50 px-3 py-1 rounded-lg">
                            Donate to unlock badges
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-indigo-950/50 rounded-full h-3 mb-2 overflow-hidden backdrop-blur-sm border border-indigo-700/30">
                    <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="flex justify-between text-xs text-indigo-300 font-medium">
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {nextLevel - points} to {nextBadge}</span>
                    <span>{nextLevel} pts</span>
                </div>
            </div>
        </div>
    );
};

export default RewardsCard;
