heroes = ["Bastion", "Dva", "Genji", "Hanzo", "Junkrat", "Lucio", "McCree", "Mei", "Mercy", "Pharah", "Reaper", "Reinhardt", "Roadhog", "Soldier76", "Symmetra", "Torbjorn", "Tracer", "Widowmaker", "Winston", "Zarya", "Zenyatta"]

weaknesses = Hash.new
weaknesses["Bastion"] = ["Widowmaker", "Hanzo", "Junkrat", "Genji", "Tracer", "Pharah"]
weaknesses["Dva"] = ["Roadhog", "Zenyatta", "Zarya", "Junkrat", "Mei"]
weaknesses["Genji"] = ["Tracer", "Pharah", "Zarya", "Junkrat", "Mei"]
weaknesses["Hanzo"] = ["Tracer", "Genji", "Widowmaker", "Mei", "Reinhardt"]
weaknesses["Junkrat"] = ["Widowmaker", "Hanzo", "Pharah", "Reaper"]
weaknesses["Lucio"] = ["Widowmaker", "Tracer", "Pharah", "Roadhog"]
weaknesses["McCree"] = ["Widowmaker", "Hanzo", "Bastion"]
weaknesses["Mei"] = ["Reaper", "Pharah", "Junkrat"]
weaknesses["Mercy"] = ["Widowmaker", "Hanzo", "McCree"]
weaknesses["Pharah"] = ["Widowmaker", "Hanzo", "McCree", "Roadhog", "Soldier76"]
weaknesses["Reaper"] = ["Pharah", "Lucio", "McCree", "Soldier76"]
weaknesses["Reinhardt"] = ["Pharah", "Junkrat", "McCree", "Reaper", "Mei", "Zenyatta"]
weaknesses["Roadhog"] = ["Pharah", "Torbjorn", "Widowmaker", "Hanzo", "Bastion", "Zenyatta"]
weaknesses["Soldier76"] = ["McCree", "Reaper", "Hanzo", "Widowmaker"]
weaknesses["Symmetra"] = ["Junkrat", "Zarya", "Winston"]
weaknesses["Torbjorn"] = ["Pharah", "McCree", "Widowmaker", "Hanzo", "Tracer", "Zenyatta", "Junkrat"]
weaknesses["Tracer"] = ["McCree", "Reaper", "Roadhog", "Winston", "Soldier76", "Pharah"]
weaknesses["Widowmaker"] = ["Tracer", "Genji", "Reaper", "Winston"]
weaknesses["Winston"] = ["Reaper", "McCree", "Mei", "Zenyatta"]
weaknesses["Zarya"] = ["Reaper", "Bastion"]
weaknesses["Zenyatta"] = ["Hanzo", "Widowmaker", "Genji", "Tracer"]

puts weaknesses["Zarya"]
puts ""
enemyTeam = ["Reaper", "Mei", "Zenyatta", "Reinhardt", "Roadhog", "Bastion"]
yourTeam = []

for enemy in enemyTeam
    puts
    puts enemy + " Weaknesses"
    currentEnemyWeaknesses = weaknesses[enemy]
    for counter in currentEnemyWeaknesses
        if yourTeam.includes?(counter)
            yourTeam[counter] = yourTeam[counter] + 1
        end
    end
end
=begin
        DetermineTeam()
        console.log('done')

        function DetermineTeam() {
            for (var x = 0; x < enemyTeam.length; x++) {
                var currentEnemy = enemyTeam[x];
                var currentEnemyWeaknesses = weaknesses[currentEnemy];
                var numOfWeaknesses = currentEnemyWeaknesses.length - 1;
                while (numOfWeaknesses >= 0) {
                    var currentEnemyWeakness = currentEnemyWeaknesses[numOfWeaknesses];
                    if (yourTeam[currentEnemyWeakness] == undefined) {
                        yourTeam[currentEnemyWeakness] = 1;
                    } else
                        yourTeam[currentEnemyWeakness]++;
                    numOfWeaknesses--;
                }
            }

            console.log("Your Team before counters")
            var keysSorted = Object.keys(yourTeam).sort(function (a, b) {
                return yourTeam[a] - yourTeam[b]
            })
            console.log(keysSorted.reverse().slice(0, 6));
            console.log(yourTeam)
            console.log(yourTeam.length)
        }
=end
