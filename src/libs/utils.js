export function getImageUrl(src, width, height){
    let url =  import.meta.env.PUBLIC_IMG_HOST+ src + '?w='+width+'&h='+height + '&q=80';
    return url;
}

export function getAbsoluteSiteUrl(href){
    return import.meta.env.PUBLIC_SITE_HOST+ href;
}


