function showStreams(streamInfo, streamList, buildingMap) {
    $('#streamList').modal('show');
    d3.select(".modal-body").selectAll("*").remove();
    
    var streamTable = d3.select(".modal-body").append('table')
                            .attr('class', 'table table-sm table-bordered stream-table')
    
    var streamBody = streamTable.append('tbody')
    
    var i = 0;
    streamList.forEach(function(d){
        streamRow = streamBody.append('tr').attr('id', 'sr' + i.toString());
        
        streamRow.append('td')
                    .attr('style', 'text-align:left;')
                    .text(d)
        streamRow.append('td')
                .append('img')
                    .attr('class', 'row-simage')
                    .attr('src', 'static/images/icons/link.png');
        streamRow.append('td')
                .text('stream-name');
        streamRow.append('td')
                .append('img')
                    .attr('class', 'row-simage')
                    .attr('src', 'static/images/icons/upload.png');
        streamRow.append('td')
                .text('filename');
        streamRow.append('td')
                .append('img')
                    .attr('class', 'row-simage')
                    .attr('id', streamInfo + '_' + i.toString())
                    .attr('style', 'cursor:pointer;')
                    .attr('src', 'static/images/icons/cancel.png')
                .on('click', function(){
                    var tag_list = this.id.split('_');
                    if (tag_list.length == 5) {
                        jQuery("#sr" + tag_list[4].toString()).remove();
                        delete buildingMap["floors"][tag_list[0]]["zones"][tag_list[1]][tag_list[2]][tag_list[4]]
                    } else if (tag_list.length == 4) {
                        jQuery("#sr" + tag_list[3].toString()).remove();
                        delete buildingMap["floors"][tag_list[0]]["appliances"][tag_list[1]][tag_list[3]]
                    } else if (tag_list.length == 3) {
                        jQuery("#sr" + tag_list[2].toString()).remove();
                        delete buildingMap["appliances"][tag_list[0]][tag_list[2]]
                    }
                });
        i = i + 1;
    });
}

function printApplianceList(iType, id, buildingMap) {
    var label = "";
    var cross_tag = "";
    var appliances = [];
    if (iType == "building") {
        label = "Building Loads";
        cross_tag = "_"
        appliances = buildingMap["appliances"];
    } else if (iType == "floor") {
        label = "Floor-" + id.split('F')[1].toString() + " Loads"
        cross_tag = "F" + id.split('F')[1].toString() + "_"
        appliances = buildingMap["floors"][id]["appliances"];
    } else if (iType == "zone") {
        label = "Floor-" + id.split('_')[0].split('F')[1].toString() + " Zone-" + id.split('_')[1].split('Z')[1].toString() + " Loads";
        cross_tag = "F" +  + id.split('_')[0].split('F')[1].toString() + "_Z" + id.split('_')[1].split('Z')[1].toString() + "_"
        appliances = buildingMap["floors"][id.split('_')[0]]["zones"][id.split('_')[1]];
    }
    
    var applianceDiv = d3.select(".list-of-appliances");
    applianceDiv.selectAll("*").remove();
    
    var applianceTable = applianceDiv.append('table')
                            .attr('class', 'table table-sm table-bordered appliance-table')
                            .attr('id', 'appliance-table')
    
    var tableHead = applianceTable.append('thead').append('tr').append('th')
            .attr('scope', 'col')
            .attr('colspan', 2)
            .text(label);
    
    var tableBody = applianceTable.append('tbody')
    
    for (var i=0; i<Object.keys(appliances).length; i++) {
        var appliance = Object.keys(appliances)[i];
        var app_cross_tag = cross_tag + appliance + '_' + i.toString();
        
        var tableRow = tableBody.append('tr').attr('id', 'r' + i.toString());
        
        tableRow.append('td')
                    .attr('style', 'text-align:left;')
                    .attr('class', 'clickable-link')
                .append('a')
                    .attr('href', 'javascript:void(0);')
                    .text(appliance)
                .on('click', function(data) {
                    showStreams(app_cross_tag, appliances[appliance], buildingMap);
                });
        tableRow.append('td')
                .append('img')
                    .attr('class', 'row-simage')
                    .attr('id', app_cross_tag)
                    .attr('src', 'static/images/icons/cancel.png')
                    .attr('style', 'cursor:pointer;')
                .on('click', function(){
                    var tag_list = this.id.split('_');
                    if (tag_list.length == 4) {
                        jQuery("#r" + tag_list[3].toString()).remove();
                        delete buildingMap["floors"][tag_list[0]]["zones"][tag_list[1]][tag_list[2]]
                    } else if (tag_list.length == 3) {
                        jQuery("#r" + tag_list[2].toString()).remove();
                        delete buildingMap["floors"][tag_list[0]]["appliances"][tag_list[1]]
                    } else if (tag_list.length == 2) {
                        jQuery("#r" + tag_list[1].toString()).remove();
                        delete buildingMap["appliances"][tag_list[0]]
                    }
                });
    }
}

