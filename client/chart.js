var makeChart = function() {
  var drawChart = function () {
    $("#piechart").text("loading data...");

    Meteor.call("getCategoryPieChartData", function (error, category_counts) {
      // sort by count
      category_counts = _.sortBy(category_counts, function (row) {
        return -row[1];
      });

      var column_names = [["Category Name", "Count"]];
      var data = column_names.concat(category_counts);
      var chart_data = google.visualization.arrayToDataTable(data);
      var options = {
        title: 'Projects in 2000 most funded, by category'
      };

      var chart = new google.visualization.PieChart($('#piechart')[0]);
      chart.draw(chart_data, options);
    });
  };

  drawChart();
};

$(function () {
  makeChart();
});