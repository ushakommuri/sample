(function(){/**
 * Created by vamsi on 12/6/15.
 */


if (Meteor.isServer) {


    Meteor.methods({
        /* userRegistration  details*/
        userRegistration: function userRegistration(userDetails, callback)
        {
            servertraces("registration >> userRegistration  >> start","null");
            var regVals = '';
            servertraces("registration >> userRegistration  >> ",userDetails);

            try
            {
                var currentId = users.findOne({}, {sort: {id: -1}}).id || 1;
                var uid = currentId + 1;
            }
            catch(error)
            {
                var uid = 1;
            }
            servertraces("registration >> userRegistration  >> Server startup for userRegistration");
            var date = new Date();


            regVals = users.insert({id:uid,email:userDetails.email,password:userDetails.password,status:"",isadmin:false,createddate:date});
            return regVals;
            servertraces("registration >> userRegistration  >> end","null");
        },
        userLogin:function userLogin(login,callback)
        {
            servertraces("registration >> userLogin  >> start","null");
            var logdetails = [];

            servertraces("registration >> userLogin  >> ",login);
            logdetails = users.find({email:login.loginemail,password:login.loginpass}).fetch();

            servertraces("registration >> userLogin  >> ",logdetails);
            return logdetails;
            servertraces("registration >> userLogin  >> end","null");
        },
        userClientInfo:function userClientInfo(userDetails,callback)
        {
            servertraces("registration >> userClientInfo  >> start","null");
            var clientInfoval = [];
            clientInfoval = userinfo.insert({email:userDetails.email,companyname:userDetails.companyname,address:userDetails.address,city:userDetails.city,zipcode:userDetails.zipcode,state:userDetails.state,contactperson:userDetails.conperson,conpersonlastname:userDetails.conpersonlastname,contactemail:userDetails.conemail,contactno:userDetails.connum,notification:userDetails.notification});

            return clientInfoval;
            servertraces("registration >> userClientInfo  >> end","null");
        },
        checkUserProfile:function checkUserProfile(email,callback)
        {
            servertraces("registration >> checkUserProfile  >> start","null");
            var checkuserInfo = [];

            checkuserInfo = userinfo.find({email:email}).fetch();

            return checkuserInfo;
            servertraces("registration >> checkUserProfile  >> end","null");
        },
        userEditClientInfo:function userEditClientInfo(userDetails,callback)
        {
            servertraces("registration >> userEditClientInfo  >> start","null");
            //clienttraces("userEditClientInfo : ",userDetails);
            var userInfo = [];
            userInfo = userinfo.update({email:userDetails.email},{$set:{ companyname:userDetails.companyname,address:userDetails.address,city:userDetails.city,zipcode:userDetails.zipcode,state:userDetails.state,contactperson:userDetails.conperson,conpersonlastname:userDetails.conpersonlastname,contactemail:userDetails.conemail,contactno:userDetails.connum,notification:userDetails.notification }});

            return userInfo;
            servertraces("registration >> userEditClientInfo  >> end","null");
        },
        province_list:function province_list(properties, callback)
        {
            servertraces("registration >> province_list  >> start","null");
            var province = [];
            province = province_US.find({ },{sort:{province:1}}).fetch();
            return province;
            servertraces("registration >> province_list  >> end","null");
        },
        city_list:function city_list(properties, callback)
        {
            servertraces("registration >> city_list  >> start","null");
            var province = [];
            province = city.find({ },{sort:{city_name:1}}).fetch();
            return province;
            servertraces("registration >> city_list  >> end","null");
        },
        createJobReq:function createJobReq(properties,callback)
        {
            servertraces("registration >> createJobReq  >> start","null");
            servertraces("registration >> createJobReq  >> createJobReq>>>>>>>>>");
            servertraces("registration >> createJobReq  >> ",properties);

            try
            {
                var daraftjob = jobsavetodraft.remove({id:properties.id});
            }
            catch(error)
            {
                servertraces("registration >> createJobReq  >> ",error);
            }

           var job = [];
           try
           {
               var currentId = jobreq.findOne({}, {sort: {id: -1}}).id || 1;
               var uid = currentId + 1;
           }
           catch(error)
           {
               var uid = 1;
           }

            var businessid = users.find({ email:properties.email}).fetch();


            properties.id = uid;
            properties.businessuserid = businessid[0].id;

            var servercurrentDate = new Date();
            var serveroffset = servercurrentDate.getTimezoneOffset();
            var convertDate;

            /*if(properties.offset == serveroffset )
            {
                convertDate = properties.campaignstarts;
                properties.offset = -1;
                serveroffset = -1;
            }
            else
            {

                var date = properties.campaignstarts;
                var datesplit = date.split(' ');
                var time = datesplit[1].split(':');
                var datetime = datesplit[0].split('/');
                var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

                var date = new Date(newdate);
                var offset = (properties.timeoffset-getTimezoneName())/60;//(serveroffset)/60;
                convertDate = new Date( new Date(date).getTime() - offset * 3600 * 1000);

                clienttraces(">>>>>>>>>>>:::::"+new Date((new Date(date).getTime() - offset * 3600 * 1000)));

                var hours = convertDate.getHours();
                var minutes = convertDate.getMinutes();
                var date = convertDate.getDate();
                var month =convertDate.getMonth()+1;
                month = month<10?"0"+month:month;
                date = date<10?"0"+date:date;
                minutes = minutes<10?"0"+minutes:minutes;
                hours = hours<10?"0"+hours:hours;
                var campaginstarts = date+"/"+month+"/"+convertDate.getFullYear()+" "+hours+":"+minutes;
                var date = properties.campaignends;
                clienttraces(date);
                var datesplit = date.split(' ');
                var time = datesplit[1].split(':');
                var datetime = datesplit[0].split('/');
                var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

                var date = new Date(newdate);
                var offset = (properties.timeoffset-getTimezoneName())/60;//(serveroffset)/60;
                var convertDate1 = new Date( new Date(date).getTime() - offset * 3600 * 1000);

                var hours = convertDate1.getHours();
                var minutes = convertDate1.getMinutes();
                var date = convertDate1.getDate();
                var month =convertDate1.getMonth()+1;

                month = month<10?"0"+month:month;
                date = date<10?"0"+date:date;
                minutes = minutes<10?"0"+minutes:minutes;
                hours = hours<10?"0"+hours:hours;

                var campaginends = date+"/"+month+"/"+convertDate1.getFullYear()+" "+hours+":"+minutes;

            }
            properties.campaignstarts = campaginstarts;
            properties.campaignends = campaginends;
            properties.serverdate = convertDate;
            properties.serveroffset = serveroffset;*/
            var tzone = getTimezoneName();
            servertraces("registration >> createJobReq  >> TimeZone Name : ",tzone);

            /*CampaignStart Time conversation */
            var date = properties.fulldtcampaignstarts;
            /*var datesplit = date.split(' ');
            var time = datesplit[1].split(':');
            var datetime = datesplit[0].split('/');
            var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];
            clienttraces("NEWDATE : ",newdate);
            var date = new Date(newdate);*/
            servertraces("registration >> createJobReq  >> DATE : ",date);
            servertraces("registration >> createJobReq  >> TimeZone Name : ",moment(date).tz(tzone).format("DD/MM/YYYY HH:mm"));
            servertraces("registration >> createJobReq  >> DIRECT TimeZone Name : ",moment(date).tz('US/Eastern').format("DD/MM/YYYY HH:mm"));
            var campaginstarts = moment(date).tz(tzone)._i;
            /*CampaignStart Time conversation  Ends*/
            servertraces("registration >> createJobReq  >> campaginstarts : ",campaginstarts);
            /*CampaignEnd Time conversation  Ends*/
            var date = properties.fulldtcampaignends;
            /*var datesplit = date.split(' ');
            var time = datesplit[1].split(':');
            var datetime = datesplit[0].split('/');
            var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

            var date = new Date(newdate);*/
            var campaginends = moment(date).tz(tzone)._i;
            /*CampaignEnd Time conversation  Ends*/
            servertraces("registration >> createJobReq  >> campaginends : ",campaginends);

            properties.campaignstarts = campaginstarts;
            properties.campaignends = campaginends;

            servertraces("registration >> createJobReq  >> properties : ",properties);

            job = jobreq.insert(properties);

            servertraces("registration >> createJobReq  >> ",job);
            servertraces("registration >> createJobReq  >> ",currentId);
            servertraces("registration >> createJobReq  >> ",uid);
            return uid;
            servertraces("registration >> createJobReq  >> end","null");
        },
        savetodraftJobReq:function savetodraftJobReq(properties,callback)
        {
            servertraces("registration >> savetodraftJobReq  >> start","null");
            var job = [];
            try
            {
                var currentId = jobsavetodraft.findOne({}, {sort: {id: -1}}).id || 1;
                var uid = currentId + 1;
            }
            catch(error)
            {
                var uid = 1;
            }
            properties.id = uid;

            var servercurrentDate = new Date();
            var serveroffset = servercurrentDate.getTimezoneOffset();
            var convertDate;

            /*if(properties.offset == serveroffset )
            {
                convertDate = properties.campaignstarts;
                properties.offset = -1;
                serveroffset = -1;
            }
            else
            {

                var date = properties.campaignstarts;
                var datesplit = date.split(' ');
                var time = datesplit[1].split(':');
                var datetime = datesplit[0].split('/');
                var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

                var date = new Date(newdate);
                var offset = (properties.timeoffset-getTimezoneName())/60;//(serveroffset)/60;
                convertDate = new Date( new Date(date).getTime() - offset * 3600 * 1000);

                clienttraces(">>>>>>>>>>>:::::"+new Date((new Date(date).getTime() - offset * 3600 * 1000)));

                var hours = convertDate.getHours();
                var minutes = convertDate.getMinutes();
                var date = convertDate.getDate();
                var month =convertDate.getMonth()+1;
                month = month<10?"0"+month:month;
                date = date<10?"0"+date:date;
                minutes = minutes<10?"0"+minutes:minutes;
                hours = hours<10?"0"+hours:hours;
                var campaginstarts = date+"/"+month+"/"+convertDate.getFullYear()+" "+hours+":"+minutes;
                var date = properties.campaignends;
                clienttraces(date);
                var datesplit = date.split(' ');
                var time = datesplit[1].split(':');
                var datetime = datesplit[0].split('/');
                var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

                var date = new Date(newdate);
                var offset = (properties.timeoffset-getTimezoneName())/60;//(serveroffset)/60;
                var convertDate1 = new Date( new Date(date).getTime() - offset * 3600 * 1000);

                var hours = convertDate1.getHours();
                var minutes = convertDate1.getMinutes();
                var date = convertDate1.getDate();
                var month =convertDate1.getMonth()+1;

                month = month<10?"0"+month:month;
                date = date<10?"0"+date:date;
                minutes = minutes<10?"0"+minutes:minutes;
                hours = hours<10?"0"+hours:hours;

                var campaginends = date+"/"+month+"/"+convertDate1.getFullYear()+" "+hours+":"+minutes;

            }
            properties.campaignstarts = campaginstarts;
            properties.campaignends = campaginends;
            properties.serverdate = convertDate;
            properties.serveroffset = serveroffset;*/
            var tzone = getTimezoneName();
            servertraces("registration >> savetodraftJobReq  >> TimeZone Name : ",tzone);

            /*CampaignStart Time conversation */
            var date = properties.fulldtcampaignstarts;
           /* var datesplit = date.split(' ');
            var time = datesplit[1].split(':');
            var datetime = datesplit[0].split('/');
            var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

            var date = new Date(newdate);*/
            //clienttraces("DATE : ",date);
            //clienttraces("TimeZone Name : ",moment(date).tz(tzone).format("DD/MM/YYYY HH:mm"));
            var campaginstarts = moment(date).tz(tzone)._i;
            /*CampaignStart Time conversation  Ends*/

            /*CampaignEnd Time conversation  Ends*/
            var date = properties.fulldtcampaignends;
            /*var datesplit = date.split(' ');
            var time = datesplit[1].split(':');
            var datetime = datesplit[0].split('/');
            var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

            var date = new Date(newdate);*/
            var campaginends = moment(date).tz(tzone)._i;
            /*CampaignEnd Time conversation  Ends*/
            properties.campaignstarts = campaginstarts;
            properties.campaignends = campaginends;
            properties.isdraft = true;

            job = jobsavetodraft.insert(properties);

            servertraces("registration >> savetodraftJobReq  >> ",job);
            servertraces("registration >> savetodraftJobReq  >> ",currentId);
            servertraces("registration >> savetodraftJobReq  >> ",uid);
            return uid;
            servertraces("registration >> savetodraftJobReq  >> end","null");
        },
        addCronForJob:function addCronForJob(properties,html,jobid,obj,callback)
        {
            servertraces("registration >> addCronForJob  >> start","null");
            var commision = '';
            if(properties.type == "Full Time")
            {
                commision = (Number(properties.salfrom)*10)/100;
                commision = (Number(commision)*30)/100;
            }
            else if(properties.type == "Part Time")
            {
                commision = ((Number(properties.perhrfrom) * Number(properties.contractlen) * 22 * 8)*30)/100;
                commision = ((commision)*30)/100;
            }
            else if(properties.type == "Contract")
            {
                commision = ((Number(properties.perhrfrom) * Number(properties.contractfrom) * 22 * 8)*30)/100;
                commision = ((commision)*30)/100;
            }
            else
            {
                commision = ((Number(properties.perhrfrom) * Number(properties.contractfrom) * 22 * 8)*30)/100;
                commision = ((commision)*30)/100;
            }


            var recuriterlist = recruiters.find({}).fetch();
            for(var i = 0;i<recuriterlist.length;i++)
            {
                var options={
                    to:recuriterlist[i].email,
                    from: "zrn@zigatta.com",
                    subject:obj[0].companyname+" is looking for "+properties.position,
                    html:html,
                    recuriterEmail:recuriterlist[i].email,
                    jobID:jobid,
                    ompanyName:obj[0].companyname,
                    title:properties.position,
                    commision:commision
                };
            }

           /* clienttraces(properties);

            var campaignstarts = '';
            campaignstarts = properties.campaignstarts;
            var campaignstartsdate = campaignstarts.split(' ');
            clienttraces(campaignstartsdate[0]+">>>"+campaignstartsdate[1]);
            var campaignstartstime = campaignstartsdate[1].split(':');
            var campaignstartsdate = campaignstartsdate[0].split('/');

            var commision = '';
            if((properties.salfrom == '')||(properties.salfrom == undefined))
            {
                commision = Number(properties.perhrfrom) * 280;
            }
            else
            {
                commision = properties.salfrom;
            }

            SyncedCron.start();
            SyncedCron.add({
                name: 'Query',
                schedule: function(parser)
                {
                    var campaignstartscron = '* '+campaignstartstime[1]+' '+campaignstartstime[0]+' '+campaignstartsdate[0]+' '+campaignstartsdate[1]+' ?';
                    clienttraces(campaignstartscron);
                    return parser.cron(campaignstartscron, true);
                },
                job: function()
                {
                    var recuriterlist = recruiters.find({}).fetch();
                    for(var i = 0;i<recuriterlist.length;i++)
                    {
                        var options={
                            to:recuriterlist[i].email,
                            from: "zrn@zigatta.com",
                            subject:obj[0].companyname+" is looking for"+properties.title,
                            html:html
                        };
                        Email.send(options);

                        var pro =
                        {
                            recuriterEmail:recuriterlist[i].email,
                            jobID:jobid,
                            companyName:obj[0].companyname,
                            title:properties.title,
                            commision:commision
                        }
                        recruiterNotifications.insert(pro);
                    }
                    var status = jobreq.update({id:jobid},{$set:{status:"started"}});
                }
            });


            var campaignends = '';
            campaignends   = properties.campaignends;
            var campaignendsdate = campaignends.split(' ');
            clienttraces(campaignendsdate[0]+">>>"+campaignendsdate[1]);
            var campaignendstime = campaignendsdate[1].split(':');
            var campaignendsdate = campaignendsdate[0].split('/');

            SyncedCron.add({
                name: 'Query status stoped for recurites and business',
                schedule: function(parser)
                {
                    var campaignendscron = '* '+campaignendstime[1]+' '+campaignendstime[0]+' '+campaignendsdate[0]+' '+campaignendsdate[1]+' ?';
                    clienttraces(campaignendscron);
                    return parser.cron(campaignendscron, true);
                },
                job: function()
                {
                    var status = jobreq.update({id:jobid},{$set:{status:"stoped"}});
                    var status = recruitersAcceptedJobs.update({id:jobid},{$set:{status:"stoped"}});


                    var recruitersAccepted = [];
                    recruitersAccepted  = recruitersAcceptedJobs.find({id:Number(jobid)}).fetch();
                    for(var i = 0;i<recruitersAccepted.length;i++)
                    {
                        clienttraces(recruitersAccepted[i].id,recruitersAccepted[i].email)
                        statuschange = recruitersAcceptedJobs.update({id:Number(recruitersAccepted[i].id),email:recruitersAccepted[i].email},{$set:{status:"stoped"}});
                    }
                }
            });*/


            return properties;
            servertraces("registration >> addCronForJob  >> end","null");
        },
        get_archived_jobs_list:function get_archived_jobs_list(properties,callback)
        {
            servertraces("registration >> get_archived_jobs_list  >> start","null");
            var jobs = [];
            jobs = jobreq.find({email:properties,status:closedJob}).fetch();
            return jobs;
            servertraces("registration >> get_archived_jobs_list  >> end","null");
        },
        recruiterRegistration:function recruiterRegistration(recruiterDetails,callback)
        {
            servertraces("registration >> recruiterRegistration  >> start","null");
            var recdetails = [];
            try
            {
                var currentId = recruiters.findOne({}, {sort: {id: -1}}).id || 1;
                var uid = currentId + 1;
            }catch(error)
            {
                var uid = 1;
            }
            var date = new Date();

            recruiterDetails.id = uid;
            recruiterDetails.createddate = date;

            recdetails = recruiters.insert(recruiterDetails);
            return recdetails;
            servertraces("registration >> recruiterRegistration  >> end","null");
        },
        sendShareEmail:function sendShareEmail(options,callback)
        {
            servertraces("registration >> sendShareEmail  >> start","null");
            servertraces("registration >> sendShareEmail  >> ",options);
            Email.send(options);
            servertraces("registration >> sendShareEmail  >> end","null");
        },
        stausUpdateRecuriter:function stausUpdateRecuriter(id,callback)
        {
            servertraces("registration >> stausUpdateRecuriter  >> start","null");
            var status = [];
            status = recruiters.find({_id:id}).fetch();

            if(status.length > 0)
            {
                status = recruiters.update({_id:id},{$set:{ status:"active"}})
            }
            return status;
            servertraces("registration >> stausUpdateRecuriter  >> end","null");
        },
        stausUpdateBusiness:function stausUpdateBusiness(id,callback)
        {
            servertraces("registration >> stausUpdateBusiness  >> start","null");
            var status = [];
            status = users.find({_id:id}).fetch();

            if(status.length > 0)
            {
                status = users.update({_id:id},{$set:{ status:"active"}})
            }
            return status;
            servertraces("registration >> stausUpdateBusiness  >> end","null");
        },
        recLogin:function recLogin(login,callback)
        {
            servertraces("registration >> recLogin  >> start","null");
            var logdetails = [];
            logdetails = recruiters.find({email:login.loginemail,password:login.loginpass}).fetch();

            return logdetails;
            servertraces("registration >> recLogin  >> end","null");
        },
        checkRecProfile:function checkRecProfile(email,callback)
        {
            servertraces("registration >> checkRecProfile  >> start","null");
            var checkuserInfo = [];
            checkuserInfo = recruitersinfo.find({email:email}).fetch();
            return checkuserInfo;
            servertraces("registration >> checkRecProfile  >> end","null");
        },
        recruitersInfo:function recruitersInfo(recprofie,callback)
        {
            servertraces("registration >> recruitersInfo  >> start","null");
            var recInfo = [];
            var recuriterDetails = [];
            recuriterDetails = recruiters.find({email:recprofie.email}).fetch();
            recInfo = recruitersinfo.insert({recid:recuriterDetails[0].id,email:recprofie.email,name:recprofie.name,lastname:recprofie.lastname,address:recprofie.address,city:recprofie.city,zipcode:recprofie.zipcode,state:recprofie.state,contactemail:recprofie.conemail,contactno:recprofie.connum,notification:recprofie.notification,phonecode:recprofie.phonecode });
            return recInfo;
            servertraces("registration >> recruitersInfo  >> end","null");
        },
        editRecuriterInfo:function editRecuriterInfo(recdata,callback)
        {
            servertraces("registration >> editRecuriterInfo  >> start","null");
            var recInfo = [];
            recInfo = recruitersinfo.update({email:recdata.email},{$set:{name:recdata.name,lastname:recdata.lastname,address:recdata.address,city:recdata.city,zipcode:recdata.zipcode,state:recdata.state,contactemail:recdata.conemail,contactno:recdata.connum,notification:recdata.notification,phonecode:recdata.phonecode  }});
            return recInfo;
            servertraces("registration >> editRecuriterInfo  >> end","null");
        },
        update_JobReq:function update_JobReq(properties, callback)
        {
            servertraces("registration >> update_JobReq  >> start","null");
            var job = [];

            var servercurrentDate = new Date();
            var serveroffset = servercurrentDate.getTimezoneOffset();
            var convertDate;


            servertraces("registration >> update_JobReq  >> properties><<::",properties);
            servertraces("registration >> update_JobReq  >> ",properties);

            /*if(properties.offset == serveroffset )
            {
                convertDate = properties.campaignstarts;
                properties.offset = -1;
                serveroffset = -1;
            }
            else
            {

                var date = properties.campaignstarts;
                var datesplit = date.split(' ');
                var time = datesplit[1].split(':');
                var datetime = datesplit[0].split('/');
                var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

                var date = new Date(newdate);
                var offset = (properties.timeoffset-getTimezoneName())/60;//(serveroffset)/60;
                convertDate = new Date( new Date(date).getTime() - offset * 3600 * 1000);

                clienttraces(">>>>>>>>>>>:::::"+new Date((new Date(date).getTime() - offset * 3600 * 1000)));

                var hours = convertDate.getHours();
                var minutes = convertDate.getMinutes();
                var date = convertDate.getDate();
                var month =convertDate.getMonth()+1;
                month = month<10?"0"+month:month;
                date = date<10?"0"+date:date;
                minutes = minutes<10?"0"+minutes:minutes;
                hours = hours<10?"0"+hours:hours;
                var campaginstarts = date+"/"+month+"/"+convertDate.getFullYear()+" "+hours+":"+minutes;
                var date = properties.campaignends;
                clienttraces(date);
                var datesplit = date.split(' ');
                var time = datesplit[1].split(':');
                var datetime = datesplit[0].split('/');
                var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

                var date = new Date(newdate);
                var offset = (properties.timeoffset-getTimezoneName())/60;//(serveroffset)/60;
                var convertDate1 = new Date( new Date(date).getTime() - offset * 3600 * 1000);


                var hours = convertDate1.getHours();
                var minutes = convertDate1.getMinutes();
                var date = convertDate1.getDate();
                var month =convertDate1.getMonth()+1;

                month = month<10?"0"+month:month;
                date = date<10?"0"+date:date;
                minutes = minutes<10?"0"+minutes:minutes;
                hours = hours<10?"0"+hours:hours;

                var campaginends = date+"/"+month+"/"+convertDate1.getFullYear()+" "+hours+":"+minutes;

            }
            properties.campaignstarts = campaginstarts;
            properties.campaignends = campaginends;*/

            var clientdate_campaginstarts = properties.campaignstarts;
            var clientdate_campaginends = properties.campaignends;

            var tzone = getTimezoneName();
            servertraces("registration >> update_JobReq  >> TimeZone Name : ",tzone);

            /*CampaignStart Time conversation */
            var date = properties.fulldtcampaignstarts;
           /* var datesplit = date.split(' ');
            var time = datesplit[1].split(':');
            var datetime = datesplit[0].split('/');
            var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

            var date = new Date(newdate);*/
            //clienttraces("DATE : ",date);
            //clienttraces("TimeZone Name : ",moment(date).tz(tzone).format("DD/MM/YYYY HH:mm"));
            var campaginstarts = moment(date).tz(tzone)._i;
            /*CampaignStart Time conversation  Ends*/

            /*CampaignEnd Time conversation  Ends*/
            var date = properties.fulldtcampaignends;
            /*var datesplit = date.split(' ');
            var time = datesplit[1].split(':');
            var datetime = datesplit[0].split('/');
            var newdate = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

            var date = new Date(newdate);*/
            var campaginends = moment(date).tz(tzone)._i;
            /*CampaignEnd Time conversation  Ends*/
            properties.campaignstarts = campaginstarts;
            properties.campaignends = campaginends;

            var status = '';

            if(properties.status == stopped )
            {
                status = restarted;

                var date = new Date();
                var recaccepted = recruitersAcceptedJobs.find({id:Number(properties.id)}).fetch();

                var businessuserid = users.find({ email:properties.email}).fetch();

                for(var l = 0;l<recaccepted.length;l++)
                {
                    var recid = recruiters.find({email:recaccepted[l].email}).fetch();
                    var rec_activity = recruitersactivity.insert({businessuserid:Number(businessuserid[0].id),jobid:Number(properties.id),recuriterid:recid[0].id,status:"Campaign restarted",date:date,business:"true",recruiter:"true"});
                }

                var business_activity = businessactivity.insert({businessuserid:Number(businessuserid[0].id),jobid:Number(properties.id),status:"Campaign restarted",date:date,business:"true",recruiter:"true"});
            }
            else
            {
                status = properties.status;
            }
            job = jobreq.update({id:properties.id},{$set:{title:properties.title,position:properties.position,jobdesc:properties.jobdesc,zipcode:properties.zipcode,state:properties.state,city:properties.city,industry:properties.industry,primary:properties.primary,requiredskill:properties.requiredskill,niceskill:properties.niceskill,softskills_name:properties.softskills_name,educational:properties.educational,certifications:properties.certifications,type:properties.type,salfrom:properties.salfrom,salto:properties.salto,perhrfrom:properties.perhrfrom,perhrto:properties.perhrto,contractfrom:properties.contractfrom,contractto:properties.contractto,campaignstarts:properties.campaignstarts,campaignends:properties.campaignends,status:status,threshold:properties.threshold,candidatecommission:properties.candidatecommission,reccommision:properties.reccommision,admincommission:properties.admincommission}});


            /*  var tzone = getTimezoneName();
            var campaginstarts = moment(properties.campaignstarts).tz(tzone).format('MM/DD/YYYY HH:mm');
            var campaginends = moment(properties.campaignends).tz(tzone).format('MM/DD/YYYY HH:mm');

            clienttraces("campaginends >>::",campaginends,"campaginstarts>>>::",campaginstarts);*/


            servertraces("registration >> update_JobReq  >> clientdate_campaginstarts >>::",clientdate_campaginstarts);
            servertraces("registration >> update_JobReq  >> clientdate_campaginends>>>::",clientdate_campaginends);



            var date = clientdate_campaginstarts;
            var datesplit = date.split(' ');
            var time = datesplit[1].split(':');
            var datetime = datesplit[0].split('/');
            var campaginstarts = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

            var date = clientdate_campaginends;
            var datesplit = date.split(' ');
            var time = datesplit[1].split(':');
            var datetime = datesplit[0].split('/');
            var campaginends = datetime[1]+"/"+datetime[0]+"/"+datetime[2]+" "+time[0]+":"+time[1];

            servertraces("registration >> update_JobReq  >> campaginends >>::",campaginends);
            servertraces("registration >> update_JobReq  >> campaginstarts>>>::",campaginstarts);

            job = recruitersAcceptedJobs.update({id:properties.id},{$set:{title:properties.title,position:properties.position,jobdesc:properties.jobdesc,zipcode:properties.zipcode,state:properties.state,city:properties.city,industry:properties.industry,primary:properties.primary,requiredskill:properties.requiredskill,niceskill:properties.niceskill,softskills_name:properties.softskills_name,educational:properties.educational,certifications:properties.certifications,type:properties.type,salfrom:properties.salfrom,salto:properties.salto,perhrfrom:properties.perhrfrom,perhrto:properties.perhrto,contractfrom:properties.contractfrom,contractto:properties.contractto,campaignstarts:campaginstarts,campaignends:campaginends,status:status}},{multi:true});

            return job;
            servertraces("registration >> update_JobReq  >> end","null");
        },
        getrecuriter_list:function  getrecuriter_list(properties,callback)
        {
            servertraces("registration >> getrecuriter_list  >> start","null");
            var recuriters =[];
            recuriters = recruiters.find({}).fetch();
            return recuriters;
            servertraces("registration >> getrecuriter_list  >> end","null");
        },
        create_recuriter:function create_recuriter(properties,callback)
        {
            servertraces("registration >> create_recuriter  >> start","null");
            var recuriters = [];
            //for(var i = 0;i<properties.length;i++)
            {

                //recuriters = recruitersSkills.update({email:properties.email}, {$set: {industryData:properties.industryData,primaryData:properties.primaryData,requiredSkillData:properties.requiredSkillData,checkvacation:properties.checkvacation}});
               recuriters = recruitersSkills.update({email:properties.email}, {$set: {industryData:properties.industryData,requiredSkillData:properties.requiredSkillData,checkvacation:properties.checkvacation}});
                if(recuriters == 0)
                {
                    recuriters = recruitersSkills.insert(properties);
                }
            }
            servertraces("registration >> create_recuriter  >> recuriters >> ",recuriters);
            return recuriters;
            servertraces("registration >> create_recuriter  >> end","null");
        },
        get_subscribeddata:function create_recuriter(email,callback)
        {
            servertraces("registration >> get_subscribeddata  >> start","null");
            var subscribeddata = {};
            subscribeddata = recruitersSkills.find({email:email}).fetch();
            return subscribeddata;
            servertraces("registration >> get_subscribeddata  >> end","null");
        },
        get_rec_subscribeddata:function create_recuriter(callback)
        {
            servertraces("registration >> get_subscribeddata  >> start","null");
            var subscribeddata = {};
            subscribeddata = recruitersSkills.find({}).fetch();
            return subscribeddata;
            servertraces("registration >> get_subscribeddata  >> end","null");
        },
        getJobInfo:function getJobInfo(id,callback)
        {
            servertraces("registration >> getJobInfo  >> start","null");
            var jobinfo = [];
            servertraces("registration >> getJobInfo  >> id>>>>"+id);
            jobinfo = jobreq.find({id:Number(id)}).fetch();
            return jobinfo;
            servertraces("registration >> getJobInfo  >> end","null");
        },
        createRecuriterJobReq:function createRecuriterJobReq(obj,callback)
        {
            servertraces("registration >> createRecuriterJobReq  >> start","null");
            var recuriter = [];
            var recruiterNitiStatus = [];

            delete obj._id;
            recuriter = recruitersAcceptedJobs.insert(obj);
            recruiterNitiStatus = recruiterNotifications.update({recuriterEmail:obj.email,jobID:obj.id},{$set:{status:"accepted"}});
            var date = new Date();
            var rec= [];
            var recinfo = [];
            rec = recruiters.find({ email : obj.email}).fetch();
            recinfo = recruitersinfo.find({ email : obj.email}).fetch();

            //var business_activity = businessactivity.insert({jobid:Number(obj.id),recuriterid:rec[0].id,status:"Recruiter accepted Job",date:date,business:"true",recruiter:"true",businessuserid:obj.businessuserid});
            var recruiters_activity = recruitersactivity.insert({jobid:Number(obj.id),recuriterid:rec[0].id,status:"Recruiter accepted Job",date:date,business:"true",recruiter:"true",businessuserid:obj.businessuserid});

            recuriter;
            servertraces("registration >> createRecuriterJobReq  >> end","null");
        },
        updateRecuriterNotAccepted:function updateRecuriterNotAccepted(email,jobid,obj,callback)
        {
            servertraces("registration >> updateRecuriterNotAccepted  >> start","null");
            var recruiterNitiStatus = [];

            delete obj._id;

            //Job rejected not show in archived list too
            //recruiterNitiStatus = recruitersAcceptedJobs.insert(obj);
            recruiterNitiStatus = recruiterNotifications.update({recuriterEmail:email,jobID:obj.id},{$set:{status:"rejected"}});

            var date = new Date();
            var rec= [];
            var recinfo = [];
            rec = recruiters.find({email:email}).fetch();
            recinfo = recruitersinfo.find({ email : obj.email}).fetch();

            //var business_activity = businessactivity.insert({jobid:Number(obj.id),recuriterid:rec[0].id,status:"Recruiter rejected Job",date:date,business:"true",recruiter:"true",businessuserid:obj.businessuserid});
            var recruiters_activity = recruitersactivity.insert({jobid:Number(obj.id),recuriterid:rec[0].id,status:"Recruiter rejected Job",date:date,business:"true",recruiter:"true",businessuserid:obj.businessuserid});
            var recactivity = recruitersactivity.remove({jobid:Number(obj.id),recuriterid:Number(rec[0].id),businessuserid:obj.businessuserid,status:campaignStarted});

            return recruiterNitiStatus;
            servertraces("registration >> updateRecuriterNotAccepted  >> end","null");
        },
        get_archived_recuriter_jobs_list:function get_archived_recuriter_jobs_list(email,callback)
        {
            servertraces("registration >> get_archived_recuriter_jobs_list  >> start","null");
            var recuriterjobs = [];

            //clienttraces(email);
            var query = {};
            query.status = {"$in":[closedJob]};
            query.email = email;
            recuriterjobs = recruitersAcceptedJobs.find(query).fetch();

            return recuriterjobs;
            servertraces("registration >> get_archived_recuriter_jobs_list  >> end","null");
        },
        checkRecuriterJobReq:function checkRecuriterJobReq(data,callback)
        {
            servertraces("registration >> checkRecuriterJobReq  >> start","null");
            var checkJobIn = [];

            checkJobIn = recruitersAcceptedJobs.find({email:data.email,id:data.id}).fetch();

            return checkJobIn;
            servertraces("registration >> checkRecuriterJobReq  >> end","null");
        },
        urlpath:function urlpath(callback)
        {
            return url;
        },
        /*statusChangeToArchive:function statusChangeToArchive(jobid,callback)
        {
            var statuschange = '';

            clienttraces("statusChangeToArchive>>"+jobid);
            var date = new Date();
            statuschange = jobreq.update({id:Number(jobid)},{$set:{archived:"true",status:"closed",createddate:date}});

            var recruitersAccepted = [];
            var date = new Date();
            recruitersAccepted  = recruitersAcceptedJobs.find({id:Number(jobid)}).fetch();
            for(var i = 0;i<recruitersAccepted.length;i++)
            {
                var options =
                {
                    to:  recruitersAccepted[i].email,
                    from: "zrn@zigatta.com",
                    subject: "Regarding Job status @ "+recruitersAccepted[i].title,
                    //html: 'Job closed @'+recruitersAccepted[i].title
                    html:'<div style="background-color: #D7D7D7;padding:15px;width: 70%;margin-left: 14%;"><div style="background-color: #ffffff;padding:10px;"><img src="http://184.107.131.178:18000/images/logo_Z_zigatta_azul_transparente.png" id="logoclick" style="cursor: pointer;margin-left:15px" width="140"/><div>Job closed @ '+recruitersAccepted[i].title+'</div></div></div>'

                };
                Email.send(options);


                clienttraces(recruitersAccepted[i].id,recruitersAccepted[i].email)
                statuschange = recruitersAcceptedJobs.update({id:Number(recruitersAccepted[i].id),email:recruitersAccepted[i].email},{$set:{archived:"true",status:"closed",createddate:date}},{multi:true});

                var rec = [];
                rec = recruiters.find({ email :recruitersAccepted[i].email }).fetch();
                var rec_activity = recruitersactivity.insert({businessuserid:recruitersAccepted[i].businessuserid,jobid:Number(jobid),recuriterid:rec[0].id,status:"Campagin closed",date:date,business:"true",recruiter:"true"});
            }
            var business_activity = businessactivity.insert({businessuserid:recruitersAccepted[0].businessuserid,jobid:Number(jobid),status:"Campagin closed",date:date,business:"true",recruiter:"true"});
            var status = recruiterNotifications.update({jobID: Number(jobid)}, {$set: {jobstatus: "closed"}},{multi:true});

            return statuschange;
        },*/
        statusChangeToArchive:function statusChangeToArchive(jobid,callback)
        {
            servertraces("registration >> statusChangeToArchive  >> start","null");
            var statuschange = '';


            servertraces("registration >> statusChangeToArchive  >> statusChangeToArchive>>"+jobid);
            var date = new Date();
            statuschange = jobreq.update({id:Number(jobid)},{$set:{archived:"true",status:closedJob,createddate:date}});

            var recruitersAccepted = [];
            var jobdetails = [];
            var date = new Date();
            jobdetails  = jobreq.find({id:Number(jobid)}).fetch();
            recruitersAccepted  = recruitersAcceptedJobs.find({id:Number(jobid)}).fetch();
            if (recruitersAccepted.length > 0)
            {
                for(var i = 0;i<recruitersAccepted.length;i++)
                {
                    var options =
                    {
                        to:  recruitersAccepted[i].email,
                        from: "zrn@zigatta.com",
                        subject: "New Update on "+recruitersAccepted[i].position,
                        //html: 'Job closed @'+recruitersAccepted[i].title
                        html:'<div style="background-color: #D7D7D7;padding:15px;width: 70%;margin-left: 14%;"><div style="background-color: #ffffff;padding:10px;"><img src="'+url+'images/logo_Z_zigatta_azul_transparente.png" id="logoclick" style="cursor: pointer;margin-left:15px" width="140"/><div>Thank you for participating in the campaign for '+recruitersAccepted[i].position+' This role is now closed. </div></div></div>'

                    };
                    Email.send(options);

                    servertraces("registration >> statusChangeToArchive  >> ",recruitersAccepted[i].email)
                    servertraces("registration >> statusChangeToArchive  >> ",recruitersAccepted[i].id)
                    statuschange = recruitersAcceptedJobs.update({id:Number(recruitersAccepted[i].id),email:recruitersAccepted[i].email},{$set:{archived:"true",status:closedJob}},{multi:true});

                    var rec = [];
                    rec = recruiters.find({ email :recruitersAccepted[i].email }).fetch();
                    var rec_activity = recruitersactivity.insert({businessuserid:recruitersAccepted[i].businessuserid,jobid:Number(jobid),recuriterid:rec[0].id,status:"Campaign closed",date:date,business:"true",recruiter:"true"});
                }
            }
            //clienttraces(jobdetails[0].businessuserid,"actuvity checking",jobid)

            var business_activity = businessactivity.insert({businessuserid:jobdetails[0].businessuserid,jobid:Number(jobid),status:"Campaign closed",date:date,business:"true",recruiter:"true"});
            var status = recruiterNotifications.update({jobID: Number(jobid)}, {$set: {jobstatus: closedJob}},{multi:true});

            return statuschange;
            servertraces("registration >> statusChangeToArchive  >> end","null");
        },
        getSate:function getSate(sate,callback)
        {
            servertraces("registration >> getSate  >> start","null");
            var sate = [];
            sate = province_US.find({province:sate}).fetch();
            return sate;
            servertraces("registration >> getSate  >> end","null");
        },
        checkEmailExists:function checkEmailExists(email,callback)
        {
            servertraces("registration >> checkEmailExists  >> start","null");
            var user = [];
            var rec = [];

            user = users.find({ email:email }).fetch();
            rec = recruiters.find({ email:email }).fetch();
            servertraces("registration >> checkEmailExists  >> "+rec.length);
            servertraces("registration >> checkEmailExists  >> ",user.length);

            if((user.length == 0)&&(rec.length == 0))
            {
               return "fail";
            }
            else
            {
                return "success";
            }
            servertraces("registration >> checkEmailExists  >> end","null");
        },
        getrecuriterNotifications:function getrecuriterNotifications(email,callback)
        {
            servertraces("registration >> getrecuriterNotifications  >> start","null");
            var notifications = [];
            notifications = recruiterNotifications.find({recuriterEmail:email},{sort: {id: -1}}).fetch();

            return notifications;
            servertraces("registration >> getrecuriterNotifications  >> end","null");
        },
        getrecuriterNotificationsNew:function getrecuriterNotificationsNew(email,callback)
        {
            servertraces("registration >> getrecuriterNotificationsNew  >> start","null");
            var notifications = [];
            notifications = recruiterNotifications.find({recuriterEmail:email,viewed:"new"},{sort: {id: -1}}).fetch();

            return notifications;
            servertraces("registration >> getrecuriterNotificationsNew  >> end","null");
        },
        updateCronForJob:function updateCronForJob(properties,html,jobid,obj,campaignstartscron,campaignendscron,callback)
        {
            servertraces("registration >> updateCronForJob  >> start","null");
           /* clienttraces(properties);

            var commision = '';
            if((properties.salfrom == '')||(properties.salfrom == undefined))
            {
                commision = Number(properties.perhrfrom) * 280;
            }
            else
            {
                commision = properties.salfrom;
            }
            SyncedCron.start();
            SyncedCron.add({
                name: 'Query',
                schedule: function(parser)
                {

                    clienttraces(campaignstartscron);
                    return parser.cron(campaignstartscron, true);
                },
                job: function()
                {
                    var recuriterlist = recruiters.find({}).fetch();
                    for(var i = 0;i<recuriterlist.length;i++)
                    {
                        var options={
                            to:recuriterlist[i].email,
                            from: "zrn@zigatta.com",
                            subject:obj[0].companyname+" is looking for"+properties.title,
                            html:html
                        };
                        Email.send(options);

                        var pro =
                        {
                            recuriterEmail:recuriterlist[i].email,
                            jobID:jobid,
                            companyName:obj[0].companyname,
                            title:properties.title,
                            commision:commision
                        }
                        recruiterNotifications.insert(pro);
                    }
                    var status = jobreq.update({id:jobid},{$set:{status:"started"}});
                }
            });


            SyncedCron.add({
                name: 'Query status stoped for recurites and business',
                schedule: function(parser)
                {

                    clienttraces(campaignendscron);
                    return parser.cron(campaignendscron, true);
                },
                job: function()
                {
                    var status = jobreq.update({id:jobid},{$set:{status:"stoped"}});
                    var status = recruitersAcceptedJobs.update({id:jobid},{$set:{status:"stoped"}});


                    var recruitersAccepted = [];
                    recruitersAccepted  = recruitersAcceptedJobs.find({id:Number(jobid)}).fetch();
                    for(var i = 0;i<recruitersAccepted.length;i++)
                    {
                        clienttraces(recruitersAccepted[i].id,recruitersAccepted[i].email)
                        statuschange = recruitersAcceptedJobs.update({id:Number(recruitersAccepted[i].id),email:recruitersAccepted[i].email},{$set:{status:"stoped"}});
                    }
                }
            });
            */
            return properties;
            servertraces("registration >> updateCronForJob  >> end","null");
        },
        get_business_archived_job_details:function get_business_archived_job_details(jobid,callback)
        {
            servertraces("registration >> get_business_archived_job_details  >> start","null");
            var businessDetails = [];
            servertraces("registration >> get_business_archived_job_details  >> jobid>>>>"+jobid);
            businessDetails  = jobreq.find({id:Number(jobid)}).fetch();
            return businessDetails;
            servertraces("registration >> get_business_archived_job_details  >> end","null");
        },
        updateNotificationViewed:function updateNotificationViewed(email,jobid,callback)
        {
            servertraces("registration >> updateNotificationViewed  >> start","null");
            var recruiterNotifi = [];

            recruiterNotifi = recruiterNotifications.update({recuriterEmail:email,jobID:jobid},{$set:{viewed:"viewed"}});

            return recruiterNotifi;
            servertraces("registration >> updateNotificationViewed  >> end","null");
        },
        get_filter_jobs_list:function get_filter_jobs_list(recemail,filtertype,callback)
        {
            servertraces("registration >> get_filter_jobs_list  >> start","null");
            servertraces("registration >> get_filter_jobs_list  >> >recemail"+filtertype)
            servertraces("registration >> get_filter_jobs_list  >> >recemail"+recemail)

            var jobs = [];
            var today = new Date();
            var date = today.getDate();
            var month = today.getMonth();
            var year = today.getFullYear();

            var updatedDate = '';

            var status = '';

            if( filtertype == 'Anydate')
            {
                updatedDate = '';
            }
            else if( filtertype == 'Today')
            {
                updatedDate = new Date((month+1)+'/'+date+'/'+year);
                updatedDate.setDate(updatedDate.getDate());
            }
            else if( filtertype == 'Past7days')
            {
                updatedDate = new Date((month+1)+'/'+date+'/'+year);
                updatedDate.setDate(updatedDate.getDate()-7); // Subtract 7 days
            }
            else if( filtertype == 'All')
            {
                status = '';
            }
            else if( filtertype == 'NotStarted')
            {
                status = notStarted;
            }
            else if( filtertype == 'Running')
            {
                status = startedJob;
            }
            else if( filtertype == stopped)
            {
                status = stopped;
            }

            var query = {};
            query.status = {"$in":[notStarted,startedJob,stopped,lookingForMoreCandidates,positionFilled]};
            query.email = {"$in":[recemail]};

            if(updatedDate != '')
            {
                query.createddate = {$gte: updatedDate};
            }

            if(status != '')
            {
                query.status = status;
            }

            //clienttraces(query)
            jobs = jobreq.find(query).fetch();

            return jobs;
            servertraces("registration >> get_filter_jobs_list  >> end","null");
        },
        get_archived_filter_jobs_list:function get_archived_filter_jobs_list(recemail,filtertype,callback)
        {
            servertraces("registration >> get_archived_filter_jobs_list  >> start","null");
            var jobs = [];
            var today = new Date();
            var date = today.getDate();
            var month = today.getMonth();
            var year = today.getFullYear();

            var updatedDate = '';

            var status = '';

            if( filtertype == 'Anydate')
            {
                updatedDate = '';
            }
            else if( filtertype == 'Today')
            {
                updatedDate = new Date((month+1)+'/'+date+'/'+year);
                updatedDate.setDate(updatedDate.getDate());
            }
            else if( filtertype == 'Past7days')
            {
                updatedDate = new Date((month+1)+'/'+date+'/'+year);
                updatedDate.setDate(updatedDate.getDate()-7); // Subtract 7 days
            }

            var query = {};
            query.status = {"$in":[closedJob]};
            query.email = {"$in":[recemail]};

            if(updatedDate != '')
            {
                query.createddate = {$gte: updatedDate};
            }

            jobs = jobreq.find(query).fetch();

            return jobs;
            servertraces("registration >> get_archived_filter_jobs_list  >> end","null");
        },
        get_recuriter_filter_jobs_list:function get_recuriter_filter_jobs_list(recemail,filtertype,callback)
        {
            servertraces("registration >> get_recuriter_filter_jobs_list  >> start","null");
            var jobs = [];
            var today = new Date();
            var date = today.getDate();
            var month = today.getMonth();
            var year = today.getFullYear();

            var updatedDate = '';

            var status = '';

            if( filtertype == 'Anydate')
            {
                updatedDate = '';
            }
            else if( filtertype == 'Today')
            {
                updatedDate = new Date((month+1)+'/'+date+'/'+year);
                updatedDate.setDate(updatedDate.getDate());
            }
            else if( filtertype == 'Past7days')
            {
                updatedDate = new Date((month+1)+'/'+date+'/'+year);
                updatedDate.setDate(updatedDate.getDate()-7); // Subtract 7 days
            }
            else if( filtertype == 'All')
            {
                status = '';
            }
            else if( filtertype == 'NotStarted')
            {
                status = notStarted;
            }
            else if( filtertype == 'Running')
            {
                status = startedJob;
            }
            else if( filtertype == stopped)
            {
                status = stopped;
            }

            var query = {};
            query.status = {"$in":[startedJob,stopped,lookingForMoreCandidates,positionFilled]};
            query.email = {"$in":[recemail]};

            if(updatedDate != '')
            {
                query.createddate = {$gte: updatedDate};
            }

            if(status != '')
            {
                query.status = status;
            }

            servertraces("registration >> get_recuriter_filter_jobs_list  >> ",query)

            jobs = recruitersAcceptedJobs.find(query).fetch();

            return jobs;
            servertraces("registration >> get_recuriter_filter_jobs_list  >> end","null");
        },
        get_recuriter_archived_filter_jobs_list:function get_recuriter_archived_filter_jobs_list(recemail,filtertype,callback)
        {
            servertraces("registration >> get_recuriter_archived_filter_jobs_list  >> start","null");
            var jobs = [];
            var today = new Date();
            var date = today.getDate();
            var month = today.getMonth();
            var year = today.getFullYear();

            var updatedDate = '';

            var status = '';

            if (filtertype == 'Anydate') {
                updatedDate = '';
            }
            else if (filtertype == 'Today') {
                updatedDate = new Date((month+1) + '/' + date + '/' + year);
                updatedDate.setDate(updatedDate.getDate());
            }
            else if (filtertype == 'Past7days') {
                updatedDate = new Date((month+1) + '/' + date + '/' + year);
                updatedDate.setDate(updatedDate.getDate() - 7); // Subtract 7 days
            }

            var query = {};
            query.status = {"$in": [closedJob]};

            if(recemail != '')
                query.email = {"$in":[recemail]};

            if (updatedDate != '')
            {
                query.createddate = {$gte: updatedDate};
            }

            //clienttraces(query);

            jobs = recruitersAcceptedJobs.find(query).fetch();

            return jobs;
            servertraces("registration >> get_recuriter_archived_filter_jobs_list  >> end","null");
        },
        get_business_forgotpassword:function get_business_forgotpassword(email,callback)
        {
            servertraces("registration >> get_business_forgotpassword  >> start","null");
            var busuness = [];

            busuness = users.find({ email:email}).fetch();

            return busuness;
            servertraces("registration >> get_business_forgotpassword  >> end","null");
        },

        update_business_password:function update_business_password(id,pwd,callback)
        {
            servertraces("registration >> update_business_password  >> start","null");
            servertraces("registration >> update_business_password  >> >>>>>>>>>>>>>>>>>>.",pwd)
            servertraces("registration >> update_business_password  >> >>>>>>>>>>>>>>>>>>.",id)
            var busuness = [];

            busuness = users.update({id:id},{$set:{ password:pwd}})

            return busuness;
            servertraces("registration >> update_business_password  >> end","null");
        },
        update_recruiter_password:function update_business_password(id,pwd,callback)
        {
            servertraces("registration >> update_recruiter_password  >> start","null");
            var busuness = [];

            busuness = recruiters.update({id:id},{$set:{ password:pwd}})

            return busuness;
            servertraces("registration >> update_recruiter_password  >> end","null");
        },
        get_recruiter_forgotpassword:function get_recruiter_forgotpassword(email,callback)
        {
            servertraces("registration >> get_recruiter_forgotpassword  >> start","null");
            var rec = [];

            rec = recruiters.find({ email:email}).fetch();

            return rec;
            servertraces("registration >> get_recruiter_forgotpassword  >> end","null");
        },
        industry_list:function industry_list(properties ,callback)
        {
            servertraces("registration >> industry_list  >> start","null");
            var industrys = [];
            industrys = industry.find({}).fetch();
            return industrys;
            servertraces("registration >> industry_list  >> end","null");
        },
        health_industry_list:function health_industry_list(properties ,callback)
        {
            servertraces("registration >> health_industry_list  >> start","null");
            var health_industrys = [];
            health_industrys = health.find({}).fetch();
            return health_industrys;
            servertraces("registration >> health_industry_list  >> end","null");
        },
        required_skills_list:function required_skills_list(properties ,callback)
        {
            servertraces("registration >> required_skills_list  >> start","null");
            var requiredskill = [];

            //console.log(">>>properties>>>"+properties);

            var arr = [];

            if((properties == '')||(properties == undefined))
            {
               // requiredskill = requiredskills.find({}).fetch();
                arr.push(requiredskill);
            }
            else
            {
                for(var i =0;i<properties.length;i++) {

                    var obj = properties[i];
                    console.log(">>>required_skills_list>>>>required_skills_list::" + obj.label);
                   /* if (i == 0) {
                        requiredskill = requiredskills.find({}).fetch();
                    }
                    else if (i == 1)
                    {
                        requiredskill = CustomerService.find({}).fetch();
                    }else if (i == 2)
                    {
                        requiredskill = health.find({}).fetch();
                    }*/

                   // requiredskill = obj.label.find({}).fetch();

                    if(obj.label == "Adminstrative")
                    {
                        requiredskill = Adminstrative.find({}).fetch();

                        requiredskill.map(function(o, j)
                        {
                            requiredskill[j].name = "Adminstrative";
                        });

                    }else if(obj.label == "Banking")
                    {
                        requiredskill = Banking.find({}).fetch();
                        requiredskill.map(function(o, j)
                        {
                            requiredskill[j].name = "Banking";
                        });
                    }else if(obj.label == "Customer Service")
                    {
                        requiredskill = CustomerService.find({}).fetch();
                        requiredskill.map(function(o, j)
                        {
                            requiredskill[j].name = "Customer Service";
                        });
                    }else if(obj.label == "Marketing")
                    {
                        requiredskill = marketing.find({}).fetch();
                        requiredskill.map(function(o, j)
                        {
                            requiredskill[j].name = "Marketing";
                        });
                    }else if(obj.label == "Engineering")
                    {
                        requiredskill = Engineering.find({}).fetch();
                        requiredskill.map(function(o, j)
                        {
                            requiredskill[j].name = "Engineering";
                        });
                    }else if(obj.label == "Human Resources")
                    {
                        requiredskill = HumanResources.find({}).fetch();
                        requiredskill.map(function(o, j)
                        {
                            requiredskill[j].name = "Human Resources";
                        });
                    }else if(obj.label == "Healthcare")
                    {
                        requiredskill = Healthcare.find({}).fetch();
                        requiredskill.map(function(o, j)
                        {
                            requiredskill[j].name = "Healthcare";
                        });
                    }else if(obj.label == "Biotech")
                    {
                        requiredskill = Biotech.find({}).fetch();
                        requiredskill.map(function(o, j)
                        {
                            requiredskill[j].name = "Biotech";
                        });
                    }else if(obj.label == "Accounting/Finance")
                    {
                        requiredskill = AccountingFinance.find({}).fetch();
                        requiredskill.map(function(o, j)
                        {
                            requiredskill[j].name = "Accounting/Finance";
                        });
                    }else if(obj.label == "Sales & Biz Dev")
                    {
                        requiredskill = SalesBizDev.find({}).fetch();
                        requiredskill.map(function(o, j)
                        {
                            requiredskill[j].name = "Sales & Biz Dev";
                        });
                    }
                    else if(obj.label == "IT")
                    {
                        requiredskill = IT.find({}).fetch();
                        requiredskill.map(function(o, j)
                        {
                            requiredskill[j].name = "IT";
                        });
                    }
                    arr.push(requiredskill);

                    }

                    //requiredskill = requiredskills.find({}).fetch();




            }

            console.log("requiredskill  >> ",arr);
            return arr;
            servertraces("registration >> required_skills_list  >> end","null");
        },
        required_skills_list_creaejob:function required_skills_list(value ,callback)
        {
            servertraces("registration >> required_skills_list  >> start","null");
            var requiredskill = [];
            var arr = [];
            console.log(">>>required_skills_list>>>>required_skills_list:: value" + value);


                    if(value == "Adminstrative")
                    {
                        requiredskill = Adminstrative.find({}).fetch();
                    }else if(value == "Banking")
                    {
                        requiredskill = Banking.find({}).fetch();
                    }else if(value == "Customer Service")
                    {
                        requiredskill = CustomerService.find({}).fetch();
                    }else if(value == "Marketing")
                    {
                        requiredskill = marketing.find({}).fetch();
                    }else if(value == "Engineering")
                    {
                        requiredskill = Engineering.find({}).fetch();
                    }else if(value == "Human Resources")
                    {
                        requiredskill = HumanResources.find({}).fetch();
                        //console.log("registration >> required_skills_list  >>ARR Human",requiredskill);

                    }else if(value == "Healthcare")
                    {
                        requiredskill = Healthcare.find({}).fetch();
                    }else if(value == "Biotech")
                    {
                        requiredskill = Biotech.find({}).fetch();
                    }else if(value == "Accounting/Finance")
                    {
                        requiredskill = AccountingFinance.find({}).fetch();
                    }else if(value == "Sales & Biz Dev")
                    {
                        requiredskill = SalesBizDev.find({}).fetch();
                    }
                    else if(value == "IT")
                    {
                        requiredskill = IT.find({}).fetch();
                    }

            for(var i=0;i<requiredskill.length;i++)
            {
                var obj = requiredskill[i];

                arr.push(obj.reqskills_name)

            }
            return arr;
            servertraces("registration >> required_skills_list  >> end","null");
        },
        get_draft_jobs_list:function get_draft_jobs_list(properties ,callback)
        {
            servertraces("registration >> get_draft_jobs_list  >> start","null");
            var jobdraftlist = [];
            jobdraftlist = jobsavetodraft.find({email:properties}).fetch();
            return jobdraftlist;
            servertraces("registration >> get_draft_jobs_list  >> end","null");
        },
        deleteJobFromDraft:function deleteJobFromDraft(properties ,callback)
        {
            servertraces("registration >> deleteJobFromDraft  >> start","null");
            var jobdraftlist = [];
            jobdraftlist = jobsavetodraft.remove({id:properties.id});
            jobdraftlist = jobsavetodraft.find({email:properties}).fetch();

            return jobdraftlist;
            servertraces("registration >> deleteJobFromDraft  >> end","null");
        },
        get_candidate_data:function get_candidate_data(candidateid,callback)
        {
            servertraces("registration >> get_candidate_data  >> start","null");
            var candidatedetails = [];
            candidatedetails = candidates.find({ id:Number(candidateid) }).fetch();

            return candidatedetails;
            servertraces("registration >> get_candidate_data  >> end","null");
        },
        get_candidate_job_data:function get_candidate_job_data(candidateid,callback)
        {
            servertraces("registration >> get_candidate_job_data  >> start","null");
            var candidatejobdetsils = [];
            candidatejobdetsils = candidateacceptedjobs.find({ candidateid:Number(candidateid) }).fetch();

            return candidatejobdetsils;
            servertraces("registration >> get_candidate_job_data  >> end","null");
        }


    });
}


/*
function getTimezoneName()
{
    tmSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
    so = -1 * tmSummer.getTimezoneOffset();
    tmWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
    wo = -1 * tmWinter.getTimezoneOffset();

    clienttraces("so--------:"+so+"wo------:"+wo);

    date = new Date();
    if(date.getMonth() >= 6)
    {
        return so;
    }
    else
    {
        return wo;
    }

}*/

getTimezoneName = function getTimezoneName()
{
   
    servertraces("registration >> getTimezoneName  >> start","null");
    tmSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
    so = -1 * tmSummer.getTimezoneOffset();
    tmWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
    wo = -1 * tmWinter.getTimezoneOffset();
    servertraces("registration >> getTimezoneName  >> so >> ",so);
    servertraces("registration >> getTimezoneName  >> wo >> ",wo);
    if (-660 == so && -660 == wo) return 'Pacific/Midway';
    if (-600 == so && -600 == wo) return 'Pacific/Tahiti';
    if (-570 == so && -570 == wo) return 'Pacific/Marquesas';
    if (-540 == so && -600 == wo) return 'America/Adak';
    if (-540 == so && -540 == wo) return 'Pacific/Gambier';
    if (-480 == so && -540 == wo) return 'US/Alaska';
    if (-480 == so && -480 == wo) return 'Pacific/Pitcairn';
    if (-420 == so && -480 == wo) return 'US/Pacific';
    if (-420 == so && -420 == wo) return 'US/Arizona';
    if (-360 == so && -420 == wo) return 'US/Mountain';
    if (-360 == so && -360 == wo) return 'America/Guatemala';
    if (-360 == so && -300 == wo) return 'Pacific/Easter';
    if (-300 == so && -360 == wo) return 'US/Central';
    if (-300 == so && -300 == wo) return 'America/Bogota';
    if (-240 == so && -300 == wo) return 'US/Eastern';
    if (-240 == so && -240 == wo) return 'America/Caracas';
    if (-240 == so && -180 == wo) return 'America/Santiago';
    if (-180 == so && -240 == wo) return 'Canada/Atlantic';
    if (-180 == so && -180 == wo) return 'America/Montevideo';
    if (-180 == so && -120 == wo) return 'America/Sao_Paulo';
    if (-150 == so && -210 == wo) return 'America/St_Johns';
    if (-120 == so && -180 == wo) return 'America/Godthab';
    if (-120 == so && -120 == wo) return 'America/Noronha';
    if (-60 == so && -60 == wo) return 'Atlantic/Cape_Verde';
    if (0 == so && -60 == wo) return 'Atlantic/Azores';
    if (0 == so && 0 == wo) return 'Africa/Casablanca';
    if (60 == so && 0 == wo) return 'Europe/London';
    if (60 == so && 60 == wo) return 'Africa/Algiers';
    if (60 == so && 120 == wo) return 'Africa/Windhoek';
    if (120 == so && 60 == wo) return 'Europe/Amsterdam';
    if (120 == so && 120 == wo) return 'Africa/Harare';
    if (180 == so && 120 == wo) return 'Europe/Athens';
    if (180 == so && 180 == wo) return 'Africa/Nairobi';
    if (240 == so && 180 == wo) return 'Europe/Moscow';
    if (240 == so && 240 == wo) return 'Asia/Dubai';
    if (270 == so && 210 == wo) return 'Asia/Tehran';
    if (270 == so && 270 == wo) return 'Asia/Kabul';
    if (300 == so && 240 == wo) return 'Asia/Baku';
    if (300 == so && 300 == wo) return 'Asia/Karachi';
    if (330 == so && 330 == wo) return 'Asia/Calcutta';
    if (345 == so && 345 == wo) return 'Asia/Katmandu';
    if (360 == so && 300 == wo) return 'Asia/Yekaterinburg';
    if (360 == so && 360 == wo) return 'Asia/Colombo';
    if (390 == so && 390 == wo) return 'Asia/Rangoon';
    if (420 == so && 360 == wo) return 'Asia/Almaty';
    if (420 == so && 420 == wo) return 'Asia/Bangkok';
    if (480 == so && 420 == wo) return 'Asia/Krasnoyarsk';
    if (480 == so && 480 == wo) return 'Australia/Perth';
    if (540 == so && 480 == wo) return 'Asia/Irkutsk';
    if (540 == so && 540 == wo) return 'Asia/Tokyo';
    if (570 == so && 570 == wo) return 'Australia/Darwin';
    if (570 == so && 630 == wo) return 'Australia/Adelaide';
    if (600 == so && 540 == wo) return 'Asia/Yakutsk';
    if (600 == so && 600 == wo) return 'Australia/Brisbane';
    if (600 == so && 660 == wo) return 'Australia/Sydney';
    if (630 == so && 660 == wo) return 'Australia/Lord_Howe';
    if (660 == so && 600 == wo) return 'Asia/Vladivostok';
    if (660 == so && 660 == wo) return 'Pacific/Guadalcanal';
    if (690 == so && 690 == wo) return 'Pacific/Norfolk';
    if (720 == so && 660 == wo) return 'Asia/Magadan';
    if (720 == so && 720 == wo) return 'Pacific/Fiji';
    if (720 == so && 780 == wo) return 'Pacific/Auckland';
    if (765 == so && 825 == wo) return 'Pacific/Chatham';
    if (780 == so && 780 == wo) return 'Pacific/Enderbury'
    if (840 == so && 840 == wo) return 'Pacific/Kiritimati';
    return 'US/Pacific';
    servertraces("registration >> getTimezoneName  >> end","null");
}


servertraces = function(method,msg)
{
   // console.log(method,msg);
}

})();
