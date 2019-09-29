const async = require('async');

let { PythonShell} = require('python-shell');
const spawn = require("child_process").spawn;

var fs              = require('fs'),
    readline        = require('readline'),
    {google}        = require('googleapis');
var creds             = require("C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\Razvan-579c7c6068ea.json");
var GoogleSpreadsheet = require('google-spreadsheet');
var MainList_HighSchool=['University of Chicago Lab Schools','St. Ignatius','Latin','New Trier',"Other"];

module.exports= class Excelworkbook {

    constructor() {
       this.Master_University_List=populateMasterUniversityList();
    }
    DeleteEntries() {

    }
    Write_To_Excel(res,high_school,university,username,password){
        var pythonProcess;
        if (university=="All"){
            console.log("User wants to serach Naviance for all Universities")
            pythonProcess = spawn('python',["C:\\Users\\david\\IdeaProjects\\Razvan_Naviance\\main.py",high_school,university,username,password,'All']);

        }
        else{
            console.log("User wants to serach Naviance for a specifc University")
            pythonProcess = spawn('python',["C:\\Users\\david\\IdeaProjects\\Razvan_Naviance\\main.py",high_school,university,username,password,'nothing']);

        }
        console.log("Exited out side spawn")
        var {JSDOM} = require("jsdom");
        var jsdom=require("jsdom")
        var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\tutor_credentials.hbs','utf-8');
        var document = new JSDOM(data).window.document;

        const doc = new GoogleSpreadsheet('1FrqqYB1gXLnYcSVix_NM4HFKxE1yR88qtxayZcGDbIk');

        var university_element=document.createElement('select')
        var highschool_element=document.createElement('select')
        var option= document.createElement("option")
        option.value=high_school;
        option.text=high_school;
        highschool_element.add(option)
        option= document.createElement("option")
        option.value=university;
        option.text=university;
        university_element.add(option)

        res.render('tutor_credentials', {title:"Please check back in 10 minutes and request the same pair of:"+" "+high_school+" "+"and"+" "+university+"",university:university_element, highschool: highschool_element})
        pythonProcess.stdout.on('data', function(data) {
            console.log("Returning from Python program"+" "+data.toString())


            //res.send(data.toString());
        } )
    }
    Read_From_Excel(university,high_school,res){
        var List; //List to be rendered

        var high_school_list= [];
        var university_list=[];
        var sheet_list=[];
        var high_school_row_list=[];
        var sheet;
        var title="";
        var {JSDOM} = require("jsdom");
        var jsdom=require("jsdom")
        var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\tutor_credentials.hbs','utf-8');
        var document = new JSDOM(data).window.document;
        var high_school_column;
        var masteruniversitylist=this.Master_University_List
        // Identifying which document we'll be accessing/reading from
        const doc = new GoogleSpreadsheet('1FrqqYB1gXLnYcSVix_NM4HFKxE1yR88qtxayZcGDbIk');
        if (university.length != 0 && university!="Input University"){
            console.log("User input University"+" "+university)
            async.series([
                function setAuth(step) {
                    doc.useServiceAccountAuth(creds, step);
                },
                function getInfoAndWorksheets(step) {
                    doc.getInfo(function (err, info) {
                        for (var i=0;i<info.worksheets.length;++i){
                            if (subStringSearch(info.worksheets[i].title,university)) {
                                console.log('Found sheet', university);
                                sheet=info.worksheets[i]
                                //console.log('row and column count: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);

                            }

                        }
                        if (sheet==undefined){
                            console.log('NEVER FOUND ANY MATCHES');
                            res.render('naviance_credentials', {title:"University is not on Database, enter your Naviance Credentials" +
                                    "in order to calculate Odds",naviance_username:"username", naviance_password: "Password"})
                            return;
                        }

                        step()
                    })

                },
                function getColumn(step){
                    sheet.getCells({
                        'min-row': 1,
                        'max-row': 2,
                        'return-empty': false
                    }, function(err, cells) {

                        for (var i=2; i<cells.length; ++i){//Starts at 2 because the first has records between universities and high_schools
                            //console.log("cell value"+" "+cells[i].value);
                            if (cells[i].value=='High_School'){
                                console.log('found highs school column'+cells[i].col);
                                high_school_column=cells[i].col;
                                break;
                            }

                        }
                        step()
                    })
                },
                function getHighschools(step){

                    sheet.getCells({
                        'min-row': 1,
                        'max-row': sheet.rowCount,
                        'min-col': high_school_column,
                        'max-col': high_school_column,
                        'return-empty': false,
                    },function (err,cells){

                        for (var i=1; i<cells.length; ++i){

                            high_school_list.push(cells[i].value)
                        }
                        step()
                    });
                },
                function returnSchoolList(step){
                    console.log("Returning"+" "+high_school_list)

                    var highschool=document.createElement('select')
                    var university_element=document.createElement('select')
                    for(var i =0; i<high_school_list.length;++i){
                        var option=document.createElement('option')
                        option.value=high_school_list[i]
                        option.text=high_school_list[i];
                        highschool.add(option)
                    }
                    var option=document.createElement('option')
                    option.value=university
                    option.text=university
                    university_element.add(option)
                    res.render('Calculate_Odds', {title:"Calculate Odds for this Pair"+university,highschool:highschool, university:university_element,universityInput:masteruniversitylist})

                    //res.render('tutor_credentials', {title:"These are the matches of high schools given"+university,High_School:Array.from(high_school_list), University: university})

                    step();

                }
            ])
        }
        else if (high_school.length!= 0 && high_school!= "Input HighSchool"){//Just entered the High school
            console.log("User input Highschool"+" "+high_school)
            if (high_school=="None"){
                console.log("User selected the Pooled data")
                async.series([
                    function setAuth(step) {
                        doc.useServiceAccountAuth(creds, step);
                    },
                    function getInfoAndWorksheets(step) {
                        doc.getInfo(function (err, info) {
                            for (var i=2;i<info.worksheets.length;++i){
                                sheet_list.push(info.worksheets[i].title)
                                //console.log('row and column count: ' + info.worksheets[i].title + ' ' + info.worksheets[i].rowCount + 'x' + info.worksheets[i].colCount);

                            }

                            step()
                        })

                    },
                    function final(step){

                        var university=document.createElement('select')
                        var highschool=document.createElement('select')

                        for(var i =0; i<sheet_list.length;++i){
                            var option=document.createElement('option')
                            option.value=sheet_list[i]
                            option.text=sheet_list[i];
                            university.add(option)
                        }
                        var option=document.createElement('option')
                        option.value="pool";
                        option.text="Pool";
                        highschool.add(option)

                        res.render('Calculate_Odds', {title:"Calculate Odds for this Pair",university:university, highschool:highschool})

                    }
                    ])
            }
        else{
                async.series([
                    function setAuth(step) {
                        doc.useServiceAccountAuth(creds, step);
                    },
                    function getInfoAndWorksheets(step) {
                        doc.getInfo(function (err, info) {
                            for (var i=0;i<info.worksheets.length;++i){
                                sheet_list.push(info.worksheets[i])
                                //console.log('row and column count: ' + info.worksheets[i].title + ' ' + info.worksheets[i].rowCount + 'x' + info.worksheets[i].colCount);

                            }

                            step()
                        })

                    },
                    function getRows(step){
                        sheet_list[0].getCells({
                            'min-row': 1,
                            'max-row': sheet_list[0].rowCount,
                            'min-col': 1,
                            'max-col': 1,
                            'return-empty': false,
                        }, function(err, cells) {

                            for (var i=0; i<cells.length; ++i){
                                console.log("Comparing"+" "+cells[i].value+" "+high_school);
                                if (subStringSearch(cells[i].value,high_school)){
                                    console.log('found highs school row'+cells[i].row);
                                    high_school_row_list.push(cells[i].row);

                                }

                            }
                            if (high_school_row_list.length==0){
                                res.render('naviance_credentials', {title:"University is not on Database, enter your Naviance Credentials" +
                                        "in order to calculate Odds",naviance_username:"username", naviance_password: "Password"})
                                return
                            }
                            step()
                        });
                    },
                    function getUniversities(step){
                        console.log("high school row")
                        sheet_list[0].getCells({
                            'min-row': high_school_row_list[0],
                            'max-row': high_school_row_list[high_school_row_list.length-1],
                            'min-col': 2,
                            'max-col': sheet_list[0].colCount,
                            'return-empty': false,
                        },function (err,cells){
                            for (var i=0; i<cells.length; ++i){
                                console.log('universities adding'+" "+cells[i].value)
                                university_list.push(cells[i].value)
                            }

                            step()
                        });


                    },
                    function final_step(step){

                        if (university_list.length==0){
                            console.log("No Universities came up")
                            res.render('naviance_credentials', {title:"High School is not on Database, enter your Naviance Credentials" +
                                    "in order to calculate Odds",naviance_username:"username", naviance_password: "Password"})
                        }
                        else {

                            console.log("Returnning inside final step"+" "+university_list)

                            var university=document.createElement('select')
                            var highschool=document.createElement('select')

                            for(var i =0; i<university_list.length;++i){
                                var option=document.createElement('option')
                                option.value=university_list[i]
                                option.text=university_list[i];
                                university.add(option)
                            }
                            var option=document.createElement('option')
                            option.value=high_school;
                            option.text=high_school;
                            highschool.add(option)
                            //res.render('tutor_credentials', {title:"Here are the Matches for your High School, pick one to Calculate odds",university:university, highschool:highschool})
                            res.render('Calculate_Odds', {title:"Calculate Odds for this Pair"+university,university:university, highschool:highschool,universityInput:masteruniversitylist})

                        }

                        step();

                    }
                ])
            }

        }
        else{///Its a tutor signing in
            console.log("User is a Tutor"+" ")
            async.series([
                function setAuth(step) {
                    doc.useServiceAccountAuth(creds, step);
                },
                function getInfoAndWorksheets(step) {
                    doc.getInfo(function (err, info) {
                        for (var i=0;i<info.worksheets.length;++i){
                            sheet_list.push(info.worksheets[i])
                            //console.log('row and column count: ' + info.worksheets[i].title + ' ' + info.worksheets[i].rowCount + 'x' + info.worksheets[i].colCount);

                        }

                        step()
                    })

                },
                function getHighSchools(step){
                    sheet_list[0].getCells({
                        'min-row': 1,
                        'max-row': sheet_list[0].rowCount,
                        'min-col': 1,
                        'max-col': 1,
                        'return-empty': false,
                    }, function(err, cells) {

                        for (var i=0; i<cells.length; ++i){

                            console.log('found highs school row'+cells[i].value);
                            high_school_list.push(cells[i].value);

                        }

                        step()
                    });
                },
                function getUniversities(step){
                    console.log("high school row"+" "+high_school_row)
                    sheet_list[0].getCells({
                        'min-row': 1,
                        'max-row': sheet_list[0].rowCount,
                        'min-col': 2,
                        'max-col': sheet_list[0].colCount,
                        'return-empty': false,
                    },function (err,cells){
                        for (var i=0; i<cells.length; ++i){
                            console.log('universities adding'+" "+cells[i].value)
                            university_list.push(cells[i].value)
                        }
                        step()
                    });


                },
                function final_step(step){

                    if (university_list.length==0){
                        console.log("No Universities came up")
                        res.render('naviance_credentials', {title:"High School is not on Database, enter your Naviance Credentials" +
                                "in order to calculate Odds",naviance_username:"username", naviance_password: "Password"})
                    }
                    else {


                        console.log("Returnning inside final step"+" "+university_list)

                        var university=document.createElement('select')
                        var highschool=document.createElement('select')


                        for(var i =0; i<university_list.length;++i){
                            var option=document.createElement('option')
                            option.value=university_list[i]
                            option.text=university_list[i];
                            university.add(option)
                        }
                        for(var i =0; i<high_school_list.length;++i){
                            var option=document.createElement('option')
                            option.value=high_school_list[i]
                            option.text=high_school_list[i];
                            highschool.add(option)
                        }


                        res.render('Calculate_Odds', {title:"Pick School and University",university:university, highschool:highschool,universityInput:masteruniversitylist})

                    }

                    step();

                }
            ])
        }

    }
    Calculate_Odds(university,highschool,res,req){

        if(req.query.University_List_Input.length>0){
            res.render('Calculate_Odds__v2', {title:"Please enter pertinent information",university:req.query.University_List_Input, highschool: req.query.High_School})

        }
        res.render('Calculate_Odds__v2', {title:"Please enter pertinent information",university:req.query.University, highschool: req.query.High_School})


    }
    SVM_Model(university,highschool,res,req){//THe req.query is from Calculate_Odds__v2
        var pythonProcess;
        console.log("Spawning out SVM Python program"+" "+req.query.checkbox_1 +" "+ req.query.checkbox_2 +" "+ req.query.checkbox_3)
        pythonProcess = spawn('python',["C:\\Users\\david\\IdeaProjects\\CalculateOdds\\main.py",highschool,university,req.query.ACT,req.query.GPA,req.query.checkbox_1+" "+ req.query.checkbox_2+" "+req.query.checkbox_3]);
        pythonProcess.stdout.on('data', function(data) {
            console.log("Returning from Python program"+" "+data.toString())


            //res.send(data.toString());
        } )
        res.set('Content-Type', 'text/plain');
        pythonProcess.stdout.pipe(res)
        pythonProcess.stderr.pipe(res)
        //res.render('Calculate_Odds', {title:"Pick School and University",university:university, highschool:highschool,universityInput:masteruniversitylist})

    }
    subStringSearch(sheet_title,search_input){
        console.log("Checking comparing"+" "+sheet_title+" "+search_input)
        return (sheet_title.includes(search_input))
    }
    University_Finder(high_school,res,req){
        console.log("Inside University Finder")
        var current_sheet, row;
        var {JSDOM} = require("jsdom");
        var jsdom=require("jsdom")
        var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\tutor_credentials.hbs','utf-8');
        var document = new JSDOM(data).window.document;
       var university_list=[]
        var masteruniversitylist=this.Master_University_List
        // Identifying which document we'll be accessing/reading from
        const doc = new GoogleSpreadsheet('1FrqqYB1gXLnYcSVix_NM4HFKxE1yR88qtxayZcGDbIk');
        async.series([
            function setAuth(step) {
                doc.useServiceAccountAuth(creds, step);
            },
            function getInfoAndWorksheets(step) {
                doc.getInfo(function (err, info) {

                    current_sheet=info.worksheets[0]
                        //console.log('row and column count: ' + info.worksheets[i].title + ' ' + info.worksheets[i].rowCount + 'x' + info.worksheets[i].colCount);

                    step()
                })

            },
            function getRow(step){

                current_sheet.getCells({
                    'min-row': 1,
                    'max-row': current_sheet.rowCount,
                    'min-col': 1,
                    'max-col': 1,
                    'return-empty': false,
                },function (err,cells){
                    for (var i=0; i<cells.length; ++i){
                        if (cells[i].value==high_school){
                            row=cells[i].row
                            break;
                        }

                    }
                    step()
                });


            },
            function getUniversities(step){
                current_sheet.getCells({
                    'min-row': row,
                    'max-row': row,
                    'min-col': 1,
                    'max-col': current_sheet.colCount,
                    'return-empty': false,
                },function (err,cells){
                    for (var i=0; i<cells.length; ++i){
                       university_list.push(cells[i].value)

                    }
                    step()
                });

            },
            function final_step(step){

                var university=document.createElement('select')
                for(var i =0; i<university_list.length;++i){
                    var option=document.createElement('option')
                    option.value=university_list[i]
                    option.text=university_list[i];
                    university.add(option)
                }


                res.render('Calculate_Odds', {title:"Pick School and University",university:university, highschool:req.query.High_School,universityInput:masteruniversitylist})



                step();

            }
        ])

}


}

