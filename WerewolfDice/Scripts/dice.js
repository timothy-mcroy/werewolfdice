
function RollDie() {
    return Math.floor((Math.random() * 10 + 1));
}

function addToDiceBag() {
    var diePool = $("#DicePool").val();
    if (diePool === "" || isNaN(diePool)) return;
    var agains = $("#Agains").val();
    var isRote = $("#RoteAction").is(":checked");

    var newButton = jQuery('<div/>', {
        "class": "button stored-roll",
        "data-dicepool": diePool,
        "data-agains": agains,
        "data-is-Rote": isRote,
        "onclick": "storedRoll(this)"
    });
    var badge = jQuery('<span/>', {
        "class": "agains-badge",
        text: agains
    });

    badge.appendTo(newButton);
    jQuery("<span/>", { text: diePool, "class": "diepool-label" }).appendTo(newButton);
    newButton.appendTo("#dicebag");

}

function storedRoll(rollElem) {
    var d = rollElem.dataset.dicepool;
    var a = rollElem.dataset.agains;
    var i = rollElem.dataset.isRote === "true";
    var rollSettings = {
        agains: a,
        diePool: d,
        isRote: i
    };
    RollAndRecord(rollSettings);
}

function ExecuteRoll() {
    
    var rollsettings = {
        agains: $("#Agains").val(),
        diePool: $("#DicePool").val(),
        isRote: $("#RoteAction").is(":checked")
    };
    if (rollsettings.diePool === "" || isNaN(rollsettings.diePool)) return;
    RollAndRecord(rollsettings);
}

function RollAndRecord(rollSettings) {
    var results = WerewolfRoll(rollSettings.isRote, rollSettings.diePool, rollSettings.agains);
    var totalDiceRolled = results.DiceBag.length - rollSettings.diePool;
    var hits = successes(results.DiceBag);
    $("#output").prepend(
        "<tr>" +
        "<td class='Hits'>" + hits + "</td>" +
        "<td class='results'>" + results.DiceBag.join(', ') + "</td>" +
        "<td class='diePool'>" + rollSettings.diePool + "</td>" +
        "<td class='agains'>" + rollSettings.agains + "</td>" +
        "<td class='totalDiceRolled hide-small'>" + totalDiceRolled + "</td>" +
        "<td class='isRote'>" + rollSettings.isRote + "</td>" +
        "<td class='numberOfRoteDice hide-small'>" + results.RoteDice + "</td>" +
        "</tr>");
    return results;
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

    console.log("--extra dice roll is --" + roll);
    var p = successes(roll);
    console.log("Extra hits are = " + p);
    if (diceToReroll > 0) {
        return roll.concat(WerewolfMainRoll(diceToReroll, agains));
    }
    return roll;
}

function WerewolfRoll(isRote, diePool, agains) {
    var roll = RollDice(diePool);
    console.log("--original roll is --" + roll);
    console.log(roll);
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

                $('#Agains')
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

});

