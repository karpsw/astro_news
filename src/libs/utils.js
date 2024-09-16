export function getImageUrl(src, width, height){
    let url =  'https://astronews.ror.ru'+ src + '?w='+width+'&h='+height + '&q=80';
    return url;
}

export function getAbsoluteSiteUrl(href){
    return 'https://astronews.ror.ru'+ href;
}


