export function getImpressions(data: any) {
    if (data.length <= 0) return null;
    let impressions = data.find(a => a.name === "impressions");
    return impressions.values[0].value;

}

export function getReach(data: any) {
    if (data.length <= 0) return null;
    let reach = data.find(a => a.name === "reach");
    return reach.values[0].value;

}

export function getEngagement(data: any) {
    if (data.length <= 0) return null;
    let engagement = data.find(a => a.name === "engagement");
    return engagement.values[0].value;

}

export function getVideoViews(data: any) {
    if (data.length <= 0) return null;
    let video_views = data.find(a => a.name === "video_views");
    return video_views.values[0].value;

}