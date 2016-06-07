//May the programming gods forgive my transgressions

var heroes = ["Bastion", "Dva", "Genji", "Hanzo", "Junkrat", "Lucio", "McCree", "Mei", "Mercy", "Pharah", "Reaper", "Reinhardt", "Roadhog", "Soldier76", "Symmetra", "Torbjorn", "Tracer", "Widowmaker", "Winston", "Zarya", "Zenyatta"];
var offenseHeroes = ["McCree", "Pharah", "Genji", "Reaper", "Tracer", "Soldier76"];
var defenseHeroes = ["Bastion", "Hanzo", "Junkrat", "Mei", "Torbjorn", "widowmaker"];
var tankHeroes = ["Dva", "Reinhardt", "Roadhog", "Winston", "Zarya"];
var supportHeroes = ["Lucio", "Mercy", "Symmetra", "Zenyatta"];
var weaknesses = [];
weaknesses["Bastion"] = ["Widowmaker", "Hanzo", "Junkrat", "Genji", "Tracer", "Pharah"];
weaknesses["Dva"] = ["Roadhog", "Zenyatta", "Zarya", "Junkrat", "Mei"];
weaknesses["Genji"] = ["Tracer", "Pharah", "Zarya", "Junkrat", "Mei"];
weaknesses["Hanzo"] = ["Tracer", "Genji", "Widowmaker", "Mei", "Reinhardt"];
weaknesses["Junkrat"] = ["Widowmaker", "Hanzo", "Pharah", "Reaper"];
weaknesses["Lucio"] = ["Widowmaker", "Tracer", "Pharah", "Roadhog"];
weaknesses["McCree"] = ["Widowmaker", "Hanzo", "Bastion"];
weaknesses["Mei"] = ["Reaper", "Pharah", "Junkrat"];
weaknesses["Mercy"] = ["Widowmaker", "Hanzo", "McCree"];
weaknesses["Pharah"] = ["Widowmaker", "Hanzo", "McCree", "Roadhog", "Soldier76"];
weaknesses["Reaper"] = ["Pharah", "Lucio", "McCree", "Soldier76"];
weaknesses["Reinhardt"] = ["Pharah", "Junkrat", "McCree", "Reaper", "Mei", "Zenyatta"];
weaknesses["Roadhog"] = ["Pharah", "Torbjorn", "Widowmaker", "Hanzo", "Bastion", "Zenyatta"];
weaknesses["Soldier76"] = ["McCree", "Reaper", "Hanzo", "Widowmaker"];
weaknesses["Symmetra"] = ["Junkrat", "Zarya", "Winston"];
weaknesses["Torbjorn"] = ["Pharah", "McCree", "Widowmaker", "Hanzo", "Tracer", "Zenyatta", "Junkrat"];
weaknesses["Tracer"] = ["McCree", "Reaper", "Roadhog", "Winston", "Soldier76", "Pharah"];
weaknesses["Widowmaker"] = ["Tracer", "Genji", "Reaper", "Winston"];
weaknesses["Winston"] = ["Reaper", "McCree", "Mei", "Zenyatta"];
weaknesses["Zarya"] = ["Reaper", "Bastion"];
weaknesses["Zenyatta"] = ["Hanzo", "Widowmaker", "Genji", "Tracer"];


function enemyClicked(enemy) {
    $(".enemyTeamIcon.empty").first().css("background-image", "url(Assets/CharacterIcons/" + enemy + ".png)");
    $(".enemyTeamIcon.empty").first().css("background-size", "cover");

    $(".enemyTeamIcon.empty").first().attr("hero", enemy);
    $(".enemyTeamIcon.empty").first().removeClass("empty");
    if ($(".enemyTeamIcon.empty").length == 0) {
        determineTeam();
    }
}

