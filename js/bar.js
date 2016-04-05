var w = 1500;
var h = 900;
var barPadding = 1;

// var drag = d3.behavior.drag()
//     .origin(function(d){
//         return d;
//     })
//     .on("dragstart", dragstarted)
//     .on("drag", dragged)
//     .on("dragend", dragended);

var drag = d3.behavior.drag()
    .on("drag", function(d, i) {
        d.x += d3.event.dx
        d.y += d3.event.dy
        d3.select(this).attr("transform", function(d, i) {
            return "translate(" + [d.x, d.y] + ")";
        })
    });

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
};

function dragged(d) {
    console.log(d.x);
    d3.select(this).attr("cx", d.x = d3.event.x)
        .attr("cy", d.y = d3.event.y);
};

function dragended(d) {
    d3.select(this).classed("dragging", false);
};

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
    var svg = d3.select("#canvas")
        .attr("width", w)
        .attr("height", h);
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        // .filter(function(d){
        //  return d.operator == "Air Canada";
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
        })
        .attr("title", function(d) {
            return d.operator + ", " + d.fatalities + " (" + d.year.getFullYear() + ")";
        })
        .call(drag);
};

function init() {
    var svg = d3.select("#canvas")
        .attr("width", w + 100)
        .attr("height", h + 100);
    svg.append("svg:rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("stroke", "#000")
        .attr("fill", "none");
};

function visualizeNodeGraph(data) {
    var svg = d3.select("#canvas")
        .attr("width", w)
        .attr("height", h);
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .filter(function(d) {
            return d.fatalities > 100;
        })
        .attr("class", "node")
        .attr("cx", function(d) {
            var posX = Math.floor((Math.random() * w) + 1);
            // var posX = +d.year.getFullYear();
            return d.x = posX;
        })
        .attr("cy", function(d) {
            var posY = Math.floor((Math.random() * h) + 1);
            // var posY = +d.fatalities;
            return d.y = posY;
        })
        .attr("r", function(d) {
            return d.fatalities / 5;
        })
        .attr("title", function(d) {
            return d.operator + ", " + d.fatalities + " (" + d.year.getFullYear() + ")";
        })
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .call(drag);
};

// function nodeConstructor(svg, data, x, y) {
//     svg.selectAll("circle")
//         .data(data)
//         .enter()
//         .append("circle")
//         .attr("class", "node")
//         .attr("cx", function(d) {
//             var posX = Math.floor((Math.random() * w) + 1);
//             return d.x = posX;
//         })
//         .attr("cy", function(d) {
//             var posY = Math.floor((Math.random() * h) + 1);
//             return d.y = posY;
//         })
//         .attr("r", function(d) {
//             return d.fatalities / 5;
//         })
//         .attr("title", function(d) {
//             return d.operator + ", " + d.fatalities + " (" + d.year.getFullYear() + ")";
//         })
//         .attr("transform", function(d) {
//             return "translate(" + d.x + "," + d.y + ")";
//         })
//         .call(drag);
// };
