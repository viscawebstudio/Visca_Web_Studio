import dotenv from "dotenv";
dotenv.config();

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function test() {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        const databaseId = "(default)";
        console.log("Database ID from config:", databaseId);

        let firebaseApp;
        if (getApps().length === 0) {
            firebaseApp = initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey.replace(/\\n/g, "\n"),
                }),
                projectId,
            });
        }
        
        const _firestore = getFirestore(firebaseApp);
        _firestore.settings({ databaseId });
        const _submissionsRef = _firestore.collection('submissions');
        
        console.error("Attempting to get data...");
        const snap = await _submissionsRef.limit(1).get();
        console.error(`Success! Docs: ${snap.docs.length}`);
    } catch (e) {
        console.error("TEST ERROR:", e);
    }
}

test();
