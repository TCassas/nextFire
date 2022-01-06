import Link from 'next/Link'
import { useContext } from 'react'
import { UserContext } from '../lib/context'

export default function Navbar() {
    const { user, username } = useContext(UserContext)

    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <Link href='/'>
                        <button className='btn-logo'>FEED</button>
                    </Link>
                </li>
                
                {/* Si el usuario está logeado*/}
                { username && (
                    <>
                        <li className='push-left'>
                            <Link href='/admin'>
                                <button className='btn-blue'>WRITE POSTS</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL}/>
                            </Link>
                        </li>
                    </>
                )}

                {/* Si el usuario no está logeado*/}
                { !username && (
                    <li>
                        <Link href='/enter'>
                            <button className='btn-blue'>Log In</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}