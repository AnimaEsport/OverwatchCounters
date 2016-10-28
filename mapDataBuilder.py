with open("in.csv", "r") as inFile:
    previousMap = ""
    previousSubMap = ""
    outDict = {}
    firstRun = True
    for line in inFile:
        currentLine = line[5:].rstrip()

        currentHero = currentLine[:currentLine.index(',')]
        currentLine = currentLine[currentLine.index(',')+1:]

        currentMap = currentLine[:currentLine.index(' - ')]
        currentLine = currentLine[currentLine.index(' - ')+3:]

        subMap = currentLine[:currentLine.index(',')]
        currentLine = currentLine[currentLine.index(',')+1:]

        previousMap = currentMap
        previousSubMap = subMap
        break
    for line in inFile:
        currentLine = line[5:].rstrip()

        currentHero = currentLine[:currentLine.index(',')]
        currentLine = currentLine[currentLine.index(',')+1:]

        currentMap = currentLine[:currentLine.index(' - ')]
        currentLine = currentLine[currentLine.index(' - ')+3:]

        subMap = currentLine[:currentLine.index(',')]
        currentLine = currentLine[currentLine.index(',')+1:]

        score = currentLine[:currentLine.index(',')]
        currentLine = currentLine[currentLine.index(',')+1:]
        score = (int(score)-3)

        outstring = "name: " + currentMap + ", actualName: " + currentMap + ", "

        if currentMap != previousMap:
            with open("out.txt", "a") as outFile:
                outFile.write(currentMap + " - " + subMap+"\n")
                outFile.write(str(outDict)+"\n\n")
            previousMap = currentMap
            previousSubMap = subMap
            outDict = {}
            exit()
        elif previousSubMap != subMap:
            with open("out.txt", "a") as outFile:
                outFile.write( currentMap + " - " + subMap+"\n")
                outFile.write( str(outDict)+"\n\n")
            previousSubMap = subMap
            outDict = {}
            exit()
        outDict[currentHero] = score

