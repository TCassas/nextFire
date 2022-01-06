import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../lib/firebase"
import { useContext, useState, useEffect, useCallback } from "react"
import { UserContext } from "../lib/context"
import { doc, onSnapshot, getDoc, writeBatch } from "firebase/firestore"
import { firestore } from "../lib/firebase"
import debounce from  "lodash.debounce"

export default function EnterPage({}) {
    const { user, username } = useContext(UserContext)

    return (
        <main>
            { user ?
                !username ? <UsernameForm /> : <SignOutButton />
            :
                <SignInButton />
            }
        </main>
    )
}

function SignInButton() {
    const googleProvider = new GoogleAuthProvider()

    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleProvider)
            .then((user) => {
                console.log(user)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    return (
        <button className='btn-google' onClick={signInWithGoogle}>
            <img src={'/google.png'} /> Sign in with Google
        </button>
    )
}

function SignOutButton() {
    return (
        <button onClick={() => {
            auth.signOut()
        }}>
            Sign Out
        </button>
    )
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user, username } = useContext(UserContext)

    useEffect(() => {
        checkUserName(formValue)
    }, [formValue])

    const onChange = (e) => {
        const val = e.target.value.toLowerCase()
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

        if(val.length < 3) {
            setFormValue(val)
            setLoading(false)
            setIsValid(false)
        }

        if(re.test(val)) {
            setFormValue(val)
            setLoading(true)
            setIsValid(false)
        }

        setFormValue(val)
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const userDoc = doc(firestore, `users/${user.uid}`)
        const usernameDoc = doc(firestore, `usernames/${formValue}`)

        const batch = writeBatch(firestore)
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
        batch.set(usernameDoc, { uid: user.uid })

        await batch.commit()
    }

    const checkUserName = useCallback(
        debounce(async (username) => {
            if(username.length > 3) {
                const ref = doc(firestore, `usernames/${username}`)
                const docSnap = await getDoc(ref)
                console.log('Searched!')

                setIsValid(!docSnap.exists())
                setLoading(false)
            }
        }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h3>Choose username</h3>
                <form onSubmit={ onSubmit }>
                    <input type='text' placeholder='username' value={formValue} onChange={onChange} />

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

                    <button type='submit' className='btn-green' disabled={!isValid} >
                        Send
                    </button>
                </form>

                <h3>Debug</h3>
                <>
                    Username: { formValue } <br />
                    Loading: { loading.toString() } <br />
                    Valid: { isValid.toString() }
                </>
            </section>
        )
    )

    function UsernameMessage({ username, isValid, loading }) {
        if(loading) {
            return <p>Checking...</p>
        } else if(isValid) {
            return <p className='text-success'>¡"{username}" is available!</p>
        } else if(username && !isValid) {
            return <p className='text-danger'>¡That username has been taken!</p>
        } else {
            return <p></p>
        }
    }
}