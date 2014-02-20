var makeChart = function() {
  var drawChart = function () {
    $("#piechart").text("loading data...");

    Session.set("selected_category_id", null);

    Meteor.call("getCategoryPieChartData", function (error, category_counts) {
      // sort by count
      category_counts = _.sortBy(category_counts, function (row) {
        return -row[1];
      });

      var column_names = [["Category Name", "Category ID", "Count"]];
      var data = column_names.concat(category_counts);
      var chart_data = google.visualization.arrayToDataTable(data);

      var options = {
        title: 'Number of projects in each category'
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

        var options = {
          title: 'Funding distribution',
          enableInteractivity: false
        };

        var chart = new google.visualization.Histogram($('#histogram')[0]);
        chart.draw(chart_data, options);
      });
  };

  drawChart();
};

$(function () {
  makeChart();
});