const queryAsync = require('../utils/queryAsync');
const bcrypt = require('bcrypt');

exports.showLoginPage = (req, res) => {
    res.render('auth/login');
};

exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE user_email = ?";
    const result = await queryAsync(sql, [email]);

    if (result.length > 0) {
        const validPassword = await bcrypt.compare(password, result[0].user_password);
        if (!validPassword) {
            req.flash('alert', { type: 'danger', message: 'Invalid email or password' });
            return res.redirect('/auth/login');
        }
        req.session.userID = result[0].user_id;
        req.session.username = result[0].user_name;
        req.session.userProfile = result[0].user_profile;
        return res.redirect('/categories');
    } else {
        req.flash('alert', { type: 'danger', message: 'Invalid email or password' });
        return res.redirect('/auth/login');
    }
};

exports.showRegisterPage = (req, res) => {
    res.render('auth/register');
};

exports.handleRegister = async (req, res) => {
    const { username, email, password } = req.body;

    const checkUserSql = "SELECT * FROM users WHERE user_email = ?";
    const checkUser = await queryAsync(checkUserSql, [email]);
    if (checkUser.length > 0) {
        req.flash("alert", { type: "danger", message: "Email already exists" });
        return res.redirect("/auth/register");
    }

    if (username.trim() === "" || password.trim() === "") {
        req.flash('alert', { type: 'warning', message: 'Empty spaces are not allowed.' });
        return res.redirect('/auth/register');
    }

    const userProfile = req.file ? req.file.filename : null;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (user_name, user_email, user_password, user_profile) VALUES (?, ?, ?, ?)";
    await queryAsync(sql, [username, email, hashedPassword, userProfile]);

    req.flash('alert', { type: 'success', message: 'Registration successful! Please log in.' });
    res.redirect('/auth/login');
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Logout error');
        res.redirect('/auth/login');
    });
};

// ----------------------------------------------------------------------------------------

exports.showForgotPassword = (req, res) => {
    res.render('auth/forgetPassword');
}