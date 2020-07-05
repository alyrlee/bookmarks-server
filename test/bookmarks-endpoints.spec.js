const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray, makeMaliciousBookmark } = require('./bookmarks-fixtures')

describe('Bookmarks Endpoints', function() {
    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)

    })
  
    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db('bookmarks').truncate())
  
    afterEach('cleanup', () => db('boomarks').truncate())

    describe(`GET /bookmarks`, () => {
     context('Given there are bookmarks in the database', () => {

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200, [])
      })
    })


    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })

      it('responds with 200 and all of the bookmarks', () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200, testBookmarks)
      })
    })
  })

  context(`Given an XSS attack bookmark`, () => {
    const { maliciousBookmark, expectedBookmark} = makeMaliciousBookmark()

    beforeEach('insert malicious bookmark', () => {
      return db
        .into('bookmarks')
        .insert([ maliciousBookmark ])
    })

    it('removes XSS attack content', () => {
      return supertest(app)
        .get(`/bookmarks`)
        .expect(200)
        .expect(res => {
          expect(res.body[0].title).to.eql(expectedBookmark.title)
          expect(res.body[0].content).to.eql(expectedBookmark.content)
        })
    })
  })
})


  describe(`GET /bookmarks/:bookmark_id`, () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 404`, () => {
        const bokmarkId = 123456
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .expect(404, { error: { message: `Bookmark doesn't exist` } })
      })
    })

    context('Given there are bookmarkss in the database', () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })

      it('responds with 200 and the specified bookmark', () => {
        const bookmarkId = 2
        const expectedBookmark = testBookmarks[bookmarkId - 1]
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .expect(200, expectedBookmark)
      })
    })

    context(`Given an XSS attack bookmark`, () => {
      const { maliciousBookmark, expectedBookmark } = makeMaliciousBookmark()

      beforeEach('insert malicious bookmark', () => {
        return db
          .into('bookmark')
          .insert([ maliciousBookmark ])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/bookmarks/${maliciousBookmark.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedBookmark.title)
            expect(res.body.content).to.eql(expectedBookmark.content)
          })
      })
    })
  })

  describe(`POST /bookmarks`, () => {
    it(`creates an bookmark, responding with 201 and the new bookmark`, function() {
      this.retries(3)
      const newBookmark = {
        title: 'Test new bookmark',
        style: 'Listicle',
        content: 'Test new bookmark content...'
      }
      return supertest(app)
        .post('/bookmarks')
        .send(newBookmark)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newBookmark.title)
          expect(res.body.style).to.eql(newBookmark.style)
          expect(res.body.content).to.eql(newBookmark.content)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/bookmarks/${res.body.id}`)
          const expected = new Date().toLocaleString()
          const actual = new Date(res.body.date_published).toLocaleString()
          expect(actual).to.eql(expected)
        })
        .then(res =>
          supertest(app)
            .get(`/bookmarks/${res.body.id}`)
            .expect(res.body)
        )
    })

    const requiredFields = ['title', 'style', 'content']

    requiredFields.forEach(field => {
      const newBookmark= {
        title: 'Test new bookmark',
        style: 'Listicle',
        content: 'Test new bookmark content...'
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newBookmark[field]

        return supertest(app)
          .post('/bookmarks')
          .send(newBookmark)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('removes XSS attack content from response', () => {
      const { maliciousBookmark, expectedBookmark} = makeMaliciousBookmark()
      return supertest(app)
        .post(`/bookmarks`)
        .send(maliciousBookmark)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(expectedBookmark.title)
          expect(res.body.content).to.eql(expectedBookmark.content)
        })
    })
  })


