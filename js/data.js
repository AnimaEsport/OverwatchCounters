//File contains all the data used for the front end. Any new Maps or Heroes added here will automatically be added to the page
//File also contains all functions used to retrieve and manipulate the data data.
var mapWeight = 1; //Amount of points to give to a hero that's good on the map.
var counterWeight = 1; //Amount of points to give to each hero that counters a hero on the enemy team
var weaknessWeight = 1;  //Amount of points to give to each hero that counters a hero on hte recommended team

//Hero data, all data for each hero is stored
//name: string - Name of the hero with no spaces or special character, for use in logic.js
//actualName: string - Display name of the hero, contains spaces and special characters
//role: string - That role the hero filles, can be Attack, Defense, Tank, or support
//healer: Boolean - Is the hero a healer
//strengths: Array of strings - Who the hero is strong against
//weaknesses: Array of strings - Who the hero is weak against
//score: Int - The current score of the hero based on counters, weaknesses, and map data
//proScorew: Int - the score based on where the hero is in the current tournoment meta.  Heroes are graded A to F and get a score from 2 to -2 where A = 2 and F = -2
//icon: string - Where the hero icon is stored
var heroData = [
    {
        name: "Ana",
        actualName: "Ana",
        role: 'Support',
        healer: true,
        strengths: ["Dva", "McCree", "Pharah"],
        weaknesses: ["Genji", "Tracer", "Reaper", "Reinhardt"],
        score: 0,
        proScore: 1
    },
    {
        name: "Bastion",
        actualName: "Bastion",
        role: 'Defense',
        healer: false,
        strengths: ["Lucio", "McCree", "Pharah", "Tracer", "Winston"],
        weaknesses: ["Dva", "Genji", "Hanzo", "Pharah", "Roadhog", "Tracer", "Widowmaker"],
        score: 0,
        proScore: -2
    },
    {
        name: "Dva",
        actualName: "Dva",
        role: 'Tank',
        healer: false,
        strengths: ["Bastion", "Hanzo", "Roadhog", "Widowmaker"],
        weaknesses: ["Reaper", "Tracer", "Pharah", "Zenyatta", "Zarya", "Ana", "Mei", "Genji"],
        score: 0,
        proScore: -1
    },
    {
        name: "Genji",
        actualName: "Genji",
        role: 'Offense',
        healer: false,
        strengths: ["Ana", "Bastion", "Dva", "Hanzo", "Mercy", "Roadhog", "Tracer", "Widowmaker", "Zenyatta"],
        weaknesses: ["McCree", "Mei", "Symmetra", "Winston", "Zarya"],
        score: 0,
        proScore: 0
    },
    {
        name: "Hanzo",
        actualName: "Hanzo",
        role: 'Defense',
        healer: false,
        strengths: ["Bastion", "Hanzo", "Soldier76", "Torbjorn", "Widowmaker"],
        weaknesses: ["Genji", "Tracer", "Winston", "Dva", "Hanzo"],
        score: 0,
        proScore: -1
    },
    {
        name: "Junkrat",
        actualName: "Junkrat",
        role: 'Defense',
        healer: false,
        strengths: ["Mei", "Reinhardt", "Symmetra", "Torbjorn"],
        weaknesses: ["Pharah", "Reinhardt", "Widowmaker"],
        score: 0,
        proScore: -2
    },
    {
        name: "Lucio",
        actualName: "Lucio",
        role: 'Support',
        healer: true,
        strengths: ["Reaper"],
        weaknesses: ["Pharah", "Reaper", "Bastion", "Roadhog"],
        score: 0,
        proScore: 2
    },
    {
        name: "McCree",
        actualName: "McCree",
        role: 'Offense',
        healer: false,
        strengths: ["Genji", "Mei", "Pharah", "Reaper", "Torbjorn", "Tracer"],
        weaknesses: ["Bastion", "Widowmaker", "Zarya", "Reinhardt", "Winston", "Ana"],
        score: 0,
        proScore: 0
    },
    {
        name: "Mei",
        actualName: "Mei",
        role: 'Defense',
        healer: false,
        strengths: ["Dva", "Genji", "Roadhog", "Soldier76", "Torbjorn", "Widowmaker", "Zarya"],
        weaknesses: ["Junkrat", "McCree", "Pharah", "Widowmaker", "Reaper", "Zarya"],
        score: 0,
        proScore: 0
    },
    {
        name: "Mercy",
        actualName: "Mercy",
        role: 'Support',
        healer: true,
        strengths: [],
        weaknesses: ["Tracer", "Genji", "Widowmaker", "Winston", "Roadhog"],
        score: 0,
        proScore: -1
    },
    {
        name: "Pharah",
        actualName: "Pharah",
        role: 'Offense',
        healer: false,
        strengths: ["Bastion", "Dva", "Junkrat", "Lucio", "Mei", "Reaper", "Reinhardt", "Symmetra"],
        weaknesses: ["Bastion", "McCree", "Soldier76", "Widowmaker", "Roadhog", "Ana"],
        score: 0,
        proScore: -1
    },
    {
        name: "Reaper",
        actualName: "Reaper",
        role: 'Offense',
        healer: false,
        strengths: ["Ana", "Dva", "Lucio", "Mei", "Reinhardt", "Widowmaker", "Winston", "Zarya", "Zenyatta"],
        weaknesses: ["Lucio", "Roadhog", "McCree", "Pharah", "Zarya"],
        score: 0,
        proScore: 0
    },
    {
        name: "Reinhardt",
        actualName: "Reinhardt",
        role: 'Tank',
        healer: false,
        strengths: ["Ana", "Junkrat", "McCree", "Roadhog", "Soldier76", "Widowmaker", "Winston", "Zenyatta"],
        weaknesses: ["Junkrat", "McCree", "Pharah", "Reaper", "Symmetra", "Winston", "Torbjorn"],
        score: 0,
        proScore: 1
    },
    {
        name: "Roadhog",
        actualName: "Roadhog",
        role: 'Tank',
        healer: false,
        strengths: ["Bastion", "Lucio", "Mercy", "Pharah", "Reaper", "Torbjorn", "Tracer", "Widowmaker"],
        weaknesses: ["Mei", "Zarya", "Reinhardt", "Genji", "Tracer", "Dva"],
        score: 0,
        proScore: 0
    },
    {
        name: "Soldier76",
        actualName: "Soldier: 76",
        role: 'Offense',
        healer: false,
        strengths: ["Pharah", "Widowmaker"],
        weaknesses: ["Mei", "Hanzo", "Reinhardt", "Zenyatta"],
        score: 0,
        proScore: -2
    },
    {
        name: "Symmetra",
        actualName: "Symmetra",
        role: 'Support',
        healer: false,
        strengths: ["Genji", "Reinhardt"],
        weaknesses: ["Tracer", "Winston", "Junkrat", "Pharah"],
        score: 0,
        proScore: -2
    },
    {
        name: "Torbjorn",
        actualName: "Torbjorn",
        role: 'Defense',
        healer: false,
        strengths: ["Tracer"],
        weaknesses: ["Widowmaker", "Reinhardt", "McCree", "Mei", "Junkrat", "Pharah", "Roadhog", "Hanzo"],
        score: 0,
        proScore: -2
    },
    {
        name: "Tracer",
        actualName: "Tracer",
        role: 'Offense',
        healer: false,
        strengths: ["Ana", "Bastion", "Dva", "Hanzo", "Mercy", "Roadhog", "Symmetra", "Widowmaker", "Zarya", "Zenyatta"],
        weaknesses: ["Genji", "McCree", "Torbjorn", "Bastion", "Roadhog"],
        score: 0,
        proScore: 0
    },
    {
        name: "Widowmaker",
        actualName: "Widowmaker",
        role: 'Defense',
        healer: false,
        strengths: ["Bastion", "Junkrat", "McCree", "Mei", "Mercy", "Pharah", "Torbjorn", "Zarya", "Zenyatta"],
        weaknesses: ["Mei", "Hanzo", "Genji", "Tracer", "Reaper", "Soldier76", "Dva", "Winston", "Roadhog", "Reinhardt"],
        score: 0,
        proScore: -2
    },
    {
        name: "Winston",
        actualName: "Winston",
        role: 'Tank',
        healer: false,
        strengths: ["Genji", "Hanzo", "McCree", "Mercy", "Reinhardt", "Symmetra", "Widowmaker", "Zenyatta"],
        weaknesses: ["Reaper", "Bastion", "Reinhardt", "Zenyatta"],
        score: 0,
        proScore: 0
    },
    {
        name: "Zarya",
        actualName: "Zarya",
        role: 'Tank',
        healer: false,
        strengths: ["Dva", "Genji", "McCree", "Mei", "Reaper", "Roadhog"],
        weaknesses: ["Tracer", "Reaper", "Mei", "Widowmaker"],
        score: 0,
        proScore: 2
    },
    {
        name: "Zenyatta",
        actualName: "Zenyatta",
        role: 'Support',
        healer: true,
        strengths: ["Dva", "Soldier76", "Winston"],
        weaknesses: ["Genji", "Tracer", "Reaper", "Reinhardt", "Widowmaker", "Winston"],
        score: 0,
        proScore: 0
    }
];

