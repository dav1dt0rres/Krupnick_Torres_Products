const express = require('express')
const router = express.Router()
var ReadFromFile = require('../Objects/ReadFromFile.js');

var fs              = require('fs'),
    readline        = require('readline'),
    {google}        = require('googleapis');
//var creds             = require("C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\Razvan-579c7c6068ea.json");
var GoogleSpreadsheet = require('google-spreadsheet');
const XLSX = require('xlsx')

//const workbook=XLSX.readFile('./biotech cos ipo_1.xlsm')
//const sheet_name_list= workbook.SheetNames
var title;

router.post('/',(req,res,next)=>{
    console.log("because youre a Tutor")

    res.redirect(307,'/ReadSheets')
})

router.get('/calculate', function (req, res, next) {
    console.log("inside calculate")
  //  var sheet=workbook.Sheets[sheet_name_list[0]]
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
    if (req.query.hasOwnProperty("past_search")){


    }
    if (req.query.hasOwnProperty("select")){

    }
    //res.render('view', {title,High_School:"Enter a High School", University: "Enter a University School"})


})
router.get('/readfromFile',function(req,res,next){
    console.log("inside /readfromFile")
    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\past_search.hbs','utf-8');
    var document = new JSDOM(data).window.document;

    var ReadFromFile_Object;
    fs.readFile('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\past_searches.txt', 'utf8', function(err, contents) {
        //console.log(contents);
        ReadFromFile_Object=new ReadFromFile(contents);
        ReadFromFile_Object.displayAll();
        var summary=document.createElement('select')
        for(var i =0; i<ReadFromFile_Object.ACT_List.length;++i){
            var option=document.createElement('option')
            option.value=i;
            option.text=ReadFromFile_Object.ACT_List[i]+" "+ReadFromFile_Object.GPA_List[i]+" "+ReadFromFile_Object.HighSchool_List[i]+" "+
                ReadFromFile_Object.University_List[i]+" "+ReadFromFile_Object.Pooled_List[i]+" "+ReadFromFile_Object.Undersampled_List[i];
            summary.add(option)
        }

        ReadFromFile_Object.searchDetails();
        var final_string="";
        for (var i =0;i<ReadFromFile_Object.MasterDetailList.length;++i){
            var temp_list=ReadFromFile_Object.MasterDetailList[i]
            for (var j= 0; j<temp_list.length;++j){
                //console.log("temp list"+" "+temp_list[j])
                //console.log("Without trim"+" "+temp_list[j]);
                final_string=final_string+temp_list[j]+";"
            }

        }
        res.render('past_search', {title:"Look up Past Searches",Summary:summary,Details:final_string})
    });

})
router.get('/getOutput',function(req,res,next){
    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\past_search.hbs','utf-8');
    var document = new JSDOM(data).window.document;
    var dist = document.getElementById('Summary').value;
    console.log("Value of selected"+" "+dist)
    //console.log("req"+" "+req.query.Summary.value)
})
//console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
router.get('/continue_program',function (req, res, next) {
    console.log("inside collection of data from Naviance")
    Write_To_Excel()
    //res.render('view', {title,High_School:"Enter a High School", University: "Enter a University School"})


})

module.exports = router