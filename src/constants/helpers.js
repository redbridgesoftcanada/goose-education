import { TAGS } from './constants';

// D A T A  F E T C H I N G  ( P A G I N A T I O N ) -----------------------------------
// note. Firestore pagination works as a set of unrelated sequential queries

let lastDocRef = {};
let queryType, nextQueryRef;

function fetchPaginatedQuery(state, firebase, setState, type) {
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

// C A L L B A C K  F U N C T I O N S  ( P A G I N A T I O N )
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

// D A T A  F E T C H I N G  ( S E L E C T ) -----------------------------------

function fetchSelectDocuments(select, collection, firebase, setState, id) {
    const fetchSelectRefs = configureFetchSelect(select, collection, firebase, id);
    const { query, stateRef } = fetchSelectRefs;
    query.then(snapshot => {
        if (snapshot.empty) {
            console.log(`No matching documents in ${collection} collection.`);
            return;
        }

        let formattedData;
        const containsMultiDocs = Array.isArray(snapshot.docs);
        if (containsMultiDocs) {
            if (collection === "graphics") {
                formattedData = {};
                snapshot.forEach(doc => {
                    return formattedData[doc.id] = doc.data();
                });
            } else {
                formattedData = snapshot.docs.map(doc => {
                    let data = doc.data();
                    let id = doc.id;
                    return {...data, id}
                });
            }
        } else {
            let data = snapshot.data();
            formattedData = {...data}
        }

        setState(prevState => ({ ...prevState, [stateRef]: formattedData }));
    })
    .catch(err => console.log("Error in fetching select documents: ", err));
}

// C A L L B A C K  F U N C T I O N S ( S E L E C T )
function configureFetchSelect(select, collection, firebase, id) {
    switch (true) {
        case select === "recent":
            return {
                query: firebase.collectionRef(collection).orderBy("updatedAt", "desc").limit(5).get(), 
                stateRef: "previewMessages"  
            }
        
        case select === "featured":
            return {
                query: firebase.collectionRef(collection).where("isFeatured", "==", true).get(),
                stateRef: convertToCamelCase(`featured ${collection}`)
            }
        
        case select === "location":
            id = (id === "/") ? "/home" : id;
            return {
                query: firebase.collectionRef(collection).where("location", "==", id).get(),
                stateRef: `${id.replace("/", "")}Graphics`
            }

        case select === 'schoolApplication':
            return {
                query: firebase.collectionRef(collection).where("authorID", "==", id).get(),
                stateRef: select                
            }

        case select === 'profile':
            return {
                query: firebase.docRef(`${collection}`, `${id}`).get(),
                stateRef: select
            }

        default:
            console.log("Not defined select type for configureFetchSelect.")
            return;
    }
}

// D A T A  F E T C H I N G  ( A L L ) -----------------------------------

function fetchAllDocuments(collection, firebase, setState) {
    const fetchAllRefs = configureFetchAll(collection, firebase);
    const { query, stateRef } = fetchAllRefs;
    query.then(snapshot => {
        if (snapshot.empty) {
            console.log(`No matching documents in ${collection} collection.`);
            return;
        }
        
        const formattedData = configureFetchAllSnapshot(collection, snapshot);
        setState(prevState => ({ ...prevState, [stateRef]: formattedData }));
    })
    .catch(err => console.log("Error in fetching all documents: ", err));
}

// C A L L B A C K  F U N C T I O N S ( A L L )
function configureFetchAll(collection, firebase) {
    const configFetch = {};
    configFetch.query = firebase.collectionRef(collection).get();
    switch (collection) {
        case "aggregates": 
            configFetch.stateRef = "adminAggregates";
            break;
        
        case "graphics":
            configFetch.stateRef = "adminGraphics";
            break;

        case "tips": 
            configFetch.stateRef = "gooseTips";
            break;
        
        case "articles": 
            configFetch.stateRef = "taggedArticles";
            break;

        default: 
            configFetch.stateRef = convertToCamelCase(`list of ${collection}`);
    }
    return configFetch;
}

function configureFetchAllSnapshot(collection, snapshot) {
    let formattedData = {};
    switch (collection) {
        case "aggregates":
            snapshot.docs.map(doc => {
                let data = doc.data();
                let id = doc.id;
                formattedData[id] = {...data, id};
            });
            break;
  
        case "graphics": 
            snapshot.docs.map(doc => {
                let data = doc.data();
                let id = doc.id;
                
                let checkForNestedData = Object.values(data).filter(value => typeof value !== 'string').length !== 0;
                if (checkForNestedData) {
                    Object.keys(data).map(key => {
                        if (key === 'title' || key === 'subtitle' || key === 'caption' || key === 'image' || key === 'location') {
                            return;
                        } else {
                            let nestedData = data[key];
                            nestedData.id = key;
                        }
                    })
                }
                formattedData[id] = {...data, id}
            });
            break;

        case "articles": 
            const allArticles = snapshot.docs.map(doc => {
                return {...doc.data()}
            });

            formattedData = TAGS.map(tag => {
                return (tag === "All") ? allArticles : allArticles.filter(article => article.tag === tag);
            });
            break;

        default: 
            formattedData = snapshot.docs.map(doc => {
                let data = doc.data();
                let id = doc.id;
                return {...data, id}
            });
            break;
        }
    return formattedData;
}

// F E A T U R E S -----------------------------------

function createPagination(totalResources, currentPage, resourcesPerPage, totalPages) {
    const indexOfLastResource = (currentPage * resourcesPerPage) + 1;
    const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
    const paginatedResource = (totalPages > 1) ? totalResources.slice(indexOfFirstResource, indexOfLastResource) : totalResources;
    return paginatedResource;
}

function singleFilterQuery(resources, option, words) {
    const filterWords = words.toLowerCase();
    let filteredContent = [];
    switch(option) {
        case 'Title':
            filteredContent = resources.filter(resource => {
                const resourceTitle = resource.title.toLowerCase();
                return resourceTitle.includes(filterWords);
            });
            break;

        case 'Contents':
            filteredContent = resources.filter(resource => {
                const resourceContent = resource.description.toLowerCase();
                return resourceContent.includes(filterWords);
            });
            break;

        case 'Title + Contents':
            filteredContent = resources.filter(resource => {
                const resourceTitle = resource.title.toLowerCase();
                const resourceContent = resource.description.toLowerCase();
                return resourceTitle.includes(filterWords) || resourceContent.includes(filterWords);
            });
            break;

        case 'Author':
            filteredContent = resources.filter(resource => {
                const resourceAuthor = resource.author.toLowerCase();
                return resourceAuthor.includes(filterWords);
            });
            break;

        default:
            break;
        }
    return filteredContent;
}

function multipleFilterQuery(resources, option, conjunction, words) {
    const filterWords = words.toLowerCase().split(/[ ,]+/).filter(Boolean);
    let filteredContent = [];

    if (conjunction === 'And') {
        switch(option) {
            case 'Title':
                filteredContent = resources.filter(resource => {
                    const resourceTitle = resource.title.toLowerCase();
                    return filterWords.every(word => resourceTitle.includes(word))});
                break;
                
            case 'Contents':
                filteredContent = resources.filter(resource => {
                    const resourceContent = resource.description.toLowerCase();
                    return filterWords.every(word => resourceContent.includes(word))});
                break;

            case 'Title + Contents':
                filteredContent = resources.filter(resource => {
                    const resourceTitle = resource.title.toLowerCase();
                    const resourceContent = resource.description.toLowerCase();
                    return filterWords.every(word => resourceTitle.includes(word) || resourceContent.includes(word))});
                break;
            
            case 'Author':
                filteredContent = resources.filter(resource => {
                    const resourceAuthor = resource.author.toLowerCase();
                    return filterWords.every(word => resourceAuthor.includes(word))});
                break;
                                        
            default:
                break;
        }
        
    } else if (conjunction === 'Or') {
        switch(option) {
            case 'Title':
                filteredContent = resources.filter(resource => {
                    const resourceTitle = resource.title.toLowerCase();
                    return filterWords.some(word => resourceTitle.includes(word))});
                break;
                
            case 'Contents':
                filteredContent = resources.filter(resource => {
                    const resourceContent = resource.description.toLowerCase();
                    return filterWords.some(word => resourceContent.includes(word))});
                break;

            case 'Title + Contents':
                filteredContent = resources.filter(resource => {
                    const resourceTitle = resource.title.toLowerCase();
                    const resourceContent = resource.description.toLowerCase();
                    return filterWords.some(word => resourceTitle.includes(word) || resourceContent.includes(word))});
                break;

            case 'Author':
                filteredContent = resources.filter(resource => {
                    const resourceAuthor = resource.author.toLowerCase();
                    return filterWords.some(word => resourceAuthor.includes(word))});
                break;
                                        
            default:
                break;
        }
    }
    return filteredContent;
}

function sortQuery(type, resources, option) {
    let sortedResources;
    if (option === 'date') {
        if (type === 'messages') {
            sortedResources = resources.sort((a,b) => (a.updatedAt > b.updatedAt) ? -1 : ((b.updatedAt > a.updatedAt) ? 1 : 0));
        } else {
            sortedResources = resources.sort((a,b) => (a.createdAt > b.createdAt) ? -1 : ((b.createdAt > a.createdAt) ? 1 : 0));
        }
    } else if (option === 'views') {
        sortedResources = resources.sort((a,b) => (a.views > b.views) ? -1 : ((b.views > a.views) ? 1 : 0));
    } else {
        sortedResources = resources.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    }
    return sortedResources;
}

// O T H E R
function convertToCamelCase(text) {
    return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

function convertToTitleCase(text) {
    return text.replace(/(?:_| |\b)(\w)/g, ($1) => $1.toUpperCase().replace('_',' '));
}

function convertToSentenceCase(text) {
    const result = text.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export { fetchPaginatedQuery, fetchSelectDocuments, fetchAllDocuments, createPagination, singleFilterQuery, multipleFilterQuery, sortQuery, convertToCamelCase, convertToTitleCase, convertToSentenceCase }
