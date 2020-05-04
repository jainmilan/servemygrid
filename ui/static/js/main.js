var globalBuildingTypes, c_indx, globalBuildingMap, globalDefaultAppList;
var sysVariables = { max_nzones: 0 };

function showStreams(streamInfo, streamList) {
    $('#streamList').modal('show');
    d3.select("#mdlbdy-stream-list").selectAll("*").remove();
    
    var streamTable = d3.select("#mdlbdy-stream-list").append('table')
                            .attr('class', 'table table-sm table-bordered stream-table')
    
    var streamBody = streamTable.append('tbody')
    
    var i = 0;
    streamList.forEach(function(d){
        streamRow = streamBody.append('tr').attr('id', 'sr' + i.toString());
        
        streamRow.append('td')
                    .attr('style', 'text-align:left;')
                    .text(d.label)
        streamRow.append('td')
                .append('img')
                    .attr('class', 'row-simage')
                    .attr('src', 'static/images/icons/link.png');
        streamRow.append('td')
                .text(d.stream);
        streamRow.append('td')
                .append('img')
                    .attr('class', 'row-simage')
                    .attr('src', 'static/images/icons/upload.png');
        streamRow.append('td')
                .text(d.filename);
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
                        delete globalBuildingMap["building"]["floors"][tag_list[0]]["zones"][tag_list[1]][tag_list[2]][tag_list[4]]
                    } else if (tag_list.length == 4) {
                        jQuery("#sr" + tag_list[3].toString()).remove();
                        delete globalBuildingMap["building"]["floors"][tag_list[0]]["appliances"][tag_list[1]][tag_list[3]]
                    } else if (tag_list.length == 3) {
                        jQuery("#sr" + tag_list[2].toString()).remove();
                        delete globalBuildingMap["building"]["appliances"][tag_list[0]][tag_list[2]]
                    }
                });
        i = i + 1;
    });
}

function printApplianceList(iType, id) {
    var label = "";
    var cross_tag = "";
    var appliances = [];
    
    if (iType == "building") {
        label = "Building Loads";
        cross_tag = "_"
        appliances = globalBuildingMap["building"]["appliances"];
    } else if (iType == "floor") {
        label = "Floor-" + id.split('F')[1].toString() + " Loads"
        cross_tag = "F" + id.split('F')[1].toString() + "_"
        appliances = globalBuildingMap["building"]["floors"][id]["appliances"];
    } else if (iType == "zone") {
        label = "Floor-" + id.split('_')[0].split('F')[1].toString() + " Zone-" + id.split('_')[1].split('Z')[1].toString() + " Loads";
        cross_tag = "F" +  + id.split('_')[0].split('F')[1].toString() + "_Z" + id.split('_')[1].split('Z')[1].toString() + "_"
        appliances = globalBuildingMap["building"]["floors"][id.split('_')[0]]["zones"][id.split('_')[1]];
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
                    showStreams(app_cross_tag, appliances[appliance]);
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
                        delete globalBuildingMap["building"]["floors"][tag_list[0]]["zones"][tag_list[1]][tag_list[2]]
                    } else if (tag_list.length == 3) {
                        jQuery("#r" + tag_list[2].toString()).remove();
                        delete globalBuildingMap["building"]["floors"][tag_list[0]]["appliances"][tag_list[1]]
                    } else if (tag_list.length == 2) {
                        jQuery("#r" + tag_list[1].toString()).remove();
                        delete globalBuildingMap["building"]["appliances"][tag_list[0]]
                    }
                });
    }
}

