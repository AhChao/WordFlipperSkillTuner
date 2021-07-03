function clickGenerateLink()
{
    reloadDictData();
    var inputDictStr = encodeURIComponent(JSON.stringify(inputDict));
    var skillOrder = document.getElementById("skillOrder1").checked == true ? 1 : 2;
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
    fillUIWithInputDictAndSkillOrder(skillOrderData);
}

function fillUIWithInputDictAndSkillOrder(skillOrder)
{
    for(let i in ids)
    {
        let inputNode = document.getElementById(ids[i]);
        inputNode.value = inputDict[ids[i]];
    }
    document.getElementById("skillOrder"+skillOrder).checked == true
}