function generateTable(sysVariables, buildingMap, buildingModel) {
    buildingModel.selectAll('*').remove();
    buildingTable = buildingModel.append('table')
                        .attr('class', 'table table-sm table-bordered building-model')
    
    var tableBody = buildingTable.append('tbody');
    
    var nfloors = Object.keys(buildingMap["floors"]).length;
    for (var i=nfloors-1; i>=0; i--) {
        floorRow = tableBody.append('tr').attr('class', 'F' + (i+1).toString() + '_row')
        nzones = Object.keys(buildingMap["floors"]['F' + (i+1).toString()]["zones"]).length;
        
        var nzoneArraylen = nzones * Math.ceil(sysVariables['max_nzones'] % nzones);
        
        nzoneArray = new Array(nzones).fill(0);
        for (var j=0; j<sysVariables['max_nzones']; j++) {
            nzoneArray[j%nzones] = nzoneArray[j%nzones] + 1;
        }
        
        for (var j=0; j<nzones; j++) {
            floorRow.append('td')
                        .attr('colspan', nzoneArray[j])
                        .attr('class', 'zone-block clickable-link')
                    .append('a')
                        .attr('href', 'javascript:void(0);')
                        .attr('id', 'F' + (i+1).toString() + '_Z' + (j+1).toString())
                        .text('Z' + (j+1).toString())
                    .on('click', function(data) {
                        printApplianceList('zone', this.id, buildingMap);
                    });
        }
        
        floorRow.append('td')
                    .attr('class', 'floor-block clickable-link')
                .append('a')
                    .attr('href', 'javascript:void(0);')
                    .attr('id', 'F' + (i+1).toString())
                    .text('F' + (i+1).toString())
                .on('click', function(data) {
                    printApplianceList('floor', this.id, buildingMap);
                });
    }
    
    tableBody.append('tr').append('td')
            .attr('scope', 'col')
            .attr('colspan', sysVariables['max_nzones'])
            .attr('class', 'building-block clickable-link')
        .append('a')
            .attr('href', 'javascript:void(0);')
            .attr('id', 'B0')
            .text("Building Loads")
        .on('click', function(data) {
            printApplianceList('building', this.id, buildingMap);
        });
}

function addFloor(f_no, floorPanel, sysVariables, buildingMap, buildingModel, nZones=1) {
    var currentNZones = nZones;
    if (currentNZones > sysVariables['max_nzones']) { sysVariables['max_nzones'] = currentNZones; }
    
    var floorID = f_no;
            
    var panel = floorPanel
                    .append('div')
                        .attr('class', 'col-sm-3 floor-div f' + (f_no+1).toString())
    
    panel
        .append('label')
            .text('F' + (f_no+1).toString())
            .attr('class', 'col-sm-12')

    panel
        .append('div')
            .attr('class', 'col-sm-12 floor-input')
        .append('input')
            .attr('id', 'f' + (f_no+1).toString() + 'zones')
            .attr('name', 'nzones')
            .attr('class', 'form-control floor-input')
            .attr('type', 'text')
            .attr('value', currentNZones)
            .attr('style', 'text-align:center;')
        .on('change', function(){
            var floorID = 'F' + this.id.split('zones')[0].split('f')[1];
            
            // previous number of floors
            var currentNZones = $("." + floorID + "_row" + " > td").length-1
            var updatedNZones = parseInt(jQuery('#' + this.id).val());

            if (updatedNZones > sysVariables['max_nzones']) { sysVariables['max_nzones'] = updatedNZones; }
            if (updatedNZones > currentNZones) {
                for (var i=currentNZones; i<updatedNZones; i++) {
                    buildingMap["floors"][floorID]["zones"]['Z' + (i+1).toString()] = ["HVAC", "Lighting", "Laptops", "Monitors"];
                }
            } 
            else if (updatedNZones < currentNZones) {
                // remove floors from the end
                for (var i=currentNZones; i>updatedNZones; i--) {
                    delete buildingMap["floors"][floorID]["zones"]['Z' + (i).toString()];
                }
            }
            generateTable(sysVariables, buildingMap, buildingModel);
        });
}