function generateTable() {
    var buildingModel = d3.select('.building-box');
    
    buildingModel.selectAll('*').remove();
    buildingTable = buildingModel.append('table')
                        .attr('class', 'table table-sm table-bordered building-model')
    
    var tableBody = buildingTable.append('tbody');
    
    var nfloors = Object.keys(globalBuildingMap["building"]["floors"]).length;
    for (var i=nfloors-1; i>=0; i--) {
        floorRow = tableBody.append('tr').attr('class', 'F' + (i+1).toString() + '_row')
        nzones = Object.keys(globalBuildingMap["building"]["floors"]['F' + (i+1).toString()]["zones"]).length;
        
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
                        printApplianceList('zone', this.id);
                    });
        }
        
        floorRow.append('td')
                    .attr('class', 'floor-block clickable-link')
                .append('a')
                    .attr('href', 'javascript:void(0);')
                    .attr('id', 'F' + (i+1).toString())
                    .text('F' + (i+1).toString())
                .on('click', function(data) {
                    printApplianceList('floor', this.id);
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
            printApplianceList('building', this.id);
        });
}

function get_default() {
    jQuery.ajax({
        type: "POST",
        url: "/query",
        data: JSON.stringify({"query_type": "default", "build_type": globalBuildingMap["building"]["type"]}),
        dataType : "html",
        contentType: "application/json",
        success: function(response) {
            globalDefaultAppList = JSON.parse(response);
        },
        error: function() {
            alert( "error" );
        }
    });
}

function addFloor(f_no, nZones=1) {
    var floorPanel = d3.select('.floor-list');

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
                    globalBuildingMap["building"]["floors"][floorID]["zones"]['Z' + (i+1).toString()] = globalDefaultAppList;
                }
            } 
            else if (updatedNZones < currentNZones) {
                // remove floors from the end
                for (var i=currentNZones; i>updatedNZones; i--) {
                    delete globalBuildingMap["building"]["floors"][floorID]["zones"]['Z' + (i).toString()];
                }
            }
            generateTable();
        });
}

function update_zones() {
    var floorPanel = d3.select('.floor-list');

    // previous number of floors
    var currentNFloors = $(".floor-list > div").length
    
    // update number of floors
    var updatedNFloors = jQuery('#nfloors').val();
    
    // if now the number of floors is more
    if (updatedNFloors > currentNFloors) {
        
        // add new floors in the building
        for (var i=currentNFloors; i<updatedNFloors; i++) {
            
            // add new floor
            addFloor(i);
            
            // update building configuration json
            globalBuildingMap["building"]["floors"]['F' + (i+1).toString()] = {};
            globalBuildingMap["building"]["floors"]['F' + (i+1).toString()]["appliances"] = globalDefaultAppList;
            globalBuildingMap["building"]["floors"]['F' + (i+1).toString()]["zones"] = {"Z1": globalDefaultAppList};
        }
    } // if now the number of floors is less
    else if (updatedNFloors < currentNFloors) {
        // remove floors from the end
        for (var i=currentNFloors; i>updatedNFloors; i--) {
            
            // remove floor
            d3.select('.f' + i.toString()).remove();
            
            // update json
            delete globalBuildingMap["building"]["floors"]['F' + (i).toString()];
        }
        
        // update max_nzones
        sysVariables['max_nzones'] = 0
        for (var i=0; i<nfloors; i++) {
            
            var nZones = Object.keys(globalBuildingMap["building"]["floors"]['F' + (i+1).toString()]["zones"]).length
            if (nZones > sysVariables['max_nzones']) {
                sysVariables['max_nzones'] = nZones;
            }
        }
    }

    // build summary table
    generateTable();
}

function build_floormap() {

    // update configuration panel

    // remove previous list
    d3.select('.floor-list').selectAll('*').remove();
    
    // get number of floors from the default building file and set in the configuration panel
    var nfloors = Object.keys(globalBuildingMap["building"]["floors"]).length;
    jQuery('#nfloors').val(nfloors);

    jQuery('#nfloors').on('change', function(){
        update_zones();
    });

    // update number of floors
    for (var i=0; i<nfloors; i++) {
        var nZones = Object.keys(globalBuildingMap["building"]["floors"]['F'+(i+1).toString()]["zones"]).length;
        addFloor(i, nZones);
    }

    // show configuration panel
    jQuery('#middle-panel').show();  

    // update summary table
    generateTable();
    
    // show summary panel
    jQuery('#right-most-panel').show();                 
}

