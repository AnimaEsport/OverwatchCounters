//This file contains all functions used to control logic and actions on the web page
var recommendedTeam, enemyTeam, droppedHeroes = [];

//AngularJS functions
(function () {
    var app = angular.module('overwatch', []);
    app.controller('HeroIcons', function () {
        this.heroes = heroData;
    });
    app.controller('MapIcons', ['$scope', function ($scope) {
        $scope.maps = mapData;
    }]);
})();

//Adds the selected CSS class to the clicked map and if the map is not control show the attack/defense options
function mapClicked(clickedMapElement) {
    var mapString = $(clickedMapElement).attr("map");
    var mapTypeString = getMapTypeByName(mapString);
    resetSubMapDropdownSelections();
    if (mapTypeString !== 'Control')
        $("#attackDefenseContainer").css("display", "inline-block");
    else
        $("#attackDefenseContainer").css("display", "none");
    toggleMapSelected(mapString);
    if (!document.getElementById("preservedCheckbox").checked)
        resetRemovedHeroes();
    determineTeamCounters();
}

//When an enemy icon is clicked add it to the list and redetermine counters
function enemyIconClicked(inputEnemy) {
    var heroObject = getHeroByName($(inputEnemy).attr('hero'));

    if($(inputEnemy).hasClass("grey")){
        $(inputEnemy).removeClass("grey");
        $(".enemyTeamIcon").each(function(index, obj){
            if ($(obj).attr("hero") == $(inputEnemy).attr("hero")) {
                $(obj).css("background-image", "");
                $(obj).attr("hero", "");
                $(obj).addClass("empty");
                $("#enemyTeamInfoIcon"+(index+1)).css("opacity", 0);
                $("#enemyTeamInfoIcon"+(index+1)).css("pointer-events", "none");
            }
        });
        determineTeamCounters();
    } else if($(".enemyTeamIcon.empty").length !== 0) {
        if(document.getElementById("onlyOneCheckbox").checked)
            $(inputEnemy).addClass("grey");
        var enemy = $(inputEnemy).attr("hero");
        $(".enemyTeamIcon.empty").first().css("background-image", "url(images/CharacterIcons/" + enemy + ".png)");
        $(".enemyTeamIcon.empty").first().css("background-size", "cover");
        $(".enemyTeamIcon.empty").first().attr("hero", enemy);
        $(".enemyTeamIcon.empty").first().removeClass("empty");
        if (!document.getElementById("preservedCheckbox").checked)
            resetRemovedHeroes();
        determineTeamCounters();
    }
}

//Displays Hero Weaknesses
function displayHeroInfo(hero){
    var parentID = $(hero).attr("parent");
    var heroName = $("#"+parentID).attr("hero");
    var heroTeam = $("#"+parentID).attr("team");
    var heroObject = getHeroByName(heroName);
    var titleString = heroName;
    var targetTeam = [];
    var opposeTeam = [];
    if (heroTeam == "enemy"){
        for (hero in recommendedTeam)
            targetTeam.push(recommendedTeam[hero].name);
        opposeTeam = enemyTeam;
    }
    else{
        targetTeam = enemyTeam;
        for (var x = 0; x < 6; x++)
            opposeTeam.push(recommendedTeam[x].name);
        //oopposeTeam = recommendedTeam;
    }
    var textHTML = '<div id="popUpHeader"><img class="iconContainer popUpIcon" src=images/CharacterIcons/' + heroName + '.png></div>';
    var heroCountersArray = heroObject.counterScores;
    var mapHeroes = getMapHeroesByName();
    if ($(".selected").length == 1) {
        if (mapHeroes[heroName] == 2)
            textHTML += '<h3 class="popUpSubHeader">Strong on map</h3>';
    }

    textHTML += '<div class="popUpDiv"><h3 class="popUpSubHeader">Strong Vs.</h3><ul>';
    for(enemy in targetTeam){
        var enemyObject = getHeroByName(targetTeam[enemy]);
        if (enemyObject.counterScores[heroName] == 2)
            textHTML += "<li><strong>" + targetTeam[enemy] + "</strong></li>";
    }
    for(enemy in targetTeam){
        var enemyObject = getHeroByName(targetTeam[enemy]);
        if (enemyObject.counterScores[heroName] == 1)
            textHTML += "<li>" + targetTeam[enemy] + "</li>";
    }
    textHTML += '</ul></div><div class="popUpDiv"><h3 class="popUpSubHeader">Weak Vs.</h3><ul>'

    for(enemy in targetTeam){
        var enemyObject = getHeroByName(targetTeam[enemy]);
        if (enemyObject.counterScores[heroName] == -2)
            textHTML += "<li><strong>" + targetTeam[enemy] + "</strong></li>";
    }
    for(enemy in targetTeam){
        var enemyObject = getHeroByName(targetTeam[enemy]);
        if (enemyObject.counterScores[heroName] == -1)
            textHTML += "<li>" + targetTeam[enemy] + "</li>";
    }
    textHTML += '</ul></div>'
    textHTML += '<div class="popUpDiv"><h3 class="popUpSubHeader">Synergy with</h3><ul>'
    for (var synergy in heroObject.synergies)
        if (heroObject.synergies[synergy] == 2 && opposeTeam.indexOf(synergy) != -1)
            textHTML += "<li><strong>" + synergy + "</strong></li>";
    for (var synergy in heroObject.synergies)
        if (heroObject.synergies[synergy] == 1 && opposeTeam.indexOf(synergy) != -1)
            textHTML += "<li>" + synergy + "</li>";
    textHTML += '</ul></div>'
    swal({title: titleString,text: textHTML,html: true });
}

