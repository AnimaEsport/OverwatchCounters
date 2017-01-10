heroes = ["Ana", "Bastion", "Dva", "Genji", "Hanzo", "Junkrat", "Lucio", "McCree", "Mei", "Mercy", "Pharah", "Reaper", "Reinhardt", "Roadhog", "Soldier76", "Sombra", "Symmetra", "Torbjorn", "Tracer", "Widowmaker", "Winston", "Zarya", "Zenyatta"]
roles = {"Genji": "Offense", "McCree": "Offense", "Pharah": "Offense", "Reaper": "Offense", "Soldier76": "Offense", "Sombra": "Offense", "Tracer": "Offense", "Bastion": "Defense", "Hanzo": "Defense", "Junkrat": "Defense", "Mei": "Defense", "Torbjorn": "Defense", "Widowmaker": "Defense", "Dva": "Tank", "Reinhardt": "Tank", "Roadhog": "Tank", "Winston": "Tank", "Zarya": "Tank", "Ana": "Support", "Lucio": "Support", "Mercy": "Support", "Symmetra": "Support", "Zenyatta": "Support"}
builders = ["Symmetra", "Torbjorn"]
snipers = ["Ana", "Hanzo", "Widowmaker"]
healers = ["Ana", "Lucio", "Mercy", "Zenyatta"]

countersMatrix = {}

for hero in heroes:
    countersMatrix[hero] = {}
    for hero_ in heroes:
        countersMatrix[hero][hero_] = 0

with open("overwatch-counters-guide-counterpicks.csv", "r") as inFile:
    for line in inFile:
        if (line.find("counterpicks,") != -1):
            line = line.replace("counterpicks,", "").rstrip()
            hero = line[:line.find(",")]
            line = line[line.find(",")+1:]
            counter = line[:line.find(",")]
            line = line[line.find(",")+1:]

            score = line[:line.find(",")]
            line = line[line.find(",")+1:]
            actualName = ""
            if score == "":
                score = 0
            else:
                score = int(score) - 3
            if hero == "Soldier: 76":
                hero = "Soldier76"
            elif hero == "D.Va":
                hero = "Dva"

            if counter == "Soldier: 76":
                counter = "Soldier76"
            elif counter == "D.Va":
                counter = "Dva"
            countersMatrix[counter][hero] = score

outString = "var heroData = ["
for hero in heroes:
    if hero == "Soldier76":
        actualName = "Soldier: 76"
    elif hero == "Dva":
        actualName = "D.Va"
    else:
        actualName = hero
    outString += " {\n\t\tname: \"" + hero + "\",\n\t\tactualName: \"" +actualName + "\",\n\t\trole: \"" + roles[hero] + "\",\n\t\thealer: " + ("true" if hero in healers else "false") + ",\n\t\tsniper: " + ("true" if hero in snipers else "false") + ",\n\t\tbuilder: " + ("true" if hero in builders else "false") + ",\n\t\tcounterScores: {\n"
    CountersString = ""
    for counter in heroes:
       CountersString += "\t\t\t" + counter + ": " + str(countersMatrix[hero][counter]) + ",\n"
    outString += CountersString[:-2] + "\n\t\t},\n\t\tsynergies: {\n\t\t"
    synergies = {"Ana": 0, "Bastion": 0, "Dva": 0, "Genji": 0, "Hanzo": 0, "Junkrat": 0, "Lucio": 0, "McCree": 0, "Mei": 0, "Mercy": 0, "Pharah": 0, "Reaper": 0, "Reinhardt": 0, "Roadhog": 0, "Soldier76": 0, "Sombra": 0, "Symmetra": 0, "Torbjorn": 0, "Tracer": 0, "Widowmaker": 0, "Winston": 0, "Zarya": 0, "Zenyatta": 0}
    with open("synergy.csv", "r") as synergiesFile:
        for line in synergiesFile:
            if line.find("synergy,") != -1:
                line = line.replace("synergy,", "").rstrip()
                XHero = line[:line.find(",")]
                line = line[line.find(",")+1:]
                YHero = line[:line.find(",")]
                line = line[line.find(",")+1:]
                score = line[:line.find(",")]
                line = line[line.find(",")+1:]
                if score == '':
                    score = 3
                if XHero == "Soldier: 76":
                    XHero = "Soldier76"
                elif XHero == "D.Va":
                    XHero = "Dva"
                if YHero == "Soldier: 76":
                    YHero = "Soldier76"
                elif YHero == "D.Va":
                    YHero = "Dva"
                if XHero == hero:
                    synergies[YHero] = int(score)-3
    for tempHero in heroes:
        outString += "\t" + tempHero + ": " + str(synergies[tempHero]) + ",\n\t\t"

    outString = outString[:-4]

    outString += "\n\t\t},\n\t\tscore: 0,\n\t\tproScore: 0,\n\t\tlocked: false,\n\t\tremoved: false\n\t},"

with open("heroData.js", "a") as outFile:
    outFile.write(outString[:-1]+"\n]")


