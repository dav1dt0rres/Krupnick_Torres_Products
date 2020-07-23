const async = require('async');
const path = require("path");
const fs = require("fs");
const mysql = require('mysql');
const mysqlx = require('@mysql/xdevapi');
module.exports= class MYSQLInstance {

    constructor(first_name, last_name) {//This is Reproducible
        console.log("inside sql constructor")
        this.DeeperQueryOptions=[];
        this.QuizNames=[];
        this.StudentID="";
        this.FirstNames = {
            'joe': true,
            'david': true,
            'cameron': true,
            'andrew': true
        }
        this.LastNames = {
            'torres': true,
            'krupnick': true,
            'gong':true,
            'klietzen':true
        }
        if(this.FirstNames[first_name.toLowerCase()] && this.LastNames[last_name.toLowerCase()]){
            this.certification=true;
        }
        else{
            this.certification=false;
        }
        this.Collections=[];//Holds the rows for the initial simple query



    }
    async executeQuery(query,callback){
        var session;
        await mysqlx.getSession({ host: 'ec2-3-12-41-231.us-east-2.compute.amazonaws.com', port: 33060, user: 'hive', password: '421854.Torres' }).then( async function (s) {

           session = s;
           var collections=[];
          await session.sql('USE metastore').execute();
            var res= await session.sql(query).execute().then(res => {
                var row;


                return callback(null, res);
            })


       })

        // In a Session context the full SQL language can be used


    }

    async run_search_student(first_name,last_name,student_name,callback){
        if (this.certification) {
            //var query_input=student_name.split(" ");

            console.log("name going in "+student_name)
            var query="Select firstname,lastName,studentID FROM Students WHERE firstname LIKE "+"'"+student_name+"%"+"'"+" or lastName LIKE "+ "'"+student_name+"%"+"'";
            console.log("QUERY GOING IN "+query)
            var rows=[]
            await this.executeQuery(query, function (err, res) {

                console.log("Executig Student query");
                var row;
                if (!err) {
                    while (row = res.fetchOne()) {
                        rows.push([row[0]+"-"+row[1]+"-"+row[2]])

                    }
                    callback(null,rows);
                }
                else {
                    callback(true,err);
                }
            });
            this.Collections=rows
            console.log("Results.....: "+this.Collections)
        }

    }
     async run_deeperQuery(request_string,callback){
        console.log("inside run_deeperquery ",request_string)
        var query_input=request_string.split(",")
        var section=query_input[0]
        if (this.QuizNames.length>0){
            return
        }
        //get All quiznames
        var query='Select quizName FROM Aggregated_Grades '
         if(section!="All Sections"){
            query=query+" WHERE section = "+section

        }
         query=query+"GROUP BY quizName;"
        console.log("Query going in "+query)
        var rows=[]
         await this.executeQuery(query, function (err, res) {

            var row;
            if (!err) {
                while (row = res.fetchOne()) {
                    rows.push([row[0]])
                }
                callback(null,rows);
            }
            else {
                callback(true,err);
            }
        });
         console.log("Results for Collected TEsts... "+rows)
        this.QuizNames=rows;

    }
    async run(first_name,last_name,student_name,request_string,callback){//This should also collect all tests given the section(section could = ALL) and tags. Save them as a field in thsi object
        var query_input=request_string.split(",")
        console.log("students inside run "+student_name)
        if (student_name==undefined || student_name=="All Students"){
            console.log("All students selected")
            student_input="all students"
        }
        else{
            var student_input=student_name.split(";");

            if (this.StudentID.length==0){
                this.StudentID=student_input[1];
                console.log("ESTABLISHED STUDENTid "+this.StudentID)
            }


        }
        console.log("REQUEST STRING "+query_input)
        var section=query_input[0]
        var quizname= "All Quizzes";
        //console.log("inside MYSQL "+student_input)
        if (this.certification) {
            var query='SELECT Percent_Wrong, DATE_FORMAT(date, \'%Y-%m-%d\') AS your_date FROM' +
                ' Aggregated_Grades WHERE'
           if (student_input!="all students"){
               query=query+' studentID='+this.StudentID;
           }


           if(section!="All Sections"){
               if(student_input!="all students"){
                   query=query+" and section = "+section;
               }
               else{
                   query=query+" section = "+section;
               }


           }
           if (quizname!="All Quizzes"){
                query=query+" and WHERE quizname="+quizname
           }
            query=query+";"
            console.log("query going in....",query)
            var session;
            var collections=[]
            var rows=[]
            await this.executeQuery(query, function (err, res) {
                console.log("Executig query");
                var row;
                if (!err) {
                    while (row = res.fetchOne()) {
                        rows.push([row[0]+";"+row[1]])
                    }
                    callback(null,rows);
                }
                else {
                    callback(true,err);
                }
            });
            this.Collections=rows
            console.log("RESULTS..."+this.Collections)
        }
    }
}