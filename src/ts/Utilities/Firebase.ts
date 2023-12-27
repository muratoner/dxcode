import { initializeApp } from "firebase/app";
import { Database, getDatabase, ref, set } from "firebase/database";
import { Firestore, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

export default class Firebase {
	public static database: Database;
	public static databaseFireStore: Firestore;
    
	public static initialize() {
		const app = initializeApp({
			apiKey: "AIzaSyAvT41yWX0XcrLQGSzDpBqNMdUUDb_vXA8",
			authDomain: "ctrlzzz-9bbf5.firebaseapp.com",
			databaseURL: "https://ctrlzzz-9bbf5-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "ctrlzzz-9bbf5",
			storageBucket: "ctrlzzz-9bbf5.appspot.com",
			messagingSenderId: "419914893697",
			appId: "1:419914893697:web:71d3e7add245bfc7a7c080",
			measurementId: "G-Y3E566MD8Q"
		});
		// Initialize Cloud Storage and get a reference to the service
		this.databaseFireStore = getFirestore(app);
		this.database = getDatabase();
	}

	public static setScore(score: number){
		set(ref(this.database, 'highscore'), {score});
	}

	public static setHighScore(score: number) {
		getDoc(doc(this.databaseFireStore, "highscores", localStorage.getItem('playerName'))).then(async res => {
			const data = res.data()
			if (score > (data?.score || 0)) {
				await setDoc(doc(this.databaseFireStore, "highscores", localStorage.getItem('playerName')), {score});
			}
		})
	}
}
