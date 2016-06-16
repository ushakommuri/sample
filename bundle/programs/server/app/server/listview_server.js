(function(){/**
 * Created by raju on 1/7/15.
 */

if (Meteor.isServer) {
    Meteor.startup(function(){
        // initializes all typeahead instances
        //Meteor.typeahead.inject();
    });
    Meteor.methods({
        get_jobs_listview:function get_jobs_listview(properties,callback)
        {
            servertraces("listview_server >> get_jobs_listview  >> start","null");
            servertraces("listview_server >> get_jobs_listview  >> check It "+properties);
            var jobs = [];
            var query = {};
            //query.status = {"$in":["Not Started"]};
            query.status = {"$in":[notStarted,startedJob,stopped,lookingForMoreCandidates,positionFilled]};
            query.email = {"$in":[properties]};
            jobs = jobreq.find(query).fetch();
            servertraces("listview_server >> get_jobs_listview  >> list of jobs >> ",jobs);
            return jobs;
            servertraces("listview_server >> get_jobs_listview  >> end","null");
        }
    });
}


})();
