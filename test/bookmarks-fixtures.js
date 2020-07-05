function makeBookmarksArray() {
    return [
        {
            id: 1,
            title: 'Google',
            url: 'https://www.google.com',
            description: 'Best book apps to download',
            rating: 5,
        },
        {
            id: 2,
            title: 'Yahoo',
            url: 'https://www.yahoo.com',
            description: 'Worst book apps to download',
            rating: 4,
        },
        {
        id: 3,
            title: 'Thinkful',
            url: 'https://www.thinkful.com',
            description: 'Build a bookmark server',
            rating: 3,
    },
  ]
}

module.exports = {
    makeBookmarksArray,
}