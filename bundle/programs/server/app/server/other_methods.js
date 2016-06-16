(function(){/**
 * Created by raju on 5/8/15.
 */


if (Meteor.isServer) {
    Meteor.methods({
        get_zipcode_data:function get_zipcode_data(zipcode,callback)
        {
            servertraces("other_methods >> get_zipcode_data  >> start","null");
            servertraces("other_methods >> get_zipcode_data  >> check zipcode : "+zipcode);
            var zipcodeDetails = {};
                zipcodeDetails = Zipcodes.lookup(zipcode);
            servertraces("other_methods >> get_zipcode_data  >> zipcode   >>>>> ",zipcodeDetails);
            return zipcodeDetails;
            servertraces("other_methods >> get_zipcode_data  >> end","null");
        },
        add_extra_required_skill:function add_extra_required_skill(extraskillarr,value)
        {
            servertraces("other_methods >> add_extra_required_skill  >> start","null");
            for(var i=0; i<extraskillarr.length; i++)
            {
                var isSkillExist = [];
                if(value == "Adminstrative")
                {
                    isSkillExist = Adminstrative.find({reqskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();
                    servertraces("other_methods >> add_extra_required_skill  >> isSkillExist  : ",isSkillExist);
                    if(isSkillExist.length == 0)
                    {
                        Adminstrative.insert({reqskills_name:extraskillarr[i]});
                    }
                }else if(value == "Banking")
                {
                    isSkillExist = Banking.find({reqskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();
                    servertraces("other_methods >> add_extra_required_skill  >> isSkillExist  : ",isSkillExist);
                    if(isSkillExist.length == 0)
                    {
                        Banking.insert({reqskills_name:extraskillarr[i]});
                    }
                }else if(value == "Customer Service")
                {
                    isSkillExist = CustomerService.find({reqskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();
                    servertraces("other_methods >> add_extra_required_skill  >> isSkillExist  : ",isSkillExist);
                    if(isSkillExist.length == 0)
                    {
                        CustomerService.insert({reqskills_name:extraskillarr[i]});
                    }
                }else if(value == "Marketing")
                {
                    isSkillExist = marketing.find({reqskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();
                    servertraces("other_methods >> add_extra_required_skill  >> isSkillExist  : ",isSkillExist);
                    if(isSkillExist.length == 0)
                    {
                        marketing.insert({reqskills_name:extraskillarr[i]});
                    }
                }else if(value == "Engineering")
                {
                    isSkillExist = Engineering.find({reqskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();
                    servertraces("other_methods >> add_extra_required_skill  >> isSkillExist  : ",isSkillExist);
                    if(isSkillExist.length == 0)
                    {
                        Engineering.insert({reqskills_name:extraskillarr[i]});
                    }
                }else if(value == "Human Resources")
                {

                    isSkillExist = HumanResources.find({reqskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();
                    servertraces("other_methods >> add_extra_required_skill  >> isSkillExist  : ",isSkillExist);
                    if(isSkillExist.length == 0)
                    {
                        HumanResources.insert({reqskills_name:extraskillarr[i]});
                    }

                }else if(value == "Healthcare")
                {
                    isSkillExist = Healthcare.find({reqskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();
                    servertraces("other_methods >> add_extra_required_skill  >> isSkillExist  : ",isSkillExist);
                    if(isSkillExist.length == 0)
                    {
                        Healthcare.insert({reqskills_name:extraskillarr[i]});
                    }
                }else if(value == "Biotech")
                {
                    isSkillExist = Biotech.find({reqskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();
                    servertraces("other_methods >> add_extra_required_skill  >> isSkillExist  : ",isSkillExist);
                    if(isSkillExist.length == 0)
                    {
                        Biotech.insert({reqskills_name:extraskillarr[i]});
                    }
                }else if(value == "Accounting/Finance")
                {
                    isSkillExist = AccountingFinance.find({reqskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();
                    servertraces("other_methods >> add_extra_required_skill  >> isSkillExist  : ",isSkillExist);
                    if(isSkillExist.length == 0)
                    {
                        AccountingFinance.insert({reqskills_name:extraskillarr[i]});
                    }
                }else if(value == "Sales & Biz Dev")
                {
                    isSkillExist = SalesBizDev.find({reqskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();
                    servertraces("other_methods >> add_extra_required_skill  >> isSkillExist  : ",isSkillExist);
                    if(isSkillExist.length == 0)
                    {
                        SalesBizDev.insert({reqskills_name:extraskillarr[i]});
                    }
                }
                else if(value == "IT")
                {
                    isSkillExist = IT.find({reqskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();
                    servertraces("other_methods >> add_extra_required_skill  >> isSkillExist  : ",isSkillExist);
                    if(isSkillExist.length == 0)
                    {
                        IT.insert({reqskills_name:extraskillarr[i]});
                    }
                }
            }
            servertraces("other_methods >> add_extra_required_skill  >> end","null");
        },
        add_extra_soft_skill:function add_extra_soft_skill(extraskillarr)
        {
            servertraces("other_methods >> add_extra_soft_skill  >> start","null");
            for(var i=0; i<extraskillarr.length; i++)
            {
                var isSkillExist = [];
                isSkillExist = softskills.find({softskills_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();

                servertraces("other_methods >> add_extra_soft_skill  >> isSkillExist  : ",isSkillExist);
                if(isSkillExist.length == 0)
                {
                    softskills.insert({softskills_name:extraskillarr[i]});
                }
            }
            servertraces("other_methods >> add_extra_soft_skill  >> end","null");
        },
        add_extra_educational_skill:function add_extra_educational_skill(extraskillarr)
        {
            servertraces("other_methods >> add_extra_educational_skill  >> start","null");
            for(var i=0; i<extraskillarr.length; i++)
            {
                var isSkillExist = [];
                isSkillExist = educationskills.find({education_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();

                servertraces("other_methods >> add_extra_educational_skill  >> isSkillExist  : ",isSkillExist);
                if(isSkillExist.length == 0)
                {
                    educationskills.insert({education_name:extraskillarr[i]});
                }
            }
            servertraces("other_methods >> add_extra_educational_skill  >> end","null");
        },
        add_extra_certifications_skill:function add_extra_certifications_skill(extraskillarr)
        {
            servertraces("other_methods >> add_extra_certifications_skill  >> start","null");
            for(var i=0; i<extraskillarr.length; i++)
            {
                var isSkillExist = [];
                isSkillExist = certifications.find({certification_name:{ $regex: extraskillarr[i], $options: "i" }}).fetch();

                servertraces("other_methods >> add_extra_certifications_skill  >> isSkillExist  : ",isSkillExist);
                if(isSkillExist.length == 0)
                {
                    certifications.insert({certification_name:extraskillarr[i]});
                }
            }
            servertraces("other_methods >> add_extra_certifications_skill  >> end","null");
        }

    });
}

//Publish Functions

//Required skills
Meteor.publish('requiredskill', function(){return requiredskills.find();});

//Soft skills
Meteor.publish('softskills', function(){return softskills.find();});

//Education skills
Meteor.publish('educationskills', function(){return educationskills.find();});

//Certification skills
Meteor.publish('certifications', function(){ return certifications.find();});

//Candidates
Meteor.publish('candidateacceptedjobs', function(){return candidateacceptedjobs.find();});

//Notifications
Meteor.publish('recruiterNotifications', function(email){
    servertraces("other_methods >> recruiterNotifications  >> start","null");
    try{check(email, String)}catch (error){servertraces("other_methods >> recruiterNotifications  >> ERROR IN PUBLISH recruiterNotifications..........")}
    servertraces("other_methods >> recruiterNotifications  >> PUBLISH recruiterNotifications>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",email);

    if((email == "")||(email == undefined)||(email == null))
    {
        return recruiterNotifications.find();
    }
    else
    {
        return recruiterNotifications.find({recuriterEmail:email},{sort: {id: -1}});
    }

    servertraces("other_methods >> recruiterNotifications  >> end","null");
});

//Joblist
Meteor.publish('jobreq', function(){
    servertraces("other_methods >> jobreq  >> start","null");
    /*try{check(email, String)}catch (error){clienttraces("ERROR IN PUBLISH jobreq..........")}
    clienttraces("PUBLISH JOBREQ>>>>>>>>>>>>>>>>>>>>",email,">>>",isAdmin);
    if(isAdmin)
        return jobreq.find({},{sort: {id: -1}});
    else if(email != '')
        return jobreq.find({email:email},{sort: {id: -1}});
    else*/
    //clienttraces("Job request fetch",jobreq.find({},{sort: {id: -1}}).fetch());
    return jobreq.find({},{sort: {id: -1}});
    servertraces("other_methods >> jobreq  >> end","null");
});

//recruitersAcceptedJobs
Meteor.publish('recruitersAcceptedJobs', function(email){
    servertraces("other_methods >> recruitersAcceptedJobs  >> start","null");
    try{check(email, String)}catch (error){servertraces("other_methods >> recruitersAcceptedJobs  >> ERROR IN PUBLISH recruitersAcceptedJobs..........")}
    servertraces("other_methods >> recruitersAcceptedJobs  >> PUBLISH recruitersAcceptedJobs>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",email);
    if(email == "" || email == null)
    {
        servertraces("other_methods >> recruitersAcceptedJobs  >> Without Email",recruitersAcceptedJobs.find({},{sort: {id: -1}}).count());
        return recruitersAcceptedJobs.find({},{sort: {id: -1}});
    }
    else
    {
        servertraces("other_methods >> recruitersAcceptedJobs  >> With Email",recruitersAcceptedJobs.find({},{sort: {id: -1}}).count());
        return recruitersAcceptedJobs.find({email:email},{sort: {id: -1}});
    }
    servertraces("other_methods >> recruitersAcceptedJobs  >> end","null");
});

//jobsavetodraft
Meteor.publish('jobsavetodraft', function(email,isAdmin){
    servertraces("other_methods >> jobsavetodraft  >> start","null");
    try{check(email, String)}catch (error){servertraces("other_methods >> jobsavetodraft  >> ERROR IN PUBLISH jobsavetodraft..........")}
    servertraces("other_methods >> jobsavetodraft  >> PUBLISH jobsavetodraft>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",email);
    if(isAdmin)
        return jobsavetodraft.find({},{sort: {id: -1}});
    else
        return jobsavetodraft.find({email:email},{sort: {id: -1}});
    servertraces("other_methods >> jobsavetodraft  >> end","null");
});
//Category
//Meteor.publish('industry', function(){return industry.find({industry_name:industry_name});});

Meteor.publish('industry', function(industry_name){
    servertraces("other_methods >> industry  >> start","null");
    try{check(industry_name, String)}catch (error){servertraces("other_methods >> industry  >> ERROR IN PUBLISH Industry..........")}
    servertraces("other_methods >> industry  >> PUBLISH Industry >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",industry_name);
    return industry.find({industry:industry_name},{sort: {id: -1}});
    servertraces("other_methods >> industry  >> end","null");
});

//BusinessActivity
Meteor.publish('businessactivity', function(){return businessactivity.find();});
//RecruitersActivity
Meteor.publish('recruitersactivity', function(){return recruitersactivity.find();});
//CandidatesActivity
Meteor.publish('candidatesactivity', function(){return candidatesactivity.find();});
//Recruiters
Meteor.publish('recruiters', function(){return recruiters.find();});
//RecruitersInfo
Meteor.publish('recruitersinfo', function(){return recruitersinfo.find();});
//Candidates
Meteor.publish('candidates', function(){return candidates.find();});
//users
Meteor.publish('users', function(){return users.find();});
//userinfo
Meteor.publish('userinfo', function(){return userinfo.find();});


//recruitersAcceptedJobs
Meteor.publish('recruiters_AcceptedJobs', function(){return recruitersAcceptedJobs.find();});

})();
