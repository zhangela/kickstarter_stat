var makeChart = function() {
  function drawChart() {
        console.log("draw");

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
      var number_entries = Projects.find({
        $or: [{"category.id" : category_id}, {"category.parent_id": category_id}]
      }).count();
      return [category_name, number_entries];
    });

    var column_names = [["Category Name", "Count"]];
    var data = column_names.concat(category_counts);
    var chart_data = google.visualization.arrayToDataTable(data);
    var options = {
      title: 'By Category'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(chart_data, options);
  }

  google.load("visualization", "1", {packages:["corechart"]});
  google.setOnLoadCallback(drawChart);


};


$(function() {
  Meteor.subscribe("projects", function() {
    makeChart();
  });

});