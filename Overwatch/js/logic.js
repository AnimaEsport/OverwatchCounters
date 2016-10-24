//This file contains all functions used to control logic and actions on the webpage
var recommendedTeam = new Array();
var enemyTeam = new Array();
var classesMap = new Object(), Tank = 0, Support = 0, Offense = 0, Defense = 0;

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
function mapClicked(e) {
    var map = $(e).attr("map");
    var mapType = getMapType(map);

    //If the clicked map is not selected, remove the selected class, then add it to the clicked map
    if (!$("#" + map).hasClass("selected")) {
        $(".mapIcon.selected").removeClass("selected");
        $("#" + map).addClass("selected");
    }

    //If the clicked map is not control show the attack & defense radio buttons
    if (mapType != 'Control')
        $("#AttackDefenseSelect").css("display", "inline-block");
    else
        $("#AttackDefenseSelect").css("display", "none");

    //Redetermine counters
    determineTeamCounters();
}

//When an enemy icon is clicked add it to the list and redetermine counters
function enemyIconClicked(inputEnemy) {
    var enemy = $(inputEnemy).attr("enemy");
    $(".enemyTeamIcon.empty").first().css("background-image", "url(images/CharacterIcons/" + enemy + ".png)");
    $(".enemyTeamIcon.empty").first().css("background-size", "cover");
    $(".enemyTeamIcon.empty").first().attr("hero", enemy);
    $(".enemyTeamIcon.empty").first().removeClass("empty");
    determineTeamCounters();
}

//Clears the recommended team icons from the .recommendedTeamIcon elements and resets working data
function removeRecommendations() {
    //Reset global values
    enemyTeam = [];
    recommendedTeam = [];
    classesMap["Tank"] = 0;
    classesMap["Support"] = 0;
    classesMap["Offense"] = 0;
    classesMap["Defense"] = 0;

    //Remove recommendations from UI
    $(".recommendedTeamIcon").each(function (index, obj) {
        $(obj).css("background-image", "");
        $(obj).attr("hero", "");
        $(obj).attr("data-balloon", "")
        $(obj).addClass("empty");
    });

    //Hides the balloons
    $("[data-balloon]:hover:before, [data-balloon]:hover:after").css("-khtml-opacity", 1);
    $("[data-balloon]:hover:before, [data-balloon]:hover:after").css("-moz-opacity", 1);
    $("[data-balloon]:hover:before, [data-balloon]:hover:after").css("opacity", 1);

    //Reset score in heroData
    heroData.forEach(function (obj, index) {
        obj.score = 0;
    });
}

//Removes the enemy from an enemyTeamIcon when it is clicked
function removeEnemy(clickedEnemy) {
    if (!($(clickedEnemy).hasClass('empty'))) {
        var enemy = $(clickedEnemy).attr("hero");
        $(clickedEnemy).css("background-image", "");
        $(clickedEnemy).attr("hero", "");
        $(clickedEnemy).addClass("empty");
        determineTeamCounters();
    }
}

//Determine the team counters, this is the main function of the site
function determineTeamCounters() {
    //Clear the previous recommendations to create a clean slate
    removeRecommendations();

    //For each enemy given, adjust the score to determine the recommended team
    $(".enemyTeamIcon").each(function (index, obj) {
        var enemyHero = $(obj).attr("hero");
        if (enemyHero != "" && enemyHero != null) {
            //Add the hero to the enemy team Array
            enemyTeam.push(enemyHero);

            //Factor in who on the enemy team counters your team
            getHeroStrengths(enemyHero).forEach(function (_hero, index) {
                decrementHero(_hero);
            });

            //Factor in who your team counters
            getHeroWeaknesses(enemyHero).forEach(function (_hero, index) {
                incrementHero(_hero);
            });
        }
    });

    //Factor in what heroes are good on the selected map, if a map is selected
    var map = $(".selected").attr('map');
    if (map != undefined) var mapType = getMapType(map);
    var mapHeroes = getMapHeroes(map);
    if ($(".selected").length == 1) {
        mapHeroes.forEach(function (mapHero, index) {
            incrementHero(mapHero);
        });
    }

    //Once all the data is factored in set the recommended team to the top six heroes
    recommendedTeam = getTopSixHeroes();
    console.log(recommendedTeam)

    //Adjust the recommended composition to fit the meta
    adjustForMeta();

    //Load the recommended team to the UI
    pushRecommendedTeamtoUI();
}

//Build a team based on the two tank, two offense, and two healer meta
function twoTwoTwoMeta(){
    var tankCount = 0;
    var supportCount = 0;
    var offenseCount = 0;

    //Reset the recommended team
    recommendedTeam = [];

    //Gets all heroes sorted by score from highest to lowest
    var sortedAllHeroes = getAllHeroes();

    //Loop through the sorted heroes then return the tanks, offense, and healers with the highest score
    sortedAllHeroes.forEach(function (hero, index) {
        if (hero.role == "Tank" && tankCount < 2) {
            recommendedTeam.push(hero);
            tankCount++;
        } else if (hero.healer && supportCount < 2) { //Don't check for a support role, the meta favors Healers
            recommendedTeam.push(hero);
            supportCount++;
        } else if (hero.role == "Offense" && offenseCount < 2) {
            recommendedTeam.push(hero);
            offenseCount++;
        }
    });
}

