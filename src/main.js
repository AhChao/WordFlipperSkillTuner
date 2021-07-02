const ids = ['unionSkill1', 'unionSkill2', 'unionSkill3',
'unionInitCharge1','unionInitCharge2','unionInitCharge3',
'unionSkillCharge11','unionSkillCharge12','unionSkillCharge13',
'unionSkillCharge21','unionSkillCharge22','unionSkillCharge23',
'unionSkillCharge31','unionSkillCharge32','unionSkillCharge33',
'unionSkillChargeTime11','unionSkillChargeTime12','unionSkillChargeTime13',
'unionSkillChargeTime21','unionSkillChargeTime22','unionSkillChargeTime23',
'unionSkillChargeTime31','unionSkillChargeTime32','unionSkillChargeTime33'];
let inputDict = {};
let orderRecord = [];

const elements = document.querySelectorAll(ids.map(id => `#${id}`).join(', '));

function init()
{
    svgInit();
}

function reloadDictData()
{
    for(let i in ids)
    {
        let inputNodeValue = document.getElementById(ids[i]).value;
        inputDict[ids[i]] =  inputNodeValue  == "" ? 0 : parseInt(inputNodeValue);
    }
}

//#region : callByHTMLValueSetUp
function calculateUnionSkillLength(positionId)
{
    let mainSkill = d3.select("#mainSkill"+positionId).node().value == "" ? 0 : parseInt(d3.select("#mainSkill"+positionId).node().value);
    let subSkill = d3.select("#subSkill"+positionId).node().value == "" ? 0 : parseInt(d3.select("#subSkill"+positionId).node().value);
    d3.select("#unionSkill"+positionId).node().value = mainSkill!=0&&subSkill!=0 ? (mainSkill + subSkill)/2 : mainSkill+subSkill;
}
//#endregion callByHTMLValueSetUp

function clickCalculate()
{
    cleanSVG();
    orderRecord = [];
    reloadDictData();
    let skillLength = [inputDict["unionSkill1"],inputDict["unionSkill2"],inputDict["unionSkill3"]];
    
    let initLength = [skillLength[0]*(inputDict["unionInitCharge1"]*0.01),
                    skillLength[1]*(inputDict["unionInitCharge2"]*0.01),
                    skillLength[2]*(inputDict["unionInitCharge3"]*0.01),];

    console.log(skillLength,initLength);

    loopGenerateLine(skillLength,initLength,1500);
}

function loopGenerateLine(skillLength,initLength,endValue)
{//unionNo - 1 = index
    let lengthToSkill = [skillLength[0]-initLength[0],
                        skillLength[1]-initLength[1],
                        skillLength[2]-initLength[2],];
    let lineYPos = [0,0,0]; 
    let time = 0;
    let skillOrder = document.getElementById("skillOrder2").checked == true ? [2,3,1] : [1,2,3];
    
    while(Math.min(...lineYPos)<endValue)
    {//function drawUnion(unionNo,text,yPos)
            let addTime = Math.min(...lengthToSkill);
            time += addTime;
            let useSkillUnionIndex = getIndexOfMin(lengthToSkill);
            if(getValueAppearTimes(Math.min(...lengthToSkill),lengthToSkill)>1)
                useSkillUnionIndex = skillInSameTimeReturnWhichIndexToUse(skillOrder,lengthToSkill);

            useInputIndexSkill(lengthToSkill,skillLength,lineYPos,time,addTime,useSkillUnionIndex);
            
    }
    writeDownSkillUseOrder();
}

function skillInSameTimeReturnWhichIndexToUse(skillOrder,lengthToSkill)
{
    let minValue = Math.min(...lengthToSkill);   
    let meetMinIndex = [];
    for(let i in lengthToSkill) if(lengthToSkill[i]==minValue) meetMinIndex.push(parseInt(i)+1);
    console.log("Same Time Detect",minValue,meetMinIndex,skillOrder);
    for(let i in skillOrder)
    {
        if(meetMinIndex.includes(skillOrder[i])) return skillOrder[i]-1;
    }
}

function useInputIndexSkill(lengthToSkill,skillLength,lineYPos,time,addTime,useSkillUnionIndex)
{
    orderRecord.push(useSkillUnionIndex+1);
    for(let index in lengthToSkill) lengthToSkill[index] -=addTime;
    for(let index in lineYPos) lineYPos[index] +=addTime;
    
    drawUnion(useSkillUnionIndex+1,lineYPos[useSkillUnionIndex],time);
    
    if(lengthToSkill[useSkillUnionIndex]==0)
    {
        lengthToSkill[useSkillUnionIndex]+= skillLength[useSkillUnionIndex];
    }
    
    useSkillChargeCalculation(lengthToSkill,skillLength,useSkillUnionIndex);
}

function useSkillChargeCalculation(lengthToSkill,skillLength,useSkillUnionIndex)
{    
    let skillChargeRatio = [inputDict["unionSkillChargeTime"+(useSkillUnionIndex+1)+"1"],
                            inputDict["unionSkillChargeTime"+(useSkillUnionIndex+1)+"2"],
                            inputDict["unionSkillChargeTime"+(useSkillUnionIndex+1)+"3"]];
    console.log("Charging1",lengthToSkill,skillChargeRatio);
    for(let index in lengthToSkill) lengthToSkill[index] += skillLength[index]*skillChargeRatio[index];
    console.log("Charging2",lengthToSkill);
}

function writeDownSkillUseOrder()
{
    let resultText = "";
    for(let index in orderRecord)
    {
        if(orderRecord[index]==1)
            resultText += "<span class='text-primary'>1</span> ->"
        if(orderRecord[index]==2)
            resultText += "<span class='text-secondary'>2</span> ->"
        if(orderRecord[index]==3)
            resultText += "<span class='text-warning'>3</span> ->"
    }
    d3.select("#skillUseOrderField").html(resultText);
}

function getValueAppearTimes(value,valueArr)
{
    return valueArr.filter((v) => (v === value)).length;
}

function getIndexOfMin(valueArr)
{
    return valueArr.indexOf(Math.min(...valueArr));
}

function clickClear()
{
    for(let i in inputDict)
    {
        inputDict[i].value = '';
    }
}