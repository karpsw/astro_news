export async function mainPageQuery(){
    console.log(import.meta.env.WORDPRESS_API_HOST + '/graphql/internal/')
    const query = await fetch(import.meta.env.WORDPRESS_API_HOST + '/graphql/internal/', {
        method: 'post', 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            query: `{
  main_top_news: posts(
    sort: {order: DESC, by: DATE}
    pagination: {limit: 1}
    filter: {metaQuery: {key: "главная_новость", compareBy: {stringValue: {value: "1", operator: EQUALS}}}}
  ) {
    ...Post
  }
  top_news_lenta: posts(
    pagination: {limit: 13}
    sort: {by: DATE, order: DESC}
  ) {
    ...Post
  }
  all_news_list: posts(
    pagination: {limit: 10, offset: 14}
    sort: {by: DATE, order: DESC}
  ) {
    ...Post
  }
  
  pupular_tags:tags(sort: {by: COUNT, order: DESC}, filter: {}, pagination: {limit: 12}) {
     
      id
      name
      urlPath
      count
    
  }
  
  
}

fragment Post on Post {
  id
  title
  urlPath
  dateStr(format: "Y.m.d H:i")
  excerpt
  categories {
    name
    urlPath
  }
  tags {
    name
    urlPath
  }
  featuredImage {
    height
    width
    srcPath
  }
}


            `
        })
    })

    const{ data } = await query.json();
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

