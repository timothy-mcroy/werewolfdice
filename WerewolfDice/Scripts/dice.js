//http://stackoverflow.com/a/3146971/5022251
Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}


// Begin UI modification code

function RollDie() {
    return Math.floor((Math.random() * 10 + 1));
}

function addToDiceBag() {
    var diePool = $("#DicePool").val();
    if (diePool === "" || isNaN(diePool)) return;
    var agains = $("#Agains").val();
    var isRote = $("#RoteAction").is(":checked");
    var rollDescription = $("#RollDescription").val();
    if (rollDescription === "") {
        rollDescription = "Saved Roll";
    }

    var premadeRoll = {
        "diePool" : diePool,
        "agains" : agains,
        "isRote": isRote,
        "rollDescription": rollDescription
    };
    storeRollLocally(premadeRoll);
    insertIntoDiceBag(premadeRoll);
}

function insertIntoDiceBag(premadeRoll) {
    var diePool = premadeRoll.diePool;
    if (diePool === "" || isNaN(diePool)) return;
    var agains = premadeRoll.agains;
    var isRote = premadeRoll.isRote;

    var newButton = jQuery("<div/>", {
        "class": "button stored-roll",
        "data-dicepool": diePool,
        "data-agains": agains,
        "data-is-Rote": isRote,
        "onclick": "storedRoll(this)",
        "data-roll-description": premadeRoll.rollDescription
    });

    var badge = jQuery("<span/>", {
        "class": "agains-badge",
        text: agains
    });
    var diePoolBadge = jQuery("<span/>", {
        "class": "dice-badge",
        text: diePool
    });
    var roteBadgeClass = isRote ? "mif-checkmark" : "mif-cross";
    var roteBadge = jQuery("<span/>", {
        "class": roteBadgeClass + " rote-badge",
        text: " Rote"
    });

    roteBadge.appendTo(newButton);
    badge.appendTo(newButton);
    diePoolBadge.appendTo(newButton);
    jQuery("<span/>", { text: premadeRoll.rollDescription, "class": "diepool-label" }).appendTo(newButton);
    newButton.appendTo("#dicebag");
    if (premadeRoll.hasOwnProperty("results")) {
        //alert("Loading a roll with results!");
    }
}


function storedRoll(rollElem) {
    var d = rollElem.dataset.dicepool;
    var a = rollElem.dataset.agains;
    var i = rollElem.dataset.isRote === "true";
    var desc = rollElem.dataset.rollDescription;
    var rollSettings = {
        agains: a,
        diePool: d,
        isRote: i,
        rollDescription: desc
    };
    
    RollAndRecord(rollSettings);
}

function ExecuteRoll() {
    
    var rollsettings = {
        agains: $("#Agains").val(),
        diePool: $("#DicePool").val(),
        isRote: $("#RoteAction").is(":checked"),
        rollDescription: $("#RollDescription").val()
    };

    if (rollsettings.rollDescription === "") {
        rollsettings.rollDescription = "Quick roll";
    }
    
    if (rollsettings.diePool === "" || isNaN(rollsettings.diePool)) return;
    RollAndRecord(rollsettings);
    
}

function RollAndRecord(rollSettings) {
    var penalty = +$("#DiePenalty").val();
    if (isNaN(penalty)) {
        penalty = 0;
    }
    var bonus = +$("#DieBonus").val();
    if (isNaN(bonus)) {
        bonus = 0;
    }
    rollSettings.diePool = +rollSettings.diePool + bonus - penalty;
    if (rollSettings.diePool < 1) return null;
    
    var results = WerewolfRoll(rollSettings.isRote, rollSettings.diePool, rollSettings.agains);
    var totalDiceRolled = results.DiceBag.length - rollSettings.diePool;
    RecordResults(rollSettings, results, totalDiceRolled);
    storeResultsLocally(rollSettings, results, totalDiceRolled);
    $.Notify({
        caption: rollSettings.rollDescription,
        content: successes(results.DiceBag),
        type: "success"
});
    return results;
}