function get_floormap(build_type) {
    jQuery.ajax({
        type: "POST",
        url: "/query",
        data: JSON.stringify({"query_type": "map", "build_type": build_type}),
        dataType : "html",
        contentType: "application/json",
        success: function(response) {
            globalBuildingMap = JSON.parse(response);
            get_default();
            build_floormap();
        },
        error: function() {
            alert( "error" );
        }
    });
}

function back_button(b_val) {
    // Remove panel when changing buildings
    jQuery('#middle-panel').hide();
    jQuery('#right-most-panel').hide();
    
    var indx_split = c_indx.split("_");
    if (indx_split.length > 1) {
        var tempJSON = globalBuildingTypes;
        for (i = 1; i < indx_split.length-1; i++) {
            tempJSON = tempJSON["children"][(+indx_split[i])-1];
        }
        update_buildtype(tempJSON);
    } else {
        document.location.href = "/";
    }
}

// function to update building type panel
function update_buildtype (building_json) {
    
    // Index of clicked building type
    c_indx = building_json.indx;

    // if parent is root, update the legend
    if (building_json["value"] == "building") {
        jQuery("#legend-lmp").text('Select Building Type');
    }

    // remove previous entries from the div
    d3.select('#row-lmp').selectAll("*").remove();

    // add back button in the div
    d3.select('#row-lmp')
        .append('div')
            .attr("class", "col-sm-12 back-button-div")
        .append('button')
            .attr("id", "btn-back")
            .attr("type", "button")
            .attr("class", "btn btn-default back-button")
        .on("click", function(){
            back_button(building_json.value)
        });

    // append parent div for all the sub building types
    d3.select('#row-lmp')
        .append("div")
            .attr("class", "col-sm-12 form-group selection-panel")
            .attr("id", building_json["value"] + "-type");
    
    // create div for each sub building type 
    var divs = d3.select("#" + building_json["value"] + "-type")
        .selectAll('div')
        .data(building_json["children"])
        .enter()
        .append("div")
            .attr("class", "col-sm-5 form-check form-check-inline selection-box")
            .attr("id", function (d){ return d.value;})

    // create selection tag for every sub building type
    divs.append('input')
            .attr("type", "radio")
            .attr("class", function (d){ 
                if (d.type=="leaf") { 
                    return "form-check-input leafRadio";
                } else {
                    return "form-check-input";
                }
            })
            .attr("id", function (d){ return d.parent + "_" + d.value; })
            .attr("name", function (d){ return d.parent; })
            .attr("value", function (d){ return d.value; })
        .on('change', function(d) {
            if (d.type !="leaf") { 
                c_indx = d.indx;
                update_buildtype (d);
            } else {
                get_floormap(d.value);
            }
        });
    
    // image icon for sub building type
    var figs = divs.append('label')
                        .attr("class", function (d) { 
                            if (d.type=="leaf") { 
                                return "form-check-label leaf";
                            } else {
                                return "form-check-label";
                            }
                        })
                        .attr("for", function (d){ return d.parent + "_" + d.value; })
                    .append("figure");
    figs.append("img")
            .attr("class", "label-image")
            .attr("alt", function (d){ return d.name; })
            .attr("src", function (d){ return 'static/images/icons/' + d.icon; })
    figs.append("figcaption")
            .attr("class", "tag")
            .text(function (d){ return d.name; });
}

jQuery('#btn-make-building').on('click', function() {
    jQuery.ajax({
        type: "POST",
        url: "/query",
        data: JSON.stringify({"query_type": "scratch"}),
        dataType : "html",
        contentType: "application/json",
        success: function(response) {
            globalBuildingTypes = JSON.parse(response);
            update_buildtype(globalBuildingTypes, "root");
        },
        error: function() {
            alert( "error" );
        }
    });
});