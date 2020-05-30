//Web JS
document.getElementById("defaultEmbassies").addEventListener("change", fillDefaultEmbassies);
document.getElementById("defaultWfeFilter").addEventListener("change", fillDefaultWfeFilter);

document.getElementById("reset").addEventListener("click", clearInputFields);

//JQuery for displaying the filename on upload
$(".custom-file-input").on("change", function() {
  const fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

//Enable all tooltips
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

function fillDefaultEmbassies() {
  document.getElementById("embassies").value = "The Black Hawks, Doll Guldur, Frozen Circle, 3 Guys";
}

function fillDefaultWfeFilter() {
  document.getElementById("wfeFilter").value = "[url=https://www.forum.the-black-hawks.org/, [url=http://forum.theeastpacific.com,  [url=https://www.nationstates.net/page=dispatch/id=485374], [url=https://discord.gg/XWvERyc, [url=https://forum.thenorthpacific.org, [url=https://discord.gg/Tghy5kW, [url=https://www.westpacific.org";
}

function clearInputFields() {
  document.getElementById("minSwitch").value = "";
  document.getElementById("optimSwitch").value = "";
  document.getElementById("minTrigger").value = "";
  document.getElementById("optimTrigger").value = "";
  document.getElementById("maxTrigger").value = "";
  document.getElementById("endos").value = "";
  document.getElementById("targAmount").value = "";
  document.getElementById("embassies").value = "";
  document.getElementById("wfeFilter").value = "";
  document.getElementById("update").value = "";
}

//Actual program JS
document.getElementById("start").addEventListener("click", mainProgram);

function mainProgram() {
  const file = document.getElementById("sheet").files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const sheet = XLSX.read(data, {type: "array"});
    const minSwitch = document.getElementById("minSwitch").value;
    const optimSwitch = document.getElementById("optimSwitch").value;
    const minTrigger = document.getElementById("minTrigger").value;
    const optimTrigger = document.getElementById("optimTrigger").value;
    const maxTrigger = document.getElementById("maxTrigger").value;
    const endos = document.getElementById("endos").value;
    const targAmount = document.getElementById("targAmount").value;
    let embassies = document.getElementById("embassies").value;
    let wfeFilter = document.getElementById("wfeFilter").value;
    const update = document.getElementById("update").value;

    let sheetArray = [];
    let targetArray = [];
    let raidFileData = "";
    let triggerListData = "";

    embassies = embassies.split(",");
    for (let i = 0; i < embassies.length; i++) {
      embassies[i] = embassies[i].trim();
    }
    wfeFilter = wfeFilter.split(",");
    for (let i = 0; i < wfeFilter.length; i++) {
      wfeFilter[i] = wfeFilter[i].trim();
    }
    if (embassies[0] === "") {
      embassies[0] = "eijl3o2il21po21-0p1ojiqlksakox;l";
    }
    if (wfeFilter[0] === "") {
      wfeFilter[0] = "OIWJQLKDWLK<WJQPOLKJQWLlqwwq0qwqwq0wqwp1kl";
    }

    //Get the actual name of the sheet in the excel file for use in the readCell function
    const worksheet = sheet.Sheets[sheet.SheetNames[0]];
    //Get the sheet length of the Spyglass sheet
    const sheetLength = getSheetLength();

    for (let i = 2; i < sheetLength; i++) {
      const regionName = readCell(`A${i}`);
      const regionEndos = readCell(`H${i}`);
      let regionEmbassies = readCell(`I${i}`);
      let regionWfe = readCell(`J${i}`);
      let isTarg = 1;

      //Since readCell returns undefined, ensure that empty embassies/wfe's are treated as empty strings
      if (regionEmbassies === undefined) {
        regionEmbassies = "";
      } else {
        regionEmbassies = regionEmbassies.toLowerCase();
      }
      if (regionWfe === undefined) {
        regionWfe = "";
      } else {
        regionWfe = regionWfe.toLowerCase();
      }

      //Filter out regions based on the wfe filter and embassy filter arrays
      //Use regionName.slice(-1) === "~" to check if the region is a target
      if ((regionName.slice(-1) === "~") && (regionEndos < endos)) {
        for (let itr = 0; itr < embassies.length; itr++) {
          if (regionEmbassies.includes(embassies[itr])) {
            isTarg = 0;
          }
        }
        for (let i = 0; i < wfeFilter.length; i++) {
          if (regionWfe.includes(wfeFilter[i])) {
            isTarg = 0;
          }
        }

        //Push onto the targetArray if it is determined to be a valid target
        if (isTarg) {
          if (update === "Major") {
            targetArray.push(new Target(regionName, readCell(`F${i}`), i));
          } else {
            targetArray.push(new Target(regionName, readCell(`E${i}`), i));
          }
        }
      }
    }

    //Create a trigger_list file that can be used with KATT, and a raidFile that contains the actual raid details
    let targNumber = 1;
    let url = "";

    //Main; Generates raidFile and trigger_list
    alert("If a target has not been tagged, press the 'Cancel' button\n\nIf a target is already tagged, press the 'OK' button");
    for (let i = 0; i < targetArray.length; i++) {
      const currentTarget = targetArray[i];
      const nextTargArray = findNextSwitch(i, currentTarget.updateTime);
      if (nextTargArray === 9 || targNumber > targAmount) {
        downloadData("raidFile.txt", raidFileData);
        downloadData("trigger_list.txt", triggerListData);
        return 0;
      }
      let hasFoundTarg = 0;
      let prospectTargPos;
      let currentTrigger;
      let prospect;

      //Go through the switchArray generated for the currentTarget, and check if any of them have triggers
      //If they don't, use the only switchArray item
      currentTrigger = findTriggers(targetArray[i].regionNumber, targetArray[i].updateTime);
      for (let i = 0; i < nextTargArray.length; i++) {
        prospect = findInTargets(nextTargArray[i].name);
        prospectTargPos = targetArray[prospect].regionNumber;

        //Exit the loop if we have found a trigger
        if (currentTrigger !== undefined) {
          hasFoundTarg = 1;
          break;
        }
      }

      //Sets the hasFoundTarg flag after finding a target
      if (hasFoundTarg) {
        //Open the prospect target in browser and ask the user whether or not it's been tagged already
        window.open(`https://www.nationstates.net/region=${targetArray[i].name.slice(0, -1)}`, "_blank");
        if (!confirm(`${targNumber}. Has ${targetArray[i].name.slice(0, -1)} already been tagged?`)) {
          //Execute if the response "n" is given

          //Various formatting things for the purpose of generating links
          const targName = targetArray[i].name.slice(0, -1);
          const currentTargPos = targetArray[i].regionNumber;
          const triggerName = ((currentTrigger.name.slice(-1) === "~") || (currentTrigger.name.slice(-1) === "*")) ? currentTrigger.name.slice(0, -1) : currentTrigger.name;

          //Add the target and trigger into raidFile, and the trigger region's into trigger_list
          if (update === "Major") {
            raidFileData += `${targNumber++}) https://www.nationstates.net/region=${targName.replace(/ /g, "_").toLowerCase()} (${readCell(`F${currentTargPos}`)})\n`;
            raidFileData += `    a) https://www.nationstates.net/template-overall=none/region=${triggerName.replace(/ /g, "_").toLowerCase()} (${timeDifference(readCell(`F${currentTargPos}`), readCell(`F${findInSpyglass(currentTrigger.name)}`))}s)\n\n`;
            triggerListData += `${triggerName}\n`;
          } else {
            raidFileData += `${targNumber++}) https://www.nationstates.net/region=${targName.replace(/ /g, "_").toLowerCase()} (${readCell(`E${currentTargetPos}`)})\n`;
            raidFileData += `    a) https://www.nationstates.net/template-overall=none/region=${triggerName.replace(/ /g, "_").toLowerCase()} (${timeDifference(readCell(`E${currentTargPos}`), readCell(`E${findInSpyglass(currentTrigger.name)}`))}s)\n\n`;
            triggerListData += `${triggerName}\n`;
          }
          i = prospect - 1; //Push the targetArray iterator up to the switched region
        }
      }
    }

    //Reads a given cell off of the Spyglass sheet
    function readCell(cell) {
      const desired_cell = worksheet[cell];
      const desired_value = (desired_cell ? desired_cell.v : undefined);
      return desired_value;
    }

    //A target constructor which holds the target name, it's update time, and it's row on the Spyglass sheet
    function Target(name, time, row) {
      this.name = name;
      this.updateTime = time;
      this.regionNumber = row;
    }

    //A constructor for both switches and triggers, which holds the region's name and it's "score"
    function ConstraintRegion(name, score) {
      this.name = name;
      this.score = score;
    }

    //Self-explanatory; gets length of Spyglass sheet by going through a while loop
    function getSheetLength() {
      let sheetLength = 1;
      while (readCell(`A${sheetLength}`) !== undefined) {
        sheetLength++;
      }
      sheetLength--;
      return sheetLength;
    }

    //Returns the difference in seconds between two times from a spyglass sheet
    function timeDifference(time1, time2) {
      const firstTimeArray = time1.split(":");
      const secondTimeArray = time2.split(":");
      const firstTimeSeconds = +(firstTimeArray[0] * 3600) + +(firstTimeArray[1] * 60) + +firstTimeArray[2];
      const secondTimeSeconds = +(secondTimeArray[0] * 3600) + +(secondTimeArray[1] * 60) + +secondTimeArray[2];
      return Math.abs(firstTimeSeconds - secondTimeSeconds);
    }

    //Function to create an array of viable triggers given (a target's position in the spyglass sheet, the region update's time)
    //Each trigger is assigned a "score" based on how close it is to the optimum trigger length (lower = better)
    //Trigger region with the lowest "score" is returned
    function findTriggers(regionPosition, lastRegionUpdate) {
      let triggerArray = [];
      let i = 1;
      let prospectTime;
      if (update === "Major") {
        prospectTime = readCell(`F${regionPosition - i}`);
      } else {
        prospectTime = readCell(`E${regionPosition - i}`);
      }

      while (timeDifference(lastRegionUpdate, prospectTime) <= maxTrigger) {
        if (update === "Major") {
          prospectTime = readCell(`F${regionPosition - i}`);
        } else {
          prospectTime = readCell(`E${regionPosition - i}`);
        }
        if ((timeDifference(lastRegionUpdate, prospectTime) >= minTrigger) && (timeDifference(lastRegionUpdate, prospectTime) <= maxTrigger)) {
          triggerArray.push(new ConstraintRegion(readCell(`A${regionPosition - i}`), Math.abs(timeDifference(lastRegionUpdate, prospectTime) - optimTrigger)));
        }
        i++;
      }

      triggerArray.sort(function(a, b) {return a.score - b.score});
      return triggerArray[0];
    }

    //Function that will generate an array of switchable regions give (a target's position in spyglass, the region's update time)
    //Uses the same "score" system as the findTriggers function
    //Return the whole array, since you may be able to use other switches if one doesn't have any triggers
    function findNextSwitch(targPosition, lastRegionUpdate) {
      let switchArray = [];
      let i = 1;
      if (targetArray[targPosition + i] === undefined) {
        return 9; //Stop the script if you try to go past the end of the spyglass sheet
      }
      let prospectTime = targetArray[targPosition + i].updateTime;

      //Work through the targetArray until it gets past the optimal switch point
      //If any target is in between the minimum switch time, and optimal switch time, push it onto the switchArray
      while(timeDifference(lastRegionUpdate, prospectTime) <= optimSwitch) {
        prospectTime = targetArray[targPosition + i].updateTime;
        if (timeDifference(lastRegionUpdate, prospectTime) >= minSwitch) {
          switchArray.push(new ConstraintRegion(targetArray[targPosition + i].name, Math.abs(timeDifference(lastRegionUpdate, prospectTime) - optimSwitch)));
        }
        i++; //Next in targetArray
      }
      //Push an extra region onto the switchArray, since there must be a switch, even if it is slower than optimal
      prospectTime = targetArray[targPosition + i].updateTime;
      switchArray.push(new ConstraintRegion(targetArray[targPosition + i].name, Math.abs(timeDifference(lastRegionUpdate, prospectTime) - optimSwitch)));

      switchArray.sort(function(a, b) {return a.score - b.score});
      return switchArray;
    }

    //Find a region in the targetArray
    function findInTargets(region) {
      for (let i = 0; i < targetArray.length; i++) {
        if (targetArray[i].name === region) {
          return i;
        }
      }
    }

    //Find a region in Spyglass sheet
    function findInSpyglass(region) {
      for (let i = 0; i < sheetLength; i++) {
        if (readCell(`A${i}`) === region) {
          return i;
        }
      }
    }

  }
  reader.readAsArrayBuffer(file);
}

function downloadData(filename, text) {
  let element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
