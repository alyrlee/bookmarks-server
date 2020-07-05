const BookmarksService = {
    getAllBookmarks(knex) {
      return knex.select('*').from('bookmarks')
    },
    insertBookmark(knex, newBookmark) {
      return knex
        .insert(newBookmark)
        .into('bookmark')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex.from('bookmarks').select('*').where('id', id).first()
    },
    deleteBookmark(knex, id) {
      return knex('bookmarks')
        .where({ id })
        .delete()
    },
    updateBookmark(knex, id, newABookmarkFields) {
      return knex('bookmark')
        .where({ id })
        .update(newBookmarkFields)
    },
  }
  
  module.exports = BookmarksService