module.exports = function(req, res, next) {
    //Check if jwt and accountData is present and account_type is employee or admin
    if (
        res.locals.accountData &&
        (res.locals.accountData.account_type === 'Employee' || res.locals.accountData.account_type === 'Admin' )
    ) {
        return next()
    } else {
        req.flash("notice", "You do not have permission to access this page." )
        return res.redirect("/account/login")
    }    
}