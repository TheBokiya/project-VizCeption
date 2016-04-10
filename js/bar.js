var margin = { top: -5, right: -5, bottom: -5, left: -5 };
var w = 1500 - margin.left - margin.right;
var h = 900 - margin.top - margin.bottom;
var barPadding = 1;

var drag = d3.behavior.drag()
    .origin(function(d) {
        return d;
    })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
}

function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
    d3.select(this).classed("dragging", false);
}

var bars = function(data) {
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
        });
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
var savedGraph = [];

function visualizeNodeGraph(data) {
    var svg = d3.select("#canvas")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom);
    node = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
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
            return d.fatalities / 2;
        })
        .attr("title", function(d) {
            return d.operator + ", " + d.fatalities + " (" + d.year.getFullYear() + ")";
        })
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .call(drag);

    // for (var i in node[0]) {
    //     var tempNode = {
    //         "x": node[0][i].getAttribute('cx'),
    //         "y": node[0][i].getAttribute('cy'),
    //         "r": node[0][i].getAttribute('r'),
    //         "title": node[0][i].getAttribute("title")
    //     };
    //     savedGraph.push(tempNode);
    // };
    saveGraph(node);
    window.localStorage.setItem("positions", JSON.stringify(savedGraph));
    console.log(localStorage.getItem("positions"));
    // console.log(JSON.stringify(savedGraph));
};

function saveGraph(nodes) {
    for (var i in nodes[0]) {
        var tempNode = {
            "x": nodes[0][i].getAttribute('cx'),
            "y": nodes[0][i].getAttribute('cy'),
            "r": nodes[0][i].getAttribute('r'),
            "title": nodes[0][i].getAttribute("title")
        };
        savedGraph.push(tempNode);
    }
};

function savePos(d) {
    console.log(d.x + "," + d.y);
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