jQuery('#learn_model').on('click', function(){
    window.location.href = 'model.html';
})

// jQuery(document).ready(function(){
function runModel() {
    var currentDiv = "building-type";
    var dataList;
    
    var buildingMap;
    var sysVariables = { max_nzones: 0 };
            
    d3.json("static/data/sensorsList.json").then(function(data){
        dataList = data;
    });
    
    var parentDict = {
        "residential-type": "building-type",
        "commercial-type": "building-type",
        "office-type": "commercial-type",
        "healthcare-type": "commercial-type",
        "school-type": "commercial-type",
        "hotel-type": "commercial-type",
        "restaurant-type": "commercial-type",
        "shop-type": "commercial-type"
    };
    
    jQuery('input[type=radio][name=building-type]').on('change', function(){
        if(this.value == 'residential') {
            currentDiv = "residential-type";
        } else {
            currentDiv = "commercial-type";
        }
        jQuery('.building-type').hide();
        jQuery('.back-button-div').show();
        jQuery('.' + currentDiv).show();
    });
    
    jQuery('input[type=radio][name=commercial-type]').on('change', function(){
        if(this.value == 'office') {
            currentDiv = "office-type";
        } else if (this.value == 'healthcare') {
            currentDiv = "healthcare-type";
        } else if (this.value == 'school') {
            currentDiv = "school-type";
        } else if (this.value == 'hotel') {
            currentDiv = "hotel-type";
        } else if (this.value == 'restaurant') {
            currentDiv = "restaurant-type";
        } else if (this.value == 'shop') {
            currentDiv = "shop-type";
        } else {
            currentDiv = "commercial-type";
        }
        
        jQuery('.commercial-type').hide();
        jQuery('.' + currentDiv).show();
    });
    
    jQuery('#back-button').on('click', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('input:radio').prop('checked', false);
        
        jQuery('.' + currentDiv).hide();
        currentDiv = parentDict[currentDiv];
        
        if (currentDiv == "building-type") {
            jQuery('.back-button-div').hide();
        }
        jQuery('.' + currentDiv).show();
        jQuery('.configuration-panel').hide();
        jQuery('.summary-panel').hide();
    });

    jQuery('.leafRadio').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        
        var selectedVal = document.querySelector('input[name=' + this.name + ']:checked').value;
        d3.json("static/data/buildingJson.json").then(function(data){
            
            // remove previous list
            d3.select('.floor-list').selectAll('*').remove();
    
            // select building
            buildingMap = data["mra"];
            buildingDiv = d3.select('.building-box')
            
            // get number of floors from the default building file and set in the configuration panel
            var nfloors = Object.keys(buildingMap["floors"]).length;
            jQuery('#nfloors').val(nfloors);
            
            // add floors to floor list in the configuration panel
            var floorPanel = d3.select('.floor-list');
            for (var i=0; i<nfloors; i++) {
                var nZones = Object.keys(buildingMap["floors"]['F'+(i+1).toString()]["zones"]).length;
                addFloor(i, floorPanel, sysVariables, buildingMap, buildingDiv, nZones);
            }
            
            // show configuration panel
            jQuery('.configuration-panel').show();
            
            // update summary table
            generateTable(sysVariables, buildingMap, buildingDiv);
            
            // show summary panel
            jQuery('.summary-panel').show();
            
            // add event on change in value of text box
            jQuery('input[type=text][name=nfloors]').on('change', function(){
                
                // previous number of floors
                var currentNFloors = $(".floor-list > div").length
                
                // update number of floors
                var updatedNFloors = jQuery('input[type=text][name=nfloors]').val();
                
                // if now the number of floors is more
                if (updatedNFloors > currentNFloors) {
                    
                    // add new floors in the building
                    for (var i=currentNFloors; i<updatedNFloors; i++) {
                        
                        // add new floor
                        addFloor(i, floorPanel, sysVariables, buildingMap, buildingDiv);
                        
                        // update building configuration json
                        buildingMap["floors"]['F' + (i+1).toString()] = {};
                        buildingMap["floors"]['F' + (i+1).toString()]["appliances"] = ["HVAC", "Lighting", "Laptops", "Monitors"];
                        buildingMap["floors"]['F' + (i+1).toString()]["zones"] = {"Z1": ["HVAC", "Lighting", "Laptops", "Monitors"]};
                    }
                } // if now the number of floors is less
                else if (updatedNFloors < currentNFloors) {
                    // remove floors from the end
                    for (var i=currentNFloors; i>updatedNFloors; i--) {
                        
                        // remove floor
                        d3.select('.f' + i.toString()).remove();
                        
                        // update json
                        delete buildingMap["floors"]['F' + (i).toString()];
                    }
                    
                    // update max_nzones
                    sysVariables['max_nzones'] = 0
                    for (var i=0; i<nfloors; i++) {
                        
                        var nZones = Object.keys(buildingMap["floors"]['F' + (i+1).toString()]["zones"]).length
                        if (nZones > sysVariables['max_nzones']) {
                            sysVariables['max_nzones'] = nZones;
                        }
                    }
                }
                // build summary table
                generateTable(sysVariables, buildingMap, buildingDiv);
            });
        });
    });
}
// });

