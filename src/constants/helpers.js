// D A T A  F E T C H I N G  ( P A G I N A T I O N )
// note. Firestore pagination works as a set of unrelated sequential queries

let lastDocRef = {};
let queryType, nextQueryRef;

// C a l l b a c k  F u n c t i o n s  ----------------------------------
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
// --------------------------------------------------------------------
function paginatedQuery(state, firebase, setState, queryLimit, type) {
    
    queryType = type; // (global variable) identifies Firestore collection for the data query.

    const firstPaginate = configFirstPaginate(firebase, state);
    const firstQueryRef = firstPaginate.firstQueryRef.limit(queryLimit);
    const { currentState, currentStateKey } = firstPaginate;

    const paginate = firstQueryRef.get().then(snapshot => {
        if (snapshot.empty) {
            console.log('No matching documents in first paginate query.');
            return;
        }

        if (!currentState.length) {
            lastDocRef[currentStateKey] = snapshot.docs[0]; // (global variable) store a reference to the first document from the initial query (= first document in collection).
            const lastDocData = configLastDocData(currentStateKey);
            nextQueryRef = firstQueryRef.startAt(lastDocData);  // (global variable) reference the last document, including that document, and return the limit number of documents.
        }
        else {
            const lastDocData = configLastDocData(currentStateKey);
            nextQueryRef = firstQueryRef.startAfter(lastDocData);   // (global variable) reference the last document, excluding that document, and return the limit number of documents.
        }

        return nextQueryRef.get().then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents in next paginate query.');
                return;
            }
            
            lastDocRef[currentStateKey] = snapshot.docs[snapshot.docs.length - 1];  // (global variable) update last document reference from this most recent query
            
            const updatePaginateData = amendPaginateData(snapshot, currentState);
            setState(prevState => ({...prevState, [currentStateKey]: updatePaginateData}));
        });
    });
    return paginate;
}

// D A T A  F E T C H I N G  ( S E L E C T )
function findFeaturedSchools(firebase, setState) {
    const schoolsQuery = firebase.schools().where('isFeatured', '==', true).get();
    schoolsQuery.then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }  
  
      let featuredSchools = [];
      snapshot.forEach(doc => featuredSchools.push(doc.data()));
      setState(prevState => ({ ...prevState, featuredSchools }))
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

function findFeaturedArticles(firebase, setState) {
    const articlesQuery = firebase.articles().where('isFeatured', '==', true).get();
    articlesQuery.then(snapshot => {
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }  

        let featuredArticles = [];
        snapshot.forEach(doc => featuredArticles.push(doc.data()));
        setState(prevState => ({ ...prevState, featuredArticles }))
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
}

function findFeaturedTips(firebase, setState) {
    const tipsQuery = firebase.tips().where('isFeatured', '==', true).get();
    tipsQuery.then(snapshot => {
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }  

        let featuredTips = [];
        snapshot.forEach(doc => featuredTips.push(doc.data()));
        setState(prevState => ({ ...prevState, featuredTips }))
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
}

async function findUserById(id, firebase, setState) {
    const profileQuery = await firebase.user(id).get();
    const profile = profileQuery.data();
    setState(prevState => ({ ...prevState, profile }));
}

async function findSchoolApplicationById(id, firebase, setState) {
    const applicationQuery = await firebase.schoolApplication(id).get();
    const schoolApplication = applicationQuery.data();
    setState(prevState => ({ ...prevState, schoolApplication }));
}

// D A T A  F E T C H I N G  ( A L L )
function findAllSchools(firebase, setState) {
    const schoolsQuery = firebase.schools().get();
    schoolsQuery.then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }  
  
      const allSchools = [];
      snapshot.forEach(doc => { allSchools.push(doc.data()) });
      setState(prevState => ({ ...prevState, listOfSchools: allSchools }));
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

function findAllArticles(tags, firebase, setState) {
    const articlesQuery = firebase.articles().get();
    articlesQuery.then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }  
  
      const allArticles = [];
      snapshot.forEach(doc => {
        allArticles.push(doc.data());
      });

      const taggedArticles = [];
      tags.forEach(tag => {
        let matchArticleTag = [];
        if (tag === 'All') {
          taggedArticles.push(allArticles);
        } else {
          matchArticleTag = allArticles.filter(article => article.tag === tag);
          taggedArticles.push(matchArticleTag);
        }
      });
      setState(prevState => ({ ...prevState, taggedArticles }))
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

function findAllTips(firebase, setState) {
    const tipsQuery = firebase.tips().get();
    tipsQuery.then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }  
  
      let gooseTips = [];
      snapshot.forEach(doc => {gooseTips.push(doc.data())});
      setState(prevState => ({ ...prevState, gooseTips }))
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

function findAllMessages(firebase, setState) {
    const messagesQuery = firebase.messages().get();
    messagesQuery.then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }  

        const allMessages = [];
        snapshot.forEach(doc => {
            let message = doc.data();
            let messageId = doc.id;
            message = {...message, id: messageId}
            allMessages.push(message)
        });
        setState(prevState => ({...prevState, listOfMessages: allMessages}))
    })
    .catch(err => { console.log('Error getting documents', err) });
}

