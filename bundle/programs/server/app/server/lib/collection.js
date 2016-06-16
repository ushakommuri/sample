(function(){var database = new MongoInternals.RemoteCollectionDriver("mongodb://127.0.0.1:27017/hr_module");
users = new Mongo.Collection("users", { _driver: database });
userinfo = new Mongo.Collection("userinfo", { _driver: database });
province_US = new Mongo.Collection("province_US", { _driver: database });
city = new Mongo.Collection("city", { _driver: database });
industry = new Mongo.Collection("industry", { _driver: database });
requiredskills = new Mongo.Collection("requiredskills", { _driver: database });
softskills = new Mongo.Collection("softskills", { _driver: database });
educationskills = new Mongo.Collection("educationskills", { _driver: database });
certifications = new Mongo.Collection("certifications", { _driver: database });
jobreq = new Mongo.Collection("jobreq", { _driver: database });
recruiters = new Mongo.Collection("recruiters", { _driver: database });
recruitersinfo = new Mongo.Collection("recruitersinfo", { _driver: database });
recruitersSkills = new Mongo.Collection("recruitersSkills", { _driver: database });
recruitersAcceptedJobs = new Mongo.Collection("recruitersAcceptedJobs", { _driver: database });
recruiterNotifications = new Mongo.Collection("recruiterNotifications", { _driver: database });
candidates = new Mongo.Collection("candidates", { _driver: database });
candidateacceptedjobs = new Mongo.Collection("candidateacceptedjobs", { _driver: database });
timeChange = new Mongo.Collection("timechange", { _driver: database });
businessactivity = new Mongo.Collection("businessactivity", { _driver: database });
recruitersactivity = new Mongo.Collection("recruitersactivity", { _driver: database });
candidatesactivity = new Mongo.Collection("candidatesactivity", { _driver: database });
health = new Mongo.Collection("health", { _driver: database });
CustomerService = new Mongo.Collection("CustomerService", { _driver: database });
HumanResources = new Mongo.Collection("HumanResources", { _driver: database });
Adminstrative = new Mongo.Collection("Adminstrative", { _driver: database });
marketing = new Mongo.Collection("marketing", { _driver: database });
Healthcare = new Mongo.Collection("Healthcare", { _driver: database });
Biotech = new Mongo.Collection("Biotech", { _driver: database });
Banking = new Mongo.Collection("Banking", { _driver: database });
AccountingFinance = new Mongo.Collection("AccountingFinance", { _driver: database });
Engineering = new Mongo.Collection("Engineering", { _driver: database });
SalesBizDev = new Mongo.Collection("SalesBizDev", { _driver: database });
IT = new Mongo.Collection("IT", { _driver: database });
jobsavetodraft = new Mongo.Collection("jobsavetodraft", { _driver: database });


/*
 Clear tables on build update for demo.

 db.businessactivity.drop();
 db.candidateacceptedjobs.drop();
 db.candidatejobs.drop();
 db.candidates.drop();
 db.jobreq.drop();
 db.jobsavetodraft.drop();
 db.recruiterNotifications.drop();
 db.recruitersAcceptedJobs.drop();

 db.businessactivity.drop();
 db.recruitersactivity.drop();
 db.candidatesactivity.drop();


 db.recruiters.drop();
 db.recruitersSkills.drop();
 db.recruitersinfo.drop();
 db.userinfo.drop();
 db.users.drop();

 */

})();
