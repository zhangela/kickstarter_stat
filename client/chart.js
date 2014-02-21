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

var makeFundingChart = function() {
  var drawChart = function () {
    $("#piechart").text("loading data...");

    Session.set("selected_category_id", null);

    Meteor.call("getCategoryPieChartData", function (error, category_counts) {
      // sort by count
      category_counts = _.sortBy(category_counts, function (row) {
        return -row[1];
      });

      var column_names = [["Category Name", "Count", "Category ID"]];
      var data = column_names.concat(category_counts);
      var chart_data = google.visualization.arrayToDataTable(data);

      var options = {
        title: '# Projects Per Category'
      };

      var chart = new google.visualization.PieChart($('#piechart')[0]);
      chart.draw(chart_data, options);

      google.visualization.events.addListener(chart, "select", function () {
        Session.set("selected_category_id",
          chart_data.getValue(chart.getSelection()[0].row, 2));
      });

      Deps.autorun(updateHistogram);
    });
  };

  var updateHistogram = function () {
    $("#histogram").text("loading...");

    Meteor.call("getHistogramDataForCategory",
      Session.get("selected_category_id"), function (error, items) {
        var column_names = [["Project Name", "Funding Amount"]];
        var data = column_names.concat(items);
        var chart_data = google.visualization.arrayToDataTable(data);

        var title;
        if (Session.get("selected_category_id")) {
          title = 'Funding distribution for ' +
            category_names[Session.get("selected_category_id")];
        } else {
          title = "Funding distribution for all projects";
        }

        var options = {
          title: title,
          enableInteractivity: false
        };

        var chart = new google.visualization.Histogram($('#histogram')[0]);
        chart.draw(chart_data, options);
      });
  };

  drawChart();
};




var makeLocationChart = function() {

  var drawChart = function () {
    $("#locationchart").text("loading data...");

    Session.set("selected_location_name", null);

    Meteor.call("getLocationPieChartData", function (error, category_counts) {
      // sort by count
      category_counts = _.sortBy(category_counts, function (row) {
        return -row[1];
      });

      var column_names = [["Location", "Count"]];
      var data = column_names.concat(category_counts);
      var chart_data = google.visualization.arrayToDataTable(data);

      var options = {
        title: '# Projects Per Country'
      };

      var chart = new google.visualization.PieChart($('#locationchart')[0]);
      chart.draw(chart_data, options);

      google.visualization.events.addListener(chart, "select", function () {
        Session.set("selected_location_name",
          chart_data.getValue(chart.getSelection()[0].row, 0));
      });

      Deps.autorun(updateLocationHistogram);
    });
  };

  var updateLocationHistogram = function () {
    $("#locationhistogram").text("loading...");

    Meteor.call("getHistogramDataForLocation",
      Session.get("selected_location_name"), function (error, items) {
        var column_names = [["Project Name", "Funding Amount"]];
        var data = column_names.concat(items);
        console.log(data);
        var chart_data = google.visualization.arrayToDataTable(data);

        var title;
        if (Session.get("selected_location_name")) {
          title = '# Projects Per State for ' +
            Session.get("selected_location_name");
        } else {
          title = "Funding distribution for all projects";
        }

        var options = {
          title: title,
          enableInteractivity: false
        };

        var chart = new google.visualization.PieChart($('#locationhistogram')[0]);
        chart.draw(chart_data, options);
      });
  };

  drawChart();

};

$(function () {
  makeFundingChart();
  makeLocationChart();
});