function addService(key) {
    var selectionBox = d3.select('#select-service')
                            .append('div')
                                .attr('class', 'col-md-3 form-check form-check-inline selection-box');

    selectionBox.append('input')
        .attr('class', 'form-check-input')
        .attr('type', 'checkbox')
        .attr('name', 'applianceType')
        .attr('id', key)
        .attr('value', key);

    var figure = selectionBox.append('label')
                                .attr('class', 'form-check-label leaf')
                                .attr('for', key)
                            .append('figure');
    
    figure.append('img')
            .attr('class', 'label-image')
            .attr('src', 'static/images/icons/monitors.png');
}

function showGridServices() {
    services =  {
                    'curtailment': {"label": "Curtailment", "ranks": {"HVAC":1, "Lighting":2, "Desktops":3, "Laptops":4}}, 
                    'frequencyRegulation': {"label": "Frequency Regulation", "ranks": {"HVAC":2, "Lighting":3, "Desktops":1, "Laptops":4}}, 
                    'ramping': {"label": "Ramping", "ranks": {"HVAC":1, "Lighting":4, "Desktops":3, "Laptops":2}}, 
                    'reactivePowerControl': {"label": "Reactive Power Control", "ranks": {"HVAC":4, "Lighting":1, "Desktops":3, "Laptops":2}}
                }
    
    for (var i=0; i<4; i++) {
        var key = Object.keys(services)[i];
        addService(key);
    }
}

