import { TAGS } from '../constants';
import { convertToCamelCase } from './_features';

export function fetchAllDocuments(collection, firebase, setState) {
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

// C A L L B A C K  F U N C T I O N S
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
              let data = doc.data();
              let id = doc.id;
              return {...data, id}
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