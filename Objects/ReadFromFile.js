
const async = require('async');

module.exports= class ReadFromFile {

    constructor(datastring) {
        this.file_string=datastring  ;
        console.log('inside ReadfromFile COnstructor')
        this.GPA_List=[];
        this.ACT_List=[];
        this.University_List=[]
        this.HighSchool_List=[]
        this.Pooled_List=[]
        this.Undersampled_List=[]
        this.Logistic_List=[]
        this.MasterDetailList=[];
    }

    displayAll(){

            this.searchSummary();
            for (var i=0;i<this.ACT_List.length;++i){
                console.log("Final ACT List"+" "+this.ACT_List[i]);
                console.log("Final Pooled List"+" "+this.Pooled_List[i])
            }

    }

    // Adding a method to the constructor
   searchSummary(){
       const lineByLine = require('n-readlines');
       const liner = new lineByLine('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\past_searches.txt');

        var global_pool=false;
       var line;

       while (line = liner.next()) {
           var temp_line=line.toString('ascii')
           //console.log("Line:"+" "+ temp_line);
           if (temp_line.indexOf("ACT(Input)") >= 0){
               this.ACT_List.push(temp_line)

           }
           if(temp_line.indexOf("highschool(Input)")>=0){
               this.HighSchool_List.push(temp_line)
           }
           if(temp_line.indexOf("GPA(Input)")>=0){
               this.GPA_List.push(temp_line)
           }
           if(temp_line.indexOf("university(Input)")>=0){
               this.University_List.push(temp_line)
           }

           if (temp_line.indexOf("Prediction for Logistic")>=0 && global_pool==false){
               this.Logistic_List.push(temp_line)
           }
           if (temp_line.indexOf("pool-option(Input) pool_highschools")>=0){
               global_pool=true;
               console.log("Push POOLED"+" ")
               this.Pooled_List.push("POOLED")
           }
           if(temp_line.indexOf('UNDERSAMPLE RESULTS')>=0){
               this.Undersampled_List.push("Undersampled")
           }
           if(temp_line.indexOf("Seperation")>=0){
               if (this.Pooled_List.length!=this.ACT_List.length)
               {
                   console.log("different length so pushed NO Pooled")
                   this.Pooled_List.push('NOT-Pooled')

               }
               if(this.Undersampled_List.length!=this.ACT_List.length){
                   this.Undersampled_List.push("")
               }
               global_pool=true;

           }


       }

   }
   searchDetails(text){
       const lineByLine = require('n-readlines');
       const liner = new lineByLine('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\past_searches.txt');
       var detailList=[];
       var global=false;

       var line;
       while(line = liner.next()){

           var temp_line=line.toString('ascii')
           if(temp_line.indexOf("Sample Size")>=0){
                global=true;

           }
           if (global==true){
              // console.log("Inserting"+" "+ temp_line.trim())

                detailList.push(temp_line.trim())
           }
           if(temp_line.indexOf("Seperation")>=0){
                this.MasterDetailList.push(detailList)
                detailList=[];
                global=false;
           }
       }



   }

    sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }



}