function addGridService(tag, label, applianceRanking) {
    var dragging = {};
    
    var div = d3.select(".grid-services").append('div').attr('class', 'col-sm-3 ' + tag)
    var margin = {top: 0, right: 0, bottom: 20, left: 0},
        actualWidth = +d3.select('.' + tag).style('width').slice(0, -2)
        actualWidth = actualWidth * 0.65
        width = actualWidth - margin.left - margin.right,
        height = 2*actualWidth - margin.top - margin.bottom;

    var textDiv = d3.select(".service-labels").append('div')
                        .attr('class', 'col-sm-3 text-wrap text-left mx-auto')
                        .text(label)
                        .style("font-size", function(d) { return width * 0.17 + "px"; })
        
    var svg = div
              .append("svg")
                .attr("class", 'mx-auto')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("margin-left", margin.left + "px")
              .append("g")
                .attr("id", "matrix")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var applianceMatrix = [], 
        appliances = Object.keys(applianceRanking),
        n = appliances.length;
    
    appliances.forEach(function(app, i){
        applianceMatrix[i] = {x: i, y: +applianceRanking[app]-1, z: app};
    });
    
    var y = d3.scaleBand().range([0, height], 0, 1),
        c = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(n));
    
    // Default order
  	var orders = {
    	appliance: d3.range(n).sort(function(a, b) { return d3.ascending(applianceMatrix[a].y, applianceMatrix[b].y); })
  	};
    
    // The default sort order.
  	y.domain(orders.appliance);
  	
    svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);
    
    
    var row = svg.selectAll("." + tag + "G")
                    .data(applianceMatrix)
                        .enter()
                    .append("g")
                        .attr("class", tag + "G")
                        .attr("transform", function(d, i) { 
                            return "translate(0," + y(d.y) + ")"; 
                        })
                    
    row.append("rect")
        .attr("x", 0)
        .attr("width", width * 0.75)
        .attr("height", y.bandwidth())
        .attr("fill", 'None')
        .style("stroke", function(d) { 
            return c(d.y); 
        })
        .style("stroke-width", 2);
    
    row.append("image")
        .attr("id", tag + "Image")
        .attr("x", width * 0.8)
        .attr("y", y.bandwidth() * 0.23)
        .attr("width", width * 0.12)
        .attr("height", y.bandwidth())
        .attr('class', 'row-simage')
        .style('cursor', 'pointer')
        .attr('xlink:href', 'static/images/icons/cancel.png');
    
    row.append("rect")
        .attr("x", width * 0.75)
        .attr("width", width * 0.25)
        .attr("height", y.bandwidth())
        .attr("fill", 'None')
        .style("stroke", function(d) { 
            return c(d.y); 
        })
        .style("stroke-width", 0)
        .style("padding-top", 4)
        .attr("fill", "url(#" + tag + "Image)");
    
    row.append("text")
        .attr("class", tag + "Rect")
        .attr("x", width * 0.05)
        .attr("dy", y.bandwidth() * 0.6)
        .style("font-size", function(d) { return y.bandwidth() * 0.35 + "px"; })
        .style("cursor", "pointer")
        .text(function(d) { 
            return appliances[d.y]; 
        });
    
    var drag_behavior = d3.drag();
	var trigger;
    
    d3.selectAll("." + tag + "G")
        .call(d3.drag()
                .subject(function(d) { 
                    return {y: y(d.y)}; 
                })
                .on("start", function(d) {
                    trigger = d3.event.sourceEvent.target.className.baseVal;
                    
                    if (trigger == tag + "Rect") {
                        d3.selectAll("." + tag + "Rect").attr("opacity", 1);
                        dragging[d.y] = y(d.y);
                        
				        // Move the row that is moving on the front
				        sel = d3.select(this);
				        sel.moveToFront();
                    }
                })
                .on("drag", function(d) {
                    // Hide what is in the back
                    
                    if (trigger == tag + "Rect") {
                        dragging[d.y] = Math.min(height, Math.max(-1, d3.event.y));
                        orders.appliance.sort(function(a, b) { 
                            return position(a) - position(b); 
                        });
                        
                        y.domain(orders.appliance);
                        
                        d3.selectAll("." + tag + "G").attr("transform", function(d, i) {
                            return "translate(0," + position(d.y) + ")"; 
                        });
                    }
                })
                .on("end", function(d) {
                    if (trigger == tag + "Rect") {
                        delete dragging[d.y];
                        
	          	        transition(d3.select(this)).attr("transform", "translate(0," + position(d.y) + ")");
                    }
                })
        );
    
    d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
            this.parentNode.appendChild(this);
        });
    };

    function position(d) {
        var v = dragging[d];
        return v == null ? y(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }
}

jQuery('#service-selected').on('click', function(){
    jQuery('.service-selection-panel').hide();
    jQuery('.model-panel').show();
    
    services =  {
                    'curtailment': {"label": "Curtailment", "ranks": {"HVAC":1, "Lighting":2, "Desktops":3, "Laptops":4}}, 
                    'frequencyRegulation': {"label": "Frequency Regulation", "ranks": {"HVAC":2, "Lighting":3, "Desktops":1, "Laptops":4}}, 
                    'ramping': {"label": "Ramping", "ranks": {"HVAC":1, "Lighting":4, "Desktops":3, "Laptops":2}}, 
                    'reactivePowerControl': {"label": "Reactive Power Control", "ranks": {"HVAC":4, "Lighting":1, "Desktops":3, "Laptops":2}}
                }
    
    d3.select(".grid-services").selectAll('*').remove();
    d3.select(".service-labels").selectAll('*').remove();
    
    for (var i=0; i<4; i++) {
        var key = Object.keys(services)[i];
        addGridService(key, services[key]["label"], services[key]["ranks"]);
    }
});

jQuery('#back-to-selection').on('click', function(){
    jQuery('.model-panel').hide();
    jQuery('.service-selection-panel').show();
});

jQuery('#reconfigure').on('click', function(){
    window.location.href = 'index.html';
});

jQuery(window).resize(function() {
        location.reload();
});