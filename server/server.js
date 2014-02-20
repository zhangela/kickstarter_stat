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
      category_id = parseInt(category_id, 10);
      var selector = {
        $or: [{"category.id": category_id}, {"category.parent_id": category_id}]
      };

      console.log(selector);
      var number_entries = Projects.find(selector).count();
      console.log(number_entries);
      return [category_name, number_entries];
    });

    return category_counts;
  }
});