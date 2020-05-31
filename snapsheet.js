document.querySelector("button.btn:nth-child(3)").addEventListener("click", mainProgram);
document.querySelector("button.btn:nth-child(4)").addEventListener("click", clearFields);

function mainProgram() {
  disableButtons(true);

  const process_embassies = document.getElementById("genEmbassies").checked;

  const SpeedOverride = true;
  const MinorTime = document.getElementById("minorLength").value;
  const MajorTime = document.getElementById("majorLength").value;

  const now = new Date();
  const YMD = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  const UAgent = document.getElementById("nationName").value;
  const filename = `SpyglassSheet${YMD}.xlsx`;

  if (UAgent === "") {
    createAlert("No nation was supplied");
    disableButtons(false);
    changeProgress("0%", "");
    return 1;
  }
  if (MinorTime === "") {
    createAlert("The length for minor update was not specified");
    disableButtons(false);
    changeProgress("0%", "");
    return 1;
  }
  if (MajorTime === "") {
    createAlert("The length for major update was not specified");
    disableButtons(false);
    changeProgress("0%", "");
    return 1;
  }

  changeProgress("20%", "Verifying nation...");

  (async () => {
    const validateNation = await getFromServer("verifyNation", UAgent);

    if (validateNation !== "true") {
      createAlert("Could not verify that the supplied nation exists");
      changeProgress("0%", "");
      disableButtons(false);
      return 1;
    }

    changeProgress("40%", "Getting additional resources from snapsheet-backend...");
    const additionalResources = await getAdditionalResources(UAgent);

    let RegionList = [];
    let RegionURLList = [];
    let RegionWFEList = [];
    let RegionEmbassyList = [];
    let NumNationList = [];
    let DelVoteList = [];
    let ExecList = [];
    let MajorList = [];

    changeProgress("60%", "Processing received data...");

    const parser = new DOMParser();

    const founderlessRegionsXML = additionalResources.founderlessList;
    const founderlessXMLDoc = parser.parseFromString(founderlessRegionsXML, "text/xml");
    const founderlessRegionsString = founderlessXMLDoc.getElementsByTagName("REGIONS")[0].childNodes[0].nodeValue;
    const UnfoundedList = founderlessRegionsString.split(",");

    const pwlessRegionsXML = additionalResources.pwlessList;
    const pwlessXMLDoc = parser.parseFromString(pwlessRegionsXML, "text/xml");
    const pwlessRegionString = pwlessXMLDoc.getElementsByTagName("REGIONS")[0].childNodes[0].nodeValue;
    const PWlessList = pwlessRegionString.split(",");

    const dataDumpXML = additionalResources.dump;
    const dumpXMLDoc = parser.parseFromString(dataDumpXML, "text/xml");
    const dumpLength = dumpXMLDoc.getElementsByTagName("NAME").length;
    const updateStart = dumpXMLDoc.getElementsByTagName("LASTUPDATE")[0].childNodes[0].nodeValue;
    for (let i = 0; i < dumpLength; i++) {
      const name = dumpXMLDoc.getElementsByTagName("NAME")[i].childNodes[0].nodeValue;
      const numNations = dumpXMLDoc.getElementsByTagName("NUMNATIONS")[i].childNodes[0].nodeValue;
      const delegateVotes = dumpXMLDoc.getElementsByTagName("DELEGATEVOTES")[i].childNodes[0].nodeValue;
      const delegateAuth = dumpXMLDoc.getElementsByTagName("DELEGATEAUTH")[i].childNodes[0].nodeValue;
      const lastUpdate = dumpXMLDoc.getElementsByTagName("LASTUPDATE")[i].childNodes[0].nodeValue - updateStart;
      const factbook = dumpXMLDoc.getElementsByTagName("FACTBOOK")[i].childNodes[0].nodeValue;
      const embassies = dumpXMLDoc.getElementsByTagName("EMBASSIES")[i];

      RegionList.push(name);
      RegionURLList.push(`https://www.nationstates.net/region=${name.replace(/ /g, "_").toLowerCase()}`);
      NumNationList.push(numNations);
      DelVoteList.push(delegateVotes);

      if (delegateAuth[0] === "X") {
        ExecList.push(true);
      } else {
        ExecList.push(false);
      }

      MajorList.push(lastUpdate);

      try {
        if (factbook[0] === "=" || factbook[0] === "+" || factbook[0] === "-" || factbook[0] === "@") {
          RegionWFEList.push(`'${factbook}`);
        } else {
          RegionWFEList.push(factbook);
        }
      }
      catch {
        RegionWFEList.push("");
      }

      let regionalEmbassies = []
      const regionalEmbassyData = embassies.getElementsByTagName("EMBASSY");
      if (process_embassies) {
        for (let itr = 0; itr < regionalEmbassyData.length; itr++) {
          regionalEmbassies.push(regionalEmbassyData[itr].childNodes[0].nodeValue);
        }
      }
      RegionEmbassyList.push(regionalEmbassies.join());
    }

    let CumulNationList = [0];
    for (let itr = 0; itr < NumNationList.length; itr++) {
      if (itr === 0) {
        CumulNationList.push(+NumNationList[itr]);
      } else {
        CumulNationList.push(+NumNationList[itr] + +CumulNationList[CumulNationList.length - 1]);
      }
    }

    const CumulNations = +CumulNationList[CumulNationList.length - 1];
    const MinorNatTime = MinorTime / CumulNations;
    const MajorNatTime = MajorTime / CumulNations;
    let MinTime = [];
    let MajTime = [];

    for (let itr = 0; itr < CumulNationList.length; itr++) {
      const temptime = Math.trunc(CumulNationList[itr] * MinorNatTime);
      const tempsecs = temptime % 60;
      const tempmins = Math.trunc(Math.floor(temptime / 60) % 60);
      const temphours = Math.trunc(Math.floor(temptime / 3600));
      MinTime.push(`${temphours}:${tempmins}:${tempsecs}`);
    }

    for (let itr = 0; itr < CumulNationList.length; itr++) {
      const temptime = Math.trunc(CumulNationList[itr] * MajorNatTime);
      const tempsecs = temptime % 60;
      const tempmins = Math.trunc(Math.floor(temptime / 60) % 60);
      const temphours = Math.trunc(Math.floor(temptime / 3600));
      MajTime.push(`${temphours}:${tempmins}:${tempsecs}`);
    }

    changeProgress("80%", "Creating Spyglass sheet...");

    XlsxPopulate.fromBlankAsync().then(workbook => {
      workbook.sheet(0).cell("A1").value("Regions");
      workbook.sheet(0).cell("B1").value("Region Link");
      workbook.sheet(0).cell("C1").value("# Nations");
      workbook.sheet(0).cell("D1").value("Tot. Nations");
      workbook.sheet(0).cell("E1").value("Minor Upd. (est)");
      workbook.sheet(0).cell("F1").value("Major Upd. (true)");
      workbook.sheet(0).cell("G1").value("Del. Votes");
      workbook.sheet(0).cell("H1").value("Del. Endos");
      if (process_embassies) {
        workbook.sheet(0).cell("I1").value("Embassies");
      }
      workbook.sheet(0).cell("J1").value("WFE");

      workbook.sheet(0).cell("L1").value("World ");
      workbook.sheet(0).cell("M1").value("Data");
      workbook.sheet(0).cell("L2").value("Nations");
      workbook.sheet(0).cell("L3").value("Last Major");
      workbook.sheet(0).cell("L4").value("Secs/Nation");
      workbook.sheet(0).cell("L5").value("Nations/Sec");
      workbook.sheet(0).cell("L6").value("Last Minor");
      workbook.sheet(0).cell("L7").value("Secs/Nation");
      workbook.sheet(0).cell("L8").value("Nations/Sec");
      workbook.sheet(0).cell("L10").value("Spyglass Version");
      workbook.sheet(0).cell("L11").value("Date Generated");
      workbook.sheet(0).cell("M2").value(CumulNations);
      workbook.sheet(0).cell("M3").value(MajorList[MajorList.length - 1] - MajorList[0]);
      workbook.sheet(0).cell("M4").value((MajorList[MajorList.length - 1] - MajorList[0]) / CumulNations);
      workbook.sheet(0).cell("M5").value(1 / ((MajorList[MajorList.length - 1] - MajorList[0]) / CumulNations));
      workbook.sheet(0).cell("M6").value(MinorTime);
      workbook.sheet(0).cell("M7").value(MinorNatTime);
      workbook.sheet(0).cell("M8").value(1 / MinorNatTime);
      workbook.sheet(0).cell("M10").value("1.4.4");
      workbook.sheet(0).cell("M11").value(YMD);

      for (let i = 0; i < RegionList.length; i++) {
        const currentRegion = RegionList[i];
        let regionString = currentRegion;

        if ((PWlessList.indexOf(currentRegion) !== -1) && (ExecList[i])) {
          workbook.sheet(0).cell(`A${i + 2}`).style("fill", "ffff00");
          workbook.sheet(0).cell(`B${i + 2}`).style("fill", "ffff00");
          regionString = `${currentRegion}~`;
        }
        if ((UnfoundedList.indexOf(currentRegion) !== -1) && (PWlessList.indexOf(currentRegion) !== -1)) {
          workbook.sheet(0).cell(`A${i + 2}`).style("fill", "01ff00");
          workbook.sheet(0).cell(`B${i + 2}`).style("fill", "01ff00");
          regionString = `${currentRegion}~`;
        }
        if (PWlessList.indexOf(currentRegion) === -1) {
          workbook.sheet(0).cell(`A${i + 2}`).style("fill", "ff0000");
          workbook.sheet(0).cell(`B${i + 2}`).style("fill", "ff0000");
          regionString = `${currentRegion}*`;
        }

        workbook.sheet(0).cell(`A${i + 2}`).value(regionString);
        workbook.sheet(0).cell(`B${i + 2}`).value(RegionURLList[i]).hyperlink(RegionURLList[i]);
        workbook.sheet(0).cell(`C${i + 2}`).value(NumNationList[i]);
        workbook.sheet(0).cell(`D${i + 2}`).value(CumulNationList[i]);
        workbook.sheet(0).cell(`E${i + 2}`).value(MinTime[i]).style("horizontalAlignment", "right");
        workbook.sheet(0).cell(`F${i + 2}`).value(MajTime[i]).style("horizontalAlignment", "right");
        workbook.sheet(0).cell(`G${i + 2}`).value(DelVoteList[i]);
        workbook.sheet(0).cell(`H${i + 2}`).value(DelVoteList[i] - 1);
        workbook.sheet(0).cell(`I${i + 2}`).value(RegionEmbassyList[i]);
        workbook.sheet(0).cell(`J${i + 2}`).value(RegionWFEList[i]);
        workbook.sheet(0).cell(`K${i + 2}`).value("");

        if (DelVoteList[i] == 0) {
          workbook.sheet(0).cell(`H${i + 2}`).style("fill", "ff0000");
        }

        workbook.sheet(0).name("Spyglass Timesheet");
        workbook.sheet(0).tabColor("ffb1b1");
        workbook.sheet(0).column("A").width(45);
        workbook.sheet(0).cell("J1").style("horizontalAlignment", "right");
      }

      workbook.outputAsync().then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        disableButtons(false);
        changeProgress("100%", "Finished");
      });
    });
  })();
}

