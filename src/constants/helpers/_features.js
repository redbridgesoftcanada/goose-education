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

export { createPagination, singleFilterQuery, multipleFilterQuery, sortQuery, convertToCamelCase, convertToTitleCase, convertToSentenceCase }