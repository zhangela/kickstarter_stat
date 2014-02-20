Meteor.publish("projects", function() {
  return Projects.find();
});

Meteor.methods({
  scrape: function() {

    Projects.remove({});
    var pages = _.range(100);

    this.unblock();

    // _.each(categories, function(category_id) {
      _.each(pages, function(page) {

        var result = HTTP.get("https://www.kickstarter.com/discover/advanced", {
                                params: {
                                  page: page,
                                  sort: "most_funded"
                                },
                                headers: {
                                  Accept: "application/json"
                                }
                              });

        _.each(result.data.projects, function(project) {
          Projects.insert(project);
        });

      });
    // });

    
  }
});