//Clears the recommended team icons from the .recommendedTeamIcon elements and resets working data
function removeRecommendations() {
    //Reset global values
    droppedHeroes = [];
    enemyTeam = [];
    recommendedTeam = [];

    //Remove recommendations from UI
    $(".recommendedTeamIcon").each(function (index, obj) {
        $(obj).css("background-image", "");
        $(obj).attr("hero", "");
        $(obj).addClass("empty");
    });

    $(".score").each(function (index, obj) {
        $(obj).html("");
        $(obj).addClass("noScore");
    });
    $(".infoIcon").css("opacity", 0);
    $(".infoIcon").css("pointer-events", "none");
    $('#subMapDropdownContainer').css("display", "none");
    resetHeroScores();

    $(".recommendedTeamIcon").each(function(index, obj){
        $(obj).css("border", "1px solid lightgrey");
    });
}

//Removes the enemy from an enemyTeamIcon when it is clicked
function removeEnemy(clickedEnemy) {
    $("#"+$(clickedEnemy).attr("hero")).removeClass("grey");
    if (!($(clickedEnemy).hasClass('empty'))) {
        $(clickedEnemy).css("background-image", "");
        $(clickedEnemy).attr("hero", "");
        $(clickedEnemy).addClass("empty");
        determineTeamCounters();
    }
}

//Loads the recommendedTeam to the UI
function pushRecommendedTeamtoUI() {
    //Loads the heroes in to the recommendedTeamIcon elements
    recommendedTeam.forEach(function (hero, index) {
        if (hero != undefined) {
            var firstRecommendedTeamIcon = $(".recommendedTeamIcon.empty").first();
            var firstRecommendedTeamScore = $(".score.noScore").first();
            firstRecommendedTeamScore.html(Math.round(hero.score));
            firstRecommendedTeamScore.removeClass("noScore");
            firstRecommendedTeamIcon.css("background-image", "url(images/CharacterIcons/" + hero.name + ".png)");
            firstRecommendedTeamIcon.attr("hero", hero.name);
            if (hero.locked)
                firstRecommendedTeamIcon.css("border", "1px solid red");
            firstRecommendedTeamIcon.removeClass("empty");
        }
    });
    hideInfoIcons();
    $(".score").css("opacity", 1);
}

//Determine the team counters, this is the main function of the site
function determineTeamCounters() {
    //Clear the previous recommendations to create a clean slate
    removeRecommendations();

    //For each enemy given, adjust the score to determine the recommended team
    $(".enemyTeamIcon").each(function (index, obj) {
        var enemyHero = $(obj).attr("hero");
        if (enemyHero !== "" && enemyHero !== null) {
            //Add the hero to the enemy team Array
            enemyTeam.push(enemyHero);
            var newEnemy = getHeroByName(enemyHero);
            for (var counter in newEnemy.counterScores)
                incrementHeroByName(counter, newEnemy.counterScores[counter]*counterWeight);
        }
    });

    //Factor in what heroes are good on the selected map, if a map is selected
    var mapHeroes = getMapHeroesByName();
    if ($(".selected").length == 1)
        for(hero in mapHeroes )
            incrementHeroByName(hero, mapHeroes[hero]*mapWeight);

    //Once all the data is factored in set the recommended team to the top six heroes
    recommendedTeam = getTopSixHeroesArray();

    //Adjust the recommended composition to fit the meta
    adjustForMeta();
    //Load the recommended team to the UI
    if ($(".enemyTeamIcon.empty").length !== 6 || $(".mapIcon.selected").length == 1 || document.getElementById("tournamentCheckbox").checked || countLockedHeroes() > 0)
        pushRecommendedTeamtoUI();


    //printEachHeroScore();
}

