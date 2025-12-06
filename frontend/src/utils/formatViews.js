

export const formatViews=(views)=>{
    if(!views) return "0";
    if(views>=1000000) return `${(views/1000000).toFixed(1)}M`;
    if(views>=1000) return `${(views/100).toFixed(1)}k`;
    return views.toString();
}