const express = require('express')
const router = express.Router()

var fs              = require('fs'),
    readline        = require('readline'),
    {google}        = require('googleapis');
var creds             = require("C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\Razvan-579c7c6068ea.json");
var GoogleSpreadsheet = require('google-spreadsheet');
const XLSX = require('xlsx')

const workbook=XLSX.readFile('C:\\Users\\david\\Downloads\\biotech cos ipo.xlsm')
const sheet_name_list= workbook.SheetNames
var title;

router.post('/',(req,res,next)=>{
    console.log("because youre a Tutor")

    res.redirect(307,'/ReadSheets')
})

router.get('/calculate', function (req, res, next) {
    console.log("inside calculate")
    var sheet=workbook.Sheets[sheet_name_list[0]]
    var tt = 0;
    var data = [];
    for (var i = 0; i < z.length; i++) {
        if (!isNaN(z[i])) {
            tt = i;
            break;
        }
    };

    var col = z.substring(0,tt);
    var row = parseInt(z.substring(tt));
    var value = worksheet[z].v;

    data[row][headers[col]] = value;
    title="School Predictor"



})

router.get('/',function (req, res, next) {
    console.log("Inside ModelPredictor GET")
    res.render('ModelPredictor', {title:"University Predictor"})

    //res.render('view', {title,High_School:"Enter a High School", University: "Enter a University School"})


})
//console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
router.get('/continue_program',function (req, res, next) {
    console.log("inside collection of data from Naviance")
    Write_To_Excel()
    //res.render('view', {title,High_School:"Enter a High School", University: "Enter a University School"})


})

module.exports = router