//Adjusts the recommended team to make sure there is one of each role
function adjustForMeta() {
    //Count how many of each role is in the recommended team
    var classesMap = {Tank: 0, Healer: 0, Offense: 0, Defense: 0};
    recommendedTeam.forEach(function (hero, index) {
        if (hero.healer)
            classesMap["Healer"] += 1;
        else
            classesMap[hero.role] = classesMap[hero.role] + 1;
    });
    var e = document.getElementById("metaDropdown");
    var selectedMeta = e.options[e.selectedIndex].value;
    //If no meta is selected, and there are missing roles
    if (selectedMeta == "oneOfEachMeta" && !(classesMap["Tank"] !== 0 && classesMap["Healer"] !== 0 && classesMap["Offense"] !== 0 && classesMap["Defense"] !== 0))
        verifyOneOfEachRoleInRecommendedTeam(classesMap);

    //If the two tank, two offense, and two healer meta is selected
    else if (selectedMeta == "TwoTwoTwoMeta")
        adjustTeamforMeta({"Offense": 2, "Tank": 2, "Support": 2});

    //If the three tank and three healer meta is selected
    else if (selectedMeta == "TankMeta")
        adjustTeamforMeta({"Tank": 3, "Support": 3});
    else if (selectedMeta == "attackDefenseMeta") {
        if (document.getElementById("attackCheckbox").checked)
            adjustTeamforMeta({"Offense": 2, "Tank": 2, "Support": 2});
        else
            adjustTeamforMeta({"Defense": 2, "Tank": 2, "Support": 2});
    }
    else if (selectedMeta == "hanzoMeta"){
        recommendedTeam = [];
        for (var i=0;i<6;i++) {
            recommendedTeam.push(getHeroByName("Hanzo"));
            incrementHeroByName("Hanzo", 10000)
        }
        pushRecommendedTeamtoUI();
    }
    //No else clause is needed. The team is valid if none of the previous if statements are true
}

//Verifies that there is one of each role in the recommended team
function verifyOneOfEachRoleInRecommendedTeam(_classesMap){
    //Figure out what roles are missing
    var rolesToBeAdded = new Array();
    for (var i in _classesMap)
        if (_classesMap[i] == 0)
            rolesToBeAdded.push(i);

    //Starting from the rear, find the lowest scoring hero with more than 1 other hero in it's role, and replace it with the highest scoring hero from the unfilled role
    rolesToBeAdded.forEach(function (role, index) {
        for (i = 5; i >= 0; i--) {
            var potentialHeroToReplace = recommendedTeam[i];
            if (role == "Healer")
                var roleHeroes = getHealersArray();
            else
                var roleHeroes = getSortedRoleByName(role);
            if (_classesMap[potentialHeroToReplace.role] > 1 && !potentialHeroToReplace.locked) {
                recommendedTeam.splice(i, 1);
                recommendedTeam.push(getHeroByName(roleHeroes[0].name))
                //recommendedTeam[i] = getHeroByName(roleHeroes[0].name);
                i = -1; //Kill the loop since the missing role has been filed
            }
        }
    });
}

