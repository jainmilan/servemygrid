var globalBuildingTypes, c_indx, globalBuildingMap;
var sysVariables = { max_nzones: 0 };

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

function addFloor(f_no, floorPanel, sysVariables, nZones=1) {
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
                    globalBuildingMap["building"]["floors"][floorID]["zones"]['Z' + (i+1).toString()] = ["HVAC", "Lighting", "Laptops", "Monitors"];
                }
            } 
            else if (updatedNZones < currentNZones) {
                // remove floors from the end
                for (var i=currentNZones; i>updatedNZones; i--) {
                    delete globalBuildingMap["building"]["floors"][floorID]["zones"]['Z' + (i).toString()];
                }
            }
        });
}

function build_floormap() {

    // draw configuration panel
    /*
    var fieldset = d3.select('#middle-panel')
                        .append('fieldset')
                            .attr('class', 'scheduler-border');
    
    fieldset.append('legend')
                .attr('class', 'scheduler-border')
                .text('Configuration Panel');

    var form = fieldset.append('div')
                            .attr('class', 'col-sm-12 form-group configuration-form')
                        .append('form');

    var first_div = form.append('div')
                            .attr('class', 'row form-group');
    first_div.append('label')
                .attr('for', 'nfloors')
                .attr('class', 'col-sm-4 col-form-label')
                .text('Number of Floors: ');
    first_div.append('div')
                .attr('class', 'col-sm-4')
            .append('input')
                .attr('class', 'form-control')
                .attr('id', 'nfloors')
                .attr('type', 'text')
                .attr('name', 'nfloors');
    */
    // get number of floors from the default building file and set in the configuration panel
    var nfloors = Object.keys(globalBuildingMap["building"]["floors"]).length;
    jQuery('#nfloors').val(nfloors);

    /*
    var second_div = form.append('div')
                            .attr('class', 'row form-group floor-panel');
    second_div.append('label')
                .attr('for', 'floor-wise-zones')
                .attr('class', 'col-sm-12 col-form-label')
                .text('Number of Zones (Floor Wise)'); 
    second_div.append('div')
                .attr('class', 'col-sm-12 floor-wise')
            .append('div')
                .attr('class', 'row floor-list');
    */
    // add floors to floor list in the configuration panel
    var floorPanel = d3.select('.floor-list');

    for (var i=0; i<nfloors; i++) {
        var nZones = Object.keys(globalBuildingMap["building"]["floors"]['F'+(i+1).toString()]["zones"]).length;
        addFloor(i, floorPanel, sysVariables, nZones);
    }

    // show configuration panel
    jQuery('#middle-panel').show();                
}

function get_floormap(build_type) {
    console.log(build_type);
    jQuery.ajax({
        type: "POST",
        url: "/query",
        data: JSON.stringify({"query_type": "map", "build_type": build_type}),
        dataType : "html",
        contentType: "application/json",
        success: function(response) {
            globalBuildingMap = JSON.parse(response);
            build_floormap();
        },
        error: function() {
            alert( "error" );
        }
    });
}

function back_button(b_val) {
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