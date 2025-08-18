const queryAsync = require('../utils/queryAsync');

// Show search results
exports.showSearchResults = async (req, res) => {
    let { search_q } = req.query;
    let sql = 'SELECT * FROM threads WHERE MATCH (thread_title, thread_desc) against (?) ORDER BY thread_id';
    let result = await queryAsync(sql, [search_q]);
    res.render('search', { threads: result });
}