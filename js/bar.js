var margin = { top: -5, right: -5, bottom: -5, left: -5 };
var w = 1400 - margin.left - margin.right;
var h = 900 - margin.top - margin.bottom;
var progressW = 350;
var progressH = 900;
var barPadding = 1;
var timer = 5000;

var progress = [];

var timeout = null;

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
    if (timeout != null) {
        window.clearTimeout(timeout);
    }
}

function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
    d3.select(this).classed("dragging", false);
    if ($("#automatic-progress").is(":checked")) {
        // saveState();
        timeout = window.setTimeout(saveState, timer);
    }
    // var svg = d3.select("#canvas");
    // node = svg.selectAll("circle");
    // progress.push(node);
    // progressView(progress);
    // console.log(progress);
}

function saveState() {
    var svg = d3.select("#canvas");
    node = svg.selectAll("circle");
    var savedNode = [{}];
    // console.log(node[0][0]);
    // console.log(node[0][1]);
    // console.log(node[0][2]);
    for (i = 0; i < node[0].length; i ++) {
        savedNode.push({
            "x": node[0][i].getAttribute('cx'),
            "y": node[0][i].getAttribute('cy'),
            "r": node[0][i].getAttribute("r"),
            "title": node[0][i].getAttribute("title")
        })
    }
    // console.log(node[0][0].getAttribute('cx'));
    progress.push(savedNode);
    d3.select("#progress").selectAll("*").remove();
    progressView(progress);
    console.log(progress);
    // for (var i in progress) {
    //     document.getElementById("state-" + i).addEventListener("click", testClick(i));
    // }
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

function progressView(data) {
    var svg = d3.select("#progress")
        .attr("width", progressW)
        .attr("height", progressH)
        .attr("border", 1);
    var borderPath = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", progressH)
        .attr("width", progressW)
        .style("stroke", 'gray')
        .style("fill", "none")
        .style("stroke-width", 3);
    progressNode = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "progress-node")
        .attr("id", function(d, i) {
            return i;
        })
        .attr("cx", 40)
        .attr("cy", function(d, i) {
            return progressH - (i * 30) - 20;
        })
        .attr("r", 10);
    $("#progress > circle").click(function() {
        var index = $(this).attr("id");
        loadSavedState(progress[index]);
    });
}

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
            return d.fatalities / 10;
        })
        .attr("title", function(d) {
            return d.operator + ", " + d.fatalities + " (" + d.year.getFullYear() + ")";
        })
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .call(drag);
    progress.push(node);
    progressView(progress);
};

function loadSavedState(state) {
    // console.log(state);
    d3.select("#canvas").selectAll("*").remove();
    var svg = d3.select("#canvas");
    node = svg.selectAll("circle")
        .data(state)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        })
        .attr("r", function(d) {
            return d.r;
        })
        .attr("title", function(d){
            return d.title;
        })
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .call(drag);
}

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