//All Data for the maps is stored here
//name: Name of the map with no spaces or special characters, for use in logic.js
//actualName: How the name is to be displayed
//maptype: What the map type is, can be Escort, Hybrid, Assault, or Control - Control is used to deterime if the attack/defense radio buttons are to be displayed.
//attackHeroes: Heroes that are good on attack, Control maps use this for map heroes
//defenseHeroes: Heroes that are good on defense, Control maps don't use this (There is no defense on control, both teams attack)
//icon: Location of the icon used to represent the map.
var mapData = [
    {
        name: "Dorado",
        actualName: "Dorado",
        mapType: "Escort",
        attackHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Genji", "Pharah", "Tracer"],
        defenseHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Hanzo", "Mei", "Widowmaker"]
    },
    {
        name: "Eichenwalde",
        actualName: "Eichenwalde",
        mapType: "Hybrid",
        attackHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Pharah", "Reaper", "Tracer"],
        defenseHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Mei", "Symmetra", "Widowmaker"]
    },
    {
        name: "Hanamura",
        actualName: "Hanamura",
        mapType: "Assault",
        attackHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Genji", "Reaper", "Soldier76", "Tracer"],
        defenseHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Symmetra", "Junkrat", "Mei", "Soldier76"]
    },
    {
        name: "Hollywood",
        actualName: "Hollywood",
        mapType: "Hybrid",
        attackHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Genji", "Pharah", "Tracer"],
        defenseHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Hanzo", "Widowmaker", "McCree", "Pharah", "Tracer"]
    },
    {
        name: "Ilios",
        actualName: "Ilios",
        mapType: "Control",
        attackHeroes: ["Dva", "Reinhardt", "Winston", "Lucio", "Mercy", "Junkrat", "McCree", "Pharah", "Reaper", "Soldier76"],
        defenseHeroes: [], //NOT NEEDE
    },
    {
        name: "KingsRow",
        actualName: "King's Row",
        mapType: "Hybrid",
        attackHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Pharah", "Reaper", "Tracer"],
        defenseHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Mei", "Symmetra", "Widowmaker"]
    },
    {
        name: "LijiangTower",
        actualName: "Lijiang Tower",
        mapType: "Control",
        attackHeroes: ["Dva", "Reinhardt", "Winston", "Lucio", "Mercy", "Junkrat", "Genji", "McCree", "Pharah", "Reaper", "Soldier76"],
        defenseHeroes: [], //Not Needed
    },
    {
        name: "Nepal",
        actualName: "Nepal",
        mapType: "Control",
        attackHeroes: ["Dva", "Reinhardt", "Lucio", "Junkrat", "Mei", "Soldier76"],
        defenseHeroes: [],
    },
    {
        name: "Numbani",
        actualName: "Numbani",
        mapType: "Hybrid",
        attackHeroes: ["Dva", "Reinhardt", "Winston", "Lucio", "Mercy", "Genji", "Pharah", "Tracer"],
        defenseHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Hanzo", "Mei", "Junkrat", "Widowmaker"],
    },
    {
        name: "Route66",
        actualName: "Route 66",
        mapType: "Escort",
        attackHeroes: ["Dva", "Reinhardt", "Winston", "Lucio", "Mercy", "Genji", "Pharah", "Tracer"],
        defenseHeroes: ["Dva", "Reinhardt", "Winston", "Lucio", "Mercy", "Hanzo", "Junkrat", "Mei"],
    },
    {
        name: "Anubis",
        actualName: "Temple of Anubis",
        mapType: "Assault",
        attackHeroes: ["Dva", "Reinhardt", "Winston", "Lucio", "Mercy", "Reaper", "Pharah", "Tracer"],
        defenseHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Symmetra", "Hanzo", "Junkrat", "Mei"],
    },
    {
        name: "Volskaya",
        actualName: "Volskaya Industries",
        mapType: "Assault",
        attackHeroes: ["Dva", "Reinhardt", "Winston", "Lucio", "Mercy", "Genji", "Reaper", "Soldier76"],
        defenseHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Symmetra", "Hanzo", "Mei", "Widowmaker"],
    },
    {
        name: "Gibraltar",
        actualName: "Watchpoint: Gibraltar",
        mapType: "Escort",
        attackHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Genji", "Pharah", "Tracer"],
        defenseHeroes: ["Dva", "Reinhardt", "Lucio", "Mercy", "Hanzo", "Junkrat", "Mei", "Widowmaker", "Pharah", "Tracer"]
    }
];

