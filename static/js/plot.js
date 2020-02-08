jQuery(document).ready(function(){
    var currentDiv = "buildingType";
    
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
            jQuery('.appliancePanel').show();
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
    });
    
    jQuery('input[type=radio][name=officeType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
    });
    
    jQuery('input[type=radio][name=healthcareType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
    });
    
    jQuery('input[type=radio][name=schoolType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
    });
    
    jQuery('input[type=radio][name=hotelType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
    });
    
    jQuery('input[type=radio][name=restaurantType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.appliancePanel').show();
    });

    jQuery('input[type=radio][name=shopType]').on('change', function(){
        jQuery('input:checkbox').prop('checked', false);
        jQuery('.applianceType').show();
    });
});

function reloadLayout() {
    console.log('static/images/floorPlans/' + document.getElementById("apt_type").value + 'BR.jpg');
    document.getElementById('aptLayout').src = 'static/images/floorPlans/' + document.getElementById("apt_type").value + 'BR.jpg';
}