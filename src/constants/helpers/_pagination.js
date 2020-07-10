// note. Firestore pagination works as a set of unrelated sequential queries

let lastDocRef = {};
let queryType, nextQueryRef;

export function fetchPaginatedQuery(state, firebase, setState, type) {
    try {
        queryType = type; // (global variable) identifies Firestore collection for the data query.

        const firstPaginate = configFirstPaginate(firebase, state);
        const firstQueryRef = firstPaginate.firstQueryRef.limit(state.queryLimit);
        const { currentState, currentStateKey } = firstPaginate;

        const paginate = firstQueryRef.get().then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents in first paginate query.');
                return;
            }

            if (!currentState.length) {
                // (global variable) store a reference to the first document from the initial query (= first document in collection).
                lastDocRef[currentStateKey] = snapshot.docs[0]; 
                const lastDocData = configLastDocData(currentStateKey);
                
                // (global variable) reference the last document, including that document, and return the limit number of documents.
                nextQueryRef = firstQueryRef.startAt(lastDocData);  
            }
            else {
                const lastDocData = configLastDocData(currentStateKey);
                // (global variable) reference the last document, excluding that document, and return the limit number of documents.
                nextQueryRef = firstQueryRef.startAfter(lastDocData);   
            }

            return nextQueryRef.get().then(snapshot => {
                if (snapshot.empty) {
                    console.log(`No matching documents in next paginate query, setting state.isQueryEmpty[${type}] === true.`);
                    const currentState = state.isQueryEmpty;
                    currentState[type] = true;
                    setState(prevState => ({...prevState, isQueryEmpty: currentState}));
                    return;
                }
                
                // (global variable) update last document reference from this most recent query
                lastDocRef[currentStateKey] = snapshot.docs[snapshot.docs.length - 1];  
                
                const updatePaginateData = amendPaginateData(snapshot, currentState);
                setState(prevState => ({...prevState, [currentStateKey]: updatePaginateData}));
            });
        });
        return paginate;
    } catch (error) {
        console.log(error)
    }
}

// C A L L B A C K  F U N C T I O N S
function configFirstPaginate(firebase, state) {
    let firstQueryRef, currentState, currentStateKey;
    switch(queryType) {
        case "Users":
            firstQueryRef = firebase.users().orderBy("email");
            currentState = state.listOfUsers;
            currentStateKey = 'listOfUsers';
            break;

        case "Schools":
            firstQueryRef = firebase.schools().orderBy("title");
            currentState = state.listOfSchools;
            currentStateKey = 'listOfSchools';
            break;

        case "Applications":
            firstQueryRef = firebase.schoolApplications().orderBy("firstName");
            currentState = state.listOfApplications;
            currentStateKey = 'listOfApplications';
            break;

        case "Homestays":
            firstQueryRef = firebase.homestayApplications().orderBy("firstName");
            currentState = state.listOfHomestays;
            currentStateKey = 'listOfHomestays';
            break;            

        case "Airport Rides":
            firstQueryRef = firebase.airportRideApplications().orderBy("firstName");
            currentState = state.listOfAirportRides;
            currentStateKey = 'listOfAirportRides';
            break;
            
        case "Goose Tips":
            firstQueryRef = firebase.tips().orderBy("title");
            currentState = state.gooseTips;
            currentStateKey = 'gooseTips';
            break;
        
        case "Articles":
            firstQueryRef = firebase.articles().orderBy("tag");
            currentState = state.listOfArticles;
            currentStateKey = 'listOfArticles';
            break;

        case "Announcements":
            firstQueryRef = firebase.announcements().orderBy("createdAt", "desc");
            currentState = state.listOfAnnouncements;
            currentStateKey = 'listOfAnnouncements';
            break;

        case "Messages":
            firstQueryRef = firebase.messages().orderBy("createdAt", "desc");
            currentState = state.listOfMessages;
            currentStateKey = 'listOfMessages';
            break;

        default:
            console.log("Missing queryType for paginate config functions, returning empty");
            return;
            
    }
    return {firstQueryRef, currentState, currentStateKey};
}

function configLastDocData(currentStateKey) {
    switch(queryType) {
        case "Users":
            return lastDocRef[currentStateKey].data().email;
        
        case "Schools":
        case "Goose Tips":
            return lastDocRef[currentStateKey].data().title;

        case "Applications":
        case "Homestays":
        case "Airport Rides":
            return lastDocRef[currentStateKey].data().firstName;
        
        case "Articles":
            return lastDocRef[currentStateKey].data().tag;

        case "Announcements":
        case "Messages":
            return lastDocRef[currentStateKey].data().createdAt;

        default:
            console.log("Missing queryType for config last document data");
            return;
    }
}

function amendPaginateData(snapshot, currentState) {
    switch (queryType) {
        case "Users":
        case "Applications":
        case "Homestays":
        case "Airport Rides":
        case "Announcements":
        case "Messages": {
            const newDataArr = snapshot.docs.map(doc => {
                let data = doc.data();
                let id = doc.id;
                return {...data, id}
            });
            currentState.push(...newDataArr);
            return currentState;
        }
        
        case "Schools":
        case "Goose Tips":
        case "Articles": {
            const newDataArr = snapshot.docs.map(doc => {
                return doc.data();
            });
            currentState.push(...newDataArr);
            return currentState;
        }

        default:
            console.log("Missing queryType for paginate config functions, returning empty");
            return;
    }
}