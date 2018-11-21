const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(proxy('/auth/google', { target: 'http://hidden-eyrie-61703.herokuapp.com/' }))
    app.use(proxy('/auth/facebook', { target: 'http://hidden-eyrie-61703.herokuapp.com/' }))
    app.use(proxy('/auth/github', { target: 'http://hidden-eyrie-61703.herokuapp.com/' }))
    app.use(proxy('/api/current_user', { target: 'http://hidden-eyrie-61703.herokuapp.com/' }))
    app.use(proxy('/api/logout', { target: 'http://hidden-eyrie-61703.herokuapp.com/' }))    
}