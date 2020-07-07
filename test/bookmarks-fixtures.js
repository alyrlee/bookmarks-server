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

function makeMaliciousBookmark() {
    const maliciousBookmark= {
      id: 911,
      style: 'How-to',
      title: 'Naughty naughty very naughty <script>alert("xss");</script>',
      url: 'https://nogood.com',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    }
    const expectedBookmark = {
      ...maliciousBookmark,
      title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
      maliciousBookmark,
      expectedBookmark,
    }
  }



module.exports = {
    makeBookmarksArray,
    makeMaliciousBookmark,
}