function plotApplicationBox(appType) {
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
        .attr('value', appType);

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
                var output = "Specialized Lab Equipment";
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
                    output = "Medical Imaging Equipment";
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
            .attr('class', 'icon-image float-left')
            .attr('src', 'static/images/icons/link.png');

    var uploadBox = iconBox
                    .append('div')
                        .attr('class', 'row uploadIcon');
    uploadBox.append('img')
            .attr('class', 'icon-image float-left')
            .attr('src', 'static/images/icons/upload.png');
}

jQuery(document).ready(function(){
    var currentDiv = "buildingType";
    var dataList;
    
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
            jQuery('input:checkbox').prop('checked', false);
            jQuery('.appliancePanel').show();

            d3.select("#applianceList").selectAll("*").remove();
            var buildingType = jQuery('input[name="commercialType"]:checked').val();
            dataList[0][buildingType].forEach(function(d){
                var appType = Object.keys(d)[0];
                plotApplicationBox(appType);
            });
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
        jQuery('.appliancePanel').hide();
    });
    
    jQuery('input[type=radio][name=residentialType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
        
        d3.select("#applianceList").selectAll("*").remove();
        var buildingType = jQuery('input[name="residentialType"]:checked').val();
        dataList[0][buildingType].forEach(function(d){
            var appType = Object.keys(d)[0];
            plotApplicationBox(appType);
        });
    });
    
    jQuery('input[type=radio][name=officeType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
        
        d3.select("#applianceList").selectAll("*").remove();
        var buildingType = jQuery('input[name="officeType"]:checked').val();
        dataList[0][buildingType].forEach(function(d){
            var appType = Object.keys(d)[0];
            plotApplicationBox(appType);
        });
    });
    
    jQuery('input[type=radio][name=healthcareType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
        
        d3.select("#applianceList").selectAll("*").remove();
        var buildingType = jQuery('input[name="healthcareType"]:checked').val();
        dataList[0][buildingType].forEach(function(d){
            var appType = Object.keys(d)[0];
            plotApplicationBox(appType);
        });
    });
    
    jQuery('input[type=radio][name=schoolType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
        
        d3.select("#applianceList").selectAll("*").remove();
        var buildingType = jQuery('input[name="schoolType"]:checked').val();
        dataList[0][buildingType].forEach(function(d){
            var appType = Object.keys(d)[0];
            plotApplicationBox(appType);
        });
    });
    
    jQuery('input[type=radio][name=hotelType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
        
        d3.select("#applianceList").selectAll("*").remove();
        var buildingType = jQuery('input[name="hotelType"]:checked').val();
        dataList[0][buildingType].forEach(function(d){
            var appType = Object.keys(d)[0];
            plotApplicationBox(appType);
        });
    });
    
    jQuery('input[type=radio][name=restaurantType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
        
        d3.select("#applianceList").selectAll("*").remove();
        var buildingType = jQuery('input[name="restaurantType"]:checked').val();
        dataList[0][buildingType].forEach(function(d){
            var appType = Object.keys(d)[0];
            plotApplicationBox(appType);
        });
    });

    jQuery('input[type=radio][name=shopType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
        
        d3.select("#applianceList").selectAll("*").remove();
        var buildingType = jQuery('input[name="shopType"]:checked').val();
        dataList[0][buildingType].forEach(function(d){
            var appType = Object.keys(d)[0];
            plotApplicationBox(appType);
        });
    });
});

function reloadLayout() {
    document.getElementById('aptLayout').src = 'static/images/floorPlans/' + document.getElementById("apt_type").value + 'BR.jpg';
}