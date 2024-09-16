export function getImageUrl(src, width, height){
    let url =  'https://astronews.ror.ru'+ src + '?w='+width+'&h='+height + '&q=80';
    return url;
}

export function getAbsoluteSiteUrl(href){
    return import.meta.env.SITE_URL+ href;
}


