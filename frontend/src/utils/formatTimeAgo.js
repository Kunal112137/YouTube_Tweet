export const formatTimeAgo=(dateString)=>{
    const date=new Date(dateString);
    const now =new Date();
    const diffInHours=Math.floor((now-date)/(1000*60*60));
    if(diffInHours<1) return "just now";
    if(diffInHours<24) return `${diffInHours} hours ago`;
    const diffInDays=Math.floor(diffInHours/24);
    if(diffInDays<7) return `${diffInDays} days ago`;
    const diffInweeks=Math.floor(diffInDays/7);
    if(diffInweeks<4) return `${diffInweeks} weeks ago `;
    const diffInMonths=Math.floor(diffInDays/30);
    return `${diffInMonths} months ago`;
}