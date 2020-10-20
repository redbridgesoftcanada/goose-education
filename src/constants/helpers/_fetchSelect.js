import { convertToCamelCase } from './_features';

export function fetchSelectDocuments(select, collection, firebase, setState, id) {
    try {
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
    } catch (error) {
        console.error("Error in fetching select documents: ", error);
    }
}

// C A L L B A C K  F U N C T I O N S
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

      case select === 'schoolApplicationHistory':
      case select === 'homestayApplicationHistory':
      case select === 'airportApplicationHistory':
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