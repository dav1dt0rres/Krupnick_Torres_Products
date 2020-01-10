
module.exports= class Student {

    constructor(firstname,lastname, email,id,session) {
        this.firstName = firstname;
        this.lastName=lastname;
        this.email=email;
        this.ID=id;
        this.Session=session;

    }

    // Adding a method to the constructor
    getLastName() {
        return this.lastName;
    }
    recordScore(Res,time){

        this.Time=time;
        this.Response=Res
    }
    recordAnswer(){
        return this.Tag;
    }
    setID(id){
        this.ID=id;
    }

}