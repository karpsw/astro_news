export async function graphQlTest(){
    const siteNavQueryRes = await fetch(import.meta.env.WORDPRESS_API_HOST + '/graphql', {
        method: 'post', 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            query: `{
               query MyQuery {
  posts(where: {search: "трамп"}, last: 10) {
    nodes {
      id
      title
      uri
    }
  }
}
            `
        })
    });
    const{ data } = await siteNavQueryRes.json();
    return data;
}
export async function graphGatoQlTest(){
    const siteNavQueryRes = await fetch(import.meta.env.WORDPRESS_API_HOST  +'/graphql/internal/', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            query: `{
               query MyQuery {
  posts(
    sort: {order: DESC, by: DATE}
    pagination: {limit: 10}
    filter: {
      metaQuery: {
        key: "главная_новость",
        compareBy: {
          stringValue: {
            value: "1"
            operator: EQUALS
          }
        }
      }
      
    }
  ) {
    id
    date
    excerpt
    metaValues(key: "главная_новость")
  }
}
            `
        })
    });
    const{ data } = await siteNavQueryRes.json();
    return data;
}

export async function navQuery(){
    const siteNavQueryRes = await fetch(import.meta.env.WORDPRESS_API_HOST + '/graphql', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            query: `{
                menus(where: {location: PRIMARY}) {
                  nodes {
                    name
                    menuItems {
                        nodes {
                            uri
                            url
                            order
                            label
                        }
                    }
                  }
                }
                generalSettings {
                    title
                    url
                    description
                }
            }
            `
        })
    });
    const{ data } = await siteNavQueryRes.json();
    return data;
}

export async function homePagePostsQuery(){
    const response = await fetch(import.meta.env.WORDPRESS_API_HOST + '/graphql', {
        method: 'post', 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            query: `{
                posts {
                  nodes {
                    date
                    uri
                    title
                    commentCount
                    excerpt
                    categories {
                      nodes {
                        name
                        uri
                      }
                    }
                    featuredImage {
                      node {
                        srcSet
                        sourceUrl
                        altText
                        mediaDetails {
                          height
                          width
                        }
                      }
                    }
                  }
                }
              }
            `
        })
    });
    const{ data } = await response.json();
    return data;
}


export async function getNodeByURI(uri){
    const response = await fetch(import.meta.env.WORDPRESS_API_HOST + '/graphql', {
        method: 'post', 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            query: `query GetNodeByURI($uri: String!) {
                nodeByUri(uri: $uri) {
                  __typename
                  isContentNode
                  isTermNode
                  ... on Post {
                    id
                    title
                    date
                    uri
                    excerpt
                    content
                    categories {
                      nodes {
                        name
                        uri
                      }
                    }
                    featuredImage {
                      node {
                        srcSet
                        sourceUrl
                        altText
                        mediaDetails {
                          height
                          width
                        }
                      }
                    }
                  }
                  ... on Page {
                    id
                    title
                    uri
                    date
                    content
                  }
                  ... on Category {
                    id
                    name
                    posts {
                      nodes {
                        date
                        title
                        excerpt
                        uri
                        categories {
                          nodes {
                            name
                            uri
                          }
                        }
                        featuredImage {
                          node {
                            srcSet
                            sourceUrl
                            altText
                            mediaDetails {
                              height
                              width
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
                uri: uri
            }
        })
    });
    const{ data } = await response.json();
    return data;
}

export async function getAllUris(){


  const response = await fetch(import.meta.env.WORDPRESS_API_HOST + '/graphql', {
      method: 'post', 
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
          query: `query GetAllUris {
            terms {
              nodes {
                uri
              }
            }
            posts(first: 100) {
              nodes {
                uri
              }
            }
            pages(first: 100) {
              nodes {
                uri
              }
            }
          }
          `
      })
  });
  const{ data } = await response.json();
  const uris = Object.values(data)
    .reduce(function(acc, currentValue){
      return acc.concat(currentValue.nodes)
    }, [])
    .filter(node => node.uri !== null)
    .map(node => {
      let trimmedURI = node.uri.substring(1);
      trimmedURI = trimmedURI.substring(0, trimmedURI.length - 1)
      return {params: {
        uri: trimmedURI
      }}
    })

  return uris;

}

