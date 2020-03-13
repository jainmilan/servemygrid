function showStreams(appType, streamList) {
    $('#streamList').modal('show');
    d3.select(".modal-body").selectAll("*").remove();
    
    streamList.forEach(function(d){
        d3.select(".modal-body").append("p").text(d);
    });
}

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

function printApplianceList(iType, id, buildingData) {
    var label = "";
    var appliances = [];
    if (iType == "building") {
        label = "Building Loads";
        appliances = buildingData["appliances"];
    } else if (iType == "floor") {
        label = "Floor-" + id.split('F')[1].toString() + " Loads"
        appliances = buildingData["floors"][id]["appliances"];
    } else if (iType == "zone") {
        label = "Floor-" + id.split('_')[0].split('F')[1].toString() + " Zone-" + id.split('_')[1].split('Z')[1].toString() + " Loads";
        appliances = buildingData["floors"][id.split('_')[0]]["zones"][id.split('_')[1]];
    }
    
    var applianceDiv = d3.select(".listOfAppliances");
    applianceDiv.selectAll("*").remove();
    
    applianceDiv.append('label').text(label);
    
    var applianceList = applianceDiv.append('ul');
    for (var i=0; i<appliances.length; i++) {
        applianceList.append('li').text(appliances[i]);
    }
}

function addFloor(f_no, floorPanel, nZones=1) {
    var panel = floorPanel
                    .append('div')
                        .attr('class', 'col-sm-3 mb-4 f' + (f_no+1).toString())

    panel
        .append('label')
            .text('F' + (f_no+1).toString())
            .attr('class', 'col-sm-12 mx-0 px-0')

    panel
        .append('div')
            .attr('class', 'col-sm-12 mx-0 px-0')
        .append('input')
            .attr('id', 'f' + (f_no+1).toString() + 'zones')
            .attr('name', 'nzones')
            .attr('class', 'form-control')
            .attr('type', 'text')
            .attr('value', nZones)
            .attr('style', 'text-align:center;');
}

function generateTable(buildingModel, buildingData, max_nzones) {
    buildingModel.selectAll('*').remove();
    buildingTable = buildingModel.append('table')
                        .attr('class', 'table table-sm table-bordered buildingMap')
    
    var tableBody = buildingTable.append('tbody');
    
    var nfloors = Object.keys(buildingData["floors"]).length;
    for (var i=nfloors-1; i>=0; i--) {
        floorRow = tableBody.append('tr')
        nzones = Object.keys(buildingData["floors"]['F' + (i+1).toString()]["zones"]).length;
        
        var nzoneArraylen = nzones * Math.ceil(max_nzones % nzones);
        
        nzoneArray = new Array(nzones).fill(0);
        for (var j=0; j<max_nzones; j++) {
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
                        printApplianceList('zone', this.id, buildingData);
                    });
        }
        
        floorRow.append('td')
                    .attr('class', 'floors')
                .append('a')
                    .attr('href', 'javascript:void(0);')
                    .attr('id', 'F' + (i+1).toString())
                    .text('F' + (i+1).toString())
                .on('click', function(data) {
                    printApplianceList('floor', this.id, buildingData);
                });
    }
    
    tableBody.append('tr').append('td')
            .attr('scope', 'col')
            .attr('colspan', max_nzones)
            .attr('class', 'building')
        .append('a')
            .attr('href', 'javascript:void(0);')
            .attr('id', 'B0')
            .text("Building Loads")
        .on('click', function(data) {
            printApplianceList('building', this.id, buildingData);
        });
}

