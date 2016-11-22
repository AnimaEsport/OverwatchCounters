heroes = ["Ana", "Bastion", "D.Va", "Genji", "Hanzo", "Junkrat", "Lucio", "McCree", "Mei", "Mercy", "Pharah", "Reaper", "Reinhardt", "Roadhog", "Soldier: 76", "Sombra", "Symmetra", "Torbjorn", "Tracer", "Widowmaker", "Winston", "Zarya", "Zenyatta"]
heroesDictAttack = {"Ana": 0, "Bastion": 0, "Dva": 0, "Genji": 0, "Hanzo": 0, "Junkrat": 0, "Lucio": 0, "McCree": 0, "Mei": 0, "Mercy": 0, "Pharah": 0, "Reaper": 0, "Reinhardt": 0, "Roadhog": 0, "Soldier76": 0, "Sombra": 0, "Symmetra": 0, "Torbjorn": 0, "Tracer": 0, "Widowmaker": 0, "Winston": 0, "Zarya": 0, "Zenyatta": 0}
heroesDictDefend = {"Ana": 0, "Bastion": 0, "Dva": 0, "Genji": 0, "Hanzo": 0, "Junkrat": 0, "Lucio": 0, "McCree": 0, "Mei": 0, "Mercy": 0, "Pharah": 0, "Reaper": 0, "Reinhardt": 0, "Roadhog": 0, "Soldier76": 0, "Sombra": 0, "Symmetra": 0, "Torbjorn": 0, "Tracer": 0, "Widowmaker": 0, "Winston": 0, "Zarya": 0, "Zenyatta": 0}
heroesDictsubmap = {"Ana": 0, "Bastion": 0, "Dva": 0, "Genji": 0, "Hanzo": 0, "Junkrat": 0, "Lucio": 0, "McCree": 0, "Mei": 0, "Mercy": 0, "Pharah": 0, "Reaper": 0, "Reinhardt": 0, "Roadhog": 0, "Soldier76": 0, "Sombra": 0, "Symmetra": 0, "Torbjorn": 0, "Tracer": 0, "Widowmaker": 0, "Winston": 0, "Zarya": 0, "Zenyatta": 0}
mapTypes = {"Hanamura": "Assault", "TempleofAnubis": "Assault", "VolskayaIndustries": "Assault", "Dorado": "Escort", "Route66": "Escort", "WatchpointGibraltar": "Escort", "Hollywood": "Hybrid", "KingsRow": "Hybrid", "Numbani": "Hybrid", "Eichenwalde": "Hybrid", "Ilios": "Control", "LijangTower": "Control", "Nepal": "Control", "Oasis": "Control"}
maplist = ["Hanamura", "Temple of Anubis", "Volskaya Industries", "Dorado", "Route 66", "Watchpoint: Gibraltar", "Hollywood", "King's Row", "Numbani", "Eichenwalde", "Ilios", "Lijang Tower", "Nepal"]


def getMapHeroes(localMapName, localSubMap):
    with open("overwatch-counters-guide-maps.csv", "r") as inFile:
        mapHeroes = {}
        for line in inFile:
            if (line.find("maps,") != -1):
                line = line.replace("maps,", "").rstrip()
                hero = line[:line.find(",")]
                line = line[line.find(",")+1:]
                if hero == "Soldier: 76":
                    hero = "Soldier76"
                elif hero == "D.Va":
                    hero = "Dva"
                mapName = line[:line.find(" - ")]
                line = line[line.find(" - ")+3:]

                submap = line[:line.find(",")]
                line = line[line.find(",")+1:]

                score = line[:line.find(",")]
                line = line[line.find(",")+1:]
                if submap == localSubMap and mapName == localMapName:
                    mapHeroes[hero] = score
        return mapHeroes

def getSubMaps(localMapName):
    returnArray = []
    with open("overwatch-counters-guide-maps.csv", "r") as inFile:
        for line in inFile:
            if (line.find("maps,") != -1):
                line = line.replace("maps,", "").rstrip()
                hero = line[:line.find(",")]
                line = line[line.find(",")+1:]
                if hero == "Soldier: 76":
                    hero = "Soldier76"
                elif hero == "D.Va":
                    hero = "Dva"
                mapName = line[:line.find(" - ")]
                line = line[line.find(" - ")+3:]

                submap = line[:line.find(",")]
                line = line[line.find(",")+1:]

                score = line[:line.find(",")]
                line = line[line.find(",")+1:]
                if mapName == localMapName and not submap in returnArray and submap != "Defend" and submap != "Attack":
                    returnArray.append(submap)
    return returnArray

outString = "var mapData = [{\n"
for map in maplist:
    mapName = map.replace(" ", "").replace("'", "").replace(":", "")
    outString += "\t\tname: \"" + mapName +"\",\n\t\tactualName: \"" + map + "\",\n\t\tmapType: \"" + mapTypes[mapName] + "\",\n\t\tsubMaps: { "
    submaps = getSubMaps(map)
    if submaps != []:
        for submap in submaps:
            submapName = submap.replace(" ", "").replace("'", "").replace(":", "")
            submapHeroes = getMapHeroes(map, submap)
            outString += "\n\t\t\t" + submapName + ": {\n\t\t\t\tname: \"" + submapName + "\",\n\t\t\t\tsubActualName: \"" + submap + "\",\n\t\t\t\theroes: {"
            for hero in heroes:
                if hero == "Soldier: 76":
                    hero = "Soldier76"
                elif hero == "D.Va":
                    hero = "Dva"
                outString += "\n\t\t\t\t\t" + hero + ": " + str(int(submapHeroes[hero]) - 3) + ","
            outString = outString[:-1] + "\n\t\t\t\t}\n\t\t\t},"
        outString = outString[:-1] + "\n\t\t\t},\n\t\tattackHeroes: {},\n\t\tdefenseHeroes: {}\n\t}, {\n"
    else:
        outString = outString[:-1] + "},\n\t\tattackHeroes: {"
        attackHeroes = getMapHeroes(map, "Attack")
        for hero in heroes:
            if hero == "Soldier: 76":
                hero = "Soldier76"
            elif hero == "D.Va":
                hero = "Dva"

            outString += "\n\t\t\t" + hero + ": " + str(int(attackHeroes[hero]) - 3) + ","
        outString = outString[:-1] + "\n\t\t},\n\t\tdefenseHeroes: {"
        defendHeroes = getMapHeroes(map, "Defend")
        for hero in heroes:
            if hero == "Soldier: 76":
                hero = "Soldier76"
            elif hero == "D.Va":
                hero = "Dva"
            outString += "\n\t\t\t" + hero + ": " + str(int(defendHeroes[hero]) - 3) + ","
        outString = outString + "\n\t\t\t}\n\t}, {\n"

outString = outString[:-4] + "];"

with open("map.js", "w") as outFile:
    outFile.write(outString)
