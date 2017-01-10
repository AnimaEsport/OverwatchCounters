with open("synergy.csv", "r") as synergyFile:
    for line in synergyFile:
        if line.find("synergy,") != -1:
            newLine = line.replace("synergy,","").rstrip()
            print newLine
