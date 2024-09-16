export async function getImageUrl(src, width, height){
    let url =  'https://astronews.ror.ru'+ src + '?w='+width+'&h='+height + '&q=80';
    console.log(url);
    return url;
}


