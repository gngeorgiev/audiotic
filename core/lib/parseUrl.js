const resolverTypes = {
    YouTube: ['youtube', 'youtu.be']
};

module.exports = function(url = '') {
    url = url.toLowerCase();

    const resolvers = Object.keys(resolverTypes);
    for (let resolver of resolvers) {
        const resolverPatterns = resolverTypes[resolver];
        for (let pattern of resolverPatterns) {
            if (
                url.includes(`http://${pattern}`) ||
                url.includes(`http://www.${pattern}`) ||
                url.includes(`https://${pattern}`) ||
                url.includes(`https://www.${pattern}`)
            ) {
                return resolver;
            }
        }
    }

    return 'Unknown';
};
