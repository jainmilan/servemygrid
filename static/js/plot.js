function updateTick(appCheck, appVal) {
    if (appCheck) {
        var tr = d3.selectAll('.tbody')
                    .append('tr')
                        .attr('class', 'tableRow')
                        .attr('id', appVal + 'Row');

        tr.append('th')
            .attr('scope', 'row')
          .append('img')
            .attr('class', 'row-image')
            .attr('src', 'static/images/icons/' + appVal + '.png');

        tr.selectAll('.tableRow')
            .data([...Array(4)].map(() => Math.floor(Math.random()*9)))
            .enter()
          .append('td')
            .attr('class', 'cell')
            .text(function(d){return d;});
    } else {
        d3.select('#' + appVal + 'Row').remove();
    }    
}

function plotApplicationBox(appType, streamList) {
    var selectionBox = d3.select('#applianceList')
                        .append('div')
                            .attr('class', 'col-md-5 form-check form-check-inline selectionBox');

    var imageBox = selectionBox
                    .append('div')
                        .attr('class', 'col-md-8 imageBox');

    imageBox.append('input')
        .attr('class', 'form-check-input')
        .attr('type', 'checkbox')
        .attr('name', 'applianceType')
        .attr('id', appType)
        .attr('value', appType)
        .on('change', function(){
            updateTick(jQuery(this).is(':checked'), jQuery(this).val()); 
        });

    var figure = imageBox.append('label')
                            .attr('class', 'form-check-label leaf')
                            .attr('for', appType)
                        .append('figure');
    figure.append('img')
            .attr('class', 'label-image')
            .attr('src', 'static/images/icons/' + appType + '.png');

    figure.append('figcaption')
            .attr('class', 'tag')
            .text(function(){
                var output = "Lab Equipment";
                if (appType == "hvac") {
                    output = "HVAC";
                } else if (appType == "lighting") {
                    output = "Lighting";
                } else if (appType == "desktops") {
                    output = "Desktops";
                } else if (appType == "laptops") {
                    output = "Laptops";
                } else if (appType == "monitors") {
                    output = "Monitors";
                } else if (appType == "refrigerators") {
                    output = "Refrigerators";
                } else if (appType == "kitchenVent") {
                    output = "Kitchen Ventillation";
                } else if (appType == "videoDisplay") {
                    output = "Video Display";
                } else if (appType == "securitySystem") {
                    output = "Security System";
                } else if (appType == "medImaging") {
                    output = "Imaging Equipment";
                }
                return output;
            });

    var iconBox = selectionBox
                    .append('div')
                        .attr('class', 'col-md-4 iconBox');

    var linkBox = iconBox
                    .append('div')
                        .attr('class', 'row linkIcon');
    linkBox.append('img')
            .attr('class', 'icon-image linkClass ' + appType + 'Link')
            .attr('src', 'static/images/icons/link.png')
            .on('click', function(){
                showStreams(appType, streamList);
            });

    var uploadBox = iconBox
                    .append('div')
                        .attr('class', 'row uploadIcon');
    uploadBox.append('img')
            .attr('class', 'icon-image uploadClass ' + appType + 'Upload')
            .attr('src', 'static/images/icons/upload.png');
}

function getTable(buildingType) {
    var serviceTable = d3.select('.servicePanel')
                            .append('table')
                                .attr('class', 'table');
    var serviceTableHead = serviceTable
                            .append('thead')
                                .attr('class', 'thead-light')
                            .append('tr');
    
    serviceTableHead
        .append('th')
            .attr('scope', 'col')
            .attr('class', 'imageRow')
        .append('img')
            .attr('class', 'table-image')
            .attr('src', 'static/images/icons/' + buildingType + '.png');
    
    serviceTableHead
        .selectAll('th.headRow')
        .data(['Curtailment', 'Frequency Regulation', 'Ramping', 'Reactive Power Control'])
            .enter()
        .append('th')
            .attr('class', 'headRow')
            .attr('scope', 'col')
            .text(function(d){return d;});
    
    var serviceTableBody = serviceTable
                            .append('tbody')
                                .attr('class', 'tbody'); 
}

function getAppliancePanel(dataList, buildingType) {
    dataList[0][buildingType].forEach(function(d){
        var appType = Object.keys(d)[0];
        plotApplicationBox(appType, d[appType]['streams']);                                  
    });
    
    jQuery('.servicePanel').show();
    d3.select(".servicePanel").selectAll("*").remove();
    getTable(buildingType);
}

