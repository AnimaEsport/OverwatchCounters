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
    outString += CountersString[:-2] + "\n\t\t},\n\t\tscore: 0,\n\t\tproScore: 0\n\t},"

with open("heroData.js", "a") as outFile:
    outFile.write(outString[:-1]+"\n]")