function changeProgress(width, message) {
  document.querySelector(".progress-bar").style.width = width;
  document.querySelector(".progress-bar").innerText = message;
}

function disableButtons(disabled) {
  if (disabled) {
    document.querySelector("button.btn:nth-child(3)").setAttribute("disabled", null);
    document.querySelector("button.btn:nth-child(4)").setAttribute("disabled", null);
  } else {
    document.querySelector("button.btn:nth-child(3)").removeAttribute("disabled");
    document.querySelector("button.btn:nth-child(4)").removeAttribute("disabled");
  }
}

function createAlert(message) {
  const notif = document.createElement("DIV");
  notif.className = "alert alert-danger alert-dismissable fade show";
  notif.innerHTML = "<button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n<strong>Error!</strong> " + message;
  document.getElementById("notifBox").appendChild(notif);
}

async function getFromServer(endpoint, nation, nationRequired = true) {
  let response;

  if (nationRequired) {
    response = await fetch(`https://snapsheet-backend.herokuapp.com/api/${endpoint}?nation=${nation}`, {mode: "cors"});
  } else {
    response = await fetch(`https://snapsheet-backend.herokuapp.com/api/${endpoint}`, {mode: "cors"});
  }

  const data = await response.text();
  return data;
}

async function getAdditionalResources(nation) {
  const data = await Promise.all([
    getFromServer("founderlessRegions", nation),
    getFromServer("pwlessRegions", nation),
    getFromServer("dump", "", false)
  ]);

  return {
    founderlessList: data[0],
    pwlessList: data[1],
    dump: data[2]
  };
}

function clearFields() {
  document.getElementById("minorLength").value = "";
  document.getElementById("majorLength").value = "";
  document.getElementById("genEmbassies").checked = true;
  document.getElementById("nationName").value = "";
}