//Increments by 1 the Hero by the counterWeight
function incrementHeroByName(_hero) {
    heroData.filter(function (val, index, array) {
        return val.name === _hero;
    })[0].score = heroData.filter(function (val, index, array) {
        return val.name === _hero;
    })[0].score + counterWeight;
}

//Decrements by 1 the hero by the counterWeight
function decrementHeroByName(_hero) {
    heroData.filter(function (val, index, array) {
        return val.name === _hero;
    })[0].score = heroData.filter(function (val, index, array) {
        return val.name === _hero;
    })[0].score - counterWeight;
}

//Returns an array of strings of all the hero weaknesses
function getHeroWeaknessesByName(_hero) {
    return heroData.filter(function (val, index, array) {
        return val.name === _hero;
    })[0].weaknesses;
}

//Returns an array of strings of all the hero strengths
function getHeroStrengthsByName(_hero) {
    return heroData.filter(function (val, index, array) {
        return val.name === _hero;
    })[0].strengths;
}

//Returns the mapType as a string
function getMapTypeByName(_map) {
    return mapData.filter(function (val, index, array) {
        return val.name === _map;
    })[0].mapType;
}

//Get all the heroes good on the map
function getMapHeroesByName(_map) {
    if (_map != null) {
        var mapType = getMapTypeByName(_map);
        var attackOrDefense = document.getElementById("attack").checked;
        if (mapType == 'Control' || attackOrDefense)
            var mapHeroesToReturn = mapData.filter(function (val, index, array) {
                return val.name === _map;
            })[0].attackHeroes;
        else
            var mapHeroesToReturn = mapData.filter(function (val, index, array) {
                return val.name === _map;
            })[0].defenseHeroes;
        return mapHeroesToReturn;
    } else
        return [];
}

