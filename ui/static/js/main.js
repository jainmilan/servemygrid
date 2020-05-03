var globalJson;

jQuery('#back-button').on('click', function(){
    console.log(globalJson);
    update_buildtype(globalJson);
});

// function to update building type panel
function update_buildtype (building_json) {
    
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
            .attr("class", "btn btn-default back-button");

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
            .attr("class", "form-check-input")
            .attr("id", function (d){ return d.parent + "_" + d.value; })
            .attr("name", function (d){ return d.parent; })
            .attr("value", function (d){ return d.value; })
        .on('change', function(d){
            globalJson = building_json;
            update_buildtype (d);
        });
    
    // image icon for sub building type
    var figs = divs.append('label')
                        .attr("class", "form-check-label")
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
        url: "/build",
        data: JSON.stringify({"build_type": "scratch"}),
        dataType : "html",
        contentType: "application/json",
        success: function(response) {
            globalJson = JSON.parse(response);
            update_buildtype(globalJson, "root");
        },
        error: function() {
            alert( "error" );
        }
    });
});