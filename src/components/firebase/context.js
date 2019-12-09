// "... to use React's Context API to provide a Firebase instance once at the top-level of your component hierarchy." (Robin Wieruch, 2018)

import React from 'react';

// (3) createContext() function is used to provide a Firebase instance to your entire application (src/index.js)
const FirebaseContext = React.createContext(null);

export default FirebaseContext;