//Build a team based on the three tanks and three healer meta
function ThreeThreeMeta(){
    var tankCount = 0;
    var supportCount = 0;

    //Reset the recommended team
    recommendedTeam = [];

    //Gets all heroes sorted by score from highest to lowest
    var sortedAllHeroes = getAllHeroes();

    //Loop through the sorted heroes then return the tanks and healers with the highest score
    sortedAllHeroes.forEach(function (hero, index) {
        if (hero.role == "Tank" && tankCount < 3) {
            recommendedTeam.push(hero);
            tankCount++;
        } else if (hero.healer && supportCount < 3) { //Don't check for a support role, the meta favors Healers
            recommendedTeam.push(hero);
            supportCount++;
        }
    });
}

//Adjusts the recommended team to make sure there is one of each role
function adjustForMeta() {
    //Count how many of each role is in the recommended team
    recommendedTeam.forEach(function (hero, index) {
        classesMap[hero.role] = classesMap[hero.role] + 1;;
    });
    console.log(classesMap)
    var e = document.getElementById("metaDropdown");
    var selectedMeta = e.options[e.selectedIndex].value;
    //If no meta is selected, and there are missing roles
    if (selectedMeta == "NoMeta" && !(classesMap['Tank'] != 0 && classesMap['Support'] != 0 && classesMap['Offense'] != 0 && classesMap['Defense'] != 0))
        verifyOneOfEachRole();

    //If the two tank, two offense, and two healer meta is selected
    else if (selectedMeta == "TwoTwoTwoMeta")
        twoTwoTwoMeta();

    //If the three tank and three healer meta is selected
    else if (selectedMeta == "TankMeta")
        ThreeThreeMeta();
    //No else clause is needed. The team is valid if none of the previous if statements are true
}

//Displays the recommended team and sets the data balloon to be visible
function pushRecommendedTeamtoUI() {
    //Loads the heroes in to the recommendedTeamIcon elements
    recommendedTeam.forEach(function (hero, index) {
        $(".recommendedTeamIcon.empty").first().css("background-image", "url(images/CharacterIcons/" + hero.name + ".png)");
        $(".recommendedTeamIcon.empty").first().attr("hero", hero.name);
        $(".recommendedTeamIcon.empty").first().attr("data-balloon", generateCounterString(hero));
        $(".recommendedTeamIcon.empty").first().removeClass("empty");
    });

    //Sets the balloons to be visible
    $("[data-balloon]:hover:before, [data-balloon]:hover:after").css("-khtml-opacity", 1);
    $("[data-balloon]:hover:before, [data-balloon]:hover:after").css("-moz-opacity", 1);
    $("[data-balloon]:hover:before, [data-balloon]:hover:after").css("opacity", 1);
}

//Verifies that there is one of each role in the recommended team
function verifyOneOfEachRole(){
    //Figure out what roles are missing
    var rolesToBeAdded = new Array();
    for (var i in classesMap)
        if (classesMap[i] == 0)
            rolesToBeAdded.push(i);

    //Starting from the rear, find the lowest scoring hero with more than 1 other hero in it's role, and replace it with the highest scoring hero from the unfilled role
    rolesToBeAdded.forEach(function (role, index) {
        for (i = 5; i >= 0; i--) {
            var potentialHeroToReplace = recommendedTeam[i];
            var roleHeroes = getSortedRole(role);
            if (classesMap[potentialHeroToReplace.role] > 1) {
                recommendedTeam[i] = getHero(roleHeroes[0].actualName)
                i = -1; //Kill the loop since the missing role has been filed
            }
        }
    });
}

//Generates the Balloon.css string to appear when the recommended hero is moused over
function generateCounterString(counterStringHero) {
    var counterString = "";

    //Build an array of all the heroes the recommended hero is good against.
    var countersArray = new Array();
    var heroStrengths = counterStringHero.strengths;
    heroStrengths.forEach(function (strength, index) {
        var indexOfEnemy = enemyTeam.indexOf(strength)
        if (indexOfEnemy != -1)
            var enemy = enemyTeam[indexOfEnemy]
            if (countersArray.indexOf(enemy) == -1 && heroStrengths.indexOf(enemy) != -1)
                countersArray.push(enemy);
    });

    //Creates the string and add "Good on map" if the hero is listed as good on the map
    var map = $(".selected").attr('map');
    var mapHeroes = getMapHeroes(map);
    if (mapHeroes.indexOf(counterStringHero.actualName) != -1) {
        counterString += "Good on map";
        if (countersArray.length > 0)
            counterString += " & ";
    }

    //Appends the counters to the end of the string
    if (countersArray.length != 0)
        counterString += "Counters ";
    if (countersArray.length == 1)
        counterString += countersArray[0]
    else if (countersArray.length == 2) {
        counterString += countersArray.join(" & ")
    } else if (countersArray.length >= 3) {
        counterString += countersArray.join(", ")
        counterString = counterString.substring(0, counterString.lastIndexOf(', ')) + ", & " + counterString.substring(counterString.lastIndexOf(', ') + 1)
    }
    return counterString;
}

