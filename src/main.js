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
let sameTimePadding = 20;
let lastTimeSKillYPos = -1;
let lastTimePlus = 0;
let loopForeverPreventor = 300;

const elements = document.querySelectorAll(ids.map(id => `#${id}`).join(', '));

function init()
{
    mapTooltip();
    svgInit();
    let urlParams = window.location.search;
    if(urlParams.indexOf('isSharedLink')!=-1)
    {
        urlParams = urlParams.split('isSharedLink')[1];
        loadFromUrl(urlParams);
    }
}

function mapTooltip()
{
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    });
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
    loopForeverPreventor = 300;
    cleanSVG();
    orderRecord = [];
    reloadDictData();
    checkChargeTime();
    let skillLength = [inputDict["unionSkill1"],inputDict["unionSkill2"],inputDict["unionSkill3"]];
    let timeLineLength = parseInt(document.getElementById("timeLineLength").value);
    if(timeLineLength < 0) timeLineLength = 0;
    let initLength = [skillLength[0]*(inputDict["unionInitCharge1"]*0.01),
                    skillLength[1]*(inputDict["unionInitCharge2"]*0.01),
                    skillLength[2]*(inputDict["unionInitCharge3"]*0.01),];
    loopGenerateLine(skillLength,initLength,timeLineLength);
}

function checkChargeTime()
{
    //if no input or 0 default wit unlimited
    for(let i=1;i<=3;i++)
    {
        for(let i2=1;i2<=3;i2++)
        {
            if(inputDict["unionSkillChargeTime"+String(i)+String(i2)] == 0 )
            {
                inputDict["unionSkillChargeTime"+String(i)+String(i2)] = 999;
            }                
        }
    }
}

function loopGenerateLine(skillLength,initLength,endValue)
{//unionNo - 1 = index
    let lengthToSkill = [skillLength[0]-initLength[0],
                        skillLength[1]-initLength[1],
                        skillLength[2]-initLength[2],];
    let lineYPos = [0,0,0]; 
    let time = 0;
    let skillOrder = document.getElementById("skillOrder").value.split("skillOrder")[1].split("");

    while(Math.min(...lineYPos)<endValue)
    {
        if(loopForeverPreventor < 0) break; // prevent forever loop
        let addTime = Math.min(...lengthToSkill);
        time += addTime;
        let useSkillUnionIndex = getIndexOfMin(lengthToSkill);
        let useSkillInSameTimeCount = getValueAppearTimes(Math.min(...lengthToSkill),lengthToSkill);
        if( useSkillInSameTimeCount > 1)
            useSkillUnionIndex = skillInSameTimeReturnWhichIndexToUse(skillOrder,lengthToSkill);
        useInputIndexSkill(lengthToSkill,skillLength,lineYPos,time,addTime,useSkillUnionIndex,useSkillInSameTimeCount);
        loopForeverPreventor --;
    }
    writeDownSkillUseOrder();
}

function skillInSameTimeReturnWhichIndexToUse(skillOrder,lengthToSkill)
{
    let minValue = Math.min(...lengthToSkill);   
    let meetMinIndex = [];
    for(let i in lengthToSkill) if(lengthToSkill[i]==minValue) meetMinIndex.push(parseInt(i)+1);
    for(let i in skillOrder)
    {
        if(meetMinIndex.includes(parseInt(skillOrder[i]))) return parseInt(skillOrder[i]-1);
    }
}

function useInputIndexSkill(lengthToSkill,skillLength,lineYPos,time,addTime,useSkillUnionIndex,useSkillInSameTimeCount)
{
    orderRecord.push(useSkillUnionIndex+1);
    for(let index in lengthToSkill) lengthToSkill[index] -=addTime;
    for(let index in lineYPos) lineYPos[index] +=addTime;
    
    console.log(useSkillUnionIndex,lineYPos[useSkillUnionIndex],lastTimeSKillYPos)
    if(lineYPos[useSkillUnionIndex] == lastTimeSKillYPos)
    {
        lastTimePlus += 1;
    }
    else
    {
        lastTimePlus = 0;
    }
    lastTimeSKillYPos = lineYPos[useSkillUnionIndex];
    drawUnion(useSkillUnionIndex+1,lineYPos[useSkillUnionIndex],time-(useSkillInSameTimeCount-1)*sameTimePadding+lastTimePlus*sameTimePadding);
    
    if(lengthToSkill[useSkillUnionIndex]==0)
    {
        lengthToSkill[useSkillUnionIndex]+= skillLength[useSkillUnionIndex];
    }
    
    useSkillChargeCalculation(lengthToSkill,skillLength,useSkillUnionIndex);
}

function useSkillChargeCalculation(lengthToSkill,skillLength,useSkillUnionIndex)
{    
    let skillChargeRatio = [inputDict["unionSkillCharge"+(useSkillUnionIndex+1)+"1"]*0.01,
                            inputDict["unionSkillCharge"+(useSkillUnionIndex+1)+"2"]*0.01,
                            inputDict["unionSkillCharge"+(useSkillUnionIndex+1)+"3"]*0.01];
    for(let index in lengthToSkill)
    {
        if(inputDict["unionSkillChargeTime"+String(useSkillUnionIndex+1)+String(parseInt(index)+1)] > 0 )
        {
            inputDict["unionSkillChargeTime"+String(useSkillUnionIndex+1)+String(parseInt(index)+1)] -= 1;
            lengthToSkill[index] -= skillLength[index]*skillChargeRatio[index];
            if(lengthToSkill[index] < 0 ) lengthToSkill[index] = 0;
        }
    } 
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