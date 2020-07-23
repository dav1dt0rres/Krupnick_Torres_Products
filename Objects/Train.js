const async = require('async');

function Train() {

    console.log("INSIDE TRAIN")


}
function University_finder(university,res){
    async.series([
        function setAuth(step) {

        },
        function getInfoAndWorksheets(step) {
            doc.getInfo(function (err, info) {
                for (var i=0;i<info.worksheets.length;++i){
                    if (subStringSearch(info.worksheets[i].title,university)) {
                        console.log('Found sheet', university);
                        console.log('row and column count: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);
                        return true;

                    }

                }
                res.render('naviance_credentials', {title:"University is not on Database, enter your Naviance Credentials" +
                        "in order to calculate Odds",naviance_username:"username", naviance_password: "Password"})
                return false;
                step()
            })

        }

    ])

}

module.exports = Train;