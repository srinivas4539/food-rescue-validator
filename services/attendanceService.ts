import { db } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, updateDoc, orderBy, limit, Timestamp } from 'firebase/firestore';
import { AttendanceRecord, ShiftType } from '../types';

const ATTENDANCE_COLLECTION = 'attendance';
const HOURLY_RATE = 150; // INR per hour

export const checkIn = async (userId: string, shift: ShiftType): Promise<AttendanceRecord> => {
    const id = `${userId}_${Date.now()}`;
    const now = new Date();

    const record: AttendanceRecord = {
        id,
        userId,
        date: now.toISOString().split('T')[0],
        checkIn: now.toISOString(),
        shift,
        status: 'ACTIVE'
    };

    await setDoc(doc(db, ATTENDANCE_COLLECTION, id), record);
    return record;
};

export const checkOut = async (userId: string): Promise<AttendanceRecord | null> => {
    // Find active record
    const q = query(
        collection(db, ATTENDANCE_COLLECTION),
        where('userId', '==', userId),
        where('status', '==', 'ACTIVE'),
        limit(1)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data() as AttendanceRecord;
    const now = new Date();
    const checkInTime = new Date(data.checkIn);

    const durationMs = now.getTime() - checkInTime.getTime();
    const hoursWorked = Math.max(0.1, parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2))); // Minimum 0.1 hours
    const earnings = Math.floor(hoursWorked * HOURLY_RATE);

    const updatedRecord: Partial<AttendanceRecord> = {
        checkOut: now.toISOString(),
        status: 'COMPLETED',
        hoursWorked,
        earnings
    };

    await updateDoc(doc(db, ATTENDANCE_COLLECTION, data.id), updatedRecord);
    return { ...data, ...updatedRecord } as AttendanceRecord;
};

export const getAttendanceHistory = async (userId: string): Promise<AttendanceRecord[]> => {
    const q = query(
        collection(db, ATTENDANCE_COLLECTION),
        where('userId', '==', userId),
        orderBy('checkIn', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as AttendanceRecord);
};

export const getActiveShift = async (userId: string): Promise<AttendanceRecord | null> => {
    const q = query(
        collection(db, ATTENDANCE_COLLECTION),
        where('userId', '==', userId),
        where('status', '==', 'ACTIVE'),
        limit(1)
    );

    const snapshot = await getDocs(q);
    return snapshot.empty ? null : (snapshot.docs[0].data() as AttendanceRecord);
};
