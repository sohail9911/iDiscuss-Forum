const queryAsync = require('../utils/queryAsync');

exports.showProfilePage = async (req, res) => {
    let userID = req.session.userID;

    let sql = `SELECT * FROM users WHERE user_id = ?;
               SELECT * FROM threads WHERE thread_user_id = ?;
               SELECT * FROM comments WHERE comment_by = ?`;
    
    let result = await queryAsync(sql,  [userID, userID, userID]);
    
    const user = result[0][0];
    const threads = result[1];
    const comments = result[2];
    const editMode = req.query.edit;

    if (editMode && user.birthdate) {
        user.birthdate = new Date(user.birthdate).toISOString().split('T')[0];
    } else if (user.birthdate) {
        user.birthdate = new Date(user.birthdate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
    res.render('profile', { user, threads, comments, editMode });
}

exports.updateProfile = async (req, res) => {
    let { bio, birthdate, gender, organization, role, alt_email, mobile } = req.body;
    let userID = req.session.userID;

   let profilePic = req.file ? req.file.filename : req.session.userProfile;
    if (req.file) {
        req.session.userProfile = profilePic;
    }

    let sql = 'UPDATE users SET bio = ?, birthdate = ?, gender = ?, organization = ?, role = ?, alt_email = ?, mobile = ?, user_profile = ? WHERE user_id = ?';

    await queryAsync(sql, [bio, birthdate, gender, organization, role, alt_email, mobile, profilePic, userID]);
    req.flash('alert', { type: 'success', message: 'Profile updated successfully!' });
    res.redirect('/profile')
}