function findAllAnnouncements(firebase, setState) {
    const announcementsQuery = firebase.announcements().get();
    announcementsQuery.then(snapshot => {
        if (snapshot.empty) {
        console.log('No matching documents.');
        return;
        }  

        const allAnnnouncements = [];
        snapshot.forEach(doc => {
            let announcement = doc.data();
            let announcementId = doc.id;
            announcement = {...announcement, id: announcementId}
            allAnnnouncements.push(announcement)
        });
        setState(prevState => ({...prevState, listOfAnnouncements: allAnnnouncements}));
    })
    .catch(err => { console.log('Error getting documents', err) });
}

function findAllUsers(firebase, setState) {
    const usersQuery = firebase.users().get();
    usersQuery.then(snapshot => {
        if (snapshot.empty) {
        console.log('No matching documents.');
        return;
        }  

        const allUsers = [];
        snapshot.forEach(doc => {
            let user = doc.data();
            let userId = doc.id;
            user = {...user, id: userId}
            allUsers.push(user)
        });
        setState(prevState => ({...prevState, listOfUsers: allUsers}));
    })
    .catch(err => { console.log('Error getting documents', err) });
}

function findAllSchoolApplications(firebase, setState) {
    const applicationsQuery = firebase.schoolApplications().get();
    applicationsQuery.then(snapshot => {
        if (snapshot.empty) {
        console.log('No matching documents.');
        return;
        }  

        const allApplications = [];
        snapshot.forEach(doc => {
            let application = doc.data();
            let applicationId = doc.id;
            application = {...application, id: applicationId}
            allApplications.push(application)
        });
        setState(prevState => ({...prevState, listOfApplications: allApplications}));
    })
    .catch(err => { console.log('Error getting documents', err) });
}

function findAllHomestayApplications(firebase, setState) {
    const homestayQuery = firebase.homestayApplications().get();
    homestayQuery.then(snapshot => {
        if (snapshot.empty) {
        console.log('No matching documents.');
        return;
        }  

        const allHomestays = [];
        snapshot.forEach(doc => {
            let application = doc.data();
            let applicationId = doc.id;
            application = {...application, id: applicationId}
            allHomestays.push(application)
        });
        setState(prevState => ({...prevState, listOfHomestays: allHomestays}));
    })
    .catch(err => { console.log('Error getting documents', err) });
}

function findAllAirportRideApplications(firebase, setState) {
    const airportRideQuery = firebase.airportRideApplications().get();
    airportRideQuery.then(snapshot => {
        if (snapshot.empty) {
        console.log('No matching documents.');
        return;
        }  

        const allAirportRides = [];
        snapshot.forEach(doc => {
            let application = doc.data();
            let applicationId = doc.id;
            application = {...application, id: applicationId}
            allAirportRides.push(application)
        });
        setState(prevState => ({...prevState, listOfAirportRides: allAirportRides}));
    })
    .catch(err => { console.log('Error getting documents', err) });
}

// F E A T U R E S
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
    return text.replace(/_([a-z])/g, function(g) { 
        return g[1].toUpperCase(); 
    });
}

function convertToTitleCase(text) {
    return text.replace(/(?:_| |\b)(\w)/g, function($1){
        return $1.toUpperCase().replace('_',' ');
    });
}

export { paginatedQuery, findFeaturedSchools, findFeaturedArticles, findFeaturedTips, findAllSchools, findAllArticles, findAllTips, findAllMessages, findAllAnnouncements, findAllUsers, findAllSchoolApplications, findAllHomestayApplications, findAllAirportRideApplications, findUserById, findSchoolApplicationById, createPagination, singleFilterQuery, multipleFilterQuery, sortQuery, convertToCamelCase, convertToTitleCase }
