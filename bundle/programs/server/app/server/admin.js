(function(){
if (Meteor.isServer)
{
    Meteor.methods({
            updateUserStatus: function updateUserStatus(obj, callback)
            {
                servertraces("admin >> updateUserStatus  >> start","null");
                var updateuser = 0;
                updateuser = users.update({email:obj.email},{$set:{status:obj.status,isadmin:obj.isadmin}});
                updateuser = recruiters.update({email:obj.email},{$set:{status:obj.status}});
                return updateuser;
                servertraces("admin >> updateUserStatus  >> end","null");
            },
            updateCandidateStatus: function updateCandidateStatus(jobid,candidateid,status, callback)
            {
                servertraces("admin >> updateCandidateStatus  >> start","null");
                var date = new Date();
                var updateCandidate = 0;
                var candidatesActivityInsert = 0;
                updateCandidate = candidateacceptedjobs.update({jobid:Number(jobid),candidateid:Number(candidateid)},{$set:{status:status}});
                candidatesActivityInsert = candidatesactivity.insert({jobid:Number(jobid),id:Number(candidateid),status:status,business:"true",recruiter:"true",date:date});
                return updateCandidate;
                servertraces("admin >> updateCandidateStatus  >> end","null");
            }
        });
}

})();
