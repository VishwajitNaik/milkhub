module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.collection('adddocters').updateMany({}, { $set: { center: 'Gogave-1' } });
    console.log("✅ Center field added to all docters with default value ''.");
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection('adddocters').updateMany({}, { $unset: { center: '' } });
    console.log("❌ Center field removed from all docters.");
  }
};
