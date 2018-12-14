

function getMostCommonRequests(logs){
    // The 'logs' input is an array of strings.
    // Each string will be in this format: 
    // [01/Aug/1995:00:54:59 -0400] "GET /images/opf-logo.gif HTTP/1.0" 200 32511
    const count = {}
    const resource_regex = /(?<=").+(?=")/g;
    const status_regex = /(?<=" )\d{3}(?<= \d+)/g;
    const bytes_regex = /(?<=" \d{3} )\d+/g;
    
    logs.forEach(l => {
        const resource = l.match(resource_regex)[0]
        const status = l.match(status_regex)[0]
        const bytes = l.match(bytes_regex)[0]
        if(count.hasOwnProperty(resource)){
            count[resource].count += 1
            count[resource].bytes += parseInt(bytes, 10)
        } else {
            count[resource] = {}
            count[resource].count = 1
            count[resource].bytes = parseInt(bytes)
        }
    })

    let results = Object.keys(count).map( key => {
        return {...count[key], resource: key}
    });

    results.sort(function(a, b) {
        return a.count < b.count;
    });

    const top_requests = []
    for(let i = 0; i <= 9 && i < results.length; i++){
        top_requests.push( `${results[i].resource} ${results[i].bytes}` )
    }

    return top_requests
}

console.log(getMostCommonRequests(
    [
        "[01/Aug/1995:00:55:04 -0400] \"GET /images/ksclogosmall.gif HTTP/1.0\" 200 3635",
        "[01/Aug/1995:00:54:59 -0400] \"GET /images/opf-logo.gif HTTP/1.0\" 200 32511",
        `[01/Aug/1995:00:55:06 -0400] "GET /images/ksclogosmall.gif HTTP/1.0" 403 298`,
        "[01/Aug/1995:00:55:09 -0400] \"GET /images/ksclogosmall.gif HTTP/1.0\" 200 3635",
        '[01/Aug/1995:00:55:18 -0400] "GET /images/opf-logo.gif HTTP/1.0" 200 32511',
        "[01/Aug/1995:00:56:52 -0400] \"GET /images/ksclogosmall.gif HTTP/1.0\" 200 3635"
    ]
 ))