function subStringSearch(sheet_title,search_input){
    console.log("Checking comparing"+" "+sheet_title+" "+search_input)
    return (sheet_title.includes(search_input))
}
function populateMasterUniversityList(){
    var university_master="Princeton University\n" +
        "Harvard University\n" +
        "University of Chicago\n" +
        "Yale University\n" +
        "Columbia University\n" +
        "Massachusetts Institute of Technology\n" +
        "Stanford University\n" +
        "University of Pennsylvania\n" +
        "Duke University\n" +
        "California Institute of Technology\n" +
        "Dartmouth College\n" +
        "Johns Hopkins University\n" +
        "Northwestern University\n" +
        "Brown University\n" +
        "Cornell University\n" +
        "Rice University\n" +
        "Vanderbilt University\n" +
        "University of Notre Dame\n" +
        "Washington University in St. Louis\n" +
        "Georgetown University\n" +
        "Emory University\n" +
        "University of California--Berkeley\n" +
        "University of California--Los Angeles\n" +
        "University of Southern California\n" +
        "Carnegie Mellon University\n" +
        "University of Virginia\n" +
        "Wake Forest University\n" +
        "University of Michigan\n" +
        "Tufts University\n" +
        "New York University\n" +
        "University of North Carolina\n" +
        "Boston College\n" +
        "College of William and Mary\n" +
        "Brandeis University\n" +
        "Georgia Institute of Technology\n" +
        "University of Rochester\n" +
        "Boston University\n" +
        "Case Western Reserve University\n" +
        "University of California--Santa Barbara\n" +
        "Northeastern University\n" +
        "Tulane University\n" +
        "Rensselaer Polytechnic Institute\n" +
        "University of California - Irvine\n" +
        "University of California - San Diego\n" +
        "University of Florida"
    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\tutor_credentials.hbs','utf-8');
    var document = new JSDOM(data).window.document;
    var master=document.createElement('select')
    var master_list=university_master.split(/\r?\n/)
    for(var i=0;i<master_list.length;++i) {
        var option = document.createElement('option')
        option.text=master_list[i]
        option.value=master_list[i]
        master.add(option)
    }
    var option = document.createElement('option')
    option.text="All"
    option.value="All"
    master.add(option)
    return master;


}