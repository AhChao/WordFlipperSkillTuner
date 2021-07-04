function clickGenerateLink()
{
    reloadDictData();
    var inputDictStr = JSON.stringify(inputDict);
    var skillOrder = JSON.stringify(document.getElementById("skillOrder").value.split("skillOrder")[1].split(""));
    let link = window.location.href + "?isSharedLinkinputDictStr"+inputDictStr+"skillOrder"+skillOrder;
    if(document.getElementById("usingShortenLinkCheckbox").checked)
    {
        d3.select("#formLinkButton").node().disabled = true;
        shortenLinkWithShrtco(link);
    }
    else
    {
        d3.select("#sharedLinkField").node().value = link;
    }	
}

function clickCopyLink()
{
    let copyText = document.getElementById("sharedLinkField");
    if(copyText.value == "") return;
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");
}

function loadFromUrl(linkData)
{
    linkData = decodeURI(linkData);
    let inputDictData = linkData.split('inputDictStr')[1].split('skillOrder')[0];
	let skillOrderData = linkData.split('skillOrder')[1]
    inputDict = JSON.parse(inputDictData);
    inputSkillOrder = JSON.parse(skillOrderData);
    fillUIWithInputDictAndSkillOrder(inputSkillOrder);
    clickCalculate();
}

function fillUIWithInputDictAndSkillOrder(skillOrder)
{
    for(let i in ids)
    {
        let inputNode = document.getElementById(ids[i]);
        inputNode.value = inputDict[ids[i]];
    }
    document.getElementById("skillOrder").value = "skillOrder"+skillOrder.join("");
}