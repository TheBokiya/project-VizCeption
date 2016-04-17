var margin = { top: -5, right: -5, bottom: -5, left: -5 };
var w = 1400 - margin.left - margin.right;
var h = 900 - margin.top - margin.bottom;
var progressW = 350;
var progressH = 900;
var barPadding = 1;
var timer = 5000;

var progress = [];
var progressNodeMetaData = [];
var savedGraph = [];

var currentStatePos = { "x": 40, "y": progressH };

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
}

function newBranch() {
    currentStatePos.x += 40;
    progressNodeMetaData.push({ "x": currentStatePos.x, "y": currentStatePos.y - 20, "type": "branch" });
    d3.select("#progress").selectAll("*").remove();
    progressView(progressNodeMetaData);
}

function saveState() {
    var svg = d3.select("#canvas");
    node = svg.selectAll("circle");
    var savedNode = [{}];
    for (i = 0; i < node[0].length; i++) {
        savedNode.push({
            "x": node[0][i].getAttribute('cx'),
            "y": node[0][i].getAttribute('cy'),
            "r": node[0][i].getAttribute("r"),
            "title": node[0][i].getAttribute("title")
        })
    }
    // console.log(node[0][0].getAttribute('cx'));
    progress.push(savedNode);
    currentStatePos.y -= 40;
    progressNodeMetaData.push({
        "x": currentStatePos.x,
        "y": currentStatePos.y,
        "type": "state",
        "id": progress.length
    });
    d3.select("#progress").selectAll("*").remove();
    progressView(progressNodeMetaData);
    historyView(progressNodeMetaData);
    console.log(progressNodeMetaData);
    // for (var i in progress) {
    //     document.getElementById("state-" + i).addEventListener("click", testClick(i));
    // }
}

function historyView(data) {
    $('select#history-list').empty();
    for (var i = 0; i < data.length; i++) {
        if (data[i].type === 'state') {
            $('select#history-list').append('<option value="' + data[i].id + '">state-' + data[i].id + '</option')
        }
    }
}

function progressView(data) {
    // currentStatePos.y -= 40;

    // progressNodeMetaData.push({ "x": currentStatePos.x, "y": currentStatePos.y, "type": "state" });

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
    svg.append("text")
        .attr("x", function(d) {
            return (progressW / 2) - 60;
        })
        .attr("y", 40)
        .text("Progress View")
        .attr("font-family", "sans-serif")
        .attr("font-size", 20)
        .attr("fill", "gray");
    if (progressNodeMetaData.length > 1)
        connectProgressNode(progressNodeMetaData);
    progressNode = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d) {
            if (d.type === "state")
                return "progress-node";
            else
                return "branch-node";
        })
        .attr("id", function(d, i) {
            if (d.type === "state")
                return d.id;
            else
                return "branch-" + i;
        })
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        })
        .attr("r", function(d) {
            if (d.type === "state")
                return 10;
            else
                return 5;
        })
        .attr("title", function(d) {
            if (d.type === "state")
                return "State " + (Number(this.id) + 1);
            else
                return "New Branch";
        });
    $("#progress > circle.progress-node").click(function() {
        var index = $(this).attr("id");
        $('.selected-state').removeClass('selected-state');
        $(this).addClass('selected-state');
        loadSavedState(progress[index - 1]);
    });
}

function connectProgressNode(data) {
    var svg = d3.select("#progress");
    // console.log(data);
    for (i = 0; i < data.length - 1; i++) {
        svg.append("line")
            .style("stroke", "#95a5a6")
            .style("stroke-width", 2)
            .attr("x1", data[i].x)
            .attr("y1", data[i].y)
            .attr("x2", data[i + 1].x)
            .attr("y2", data[i + 1].y);
    }
}

function visualizeNodeGraph(data) {
    var svg = d3.select("#canvas")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom);
    node = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node tooltip")
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
            return d.fatalities / 4;
        })
        .attr("title", function(d) {
            return d.operator + ", " + d.fatalities + " (" + d.year.getFullYear() + ")";
        })
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .call(drag);
    saveState();
};

function loadSavedState(state) {
    console.log(progress);
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
        .attr("title", function(d) {
            return d.title;
        })
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .call(drag);
}