jQuery(document).ready(function(){
    var currentDiv = "buildingType";
    var dataList;
    var defaultBuilding;
    
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
            // jQuery('input:checkbox').prop('checked', false);
            // jQuery('.appliancePanel').show();

            // d3.select("#applianceList").selectAll("*").remove();
            // var buildingType = jQuery('input[name="commercialType"]:checked').val();
            // getAppliancePanel(dataList, buildingType);
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
//        jQuery('.appliancePanel').hide();
//        jQuery('.servicePanel').hide();
    });
    /*
    jQuery('input[type=radio][name=residentialType]').on('change', function(){
        // jQuery('input:checkbox').prop('checked', false);
        // jQuery('.appliancePanel').show();
        
        // d3.select("#applianceList").selectAll("*").remove();
        // var buildingType = jQuery('input[name="residentialType"]:checked').val();
        // getAppliancePanel(dataList, buildingType);
    });
    
    jQuery('input[type=radio][name=officeType]').on('change', function(){
        // jQuery('input:checkbox').prop('checked', false);
        // jQuery('.appliancePanel').show();
        
        // d3.select("#applianceList").selectAll("*").remove();
        // var buildingType = jQuery('input[name="officeType"]:checked').val();
        // getAppliancePanel(dataList, buildingType);
    });
    
    jQuery('input[type=radio][name=healthcareType]').on('change', function(){
        // jQuery('input:checkbox').prop('checked', false);
        // jQuery('.appliancePanel').show();
        
        // d3.select("#applianceList").selectAll("*").remove();
        // var buildingType = jQuery('input[name="healthcareType"]:checked').val();
        // getAppliancePanel(dataList, buildingType);
    });
    
    jQuery('input[type=radio][name=schoolType]').on('change', function(){
        // jQuery('input:checkbox').prop('checked', false);
        // jQuery('.appliancePanel').show();
        
        // d3.select("#applianceList").selectAll("*").remove();
        // var buildingType = jQuery('input[name="schoolType"]:checked').val();
        // getAppliancePanel(dataList, buildingType);
    });
    
    jQuery('input[type=radio][name=hotelType]').on('change', function(){
        // jQuery('input:checkbox').prop('checked', false);
        // jQuery('.appliancePanel').show();
        
        // d3.select("#applianceList").selectAll("*").remove();
        // var buildingType = jQuery('input[name="hotelType"]:checked').val();
        // getAppliancePanel(dataList, buildingType);
    });
    
    jQuery('input[type=radio][name=restaurantType]').on('change', function(){
        // jQuery('input:checkbox').prop('checked', false);
        // jQuery('.appliancePanel').show();
        
        // d3.select("#applianceList").selectAll("*").remove();
        // var buildingType = jQuery('input[name="restaurantType"]:checked').val();
        // getAppliancePanel(dataList, buildingType);
    });

    jQuery('input[type=radio][name=shopType]').on('change', function(){
        // jQuery('input:checkbox').prop('checked', false);
        // jQuery('.appliancePanel').show();
        
        // d3.select("#applianceList").selectAll("*").remove();
        // var buildingType = jQuery('input[name="shopType"]:checked').val();
        // getAppliancePanel(dataList, buildingType);
    });
    */
    jQuery('.leafRadio').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        
        var selectedVal = document.querySelector('input[name=' + this.name + ']:checked').value;
        d3.json("static/data/buildingJson.json").then(function(data){
            
            // remove previous list
            d3.select('.floorList').selectAll('*').remove();
    
            // select building
            defaultBuilding = data["mra"];
            
            // get number of floors from the default building file
            var nfloors = Object.keys(defaultBuilding["floors"]).length;
            jQuery('#nfloors').val(nfloors);
            
            // add floors from the default file
            var max_nzones = 0
            for (var i=0; i<nfloors; i++) {
                var floorPanel = d3.select('.floorList');
                var nzones = Object.keys(defaultBuilding["floors"]["F" + (i+1).toString()]["zones"]).length;
                if (nzones > max_nzones) { max_nzones = nzones; }
                addFloor(i, floorPanel, nzones);
            }
            
            // show configuration panel
            jQuery('.configurationPanel').show();
            
            buildingModel = d3.select('.buildingModel')
            generateTable(buildingModel, defaultBuilding, max_nzones);
            
            // show summary panel
            jQuery('.summaryPanel').show();
            
            // add event on change in value of text box
            jQuery('input[type=text][name=nfloors]').on('change', function(){
                
                // previous number of floors
                prevNFloors = $(".floorList > div").length
                
                // update number of floors
                nfloors = jQuery('input[type=text][name=nfloors]').val();
                
                // if now the number of floors is more
                if (nfloors > prevNFloors) {
                    // add new floors in the building
                    for (var i=prevNFloors; i<nfloors; i++) {
                        
                        // add new floor
                        var floorPanel = d3.select('.floorList');
                        addFloor(i, floorPanel);
                        
                        // update building configuration json
                        defaultBuilding["floors"]['F' + (i+1).toString()] = {};
                        defaultBuilding["floors"]['F' + (i+1).toString()]["appliances"] = ["HVAC", "Lighting", "Laptops", "Monitors"];
                        defaultBuilding["floors"]['F' + (i+1).toString()]["zones"] = {"Z1": ["HVAC", "Lighting", "Laptops", "Monitors"]};
                    }
                } // if now the number of floors is less
                else if (nfloors < prevNFloors) {
                    // remove floors from the end
                    for (var i=prevNFloors; i>nfloors; i--) {
                        
                        // remove floor
                        d3.select('.f' + i.toString()).remove();
                        
                        // update json
                        delete defaultBuilding["floors"]['F' + (i).toString()];
                    }
                }
                
                // build summary table
                generateTable(buildingModel, defaultBuilding, max_nzones);
                console.log(defaultBuilding);
            });
            
            // add event on change in value of text box
            jQuery('input[type=text][name=nzones]').on('change', function(){
                var floorID = this.id.split('zones')[0].toUpperCase();
                var previousNZones = Object.keys(defaultBuilding["floors"][floorID]).length;
                var nzonesNow = jQuery('#' + this.id).val();
                
                if (nzonesNow > max_nzones) { max_nzones = nzonesNow; }
                if (nzonesNow > previousNZones) {
                    for (var i=previousNZones; i<nzonesNow; i++) {
                        defaultBuilding["floors"][floorID]["zones"]['Z' + (i+1).toString()] = ["HVAC", "Lighting", "Laptops", "Monitors"];
                    }
                } 
                else if (nzonesNow < previousNZones) {
                    // remove floors from the end
                    for (var i=previousNZones; i>nzonesNow; i--) {
                        delete defaultBuilding["floors"][floorID]["zones"]['Z' + (i).toString()];
                    }
                }
                
                // build summary table
                generateTable(buildingModel, defaultBuilding, max_nzones);
            });
        });
    });
});

function reloadLayout() {
    document.getElementById('aptLayout').src = 'static/images/floorPlans/' + document.getElementById("apt_type").value + 'BR.jpg';
}