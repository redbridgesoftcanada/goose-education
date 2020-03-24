// D A T A  F E T C H I N G
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

export { findFeaturedSchools, findFeaturedArticles, findFeaturedTips, findAllSchools, findAllArticles, findAllTips, findAllMessages, findAllAnnouncements, findUserById, findSchoolApplicationById, createPagination, singleFilterQuery, multipleFilterQuery, sortQuery, convertToCamelCase, convertToTitleCase }