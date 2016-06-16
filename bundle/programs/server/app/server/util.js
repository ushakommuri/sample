(function(){

if (Meteor.isServer)
{
    servertraces('util >> Server startup');
    //Niharika
     process.env.MAIL_URL = 'smtp://postmaster@sandboxceb830a3a05449088b3be4e1e3645b03.mailgun.org:8ddeec0bf087e0fa55c7edbce0bae1ce@smtp.mailgun.org:587';
    //process.env.MAIL_URL = 'smtp://postmaster@sandboxfecdda28307b49348935fbae2aceebc9.mailgun.org:b4aa06d1a688fbe9605fca1899728bf2@smtp.mailgun.org:587';
    //process.env.MAIL_URL = 'smtp://postmaster@sandbox657d6a4d90814974a907a50c55e1e334.mailgun.org:942776600d2e763c5c71e9ca2d990f8a@smtp.mailgun.org:587';

    SyncedCron.start();
    SyncedCron.add({
        name: 'Query the scheduled emails and send if necessary.',
        schedule: function(parser)
        {
            return parser.text("every 1 mins");
        },
        job: function()
        {
            servertraces("util >> job  >> start","null");
            var jobNotifi = [];
            jobNotifi = jobreq.find({}).fetch();

            /*START : Stop the job if time completes.*/
            for(var v= 0;v<jobNotifi.length;v++)
            {
                servertraces("util >> job  >> >>>>>>>&&&&&&&&&&&&&*************************"+jobNotifi[v].title);
                servertraces("util >> job  >> >>>>>>>&&&&&&&&&&&&&*************************",jobNotifi[v].status);

                if(jobNotifi[v].status == stopped)
                {

                }
                else
                {
                    var campaignends = '';
                    /*campaignends = jobNotifi[v].campaignends;*/
                    var fulldtcampaignends = jobNotifi[v].campaignends;

                    var hours = fulldtcampaignends.getHours();
                    var minutes = fulldtcampaignends.getMinutes();
                    var date = fulldtcampaignends.getDate();
                    var month =fulldtcampaignends.getMonth()+1;
                    month = month<10?"0"+month:month;
                    date = date<10?"0"+date:date;
                    minutes = minutes<10?"0"+minutes:minutes;
                    hours = hours<10?"0"+hours:hours;

                    campaignends = date+"/"+month+"/"+fulldtcampaignends.getFullYear()+" "+hours+":"+minutes;
                    //servertraces(campaignends);

                    var campaignendsdate ='';
                    if(campaignends != undefined)
                    {
                        campaignendsdate = campaignends.split(' ');;
                    }

                    var date = new Date();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    minutes = minutes<10?"0"+minutes:minutes;
                    hours = hours<10?"0"+hours:hours;
                    var newdate = hours+":"+minutes;


                    var currentMonth = ('0' + (date.getMonth()+1)).slice(-2);
                    var currentDate = ('0' + date.getDate()).slice(-2);
                    var datenew = campaignendsdate[0].split('/');


                    if(currentMonth == datenew[1])
                    {
                        if (currentDate == datenew[0])
                        {
                            if (newdate == campaignendsdate[1])
                            {
                                var status = jobreq.update({id: jobNotifi[v].id}, {$set: {status: stopped}});
                                var status = recruitersAcceptedJobs.update({id: jobNotifi[v].id}, {$set: {status: stopped}},{multi:true});
                                var status = recruiterNotifications.update({jobID: jobNotifi[v].id}, {$set: {jobstatus: stopped}},{multi:true});

                                var recaccepted = recruitersAcceptedJobs.find({id: jobNotifi[v].id}).fetch();

                                for(var l = 0;l<recaccepted.length;l++)
                                {
                                    var recid = recruiters.find({email:recaccepted[l].email}).fetch();
                                    var rec_activity = recruitersactivity.insert({businessuserid:Number(jobNotifi[v].businessuserid),jobid:Number(jobNotifi[v].id),recuriterid:recid[0].id,status:campaginStoped,date:date,business:"true",recruiter:"true"});

                                    var options=
                                    {
                                        to:recaccepted[l].email,
                                        from: "zrn@zigatta.com",
                                        subject:"Campaign for "+ jobNotifi[v].position+" just ended",
                                        html:'<div style="background-color: #D7D7D7;padding:15px;width: 70%;margin-left: 14%;"><div style="background-color: #ffffff;padding:10px;"><img src="'+url+'images/logo_Z_zigatta_azul_transparente.png" id="logoclick" style="cursor: pointer;margin-left:15px" width="140"/><br/>Thank you for participating in the campaign. This role is now closed. You will be notified if it is reopened</div></div></div>'
                                    };
                                    Email.send(options);
                                }

                                var candidates = candidateacceptedjobs.find({jobid:jobNotifi[v].id}).fetch()

                                if(candidates.length <= 0)
                                {
                                    var options=
                                    {
                                        to:jobNotifi[v].email,
                                        from: "zrn@zigatta.com",
                                        subject:"Campaign for "+ jobNotifi[v].position+" just ended",
                                        html:'<div style="background-color: #D7D7D7;padding:15px;width: 70%;margin-left: 14%;"><div style="background-color: #ffffff;padding:10px;"><img src="'+url+'images/logo_Z_zigatta_azul_transparente.png" id="logoclick" style="cursor: pointer;margin-left:15px" width="140"/><br/>Your campaign for '+ jobNotifi[v].position +' has ended. Please review all candidates submitted below. Campaign can be restarted if needed.</div></div></div>'
                                    };
                                    Email.send(options);
                                }

                                var date =new Date();
                                var business_activity = businessactivity.insert({businessuserid:Number(jobNotifi[v].businessuserid),jobid:Number(jobNotifi[v].id),status:campaginStoped,date:date,business:"true",recruiter:"true"});

                            }
                        }
                    }
                }
            }
            /*END : Stop the job if time completes.*/

            for(var i= 0;i<jobNotifi.length;i++)
            {
                if (jobNotifi[i].status == stopped || jobNotifi[i].status == closedJob)
                {

                }
                else
                {

                    var campaignstarts = '';
                    /*campaignstarts = jobNotifi[i].campaignstarts;*/
                    var fulldtcampaignstarts = jobNotifi[i].campaignstarts;

                    var hours = fulldtcampaignstarts.getHours();
                    var minutes = fulldtcampaignstarts.getMinutes();
                    var date = fulldtcampaignstarts.getDate();
                    var month =fulldtcampaignstarts.getMonth()+1;
                    month = month<10?"0"+month:month;
                    date = date<10?"0"+date:date;
                    minutes = minutes<10?"0"+minutes:minutes;
                    hours = hours<10?"0"+hours:hours;

                    campaignstarts = date+"/"+month+"/"+fulldtcampaignstarts.getFullYear()+" "+hours+":"+minutes;
                    servertraces("util >> job  >> campaignstarts>>>>>>>>>>>"+campaignstarts);

                    var campaignstartsdate ='';
                    if(campaignstarts != undefined)
                    {
                        campaignstartsdate = campaignstarts.split(' ');
                    }

                    var date = new Date();
                    servertraces("util >> job  >> date>>>>>>>>>>>"+date);

                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    minutes = minutes<10?"0"+minutes:minutes;
                    hours = hours<10?"0"+hours:hours;
                    var newdate = hours+":"+minutes;

                    var currentMonth = ('0' + (date.getMonth()+1)).slice(-2);
                    var currentDate = ('0' + date.getDate()).slice(-2);
                    var datenew = campaignstartsdate[0].split('/');

                    servertraces("util >> job  >> currentMonth>>>>>>>>>>>"+currentMonth);
                    servertraces("util >> job  >> currentDate>>>>>>>>>>>"+currentDate);
                    servertraces("util >> job  >> newdate>>>>>>>>>>>"+newdate);
                    servertraces("util >> job  >> datenew[1]>>>>>>>>>>>"+datenew[1]);
                    servertraces("util >> job  >> datenew[0]>>>>>>>>>>>"+datenew[0]);
                    servertraces("util >> job  >> campaignstartsdate[1]>>>>>>>>>>>"+campaignstartsdate[1]);

                    if(currentMonth == datenew[1])
                    {
                        servertraces("success Month >>>>>>>>>>>>>>>>>>>>",jobNotifi[i].title);
                        if (currentDate == datenew[0])
                        {
                            servertraces("success Date >>>>>>>>>>>>>>>>>>>>",jobNotifi[i].title);
                            if (newdate == campaignstartsdate[1])
                            {

                                servertraces("success newdate >>>>>>>>>>>>>>>>>>>>",jobNotifi[i].title);
                                var rec= [];

                                //If no recruiter is subscribed to specific Job Send mail to all recruiters.
                                if(rec.length == 0)
                                    rec= recruiters.find({}).fetch();


                                for(var j =0;j< rec.length;j++)
                                {

                                    var recinfo = [];
                                    recinfo = recruitersinfo.find({email: rec[j].email}).fetch();

                                    var recskills = [];
                                    var query = [];
                                    var query1 = [];
                                    query.push({industryData: {$regex: jobNotifi[i].industry, $options: "i"}});
                                    var requiredskillsObj = jobNotifi[i].requiredskill;
                                    for (var p = 0; p < requiredskillsObj.length; p++) {
                                        //servertraces("requiredskillsObj : ",requiredskillsObj[p].requiredskill);
                                        query1.push({
                                            requiredSkillData: {
                                                $regex: requiredskillsObj[p].requiredskill,
                                                $options: "i"
                                            }
                                        });
                                    }
                                    query.push({"$or": query1})
                                    query.push({email: rec[j].email});
                                    //servertraces(query);
                                    recskills = recruitersSkills.find({"$and": query}).fetch();
                                    //recskills = recruitersSkills.find({"$and" : [ { industryData: { $regex: jobNotifi[i].industry, $options: "i" } },{ requiredSkillData: { $regex: jobNotifi[i].requiredskill, $options: "i" } },{email:rec[j].email} ]} ).fetch();

                                    //servertraces(">>>>>>>>>>>recskills<<<<<<<<<<<<");
                                    //servertraces(recskills);
                                    //servertraces(">>>>>>>>>>>recskills<<<<<<<<<<<<");
                                    //Remove already sent notification email
                                    var filter_recskills = [];
                                    if (recskills.length > 0)
                                    {
                                        var skillsdata = '';
                                        for(var s = 0;s<jobNotifi[i].requiredskill.length;s++)
                                        {

                                            skillsdata = skillsdata+"<tr><td>Skill : "+ jobNotifi[i].requiredskill[s].requiredskill +"</td></tr>"+"<tr><td>Experience : "+ jobNotifi[i].requiredskill[s].requiredskillexp +"</td></tr>";
                                        }

                                        var jobdetails = [];

                                        jobdetails = recruitersactivity.find({jobid:Number(jobNotifi[i].id),recuriterid: Number(rec[j].id)}).fetch();

                                        if(jobdetails.length == 0)
                                        {
                                            var rec_activity = recruitersactivity.insert({
                                                businessuserid: Number(jobNotifi[i].businessuserid),
                                                jobid: Number(jobNotifi[i].id),
                                                recuriterid: rec[j].id,
                                                status: campaignStarted,
                                                date: date,
                                                business: "true",
                                                recruiter: "true"
                                            });
                                        }
                                    }

                                }

                                var jobcreateddate;
                                var jobcampaignstartsdate

                                jobcreateddate = jobNotifi[i].createddate;
                                jobcampaignstartsdate = jobNotifi[i].campaignstarts;

                                //jobcreateddate = new Date(convertDate_TimeZone(jobcreateddate));
                                jobcreateddate = (jobcreateddate);
                                //jobcampaignstartsdate = new Date(convertDate_TimeZone(jobcampaignstartsdate));
                                jobcampaignstartsdate = (jobcampaignstartsdate);

                                servertraces("util >> job  >> >>>jobcampaignstartsdate<<<", jobcreateddate);
                                servertraces("util >> job  >> >>>jobcampaignstartsdate<<<",jobcampaignstartsdate);

                                var ismailsending = diff_dates(jobcampaignstartsdate,jobcreateddate);


                                //ToDo :  Convert time to recruiter Time Zone.
                                var campaginstarts = jobNotifi[i].campaignstarts;
                                var campaginends = jobNotifi[i].campaignends;

                                var skillsdata = '';
                                for(var s = 0;s<jobNotifi[i].requiredskill.length;s++)
                                {
                                    //skillsdata = skillsdata+"<tr><td>Skill : "+ jobNotifi[i].requiredskill[s].requiredskill +"</td></tr>"+"<tr><td>Experience : "+ jobNotifi[i].requiredskill[s].requiredskillexp +"</td></tr>";
                                    skillsdata = skillsdata+"<tr><td>"+ jobNotifi[i].requiredskill[s].requiredskill +"("+jobNotifi[i].requiredskill[s].requiredskillexp+")"+"</td></tr>";
                                }

                                var date = new Date();
                                var jobdetails =[];
                                jobdetails = businessactivity.find({jobid:Number(jobNotifi[i].id)}).fetch();

                                if(jobdetails.length == 0)
                                {
                                    var business_activity = businessactivity.insert({businessuserid:Number(jobNotifi[i].businessuserid),jobid:Number(jobNotifi[i].id),status:campaignStarted,date:date,business:"true",recruiter:"true"});
                                }

                                if(ismailsending)
                                {
                                    var options=
                                    {
                                        to:jobNotifi[i].email,
                                        from: "zrn@zigatta.com",
                                        subject:"Campaign started for "+jobNotifi[i].position,
                                        html:'<div style="background-color: #D7D7D7;padding:15px;width: 70%;margin-left: 14%;"><div style="background-color: #ffffff;padding:10px;"><img src="'+url+'images/logo_Z_zigatta_azul_transparente.png" id="logoclick" style="cursor: pointer;margin-left:15px" width="140"/><div style="background:#86A05C;color:#ffffff;padding:10px 10px;text-decoration:none;margin-left: 15px;margin-right: 15px;font-size: 15px;">Campaign Started, mail sent to all Recruiters for the position of '+jobNotifi[i].position+'</div><div style="display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;flex-direction: row;"><div  style="font-size: 14px;line-height: 28px;width:100%;"><div style="margin-right: 15px;margin-left: 15px;display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;flex-direction: row;"><div style="background-color: #C5C5C5;width: 100%;"><div style="padding: 10px;"><label class="titlecls">'+jobNotifi[i].title+'</label></div></div></div><div><div style="margin-right: 15px;display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;flex-direction: row;"><div style="position: relative;min-height: 1px;width: 100%;padding-left: 15px;float: left;margin-left: -15px;border-right: 1px solid #E9E9E9;"><div class="box-shade-1" style="background: #DFDFDE; padding: 15px;"><div style="margin-top: -20px;padding:10px;"><h4 style="margin: 0px auto;">Description</h4><div style="text-align: justify;"><span> '+jobNotifi[i].jobdesc+'</span></div></div></div><div class="box-shade-2" style="background: #D5D5D5;margin-bottom: -45px;padding-top: 1px;padding-left: 15px;margin-top: 1px;border-top: 1px solid #E9E9E9;"><div style="padding:10px;"><h4 style="margin: 0px auto;">Location</h4> <div class="col-md-12" style="width:100%"><div  class="col-md-6" style="float: left;"><label>State :</label></div><div class="col-md-6" >'+jobNotifi[i].state+'</div></div><div class="col-md-12" style="width:100%"><div class="col-md-6" style="float: left;"><label>City :</label></div><div class="col-md-6" >'+jobNotifi[i].city+'</div></div><div class="col-md-12" style="width:100%"><div class="col-md-6" style="float: left;"><label>Zipcode :</label></div><div class="col-md-6" >'+jobNotifi[i].zipcode+'</div></div></div></div><div class="box-shade-2" style="background: #DFDFDE;height: 70px;padding-top: 1px;padding-left: 15px;margin-top: 1px;border-top: 1px solid #E9E9E9;"><div style="padding:10px;"><div class="col-md-12" style="width:100%"><div  class="col-md-6" style="float: left;"><label>Category :</label></div><div class="col-md-6" >'+jobNotifi[i].industry+'</div></div><div class="col-md-12" style="width:100%"><div class="col-md-6" style="float: left;"><label>Position Type :</label></div><div class="col-md-6" >'+jobNotifi[i].type+'</div></div></div></div><div class="box-shade-2" style="background: #D5D5D5;height: 68px;padding-top: 1px;padding-left: 15px;margin-top: 1px;border-top: 1px solid #E9E9E9;"><div style="padding:10px;"><div class="col-md-12" style="width:100%"><div class="col-md-6" style="float: left;"><label>Campaign Starts :</label></div><div class="col-md-6" >'+campaignstarts+'</div></div><div class="col-md-12" style="width:100%"><div class="col-md-6" style="float: left;"><label>Campaign Ends :</label></div><div class="col-md-6" >'+campaignends+'</div></div></div></div><div class="box-shade-3" style="background: #DFDFDE;min-height:68px;padding-top:1px;padding-left:15px;margin-top:1px;border-top:1px solid #e9e9e9"><div class="col-md-12"><div class="col-md-12" style="padding: 10px;"><h4 style="margin:0px auto;">Required Skills</h4><div>'+skillsdata+'</div></div></div></div></div></div></div></div></div><div style = "margin-left:15px;margin-top:2%;"><a href="'+url+'#/job_detailed_information/'+jobNotifi[i].id+'" style="background:#02A7E7;color:#ffffff;padding:5px 10px;text-decoration:none;border-radius:3px">Click here to view job details </a></div>'
                                    };
                                    Email.send(options);
                                }

                            }
                        }
                    }

                }
            }

            for(var i= 0;i<jobNotifi.length;i++)
            {
                if(jobNotifi[i].status == stopped || jobNotifi[i].status == closedJob)
                {

                }
                else
                {
                    var campaignstarts = '';
                    /*campaignstarts = jobNotifi[i].campaignstarts;*/
                    var fulldtcampaignstarts = jobNotifi[i].campaignstarts;

                    var hours = fulldtcampaignstarts.getHours();
                    var minutes = fulldtcampaignstarts.getMinutes();
                    var date = fulldtcampaignstarts.getDate();
                    var month =fulldtcampaignstarts.getMonth()+1;
                    month = month<10?"0"+month:month;
                    date = date<10?"0"+date:date;
                    minutes = minutes<10?"0"+minutes:minutes;
                    hours = hours<10?"0"+hours:hours;

                    campaignstarts = date+"/"+month+"/"+fulldtcampaignstarts.getFullYear()+" "+hours+":"+minutes;
                    //servertraces("campaignstarts>>>>>>>>>>>"+campaignstarts);

                    var campaignstartsdate ='';
                    if(campaignstarts != undefined)
                    {
                        campaignstartsdate = campaignstarts.split(' ');
                    }

                    var date = new Date();
                    //servertraces("date>>>>>>>>>>>"+date);

                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    minutes = minutes<10?"0"+minutes:minutes;
                    hours = hours<10?"0"+hours:hours;
                    //var newdate = hours+":"+minutes;
                    var currentTime = hours+":"+minutes;

                    var currentMonth = ('0' + (date.getMonth()+1)).slice(-2);
                    var currentDate = ('0' + date.getDate()).slice(-2);
                    var datenew = campaignstartsdate[0].split('/');

                    servertraces("util >> job  >> currentMonth>>>>>>"+currentMonth);
                    servertraces("util >> job  >> currentMonth>>>>>>"+datenew[1]);
                    servertraces("util >> job  >> currentMonth>>>>>>"+currentDate);
                    servertraces("util >> job  >> currentMonth>>>>>>",datenew[0]);
                    servertraces("util >> job  >> "+campaignstartsdate[1]);
                    servertraces("util >> job  >> "+currentTime);


                    var time = campaignstartsdate[1].split(':');
                    var datetime = campaignstartsdate[0].split('/');
                    var newdate = datetime[2]+"/"+datetime[1]+"/"+datetime[0]+" "+time[0]+":"+time[1];


                    var checkdate = new Date(newdate);
                    //servertraces("date>>>",date,"checkdate>>>",checkdate,campaignstartsdate[0],campaignstartsdate[1]);

                    if(date > checkdate)
                    {
                        //servertraces("checking datetime in dates");
                        //servertraces("???????????????*************&&&&&&&&&&&&&&&&&&&&::",date,checkdate,jobNotifi[i].status);

                        if(jobNotifi[i].status == restarted)
                        {
                            servertraces("util >> job  >> success >>> chnaged to >>>>::started",jobNotifi[i].status);
                            servertraces("util >> job  >> success >>> chnaged to >>>>::started",jobNotifi[i].id);
                            var job = jobreq.update({id:Number(jobNotifi[i].id)},{$set:{status:startedJob}});
                            var recruitersapp= recruitersAcceptedJobs.update({id:Number(jobNotifi[i].id)},{$set:{status:startedJob}});
                        }
                    }

                    if(currentMonth >= datenew[1])
                    {
                        if(currentDate >= datenew[0])
                        {
                            //if(newdate >= campaignstartsdate[1]) //Changed by raju
                            if(currentTime >= campaignstartsdate[1])
                            {
                                servertraces("util >> job  >> success",jobNotifi[i].status);
                                servertraces("util >> job  >> ::>>title>>::",jobNotifi[i].title );
                                var rec= [];
                                //If no recruiter is subscribed to specific Job Send mail to all recruiters.
                                if(rec.length == 0)
                                    rec= recruiters.find({}).fetch();



                                for(var j =0;j< rec.length;j++)
                                {
                                    var recinfo = [];
                                    recinfo = recruitersinfo.find({ email:rec[j].email }).fetch();

                                    var recskills = [];
                                    var industry;
                                    var requiredskill = [];
                                    industry = jobNotifi[i].industry
                                    var requiredskillsObj = jobNotifi[i].requiredskill;
                                    for(var p=0; p<requiredskillsObj.length; p++)
                                    {
                                        requiredskill.push(requiredskillsObj[p].requiredskill);
                                    }

                                    recskills = recruitersSkills.find({email:rec[j].email}).fetch();
                                    var skillarr = [];
                                    var skillsmatched = false;
                                if(recskills.length >= 1)
                                {
                                   //console.log("recskills>>>>>>>>>>>>>>>",recskills)
                                    for(var z=0;z<recskills[0].requiredSkillData.length;z++)
                                    {
                                        var obj = recskills[0].requiredSkillData[z];

                                        var skillsAry = [];
                                       // console.log(industry,"================",obj.category,"=======================",rec[j].email);
                                        /*var value;
                                        if(industry == "Customer Service")
                                        {
                                            value = "CustomerService";
                                        }else if(industry == "Human Resources")
                                        {
                                            value = "HumanResources"
                                        }else if(industry == "Sales & Biz Dev")
                                        {
                                            value = "SalesBizDev"
                                        }else{
                                            value = industry;
                                        }*/
                                        //console.log(value,"================",obj.category,"=======================",rec[j].email);
                                        if(industry == obj.category)
                                        {
                                           // console.log("=============obj===skilll===========",obj.skill,"=======================",rec[j].email)
                                            skillsAry = obj.skill;
                                            if(skillsAry.length > 0)
                                            {

                                                for(var x=0;x<skillsAry.length;x++)
                                                {

                                                    for(var y=0;y<requiredskill.length;y++)
                                                    {
                                                        //console.log(skillsAry[x],"================skilll===========",requiredskill[y],"=======================",rec[j].email)
                                                        if(skillsAry[x] == requiredskill[y])
                                                        {
                                                           // console.log("query testing>>recskills")

                                                            skillsmatched = true;
                                                        }
                                                        if(skillsmatched)
                                                        {
                                                            break;
                                                        }
                                                    }
                                                    if(skillsmatched)
                                                    {
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        if(skillsmatched)
                                        {
                                            break;
                                        }
                                    }
                                }
                                    //console.log(recskills,"query testing>>recskills")
                                    //recskills = recruitersSkills.find({"$and" : [ { industryData: { $regex: jobNotifi[i].industry, $options: "i" } },{ requiredSkillData: { $regex: jobNotifi[i].requiredskill, $options: "i" } },{email:rec[j].email} ]} ).fetch();

                                    //servertraces(">>>>>>>>>>>recskills<<<<<<<<<<<<");
                                    //servertraces(recskills);
                                    // servertraces(">>>>>>>>>>>recskills<<<<<<<<<<<<");
                                    //Remove already sent notification email
                                    var filter_recskills = [];
                                   //console.log(skillsmatched,"============",recskills.length)
                                    if(skillsmatched && recskills.length >= 1)
                                    {

                                        for(var k =0;k< recskills.length;k++)
                                        {
                                            var recskills_notification = [];
                                            //servertraces("jobid >> ",jobNotifi[i].id);
                                            recskills_notification = recruiterNotifications.find({"$and" : [{recuriterEmail:recskills[0].email},{jobID:jobNotifi[i].id}]}).fetch();
                                            //servertraces("recskills_notification >> ",recskills_notification);
                                            if(recskills_notification.length == 0)
                                            {
                                                filter_recskills.push(recskills[k]);
                                            }
                                        }

                                        recskills = filter_recskills;
                                    }

                                    var commision = 0;
                                    var admincommission = 0;
                                    var candidatecommission = 0;

                                    var commisionto = 0;
                                    var admincommissionto = 0;
                                    var candidatecommissionto = 0;

                                    var commision = '';
                                    if(jobNotifi[i].type == "Full Time")
                                    {
                                        admincommission = (Number(jobNotifi[i].salfrom)*10)/100;
                                        commision = (Number(admincommission)*50)/100;
                                        candidatecommission = (Number(jobNotifi[i].salfrom)) - admincommission;

                                        admincommissionto = (Number(jobNotifi[i].salto)*10)/100;
                                        commisionto = (Number(admincommissionto)*50)/100;
                                        candidatecommissionto = (Number(jobNotifi[i].salto)) - admincommissionto;

                                        commision =  "upto $"+ commisionto;
                                        candidatecommission =  "upto $"+ candidatecommissionto;

                                    }
                                    else if(jobNotifi[i].type == "Part Time")
                                    {
                                        admincommission = ((Number(jobNotifi[i].perhrfrom) * Number(jobNotifi[i].contractlen) * 22 * 8)*50)/100;
                                        commision = ((admincommission)*50)/100;
                                        candidatecommission = (Number(jobNotifi[i].perhrfrom) * Number(jobNotifi[i].contractlen) * 22 * 8) - admincommission;

                                        admincommissionto = ((Number(jobNotifi[i].perhrto) * Number(jobNotifi[i].contractlen) * 22 * 8)*50)/100;
                                        commisionto = ((admincommissionto)*50)/100;
                                        candidatecommissionto = (Number(jobNotifi[i].perhrto) * Number(jobNotifi[i].contractlen) * 22 * 8) - admincommissionto;

                                        commision = "upto $"+ commisionto;
                                        candidatecommission =  "upto $"+ candidatecommissionto;

                                    }
                                    else if(jobNotifi[i].type == "Contract")
                                    {
                                        admincommission = ((Number(jobNotifi[i].perhrfrom) * Number(jobNotifi[i].contractfrom) * 22 * 8)*50)/100;
                                        commision = ((admincommission)*50)/100;
                                        candidatecommission = (Number(jobNotifi[i].perhrfrom) * Number(jobNotifi[i].contractfrom) * 22 * 8) - admincommission;

                                        admincommissionto = ((Number(jobNotifi[i].perhrto) * Number(jobNotifi[i].contractfrom) * 22 * 8)*50)/100;
                                        commisionto = ((admincommissionto)*50)/100;
                                        candidatecommissionto = (Number(jobNotifi[i].perhrto) * Number(jobNotifi[i].contractfrom) * 22 * 8) - admincommissionto;

                                        commision =  "upto $"+ commisionto;
                                        candidatecommission =  "upto $"+ candidatecommissionto;

                                    }
                                    else
                                    {
                                        admincommission = ((Number(jobNotifi[i].perhrfrom) * Number(jobNotifi[i].contractfrom) * 22 * 8)*50)/100;
                                        commision = ((admincommission)*50)/100;
                                        candidatecommission = (Number(jobNotifi[i].perhrfrom) * Number(jobNotifi[i].contractfrom) * 22 * 8) - admincommission;

                                        admincommissionto = ((Number(jobNotifi[i].perhrto) * Number(jobNotifi[i].contractfrom) * 22 * 8)*50)/100;
                                        commisionto = ((admincommissionto)*50)/100;
                                        candidatecommissionto = (Number(jobNotifi[i].perhrto) * Number(jobNotifi[i].contractfrom) * 22 * 8) - admincommissionto;

                                        commision = "upto $"+ commisionto;
                                        candidatecommission =  "upto $"+ candidatecommissionto;

                                    }
                                        if(skillsmatched && recskills.length >= 1)
                                        {
                                            if((recskills[0].checkvacation == false)||(recskills[0].checkvacation == "false"))
                                            {
                                                var businessdetails = [];
                                                businessdetails = userinfo.find({ email:jobNotifi[i].email }).fetch();

                                                var jobdata = url+"#/"+jobNotifi[i].id;
                                                //var message = businessdetails[0].companyname+" is looking for "+jobNotifi[i].position+", you have a very good opportunity to earn $"+commision+" by submitting candidates for this job req.";
                                                var message = "We are looking for a "+jobNotifi[i].position+", You can earn "+commision+" for referring candidates through your network. Refer now! ";

                                                if(recinfo[0].notification == "Both")
                                                {

                                                    var accountSid = 'ACf1d20e0a7577e64817516e60bf2a2355';
                                                    var authToken = 'b829195da1f72dbb82eba93375126cd8';
                                                    twilio = Twilio(accountSid, authToken); //this appears to be the issue

                                                    twilio.sendSms({
                                                            to:recinfo[0].contactno,
                                                            from: '+12013451117',
                                                            body: message
                                                        },
                                                        function(err, responseData)
                                                        {
                                                            if (!err)
                                                            {
                                                                servertraces("util >> job  >> ",err)
                                                                servertraces("util >> job  >> ",responseData.to);
                                                                servertraces("util >> job  >> ",responseData.from); // outputs "+14506667788"
                                                                servertraces("util >> job  >> ",responseData.body); // outputs "word to your mother."
                                                            }
                                                            else
                                                            {
                                                                servertraces(err)
                                                            }
                                                        });

                                                        var options=
                                                        {
                                                            to:rec[j].email,
                                                            from: "zrn@zigatta.com",
                                                            //from: "dileepp@swingwind.com",
                                                            subject:"We are looking for "+jobNotifi[i].position,
                                                            html:'<div style="background-color: #D7D7D7;padding:15px;width: 70%;margin-left: 14%;"><div style="background-color: #ffffff;padding:10px;"><img src="'+url+'images/logo_Z_zigatta_azul_transparente.png" id="logoclick" style="cursor: pointer;margin-left:15px" width="140"/><div style="display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;flex-direction: row;padding-left:15px;">'+message+'</div><div style = "margin-left:15px;margin-top:2%;"><a href="'+jobdata+'" style="background:#02A7E7;color:#ffffff;padding:5px 10px;text-decoration:none;border-radius:3px"> &nbsp;Click here to get more details.</a></div>'

                                                        };
                                                        try{Email.send(options)}catch (error){servertraces("util >> job  >> EMAIL ERROR 404")};

                                                }
                                                else if(recinfo[0].notification == "Sms")
                                                {
                                                    var accountSid = 'ACf1d20e0a7577e64817516e60bf2a2355';
                                                    var authToken = 'b829195da1f72dbb82eba93375126cd8';
                                                    twilio = Twilio(accountSid, authToken); //this appears to be the issue

                                                    twilio.sendSms({
                                                            to:recinfo[0].contactno,
                                                            from: '+12013451117',
                                                            body: message
                                                        },
                                                        function(err, responseData)
                                                        {
                                                            if (!err)
                                                            {
                                                                servertraces(err)
                                                                servertraces(responseData.from); // outputs "+14506667788"
                                                                servertraces(responseData.body); // outputs "word to your mother."
                                                            }
                                                            else
                                                            {
                                                                servertraces(err)
                                                            }
                                                        });
                                                }
                                                else if(recinfo[0].notification == "Email")
                                                {
                                                    var options=
                                                    {
                                                        to:rec[j].email,
                                                        from: "zrn@zigatta.com",
                                                        //from: "dileepp@swingwind.com",
                                                        subject:"We are looking for "+jobNotifi[i].position,
                                                        //html:message+"<br/><h4><a href='"+jobdata+"' taget='_blank'>Campaign started would like to join.</a></h4>"
                                                        html:'<div style="background-color: #D7D7D7;padding:15px;width: 70%;margin-left: 14%;"><div style="background-color: #ffffff;padding:10px;"><img src="'+url+'images/logo_Z_zigatta_azul_transparente.png" id="logoclick" style="cursor: pointer;margin-left:15px" width="140"/><div style="display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;flex-direction: row;padding-left:15px;">'+message+'</div><div style = "margin-left:15px;margin-top:2%;"><a href="'+jobdata+'" style="background:#02A7E7;color:#ffffff;padding:5px 10px;text-decoration:none;border-radius:3px"> &nbsp;Click here to get more details.</a></div>'
                                                    };
                                                    try{Email.send(options)}catch (error){servertraces("EMAIL ERROR 404")};
                                                }
                                                try
                                                {
                                                    var currentId = recruiterNotifications.findOne({}, {sort: {id: -1}}).id || 1;
                                                    var uid = currentId + 1;
                                                }
                                                catch(error)
                                                {
                                                    var uid = 1;
                                                }

                                                var date = new Date();
                                                var tzone = getTimezoneName();
                                                var createddate = moment(date).tz(tzone)._i;

                                                var pro =
                                                {
                                                    id:uid,
                                                    recuriterEmail:rec[j].email,
                                                    jobID:jobNotifi[i].id,
                                                    companyName:businessdetails[0].companyname,
                                                    title:jobNotifi[i].position,
                                                    commision:commision,
                                                    viewed:"new",
                                                    status:'',
                                                    jobstatus:startedJob,
                                                    createddate:createddate
                                                }
                                                recruiterNotifications.insert(pro);

                                                if((jobNotifi[i].status == notStarted)||(jobNotifi[i].status == restarted))
                                                {
                                                    var status = jobreq.update({id:Number(jobNotifi[i].id)},{$set:{status:startedJob,candidatecommission:candidatecommission,reccommision:commision,admincommission:admincommission}});
                                                }
                                            }
                                        }
                                        else
                                        {
                                            servertraces("util >> job  >>  No recuriters found for this job ");
                                            if((jobNotifi[i].status == notStarted)||(jobNotifi[i].status == restarted))
                                            {
                                                var status = jobreq.update({id:Number(jobNotifi[i].id)},{$set:{status:startedJob,candidatecommission:candidatecommission,reccommision:commision,admincommission:admincommission}});
                                            }
                                        }
                                }
                            }
                            else
                            {
                                servertraces("util >> job  >> fail");
                            }
                        }
                    }
                }
            }
            servertraces("util >> job  >> end","null");
        }
    });
    convertDate_TimeZone = function(dt)
    {
        servertraces("util >> convertDate_TimeZone  >> start","null");
        servertraces("util >> convertDate_TimeZone  >> dt : ",dt);
        var tzone = getTimezoneName();
        var date = dt;
        var finalDate = moment(date).tz(tzone).format('MM/DD/YYYY HH:mm');
        servertraces("util >> convertDate_TimeZone  >> finalDate : ",finalDate);
        return finalDate;
        servertraces("util >> convertDate_TimeZone  >> end","null");
    }
    dateconversion = function(date)  //DD-MM-YYYY
    {
        servertraces("util >> dateconversion  >> start","null");
        servertraces("util >> dateconversion  >> date>>::",date);
        var datesplit = date.split(' ');
        var time = datesplit[1].split(':');
        var datetime = datesplit[0].split('/');
        var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

        return newdate;
        servertraces("util >> dateconversion  >> end","null");
    }
    diff_dates =  function( date1, date2 )
    {
        servertraces("util >> diff_dates  >> start","null");
        //Get 1 day in milliseconds
        var one_day=1000*60*60*24;

        servertraces("util >> diff_dates  >> :dates::",date2)
        servertraces("util >> diff_dates  >> :dates::",date1)

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms =date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        //take out milliseconds
        difference_ms = difference_ms/1000;
        var seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms/60;
        var minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms/60;
        var hours = Math.floor(difference_ms % 24);
        var days = Math.floor(difference_ms/24);

        servertraces("util >> diff_dates  >> ismailsending >>>> Inline: difference_ms",difference_ms);
        servertraces("util >> diff_dates  >> ismailsending >>>> Inline: :days::" ,days );
        servertraces("util >> diff_dates  >> ismailsending >>>> Inline::Hours:",hours );
        servertraces("util >> diff_dates  >> ismailsending >>>> Inline: difference_ms:minutes:",minutes );
        servertraces("util >> diff_dates  >> ismailsending >>>> Inline: difference_ms:seconds:",seconds );

        if (Number(days) < 1)
        {
            if (Number(hours) > 12)
            {
                return true;

            }
            else
            {
                return false;
            }
        }
        else
        {
            return true;
        }
        //return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
        servertraces("util >> diff_dates  >> end","null");
    }
}

//Console logs in server


})();
