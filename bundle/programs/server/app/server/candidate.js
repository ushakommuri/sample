(function(){/**
 * Created by vamsi on 30/6/15.
 */


if (Meteor.isServer) {
    Meteor.methods(
        {
            /* insert Candidate Details */
            insertCandidateDetails: function insertCandidateDetails(candidateDetails, callback)
            {
                servertraces("candidate >> insertCandidateDetails  >> start","null");
                var candidatevals = '';
                try
                {
                    var currentId = candidates.findOne({}, {sort: {id: -1}}).id || 1;
                    var uid = currentId + 1;
                }
                catch(error)
                {
                    var uid = 1;
                }

                candidatevals = candidates.insert({id:uid,jobid:candidateDetails.jobid,candidatename:candidateDetails.candidatename,candidatelastname:candidateDetails.candidatelastname,candidateemail:candidateDetails.candidateemail,contactno:candidateDetails.contactno,interviewstatus:'Notaccepted',recuriteremail:candidateDetails.recuriteremail,threshold:candidateDetails.threshold});
                return uid;
                servertraces("candidate >> insertCandidateDetails  >> end","null");
            },
            candidate_accepted_job_list:function candidate_accepted_job_list(properties,jobid)
            {
                servertraces("candidate >> candidate_accepted_job_list  >> start","null");
                var candidatejobslist = [];
                candidatejobslist = candidateacceptedjobs.find({recuriteremail:properties,jobid:Number(jobid)}).fetch();
                return candidatejobslist;
                servertraces("candidate >> candidate_accepted_job_list  >> end","null");
            },
            getRecuriterAcceptedJobInfo:function getRecuriterAcceptedJobInfo(jobid,candidateid,recid,callback)
            {
                servertraces("candidate >> getRecuriterAcceptedJobInfo  >> start","null");
                var jobdetails = [];
                var candidatedetails = [];
                var recruiterinfo = [];
                var finalArr = [];
                var jobdetailsjobreq = [];

                servertraces("getRecuriterAcceptedJobInfo>>>>>>"+jobid+">>>>>"+candidateid+">>>>>"+recid);

                candidatedetails = candidates.find({id:Number(candidateid) }).fetch();
                recruiterinfo = recruitersinfo.find({recid:Number(recid)}).fetch();
                jobdetails = recruitersAcceptedJobs.find({ id:Number(jobid),email:recruiterinfo[0].email }).fetch();
                jobdetailsjobreq = jobreq.find({ id:Number(jobid)}).fetch();

                var job = {};
                job = jobdetails[0];

                //servertraces(job.email);
                //servertraces(recruiterinfo);

                try
                {
                    job.candidatename = candidatedetails[0].candidatename;
                    job.candidatelastname = candidatedetails[0].candidatelastname;
                }
                catch(error)
                {

                }
                job.candidateemail = candidatedetails[0].candidateemail;
                job.contactno = candidatedetails[0].contactno;
                job.candidateid = candidatedetails[0].id;

                try
                {
                    job.recruitername = recruiterinfo[0].name;
                    job.recruiterlastname = recruiterinfo[0].lastname;
                }
                catch(error)
                {

                }

                job.recruiteremail= recruiterinfo[0].email;
                job.businessemail= jobdetailsjobreq[0].email;
                finalArr.push(job);

                return finalArr;
                servertraces("candidate >> getRecuriterAcceptedJobInfo  >> end","null");
            },
            candidateJobDetails:function candidateJobDetails(candidate,callback)
            {
                servertraces("candidate >> candidateJobDetails  >> start","null");
                var candidatejob = [];
                candidatejob = candidateacceptedjobs.insert(candidate);

                //candidatejob = candidateacceptedjobs.update({jobid:Number(candidate.jobid),candidateid:Number(candidate.candidateid)},{$set:{name:candidate.name,recuriteremail:candidate.recuriteremail,experience:candidate.experience,currentposition:candidate.currentposition,currentcompany:candidate.currentcompany,jointime:candidate.jointime,path:candidate.path,status:candidate.status}});

                return candidatejob;
                servertraces("candidate >> candidateJobDetails  >> end","null");
            },
            candidateJobDetailsUpdate:function candidateJobDetails(candidate,callback)
            {
                servertraces("candidate >> candidateJobDetailsUpdate  >> start","null");
                servertraces("candidate >> candidateJobDetailsUpdate  >> candidateJobDetailsUpdate  >>> ");
                var candidatejob = [];
                var dt = new Date();

                /*var jobdetails = jobreq.find({id:Number(candidate.jobid)}).fetch();
                //servertraces(jobdetails);

                var required_skills = jobdetails[0].requiredskill;
                var percentage = [];

                var threshold = jobdetails[0].threshold;
                for(var i = 0;i< candidate.requiredskill.length;i++)
                {
                    var jobrequireddetails = required_skills[i];

                    if(Number(jobrequireddetails.requiredskillexp) <= Number(candidate.requiredskill[i].requiredskillexp))
                    {
                        percentage.push(jobrequireddetails.requiredweightage);
                    }
                    else
                    {
                        var candidatepercengage = (candidate.requiredskill[i].requiredskillexp/jobrequireddetails.requiredskillexp)*jobrequireddetails.requiredweightage;
                        percentage.push(candidatepercengage);
                    }
                }

                var totalper = 0;
                for(var m = 0;m<percentage.length;m++)
                {
                    totalper = Number(totalper)+Number(percentage[m]);
                }

                var cadidatepercentage = 0;

                if(candidate.status == "rejected")
                {
                    cadidatepercentage = 0;
                }
                else
                {
                    cadidatepercentage = totalper;
                }*/

                /*var percentage = [];
                var ratingpercentage = [];

                for(var i = 0;i< candidate.requiredskill.length;i++)
                {
                    var jobrequireddetails = required_skills[i];
                    //servertraces(jobrequireddetails.requiredskillexp +">>>>>>>>>"+candidate.requiredskill[i].requiredskillexp);
                    if(Number(jobrequireddetails.requiredskillexp) <= Number(candidate.requiredskill[i].requiredskillexp))
                    {
                        percentage.push(100);
                    }
                    else
                    {
                        var val = (candidate.requiredskill[i].requiredskillexp/jobrequireddetails.requiredskillexp)*100;
                        percentage.push(val);
                    }

                    var ratingper = (candidate.requiredskill[i].rating/5)*100;
                    ratingpercentage.push(ratingper);
                }
                //servertraces(percentage);
                var totalper = 0;
                for(var m = 0;m<percentage.length;m++)
                {
                    totalper = totalper+percentage[m];
                }
                var totalratingper = 0;
                for(var n = 0;n<ratingpercentage.length;n++)
                {
                    totalratingper = totalratingper+ratingpercentage[n];
                }
                var cadidatepercentage = (totalper/(percentage.length*100))*100;
                var cadidateratingpercentage = (totalratingper/(ratingpercentage.length*100))*100;
                 */


                //servertraces(totalper);
                var date = new Date();
                candidatejob = candidates.update({id:Number(candidate.candidateid)},{$set:{candidatename:candidate.name,candidatelastname:candidate.candidatelastname,contactno:candidate.contactno}});

                candidatejob = candidateacceptedjobs.update({jobid:Number(candidate.jobid),candidateid:Number(candidate.candidateid)},{$set:{name:candidate.name,candidatelastname:candidate.candidatelastname,recuriteremail:candidate.recuriteremail,requiredskill:candidate.requiredskill,currentposition:candidate.currentposition,currentcompany:candidate.currentcompany,path:candidate.path,status:candidate.status,linkedin:candidate.linkedin,acceptedon:dt,cadidatepercentage:Math.round(candidate.cadidatepercentage),threshold:candidate.threshold}});
                candidatejob  = candidatesactivity.insert({jobid:Number(candidate.jobid),id:Number(candidate.candidateid),status:candidate.status,business:"true",recruiter:"true",date:date});
                return candidatejob;
                servertraces("candidate >> candidateJobDetailsUpdate  >> end","null");
            },
            get_candidate_details:function get_candidate_details(jobid,name,callback)
            {
                servertraces("candidate >> get_candidate_details  >> start","null");
                var candidatelist = [];
                var jobdetails = [];
                servertraces("candidate >> get_candidate_details  >> >>>>>jobid>>"+name);
                servertraces("candidate >> get_candidate_details  >> >>>>>jobid>>"+jobid);
                candidatelist = candidates.find({ id:Number(name),jobid:Number(jobid) }).fetch();
                jobdetails = jobreq.find({id:Number(jobid)}).fetch();

                for(var i = 0;i<candidatelist.length;i++)
                {
                    var obj = {};
                    obj = candidatelist[i];
                    obj.jobdetails = jobdetails;
                }

                return candidatelist;
                servertraces("candidate >> get_candidate_details  >> end","null");
            },
            update_candidate_submition:function update_candidate_submition(candidate,callback)
            {
                servertraces("candidate >> update_candidate_submition  >> start","null");
                var candidatesubmition = [];
                servertraces("candidate >> update_candidate_submition  >> Candidatesubmition >>>>>>>>",candidate);
                var dt = new Date();
                candidatesubmition = candidateacceptedjobs.update({jobid:Number(candidate.jobid),candidateid:Number(candidate.candidateid)},{$set:{name:candidate.name,candidatelastname:candidate.candidatelastname,recuriteremail:candidate.recuriteremail,requiredskill:candidate.requiredskill,currentposition:candidate.currentposition,currentcompany:candidate.currentcompany,path:candidate.path,status:candidate.status,linkedin:candidate.linkedin,acceptedon:dt,cadidatepercentage:Math.round(candidate.cadidatepercentage),threshold:candidate.threshold}});
                //candidatesubmition = candidates.update({jobid:Number(candidate.jobid)},{$set:{ candidatename:candidate.candidatename,candidatelastname:candidate.candidatelastname,contactno:candidate.contactno}});

                servertraces("candidate >> update_candidate_submition  >> Candidatesubmition >>>>>>>>",candidatesubmition);
                return candidatesubmition;
                servertraces("candidate >> update_candidate_submition  >> end","null");

            },
            update_candidate_submition_preview:function update_candidate_submition_preview(candidate,callback)
            {
                servertraces("candidate >> update_candidate_submition_preview  >> start","null");
                var candidatesubmitionpreview = [];
                servertraces("candidate >> update_candidate_submition_preview  >> Candidatesubmition >>>>>>>>",candidate);
                //candidatesubmition = candidateacceptedjobs.update({jobid:Number(candidate.jobid),candidateid:Number(candidate.candidateid)},{$set:{ name:candidate.name,candidatelastname:candidate.candidatelastname,contactno:candidate.contactno}});
                candidatesubmitionpreview = candidates.update({id:Number(candidate.candidateid)},{$set:{ candidatename:candidate.name,candidatelastname:candidate.candidatelastname,contactno:candidate.contactno}});

                servertraces("candidate >> update_candidate_submition_preview  >> Candidatesubmition >>>>>>>>",candidatesubmitionpreview);
                return candidatesubmitionpreview;
                servertraces("candidate >> update_candidate_submition_preview  >> end","null");

            },
            update_candidate_business_viewed_status:function update_candidate_business_viewed_status(jobid,candidateid,callback)
            {
                servertraces("candidate >> update_candidate_business_viewed_status  >> start","null");
                var candidatedetails = [];

                candidatedetails = candidateacceptedjobs.update({jobid:Number(jobid),candidateid:Number(candidateid)},{$set:{ businessviewstatus:"Viewed" }});

                return candidatedetails;
                servertraces("candidate >> update_candidate_business_viewed_status  >> end","null");

            },
            getCandidateAcceptedJobInfo:function getCandidateAcceptedJobInfo(jobid,candidateid,recid,callback)
            {
                servertraces("candidate >> getCandidateAcceptedJobInfo  >> start","null");
                var cadidateJobdetails = [];

                var cadidatedetails = [];
                cadidatedetails = candidates.find({ id:Number(candidateid) }).fetch();

                cadidateJobdetails = candidateacceptedjobs.find({ jobid:Number(jobid),candidateid:Number(candidateid)}).fetch();

                return cadidateJobdetails;
                servertraces("candidate >> getCandidateAcceptedJobInfo  >> end","null");
            },
            saveOfferLetterFile:function(blob, name, path, encoding)
            {
                servertraces("candidate >> saveOfferLetterFile  >> start","null");
                servertraces("candidate >> saveOfferLetterFile  >> Upload image function server");
                var path = cleanPath(path), fs = Npm.require('fs'),
                    name = cleanName(name || 'file'), encoding = encoding || 'binary',
                    chroot = Meteor.chroot || ('/root/www/html/uploadfiles/offerletters/') ;

                path="/var/www/html/uploadfiles/offerletters/";
                servertraces("candidate >> saveOfferLetterFile  >> Path :"+path);
                servertraces("candidate >> saveOfferLetterFile  >> Path :"+chroot);
                // TODO Add file existance checks, etc...
                fs.writeFile(path + name, blob, encoding, function(err) {
                    if (err) {
                        throw (new Meteor.Error(500, 'Failed to save file.', err));
                    } else {
                        servertraces('candidate >> saveOfferLetterFile  >> The file ' + name + ' (' + encoding + ') was saved to ' + path);
                    }
                });
                function cleanPath(str) {
                    if (str) {
                        return str.replace(/\.\./g,'').replace(/\/+/g,'').
                            replace(/^\/+/,'').replace(/\/+$/,'');
                    }
                }
                function cleanName(str) {
                    return str.replace(/\.\./g,'').replace(/\//g,'');
                }
                servertraces("candidate >> saveOfferLetterFile  >> end","null");
            },
            saveFile: function(blob, name, path, encoding)
            {
                servertraces("candidate >> saveFile  >> start","null");
                servertraces("candidate >> saveFile  >> Upload image function server");
                var path = cleanPath(path), fs = Npm.require('fs'),
                    name = cleanName(name || 'file'), encoding = encoding || 'binary',
                    chroot = Meteor.chroot || ('/root/www/html/uploadfiles/resumes/') ;

                path="/var/www/html/uploadfiles/resumes/";
                servertraces("candidate >> saveFile  >> Path :"+path);
                servertraces("candidate >> saveFile  >> Path :"+chroot);
                // TODO Add file existance checks, etc...
                fs.writeFile(path + name, blob, encoding, function(err) {
                    if (err) {
                        throw (new Meteor.Error(500, 'Failed to save file.', err));
                    } else {
                        servertraces('candidate >> saveFile  >> The file ' + name + ' (' + encoding + ') was saved to ' + path);
                    }
                });
                function cleanPath(str) {
                    if (str) {
                        return str.replace(/\.\./g,'').replace(/\/+/g,'').
                            replace(/^\/+/,'').replace(/\/+$/,'');
                    }
                }
                function cleanName(str) {
                    return str.replace(/\.\./g,'').replace(/\//g,'');
                }
                servertraces("candidate >> saveFile  >> candidate >> saveFile  >> end","null");
            },
            candidate_selected_interview: function candidate_selected_interview(jobid,candidateid,callback)
            {
                servertraces("candidate >> candidate_selected_interview  >> start","null");
                var candidate = [];
                var date = new Date();

                servertraces("candidate >> candidate_selected_interview  >> candidate_selected_interview>>>>>>>>>>"+jobid,candidateid);
                candidate  = candidates.update({jobid:Number(jobid),id:Number(candidateid)},{$set:{interviewstatus:shortlistedforInterview}});
                candidate  = candidateacceptedjobs.update({jobid:Number(jobid),candidateid:Number(candidateid)},{$set:{status:shortlistedforInterview}});
                candidate  = candidatesactivity.insert({jobid:Number(jobid),id:Number(candidateid),status:shortlistedforInterview,business:"true",recruiter:"true",date:date});


                return candidate;
                servertraces("candidate >> candidate_selected_interview  >> end","null");
            },
            candidate_not_selected_interview: function candidate_not_selected_interview(jobid,candidateid,callback)
            {
                servertraces("candidate >> candidate_not_selected_interview  >> start","null");
                var candidate = [];

                var date = new Date();
                servertraces("candidate >> candidate_not_selected_interview  >> candidate_selected_interview>>>>>>>>>>"+jobid);
                servertraces("candidate >> candidate_not_selected_interview  >> candidate_selected_interview>>>>>>>>>>"+candidateid);
                candidate  = candidates.update({jobid:Number(jobid),id:Number(candidateid)},{$set:{interviewstatus:notShortlistedforInterview}});
                candidate  = candidateacceptedjobs.update({jobid:Number(jobid),candidateid:Number(candidateid)},{$set:{status:notShortlistedforInterview}});
                candidate  = candidatesactivity.insert({jobid:Number(jobid),id:Number(candidateid),status:notShortlistedforInterview,business:"true",recruiter:"true",date:date});


                return candidate;
                servertraces("candidate >> candidate_not_selected_interview  >> end","null");
            },
            candidate_job_acceted:function candidate_job_acceted(jobid,cadidateid,callback)
            {
                servertraces("candidate >> candidate_job_acceted  >> start","null");
                var candidate_job = [];

                candidate_job = jobreq.update({id:Number(jobid)},{$set:{ status:positionFilled }});
                candidate_job = recruitersAcceptedJobs.find({id:Number(jobid)}).fetch();
                var date = new Date();
                var rec_activity = recruitersactivity.insert({jobid:Number(jobid),status:positionFilled,date:date,business:"true",recruiter:"true"});

                for(var i = 0;i< candidate_job.length;i++)
                {
                    //servertraces("Number(jobid)>>>"+Number(jobid)+"candidate_job[i].email>>>>>>>>"+candidate_job[i].email);
                    candidate_job = recruitersAcceptedJobs.update({id:Number(jobid)},{$set:{ status:positionFilled }},{multi: true})
                }
                candidate_job  = candidates.update({jobid:Number(jobid),id:Number(cadidateid)},{$set:{interviewstatus:jobAccepted}});
                candidate_job  = candidateacceptedjobs.update({jobid:Number(jobid),candidateid:Number(cadidateid)},{$set:{status:jobAccepted}});
                candidate_job  = candidatesactivity.insert({jobid:Number(jobid),id:Number(cadidateid),status:jobAccepted,business:"true",recruiter:"true",date:date});

                return candidate_job;
                servertraces("candidate >> candidate_job_acceted  >> end","null");
            },
            candidate_job_rejected:function candidate_job_rejected(jobid,cadidateid,callback)
            {
                servertraces("candidate >> candidate_job_rejected  >> start","null");
                var candidate_job = [];
                var date = new Date();


                candidate_job = jobreq.update({id:Number(jobid)},{$set:{status:lookingForMoreCandidates}});
                servertraces(jobid+"candidate_job>>>"+candidate_job);

                candidate_job = recruitersAcceptedJobs.find({id:Number(jobid)}).fetch();
                var rec_activity = recruitersactivity.insert({jobid:Number(jobid),status:lookingForMoreCandidates,date:date,business:"false",recruiter:"true"});

                //servertraces(candidate_job);

                for(var i = 0;i< candidate_job.length;i++)
                {
                   //servertraces(candidate_job.length+"Number(jobid)>>>"+Number(jobid)+"candidate_job[i].email>>>>>>>>"+candidate_job[i].email);
                    candidate_job = recruitersAcceptedJobs.update({id:Number(jobid)},{$set:{ status:lookingForMoreCandidates }},{multi: true})
                }

                var date = new Date();
                candidate_job  = candidates.update({jobid:Number(jobid),id:Number(cadidateid)},{$set:{interviewstatus:jobRejected}});
                candidate_job  = candidateacceptedjobs.update({jobid:Number(jobid),candidateid:Number(cadidateid)},{$set:{status:jobRejected}});
                candidate_job  = candidatesactivity.insert({jobid:Number(jobid),id:Number(cadidateid),status:jobRejected,business:"true",recruiter:"true",date:date});

                return candidate_job;
                servertraces("candidate >> candidate_job_rejected  >> end","null");
            },
            candidate_job_offered:function candidate_job_offered(jobid,candidateid,salary,dateoffer,offerletterpath,callback)
            {
                servertraces("candidate >> candidate_job_offered  >> start","null");
                var candidate_job = [];

                var date = new Date();
                candidate_job  = candidates.update({jobid:Number(jobid),id:Number(candidateid)},{$set:{interviewstatus:jobOffered,offeredsal:salary,date:dateoffer,offerletter:offerletterpath}});
                candidate_job  = candidateacceptedjobs.update({jobid:Number(jobid),candidateid:Number(candidateid)},{$set:{status:jobOffered,offeredsal:salary,date:dateoffer,offerletter:offerletterpath}});
                candidate_job  = candidatesactivity.insert({jobid:Number(jobid),id:Number(candidateid),status:jobOffered,business:"true",recruiter:"true",date:date});

                return candidate_job;
                servertraces("candidate >> candidate_job_offered  >> end","null");
            },
            candidate_not_job_offered:function candidate_not_job_offered(jobid,candidateid,callback)
            {
                servertraces("candidate >> candidate_not_job_offered  >> start","null");
                var candidate_job = [];

                var date = new Date();
                candidate_job  = candidates.update({jobid:Number(jobid),id:Number(candidateid)},{$set:{interviewstatus:rejectedforJob}});
                candidate_job  = candidateacceptedjobs.update({jobid:Number(jobid),candidateid:Number(candidateid)},{$set:{status:rejectedforJob}});
                candidate_job  = candidatesactivity.insert({jobid:Number(jobid),id:Number(candidateid),status:rejectedforJob,business:"true",recruiter:"true",date:date});

                return candidate_job;
                servertraces("candidate >> candidate_not_job_offered  >> end","null");
            },
            recutiter_count_candidates:function recutiter_count_candidates(jobid,callback)
            {
                servertraces("candidate >> recutiter_count_candidates  >> start","null");
                var countcandidates = [];
                countcandidates = candidateacceptedjobs.find({ jobid:Number(jobid) }).fetch();
                return countcandidates;
                servertraces("candidate >> recutiter_count_candidates  >> end","null");
            },
            getBusinessActivitys:function getBusinessActivitys(properties,callback)
            {
                servertraces("candidate >> getBusinessActivitys  >> start","null");
                var businessactivitys = [];
                businessactivitys = businessactivity.find({ business:"true" }).fetch();
                /*var activitys = [];
                for(var i = 0;i<businessactivitys.length;i++)
                {
                    var obj = {};
                    obj = businessactivitys[i];
                    //servertraces(obj);
                    var title = jobreq.find({ id:obj.jobid }).fetch();
                    if(title.length > 0)
                        obj.title= title[0].title;
                    else
                        obj.title= obj.jobid+" Job is removed";
                }*/

                return businessactivitys;
                servertraces("candidate >> getBusinessActivitys  >> end","null");
            }
        });
}

})();