function showStreams(streamInfo, streamList, buildingMap) {
    $('#streamList').modal('show');
    d3.select(".modal-body").selectAll("*").remove();
    
    var streamTable = d3.select(".modal-body").append('table')
                            .attr('class', 'table table-sm table-bordered streamTable')
    
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
                    console.log(this.id);
                    var tag_list = this.id.split('_');
                    console.log(tag_list);
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
    
    var applianceDiv = d3.select(".listOfAppliances");
    applianceDiv.selectAll("*").remove();
    
    var applianceTable = applianceDiv.append('table')
                            .attr('class', 'table table-sm table-bordered applianceList mx-2')
                            .attr('id', 'applianceList')
    
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
                        .attr('class', 'table table-sm table-bordered buildingMap')
    
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
                        .attr('class', 'zones')
                    .append('a')
                        .attr('href', 'javascript:void(0);')
                        .attr('id', 'F' + (i+1).toString() + '_Z' + (j+1).toString())
                        .text('Z' + (j+1).toString())
                    .on('click', function(data) {
                        printApplianceList('zone', this.id, buildingMap);
                    });
        }
        
        floorRow.append('td')
                    .attr('class', 'floors')
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
            .attr('class', 'building')
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
                        .attr('class', 'col-lg-3 mb-4 f' + (f_no+1).toString())
    
    panel
        .append('label')
            .text('F' + (f_no+1).toString())
            .attr('class', 'col-lg-12 mx-0 px-0')

    panel
        .append('div')
            .attr('class', 'col-lg-12 mx-0 px-0')
        .append('input')
            .attr('id', 'f' + (f_no+1).toString() + 'zones')
            .attr('name', 'nzones')
            .attr('class', 'form-control')
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

jQuery(document).ready(function(){
    var currentDiv = "buildingType";
    var dataList;
    
    var buildingMap;
    var sysVariables = { max_nzones: 0 };
            
    d3.json("static/data/sensorsList.json").then(function(data){
        dataList = data;
    });
    
    var parentDict = {
        residentialType: "buildingType",
        commercialType: "buildingType",
        officeType: "commercialType",
        healthcareType: "commercialType",
        schoolType: "commercialType",
        hotelType: "commercialType",
        restaurantType: "commercialType",
        shopType: "commercialType"
    };
    
    jQuery('input[type=radio][name=buildingType]').on('change', function(){
        if(this.value == 'residential') {
            currentDiv = "residentialType";
        } else {
            currentDiv = "commercialType";
        }
        jQuery('.buildingType').hide();
        jQuery('.backButton').show();
        jQuery('.' + currentDiv).show();
    });
    
    jQuery('input[type=radio][name=commercialType]').on('change', function(){
        if(this.value == 'office') {
            currentDiv = "officeType";
        } else if (this.value == 'healthcare') {
            currentDiv = "healthcareType";
        } else if (this.value == 'school') {
            currentDiv = "schoolType";
        } else if (this.value == 'hotel') {
            currentDiv = "hotelType";
        } else if (this.value == 'restaurant') {
            currentDiv = "restaurantType";
        } else if (this.value == 'shop') {
            currentDiv = "shopType";
        } else {
            currentDiv = "commercialType";
        }
        
        jQuery('.commercialType').hide();
        jQuery('.' + currentDiv).show();
    });
    
    jQuery('#backButton').on('click', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('input:radio').prop('checked', false);
        
        jQuery('.' + currentDiv).hide();
        currentDiv = parentDict[currentDiv];
        
        if (currentDiv == "buildingType") {
            jQuery('.backButton').hide();
        }
        jQuery('.' + currentDiv).show();
        jQuery('.configurationPanel').hide();
        jQuery('.summaryPanel').hide();
    });

    jQuery('.leafRadio').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        
        var selectedVal = document.querySelector('input[name=' + this.name + ']:checked').value;
        d3.json("static/data/buildingJson.json").then(function(data){
            
            // remove previous list
            d3.select('.floorList').selectAll('*').remove();
    
            // select building
            buildingMap = data["mra"];
            buildingDiv = d3.select('.buildingModel')
            
            // get number of floors from the default building file and set in the configuration panel
            var nfloors = Object.keys(buildingMap["floors"]).length;
            jQuery('#nfloors').val(nfloors);
            
            // add floors to floor list in the configuration panel
            var floorPanel = d3.select('.floorList');
            for (var i=0; i<nfloors; i++) {
                var nZones = Object.keys(buildingMap["floors"]['F'+(i+1).toString()]["zones"]).length;
                addFloor(i, floorPanel, sysVariables, buildingMap, buildingDiv, nZones);
            }
            
            // show configuration panel
            jQuery('.configurationPanel').show();
            
            // update summary table
            generateTable(sysVariables, buildingMap, buildingDiv);
            
            // show summary panel
            jQuery('.summaryPanel').show();
            
            // add event on change in value of text box
            jQuery('input[type=text][name=nfloors]').on('change', function(){
                
                // previous number of floors
                var currentNFloors = $(".floorList > div").length
                
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
});

function reloadLayout() {
    document.getElementById('aptLayout').src = 'static/images/floorPlans/' + document.getElementById("apt_type").value + 'BR.jpg';
}