//Returns an array of six heroes as objects sorted by score
function getTopSixHeroesArray() {
    return heroData.sort(function (a, b) {
        return a.score - b.score;
    }).reverse().slice(0, 6);
}

//Returns an array of objects filled with all heroes sorted by score from highest to lowest
function getAllHeroesArray() {
    return heroData.sort(function (a, b) {
        return a.score - b.score;
    }).reverse();
}

//Returns an object of the selected hero
function getHeroByName(_hero) {
    return heroData.filter(function (val, index, array) {
        return val.name === _hero;
    })[0];
}

//Returns all heroes of a given role as an array of objects
function getSortedRoleByName(roleToSearch){
    var tempArray = new Array();
    if (roleToSearch)
        heroData.forEach(function (hero, index){
            if(hero.role == roleToSearch)
                tempArray.push(hero)
        });
    return tempArray;
}

//Returns an array of objects of all heroes marked as healers
function getHealersArray() {
    var tempArray = new Array();
    heroData.forEach(function (hero, index){
        if(hero.healer)
            tempArray.push(hero)
    });
    return tempArray;
}

//Testing, logs to the console all the hero's scores
function printEachHeroScore(){
    console.log("");
    for (var i = 0; i < heroData.length; i++)
        console.log(heroData[i].name + "'s score: " + heroData[i].score);
}
