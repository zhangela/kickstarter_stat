var projectsInCategory = function (category_id, fields) {
  category_id = parseInt(category_id, 10);

  var selector = {
    $or: [{"category.id": category_id}, {"category.parent_id": category_id}]
  };

  if (fields) {
    return Projects.find(selector, {
      fields: fields
    });
  } else {
    return Projects.find(selector);
  }
};

Meteor.methods({
  scrape: function() {
    Projects.remove({});
    var pages = _.range(100);

    this.unblock();

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
  },


  getCategoryPieChartData: function () {
    if (Projects.find().count() === 0) {
      Meteor.call("scrape");
    }

    var categories = [1, 3, 6, 7, 9, 11, 10, 12, 14, 15, 18, 16, 17];
    var category_names = {
      1: "Art",
      3: "Comics",
      6: "Dance",
      7: "Design",
      9: "Fashion",
      11: "Film and Video",
      10: "Food",
      12: "Games",
      14: "Music",
      15: "Photography",
      18: "Publishing",
      16: "Technology",
      17: "Theatre"
    };

    var category_counts = _.map(category_names, function(category_name, category_id) {
      var number_entries = projectsInCategory(category_id).count();
      return [category_name, number_entries, category_id];
    });
    return category_counts;
  },
  getHistogramDataForCategory: function (category_id) {
    var projects;

    if (category_id) {
      projects = projectsInCategory(category_id, {name: 1, pledged: 1}).fetch();
    } else {
      projects = Projects.find({}, {fields: {name: 1, pledged: 1}}).fetch();
    }

    return _.map(projects,
      function (doc) {
        return [doc.name, doc.pledged];
      });
  },

  getLocationPieChartData: function() {
    var counts = {};
    var projects = Projects.find().fetch();
    _.each(projects, function(project) {
      var location = project.location.country;
      if (counts[location]) {
        counts[location] += 1;
      } else {
        counts[location] = 1;
      }
    });

    return _.pairs(counts);
  },
  getHistogramDataForLocation: function (location) {
    var projects;

    if (location) {
      projects = Projects.find({"location.country": location}, {fields: {name: 1, location: 1}}).fetch();
    } else {
      projects = Projects.find({}, {fields: {name: 1, location: 1}}).fetch();
    }

    var counts = {};
    _.each(projects, function(project) {
      var location = project.location.state;
      if (counts[location]) {
        counts[location] += 1;
      } else {
        counts[location] = 1;
      }
    });

    return _.pairs(counts);
  }
});