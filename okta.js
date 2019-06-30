

const okta = require('@okta/okta-sdk-nodejs')
var oktaClient = new okta.Client({
  orgUrl: 'https://dev-902682.oktapreview.com',
  token: '003nELt2MfhfNHg0En0FEAsWEaJqL9rkUAfBMU29MG'
});

const middleware = async (req, res, next) => {
    if (req.userinfo) {
        try {
            req.user = await oktaClient.getUser(req.userinfo.sub)
        } catch (error) {
            console.log(error)
        }
    }
    console.log("Middelware")
    next()
}
module.exports = {oktaClient, middleware}