import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, UserRole } from '../types';

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    } else {
        return null;
    }
};

// Helper to determine badge based on points
const calculateBadges = (points: number): string[] => {
    const badges: string[] = [];
    if (points >= 100) badges.push('BRONZE');
    if (points >= 500) badges.push('SILVER');
    if (points >= 1000) badges.push('GOLD');
    if (points >= 5000) badges.push('PLATINUM');
    return badges;
};

export const createUserProfile = async (uid: string, role: UserRole, data?: Partial<UserProfile>): Promise<UserProfile> => {
    const profile: UserProfile = {
        id: uid,
        name: data?.name || 'User',
        role: role,
        organization: data?.organization || null,
        internshipStartDate: data?.internshipStartDate || null,
        safetyScore: data?.safetyScore || null,
        phone: data?.phone || null,
        rewardPoints: 0,
        badges: [],
        ...data
    };

    // Sanitize object to remove any remaining undefined values
    const sanitizedProfile = Object.fromEntries(
        Object.entries(profile).filter(([_, v]) => v !== undefined)
    );

    await setDoc(doc(db, "users", uid), sanitizedProfile);
    return profile;
};

export const addRewardPoints = async (uid: string, pointsToAdd: number): Promise<void> => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const currentData = docSnap.data() as UserProfile;
        const newPoints = (currentData.rewardPoints || 0) + pointsToAdd;
        const newBadges = calculateBadges(newPoints);

        await setDoc(docRef, {
            ...currentData,
            rewardPoints: newPoints,
            badges: newBadges
        });
    }
};

export const updateUserRole = async (uid: string, newRole: UserRole): Promise<void> => {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, { role: newRole }, { merge: true });
};
