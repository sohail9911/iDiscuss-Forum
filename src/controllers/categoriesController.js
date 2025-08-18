const queryAsync = require('../utils/queryAsync');

// Show categories
exports.showCategories = async (req, res) => {
    const sql = 'SELECT * FROM categories LIMIT 6';
    const categories = await queryAsync(sql);
    res.render('index', { categories });
};

// Open a category
exports.openCategoryPage = async (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT * FROM categories WHERE id = ?;
        SELECT * FROM threads T LEFT JOIN users U ON T.thread_user_id = U.user_id WHERE thread_cat_id = ?`;
    const result = await queryAsync(sql, [id, id]);

    if(!result[0][0]){
        req.flash('alert', { type: 'warning', message: 'Category you want to open does not exist!' });
        return res.redirect(`/categories`);
    }
    res.render('threadlist', { category: result[0][0], threads: result[1] });
};

// Insert Thread
exports.insertThread = async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;

    if (title.trim() === "" || description.trim() === "") {
        req.flash('alert', { type: 'warning', message: 'Empty spaces are not allowed.' });
        return res.redirect(`/categories/${id}`);
    }

    const sql = "INSERT INTO threads (thread_title, thread_desc, thread_cat_id, thread_user_id) VALUES (?, ?, ?, ?)";
    await queryAsync(sql, [title, description, id, req.session.userID]);
    req.flash('alert', { type: 'success', message: 'Thread inserted successfully!' });
    res.redirect(`/categories/${id}`);
};

// Delete Thread
exports.deleteThread = async (req, res) => {
    const { id, thread_id } = req.params;
    const sql = "DELETE FROM threads WHERE thread_cat_id = ? AND thread_id = ?";
    await queryAsync(sql, [id, thread_id]);
    req.flash('alert', { type: 'success', message: 'Thread deleted successfully!' });
    res.redirect(`/categories/${id}`);
};

// Open thread
exports.openThread = async (req, res) => {
    const { id, thread_id } = req.params;
    const sql = `
        SELECT * FROM threads LEFT JOIN users ON threads.thread_user_id = users.user_id WHERE thread_id = ?;
        SELECT * FROM comments LEFT JOIN users ON comments.comment_by = users.user_id WHERE thread_id = ?`;
    const result = await queryAsync(sql, [thread_id, thread_id]);

    if(!result[0][0]){
        req.flash('alert', { type: 'warning', message: 'Thread you want to open does not exist!' });
        return res.redirect(`/categories/${id}`);
    }

    res.render('thread', { thread: result[0][0], comments: result[1], id });
};

// Add Comment
exports.insertComment = async (req, res) => {
    const { comment } = req.body;
    const { id, thread_id } = req.params;
    const user_id = req.session.userID;

    if (comment.trim() === "") {
        req.flash('alert', { type: 'warning', message: 'Empty spaces are not allowed.' });
        return res.redirect(`/categories/${id}/threads/${thread_id}`);
    }

    const sql = "INSERT INTO comments (comment_content, thread_id, comment_by) VALUES (?, ?, ?)";
    await queryAsync(sql, [comment, thread_id, user_id]);
    req.flash('alert', { type: 'success', message: 'Comment added successfully!' });
    res.redirect(`/categories/${id}/threads/${thread_id}`);
};

// Delete Comment
exports.deleteComment = async (req, res) => {
    const { id, thread_id, comment_id } = req.params;
    const user_id = req.session.userID;

    const sql = "DELETE FROM comments WHERE thread_id = ? AND comment_by = ? AND comment_id = ?";
    await queryAsync(sql, [thread_id, user_id, comment_id]);
    req.flash('alert', { type: 'success', message: 'Comment deleted successfully!' });
    res.redirect(`/categories/${id}/threads/${thread_id}`);
};