## How to Mark up PGN for OLGA 2 Header


The Header supports these new PGN Elements

### **Set Name**
#### *The name of the set being displayed (blank if empty).*
[Set "string value set name"]

    [Set "Testing Olga 2"]

### **Set Date**
#### *A date associated with the set.*

[SetDate "string or **preferrably string date**"] 

    [SetDate "Halloween 2020"]
    [SetDate "Oct 31 2020"]


### **Image Path**
#### *The path to images assume DOMAIN_NAME this path files.* 

[ImagePath "path/to/files"]

    [ImagePath "/assets/images/players/"]


### **Player Data**
#### *Describes meta related to a player (image, born, rating). Player data is an associative object 'Player Name'=> Object. Make sure the string is valid JSON or it will be ignored.* 
[PlayerData "object{name:object,name:object,...}"]

    [PlayerData "{"Garry Kasparov":{"born":"April 13th 1963","image":"Garry-Kasparov.png", "elo":2812}, "Anatoly Karpov":{"image":"Anatoly-Karpov.png", "elo":2617, "born":"May 23th 1951"}}"]