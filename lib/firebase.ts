import { initializeApp } from "@firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyCW_Y72mzb5Vjd54zQv18Tz_aHPfIDxjac",
    authDomain: "nextfire-9a946.firebaseapp.com",
    projectId: "nextfire-9a946",
    storageBucket: "nextfire-9a946.appspot.com",
    messagingSenderId: "973073506854",
    appId: "1:973073506854:web:1ed15ea811aca9dabd7ce7",
    measurementId: "G-ZN8ME3KT9W"
}

//Inicializar firebase
const firebaseApp = initializeApp(firebaseConfig)

//Inicializar auth && firestore utilizando la propiedad firebaseApp
export const auth = getAuth(firebaseApp)
export const firestore = getFirestore(firebaseApp)