function determineTeam() {
    //var enemyTeam = ["Reaper", "Mei", "Zenyatta", "Reinhardt", "Roadhog", "Pharah"];
    var enemyTeam = [];
    $(".enemyTeamIcon").each(function (index) {
        enemyTeam.push($(this).attr("hero"))
    });
    var yourTeam = [];
    for (var x = 0; x < enemyTeam.length; x++) { //For each enemy on the enemy team
        var currentEnemy = enemyTeam[x]; //Current Enemy
        var currentEnemyWeaknesses = weaknesses[currentEnemy]; // Current enemy weaknesses
        var numOfWeaknesses = currentEnemyWeaknesses.length - 1; //get number of weaknesses
        while (numOfWeaknesses >= 0) {
            var currentEnemyWeakness = currentEnemyWeaknesses[numOfWeaknesses]; //Get an enemy weaknes
            if (yourTeam[currentEnemyWeakness] == undefined) //If that enemy isn't in in your team add it
                yourTeam[currentEnemyWeakness] = 1;
            else // Else increment the enemy by one
                yourTeam[currentEnemyWeakness]++;
            numOfWeaknesses--;
        }
    }
    var yourTeamArray = Object.keys(yourTeam).sort(function (a, b) {
        return yourTeam[a] - yourTeam[b]
    })
    yourTeamArray.forEach(function (hero, heroIndex) { //For each hero in your team
            var weaknessesList = weaknesses[hero] //Get the Weakness of the hero
            weaknessesList.forEach(function (weakness, weaknessIndex) { //For each of the weaknesses
                if (enemyTeam.indexOf(weakness) != -1) { //if the enemy team has a counter to the hero
                    yourTeam[hero]--;
                }
            })
        })
        //Pick the Better Sniper
    if (yourTeam["Hanzo"] > yourTeam["Widowmaker"])
        yourTeam["Widowmaker"] = yourTeam["Widowmaker"] - 2
    else
        yourTeam["Hanzo"] = yourTeam["Hanzo"] - 2
    yourTeamArray = Object.keys(yourTeam).sort(function (a, b) {
        return yourTeam[a] - yourTeam[b]
    })

    yourTeamArray.forEach(function(hero, index){
        console.log(hero + " : " + yourTeam[hero])
    })
    console.log(yourTeamArray)

    var hasDefense = false;
    var hasOffense = false;
    var hasSupport = false;
    var hasTank = false;

    yourTeamArray.slice(0, 6).forEach(function(hero, index){
        console.log(hero)
        if(defenseHeroes.indexOf(hero) != -1)
            hasDefense = true;
        else if(offenseHeroes.indexOf(hero) != -1)
            hasOffense = true;
        else if(tankHeroes.indexOf(hero) != -1)
            hasTank = true;
        else if(supportHeroes.indexOf(hero) != -1)
            hasSupport = true;
    })

    console.log("Has Defense: " + hasDefense)
    console.log("Has Offense: " + hasOffense)
    console.log("Has Support: " + hasSupport)
    console.log("Has Tank: " + hasTank)


    loadRecommendations(yourTeamArray.reverse().slice(0, 6), enemyTeam);
}

function loadRecommendations(recommendations, enemyTeam) {
    recommendations.forEach(function(recommendation, index) {
        var ele = parseInt(index)+1;
        $("#recommendTeam"+ele.toString()).css("background-image", "url(Assets/CharacterIcons/" + recommendation + ".png)");
        $("#recommendTeam"+ele.toString()).css("background-size", "cover");
        $("#recommendTeam"+ele.toString()).attr("data-balloon", counterString(recommendation, enemyTeam));
    })
    $("[data-balloon]:hover:before, [data-balloon]:hover:after").css("opacity", 1);
}

function counterString(hero, enemyTeam) {
    var outArray = [];
    enemyTeam.forEach(function(enemy, index){
        var weaknessList = weaknesses[enemy];
        if (weaknessList.indexOf(hero) != -1) {
            if(outArray.indexOf(enemy) == -1)
                outArray.push(enemy)
        }
    })
    console.log(outArray.length);
    if (outArray.length > 1) {
    var outString = outArray.join(", ");
    var lastIndexComma = outString.lastIndexOf(",");
    outString = outString.substring(0, lastIndexComma) + ', and' + outString.substring(lastIndexComma + 1)
    }
    else {
        var outString = outArray[0]
    }
    return "Counters " + outString;
}

$(document).ready(function () {
    $(".heroIcon").click(function () {
        enemyClicked($(this).attr("enemy"));
    });
    $(".enemyTeamIcon").click(function () {
        $(this).css("background-image", "");
        $(this).attr("hero", "");
        $(this).addClass("empty");
    });
});
