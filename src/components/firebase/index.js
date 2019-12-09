// "...exports all necessary functionalities (Firebase class, Firebase context for Consumer and Provider components)" (Robin Wieruch, 2018)

import FirebaseContext from './context';
import Firebase from './firebase';

// (4)  Only needing to create the Firebase instance once with the Firebase class (import Firebase from './firebase';) and pass it as a value prop to the React's Context.
export default Firebase;
export { FirebaseContext };