//Adjust the recommendedTeam based on the selected meta
function adjustTeamforMeta(roles) {
    //Reset the recommended team
    recommendedTeam = [];
    var lockedHeroes = getAllLockedHeroes();

    lockedHeroes.forEach(function(obj){
        recommendedTeam.push(obj);
    });
    //Gets all heroes sorted by score from highest to lowest
    var sortedAllHeroes = getAllHeroesArray();
    var hasHealer = false;
    var supportCount = roles["Support"];
    var replacementHero;
    var hasSniper = false;
    var hasBuilder = false;
    //Loop through the sorted heroes then return the tanks and healers with the highest score
    sortedAllHeroes.forEach(function (hero, index) {
        if (recommendedTeam.length < 6 && roles[hero.role] > 0) {
            if (hero.sniper && !hasSniper && !hero.removed && !hero.locked && !heroInRecommended(hero.name)) {
                hasSniper=true;
                recommendedTeam.push(getHeroByName(hero.name));
                roles[hero.role]--;
            } else if (!hero.sniper && !hero.removed && !hero.locked && !heroInRecommended(hero.name)) {
                recommendedTeam.push(getHeroByName(hero.name));
                roles[hero.role]--;
            }

        }
    });
}

//Removes a recommended hero from the UI
function dropRecommended(obj){
    var heroToDrop = $("#"+obj.id).attr("hero");
    $('#'+heroToDrop).css("background-color", "red");
    removeHero(heroToDrop);
    determineTeamCounters();
}

//Removes all recommended heroes, map, and resets scores
function resetButtonClick() {
    $(".mapIcon.selected").removeClass("selected");
    $(".enemyTeamIcon").each(function (index, obj) {
        $(obj).css("background-image", "");
        $(obj).attr("hero", "");
        $(obj).addClass("empty");
    });
    $("#attackDefenseContainer").css("display", "none");
    resetRemovedHeroes();
    removeRecommendations();
    resetLockedHeroes();
    resetGreyHeroes();
}

function onlyOneCheckboxClicked(){
    resetGreyHeroes();
    var enemyTeamDuplicates = []
    if (document.getElementById("onlyOneCheckbox").checked )
        $(".enemyTeamIcon").each(function(index, obj){
            var heroToRemove = $(obj).attr("hero");
            var indexOfDuplicate = enemyTeamDuplicates.indexOf(heroToRemove);
            if (indexOfDuplicate != -1) {
                $(obj).css("background-image", "");
                $(obj).attr("hero", "");
                $(obj).addClass("empty");
                $("#enemyTeamInfoIcon"+(index+1)).css("opacity", 0);
                $("#enemyTeamInfoIcon"+(index+1)).css("pointer-events", "none");
            } else {
                enemyTeamDuplicates.push(heroToRemove);
            }
            $("#" + heroToRemove).addClass("grey");
    });

        determineTeamCounters();
}

function preservedCheckboxClicked() {
    if (!document.getElementById("preservedCheckbox").checked)
        resetRemovedHeroes();
    determineTeamCounters();
}

function resetRemovedHeroesBackgroundColor() {
    $('.heroIcon').each(function(index, obj){
        $(obj).css("background-color", "orange")
    });
}

function lockHeroClicked(heroElement){
    var heroToLock = $(heroElement).attr("hero");
    if ($(heroElement).hasClass("fa-lock") && $(".enemyTeamIcon.empty").length !== 0 && $(".fa-unlock").length !== 6) {
        $(heroElement).removeClass("fa-lock");
        $(heroElement).addClass("fa-unlock");
        //$("#"+heroToLock).addClass("grey");
        lockHero(heroToLock, true);
    } else if ($(".enemyTeamIcon.empty").length !== 0) {
        $(heroElement).removeClass("fa-unlock");
        $(heroElement).addClass("fa-lock");
        //$("#"+heroToLock).removeClass("grey");
        lockHero(heroToLock, false);
    }
    determineTeamCounters();
}

function sortEnemyTeam(){
    $(".enemyTeamIcon").each(function(index, obj){
        var _hero = $(obj).attr()
    });
}

function resetGreyHeroes() {
    $(".grey").each(function(index, obj){
        $(obj).removeClass("grey");
    });
}

function heroInRecommended(_hero) {
    var temp = false;
    recommendedTeam.forEach(function(obj){
        if (obj.name == _hero)
            temp = true;
    });
    return temp;
}

function resetEnemyTeam(){
    $(".enemyTeamIcon").each(function(index, obj){
        $(obj).css("background-image", "");
        $(obj).attr("hero", "");
        $(obj).addClass("empty");
    });
}

function resetRecommendedTeam() {
    $(".recommendedTeamIcon").each(function(index, obj){
        $(obj).css("background-image", "");
        $(obj).attr("hero", "");
        $(obj).addClass("empty");
        $(obj).css("border", "1px solid lightgrey");
    });
}
