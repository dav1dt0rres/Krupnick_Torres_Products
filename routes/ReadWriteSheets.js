const express = require('express')
const router = express.Router();
let { PythonShell} = require('python-shell');
const spawn = require("child_process").spawn;
var async = require('async');
var fs              = require('fs'),
    readline        = require('readline'),
    {google}        = require('googleapis');
var creds             = require("C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\Razvan-579c7c6068ea.json");
var GoogleSpreadsheet = require('google-spreadsheet');
var MainList_HighSchool=['University of Chicago Lab Schools','St. Ignatius','Latin','New Trier',"Other"];
var ReadWrite=require('../Objects/Excelworkbook.js');
var Workbook=new ReadWrite();

router.get('/',function (req, res, next) {
    console.log("Inside ReadWriteSheets get",req.query.University)

   // if (req.query.University==undefined){
      //  console.log("First time loaded");
        //res.render('tutor_credentials', {title:"Enter University OR High School",High_School:"Input high school", University: "Input University"})

    //}
    if (req.query.hasOwnProperty("student_button")){
        res.render('student_credentials', {title:"Choose High School",High_School:"Input high school", University: "Input University"})

    }
    if (req.query.hasOwnProperty("naviance_button")){
        console.log("pressed naviance_button")
        console.log("GOing in"+ " "+ req.query.HighSchool_Input+" "+req.query.University_Input+" "+req.query.N_user_name)
        Workbook.Write_To_Excel(res,req.query.HighSchool_Input,req.query.University_Input,req.query.N_user_name,req.query.N_password)
       //Write_To_Excel(res,req.query.High_School,req.query.Univpast_searches.txtersity,req.query.username,req.query.password); //Write_TO_Excel function probably needs command line arguments to be to python

    }
    else if (req.query.hasOwnProperty("tutor_button")){
        res.render('tutor_credentials', {title:"Choose High School",High_School:"Input high school", University: "Input University"})

        //Workbook.Read_From_Excel("Input University","Input HighSchool",res)


    }
    else if(req.query.hasOwnProperty("run_program")){
        console.log("run program has been pressed")
        Workbook.Write_To_Excel(res,req.query.HighSchool_Input,req.query.University_Input,req.query.N_user_name,req.query.N_password)
    }
    else if(req.query.hasOwnProperty("list_button")){
        console.log("Searching if High School since its student")

        Workbook.Read_From_Excel("Input University",req.query.High_School,res)

    }
    else if (req.query.hasOwnProperty("list_button_tutor")){
        console.log("Searching if High School since its Tutor")
        Workbook.Read_From_Excel("Input University",req.query.High_School,res)
    }
    else if(req.query.hasOwnProperty("match_button")){
        console.log("Search matches for TUtor")
        Workbook.Read_From_Excel(req.query.University,req.query.High_School,res)

    }
    else if (req.query.hasOwnProperty("calculate_button")){
        console.log("Calculating Odds...")
        Workbook.Calculate_Odds(req.query.University,req.query.High_School,res,req)
    }

})
router.get('/loadSearches',function(req,res,next){
    console.log("Inside loading searches")


})
router.get('/Calculate_Odds',function(req,res,next){
    console.log("Inside Caclulate_Odds get (SVM)")



    Workbook.SVM_Model(req.query.university,req.query.highschool,res,req)
    console.log("Outside of SVM Model...")


})
router.get('/University_finder',function(req,res,next){
    var document = new JSDOM(data).window.document;
    console.log("Inside University Finder get"+" "+req+" "+req.query.High_School.value)
    Workbook.University_Finder(req.query.High_School,res,req)


})
router.post('/',function (req, res, next) {
    console.log("Inside ReadWroteSheets post")
    console.log("University",res.University.toString())
    //res.render('view', {title,High_School:"Enter a High School", University: "Enter a University School"})


})



function University_finder(university,res){
    console.log("Inside University finder"+" "+university);
    const doc = new GoogleSpreadsheet('1FrqqYB1gXLnYcSVix_NM4HFKxE1yR88qtxayZcGDbIk');
    var rows_list=[]
    var sheet;
    async.series([
        function setAuth(step) {
            doc.useServiceAccountAuth(creds, step);
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
function HighSchool_finder(high_school,res){
    console.log("Inside highschool finder"+" "+high_school);
    const doc = new GoogleSpreadsheet('1FrqqYB1gXLnYcSVix_NM4HFKxE1yR88qtxayZcGDbIk');
     var high_school_row;
     var signal=false;
     var sheet_list=[];
     var university_list=[];
    async.series([

    ])
}




function searchforhighschools(sheet){
    console.log("University searching for deeper",sheet.title)



    console.log("Found high school column"+" "+high_school_column)

    return high_school_list;

}
module.exports = router