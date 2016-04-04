var w = 1500;
var h = 900;
var barPadding = 1;
var bars = function(data) {
    // max = d3.max(data, function(d) {
    //     return d.value;
    // });

    // y = d3.scale.linear()
    //     .domain([0, max])
    //     .range([0, h]);

    // x = d3.scale.ordinal()
    //     .domain(d3.range(data.length))
    //     .rangeBands([0, w], .2);

    // var vis = d3.select("#barchart");
    // var bars = vis.selectAll("rect.bar")
    //     .data(data)
    //     .enter()
    //     .append("svg:rect")
    //     .attr("class", "bar")
    //     .attr("fill", "#800")
    //     .attr("stroke", "#800");

    // // bars.exit()
    // //     .remove();

    // bars.attr("x", function(d, i) {
    //         return i * (w / data.length);
    //     })
    //     .attr("y", function(d) {
    //         return d * 4;
    //     })
    //     .attr("height", function(d, i) {
    //         return d.fatalities;
    //     })
    //     .attr("width", 20)
    //     .attr("height", h);
    var svg = d3.select("#svg")
        .attr("width", w)
        .attr("height", h);
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        // .filter(function(d){
        // 	return d.operator == "Air Canada";
        // })
        .attr("class", "bar")
        .attr("x", function(d, i) {
            return i * (w / data.length);
        })
        .attr("y", function(d) {
            return h - (d.fatalities);
        })
        .attr("width", 3)
        .attr("height", function(d) {
            return d.fatalities;
        });
};

function init() {
    var svg = d3.select("#svg")
        .attr("width", w + 100)
        .attr("height", h + 100);
    svg.append("svg:rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("stroke", "#000")
        .attr("fill", "none");
}