function compressedCount(list) {
    http://stackoverflow.com/a/5668029/5022251
    var counts = {};
    for (var i = 0; i < list.length; i++) {
        var num = list[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    return counts;
}

function formatCompressed(compressed) {
    var results = "";
    for (var key in compressed) {
        results =  results + key + ": " + compressed[key] + ", ";
    }
    return results.substring(0, results.length - 2);
}

function RecordResults(rollSettings, results, totalDiceRolled) {
    var hits = successes(results.DiceBag);
    var dieBag = results.DiceBag.join(", ");

    if (results.DiceBag.length > 25) {
        dieBag = formatCompressed(compressedCount(results.DiceBag));
    }
    $("#output").prepend(
        "<tr>" +
        "<td class='Hits'>" + hits + "</td>" +
        "<td class='results'>" + dieBag + "</td>" +
        "<td class='diePool'>" + rollSettings.diePool + "</td>" +
        "<td class='agains'>" + rollSettings.agains + "</td>" +
        "<td class='totalDiceRolled hide-small'>" + totalDiceRolled + "</td>" +
        "<td class='isRote'>" + rollSettings.isRote + "</td>" +
        "<td class='numberOfRoteDice hide-small'>" + results.RoteDice + "</td>" +
        "<td class='result-description'>" + rollSettings.rollDescription + "</td>" +
        "</tr>");
    
}

function storeResultsLocally(rollSettings, results, totalRolledDice) {
    var resultStore = {
        RollSettings : rollSettings,
        Results: results,
        TotalDiceRolled: totalRolledDice
    };
    var resultPool = localStorage.getObject("DiceResults");
    resultPool.unshift(resultStore);
    localStorage.setObject("DiceResults", resultPool);
}
function storeRollLocally(premadeRoll) {
    var roll = {
        "diePool": premadeRoll.diePool,
        "agains": premadeRoll.agains,
        "isRote": premadeRoll.isRote,
        "rollDescription": premadeRoll.rollDescription
    }
    CharacterStore.currentCharacter.addToDiceBag(roll);
    //var diceBag = localStorage.getObject("DiceBag");
    //diceBag.unshift(roll);
    //localStorage.setObject("DiceBag", diceBag);
}

function showDialog(id) {
    var dialog = $(id).data('dialog');
    dialog.open();
}
function closeDialog(id) {
    var dialog = $(id).data('dialog');
    dialog.close();
}



function ClearDiceResults() {
    //Clear table
    //ajax would be ideal, but we want this to be fully cacheable.  Solutions?
    $("#output").html("<thead>" +
        "<tr>" +
        "<th class=\"results-hits\">Hits</th>" +
        "<th class=\"results-dice\">Dice</th>" +
        "<th class=\"diePool\">Die Pool</th>" +
        "<th class=\"\">Agains</th>" +
        "<th class=\"hide-small\">Extra Dice</th>" +
        "<th class=\"Rote\">Rote action</th>" +
        "<th class=\"hide-small\">Dice from rote action</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody class=\"diceoutput\">" +
        "</tbody>");
    //Clear localstorage
    localStorage.removeItem("DiceResults");
    
}
var RollResults = function(rollSettings, results, totalRolledDice) {

    this.RollSettings = rollSettings;
    this.Results = results;
    this.TotalDiceRolled = totalRolledDice;
}

var RollSettings = function(diePool, agains, isRote, rollDescription) {
    if (typeof isRote === "undefined") {
        isRote = false;
    }
    if (typeof agains === "undefined") {
        agains = 10;
    }
    if (typeof rollDescription === "undefined") {
        rollDescription = diePool + " with " + agains + " agains" + (isRote ? "and Rote." : ".");
    }
    this.agains = agains;
    this.diePool = diePool;
    this.isRote = isRote;
    this.rollDescription = rollDescription;
    this.results = [];
}

RollSettings.prototype.roll = function() {
    var result = WerewolfRoll(this.isRote, this.diePool, this.agains);
    this.results.push(result);
    return result;
}
var SavedRollArea = SavedRollArea || {};
SavedRollArea = function(characterName, obj) {
    this.rollKey = 0;
    this.storedRoll = {};
    this.characterName = characterName;
    for (var prop in obj) this[prop] = obj[prop];
}

SavedRollArea.prototype.addToDiceBag = function (dieSettings) {
    this.storedRoll[this.rollKey] = dieSettings;
    this.rollKey++;
    CharacterStore.updateCharacter();
    return this.rollKey;
}

SavedRollArea.prototype.roll  = function(currentRollKey) {
    if (!this.storedRoll.hasOwnProperty(currentRollKey)) {
        //alert("Invalid rollkey found");
        return -1;
    }
    var currentRoll = this.storedRoll[currentRollKey];
    return currentRoll.roll();;
}

//Begin CharacterStore Definition

var CharacterStore = CharacterStore || {};

CharacterStore.updateCharacter = function (character) {
    if (typeof character === "undefined") {
        character = CharacterStore.currentCharacter;
    }
    var characters = CharacterStore.getCharacters();
    var overwrite = characters.hasOwnProperty(character.characterName);
    characters[character.characterName] = character;
    localStorage.setObject("Characters", characters);
    if (overwrite) {
        if (typeof character.characterName === "undefined") {
            alert("Name is not defined");
        }
        console.log("Overwrote " + character.characterName + " with new data");

    }
}
CharacterStore.getCharacters = function () {
    var untypedCharacters = localStorage.getObject("Characters");
    var typedCharacters = {};
    for (var character in untypedCharacters) {
        if (untypedCharacters.hasOwnProperty(character)) {
            typedCharacters[character] = new SavedRollArea(character, untypedCharacters[character]);
        }
    }
    return typedCharacters;
}

CharacterStore.loadCharacter = function (characterName) {
    $("#dicebag").html("");
    var characterList = localStorage.getObject("Characters");
    if (characterList === null) {
        localStorage.setObject("Characters", {});
        characterList = localStorage.getObject("Characters");
    }
    $("#charactername").text(characterName);
    if (!(characterList.hasOwnProperty(characterName))) {
        var character = new SavedRollArea(characterName);
        characterList[characterName] = character;
        localStorage.setObject("Characters", characterList);
        this.currentCharacter = character;
        return character;
    } else {
        var loadedChar = new SavedRollArea(characterName, characterList[characterName]);
        this.displayCharacterStuff(loadedChar);
        this.currentCharacter = loadedChar;
        return loadedChar;
    }
};
CharacterStore.displayCharacterStuff = function (character) {
    for (var rollSetting in character.storedRoll) {
        if (character.storedRoll.hasOwnProperty(rollSetting)) {
            insertIntoDiceBag(character.storedRoll[rollSetting]);
        }
    }
}

CharacterStore.clearDiceBag = function () {
    $("#dicebag").html("");
    var name = CharacterStore.currentCharacter.characterName;
    var reset = new SavedRollArea(name);
    CharacterStore.updateCharacter(reset);
}

CharacterStore.changeCharacters = function (characterName) {
    this.loadCharacter(characterName);
    
}

CharacterStore.currentCharacter = CharacterStore.loadCharacter("General");

//End CharacterStore definition


function loadLocals() {
    var diceBag = localStorage.getObject("DiceBag");
    var Default = new SavedRollArea("General");
    if (diceBag !== null) {
        for (var i = 0; i < diceBag.length; i++) {
            var currentDieRoll = diceBag[i];
            var settings = new RollSettings(currentDieRoll.diePool, currentDieRoll.agains, currentDieRoll.isRote, currentDieRoll.rollDescription);
            Default.addToDiceBag(settings);
        }
    }
    CharacterStore.currentCharacter = Default;
    CharacterStore.updateCharacter(Default);
    if (diceBag !== null) {
        for (var i = diceBag.length - 1; i >= 0; i--) {
            insertIntoDiceBag(diceBag[i]);
        }
    } else {
        localStorage.setObject("DiceBag", []);
    }
    var rollResults = localStorage.getObject("DiceResults");
    if (rollResults !== null) {
        for (var i = rollResults.length - 1; i >= 0; i--) {
            var results = rollResults[i].Results;
            var rollSettings = rollResults[i].RollSettings;
            var totalDiceRolled = rollResults[i].TotalDiceRolled;
            RecordResults(rollSettings, results, totalDiceRolled);
        }
    } else {
        localStorage.setObject("DiceResults", []);
    }
    
}

function RollDice(diePool) {
    var results = [];
    for (i = 0; i < diePool; i++) {
        results[i] = RollDie();
    }
    return results;
}

function count(dice, predicate) {
    return dice.filter(predicate).length;

}

function successes(roll) {
    return count(roll, function (x) { return x >= 8 });
}

function WerewolfMainRoll(diePool, agains) {
    var roll = RollDice(diePool);
    var diceToReroll = count(roll, function (x) { return x >= agains; });
    if (diceToReroll > 0) {
        return roll.concat(WerewolfMainRoll(diceToReroll, agains));
    }
    return roll;
}

function WerewolfRoll(isRote, diePool, agains) {
    var roll = RollDice(diePool);
    var diceToReroll = 0;
    var diceFromRote = 0;
    if (isRote) {
        diceFromRote = roll.length - successes(roll);
        diceToReroll += diceFromRote;
    }
    diceToReroll += count(roll, function (x) { return x >= agains; });
    if (diceToReroll > 0) {
        return { DiceBag: roll.concat(WerewolfMainRoll(diceToReroll, agains)), RoteDice: diceFromRote };
    }
    return { DiceBag: roll, RoteDice: diceFromRote };
}

function listCharacters() {
    var currentCname = CharacterStore.currentCharacter.characterName;
    var characters = CharacterStore.getCharacters();
    $("<select>").appendTo("#characterSelection");
    for (var character in characters) {
        if (characters.hasOwnProperty(character)) {
            if (character === "undefined" ) {
                continue;
            }
            $("<option>", {
                "text": character,
                "value": character
            })
                .appendTo("#characterSelection>select");
        }
    }
    $("#characterSelection>select").on('change', function() {
        var newChar = $("#characterSelection>select>option:selected").val();
        CharacterStore.loadCharacter(newChar);
    });
    var currentCname = CharacterStore.currentCharacter.characterName;
    $("#characterSelection>select").val(currentCname);
}

$("#addCharacter button").on("click", function () {
    var newChar = $("#addCharacter input").val();
    if (newChar === ""  ) {
        return;
    }
    var chars = CharacterStore.getCharacters();
    if (chars.hasOwnProperty(newChar)) {
        return;
    }
    CharacterStore.changeCharacters(newChar);
    $("<option>", {
        "text": newChar,
        "value": newChar
    }).appendTo("#characterSelection>select");

});

$(document).ready(function () {

    //check the enabled state on load
    
    if ($("#chk").is(":checked")) {
        $("#txt").attr("disabled", "disabled");
    }

    //toggle the enabled state when the checkbox is clicked
    $("#disable-agains").click(function () {
        var el = $("#Agains");
        if (el) {
            el.removeAttr("disabled");
            if (this.checked) {
                el.attr("disabled", "disabled");

                $("#Agains")
                    .append($("<option></option>")
                        .attr("value", "Disabled")
                        .text("No trick!"))
                    .val("Disabled");
            } else {
                $("#Agains option[value='Disabled']").each(function() {
                    $(this).remove();
                });
                $("#Agains").val("10");
            }
        }
    });
    if (typeof characterName === "undefined") {
        loadLocals();
    } 
    else {
        CharacterStore.currentCharacter = CharacterStore.loadCharacter(characterName);
    }
    listCharacters();
});





//var diceBag = localStorage.getObject("DiceBag");
//var Default = new SavedRollArea("General");
//if (diceBag !== null) {
//    for (var i = 0; i < diceBag.length; i++) {
//        var currentDieRoll = diceBag[i];
//        var settings = new RollSettings(currentDieRoll.diePool, currentDieRoll.agains, currentDieRoll.isRote, currentDieRoll.rollDescription);
//        Default.addToDiceBag(settings);
//    }
//}
//CharacterStore.updateCharacter("General");

//var ch = localStorage.getObject("Characters");
//ch["General"] = Default;
//localStorage.setObject("Characters", ch);


