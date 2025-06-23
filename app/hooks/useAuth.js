import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from '../lib/firebase';

export default function useAuth() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setAuthError(null);
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                    const profileData = userDocSnap.data();
                    if (profileData.isActive === false) {
                        setAuthError("Your account has been deactivated.");
                        await signOut(auth);
                        setUserProfile(null);
                    } else {
                        setUserProfile({ uid: user.uid, ...profileData });
                    }
                } else {
                    // This logic handles first-time user creation in the database
                    const username = user.email.split('@')[0];
                    const newUserProfile = {
                        email: user.email,
                        firstName: '', lastName: '', rank: 'Unassigned',
                        cellNumber: '', permissionLevel: 0, isActive: false,
                        username: username
                    };
                    await setDoc(userDocRef, newUserProfile);
                    setAuthError("Account requires activation by an administrator.");
                    await signOut(auth);
                    setUserProfile(null);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { userProfile, loading, authError, setAuthError };
}
