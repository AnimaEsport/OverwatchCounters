function hideInfoIcons(){
        $(".infoIcon").each(function(index, obj){
        var parent = $(obj).attr("parent");
        var test =$("#"+parent).attr("hero");
        if ($("#"+parent).attr("hero") != ""){
            $(obj).css("opacity", 1);
            $(obj).css("pointer-events", "all");
        } else {
            $(obj).css("opacity", 0);
            $(obj).css("pointer-events", "none");
        }
    });
}

function resetSubMapDropdownSelections() {
    $('#subMapDropdown').empty();
    $("#subMapDropdown").append("<option value=\"NoSubMap\">Average of all maps</option>");
}

function toggleMapSelected(_mapString) {
    if ($("#" + _mapString + "Icon").hasClass("selected")) {
        $("#attackDefenseContainer").css("display", "none");
        $("#" + _mapString + "Icon").removeClass("selected");
    } else {
        $(".mapIcon.selected").removeClass("selected");
        $("#" + _mapString + "Icon").addClass("selected");
    }
}
