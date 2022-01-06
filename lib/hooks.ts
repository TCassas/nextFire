import { auth, firestore } from '../lib/firebase'
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, onSnapshot } from 'firebase/firestore'

export function useUserData() {
    const [user] = useAuthState(auth)
    const [username, setUsername] = useState(null)
    
    useEffect(() => {
        if (!user) {
            setUsername(null)
            return
        }
        
        const ref = doc(firestore, `users/${user.uid}`)
        const unsubscribe = onSnapshot(ref, (doc) => {
            setUsername(doc.data()?.username) 
        })
        
        return () => unsubscribe?.()
    }, [user])

    return { user, username }
}