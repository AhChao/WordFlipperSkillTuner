const ids = ['mainSkill1', 'mainSkill2', 'mainSkill3',
'subSkill1','subSkill2','subSkill3',
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
}

function reloadDictData()
{
    for(let i in ids)
    {
        let inputNodeValue = document.getElementById(ids[i]).value;
        inputDict[ids[i]] =  inputNodeValue  == "" ? 0 : parseInt(inputNodeValue);
    }
}

function clickCalculate()
{
    orderRecord = [];
    reloadDictData();
    let skillLength = [(inputDict["mainSkill1"]+inputDict["subSkill1"])/2,
                        (inputDict["mainSkill2"]+inputDict["subSkill2"])/2,
                        (inputDict["mainSkill3"]+inputDict["subSkill3"])/2,];
    
    let initLength = [skillLength[0]*(inputDict["unionInitCharge1"]*0.01),
                    skillLength[1]*(inputDict["unionInitCharge2"]*0.01),
                    skillLength[2]*(inputDict["unionInitCharge3"]*0.01),];

    console.log(skillLength,initLength);

    loopGenerateLine(skillLength,initLength,3000);
}

function loopGenerateLine(skillLength,initLength,endValue)
{//unionNo - 1 = index
    let lengthToSkill = [skillLength[0]-initLength[0],
                        skillLength[1]-initLength[1],
                        skillLength[2]-initLength[2],];
    let lineYPos = [0,0,0]; 
    let time = 0;
    let skillOrder = [2,3,1];
    
    while(Math.min(...lineYPos)<endValue)
    {//function drawUnion(unionNo,text,yPos)
        console.log("runningloop",Math.min(...lineYPos),endValue);
        console.log("lengthToSkil", lengthToSkill);
        // if(getValueAppearTimes(Math.min(...lengthToSkill),lengthToSkill)>1)
        // {

        // }
        // else
        //{
            let addTime = Math.min(...lengthToSkill);
            
            time += addTime;
            let useSkillUnionIndex = getIndexOfMin(lengthToSkill);
            orderRecord.push(useSkillUnionIndex+1);
            for(let index in lengthToSkill) lengthToSkill[index] -=addTime;
            for(let index in lineYPos) lineYPos[index] +=addTime;
            
            drawUnion(useSkillUnionIndex+1,lineYPos[useSkillUnionIndex],lineYPos[useSkillUnionIndex]);
            
            if(lengthToSkill[useSkillUnionIndex]==0)
            {
                lengthToSkill[useSkillUnionIndex]+= skillLength[useSkillUnionIndex];
            }
            //console.log("ck",lengthToSkill);
            //lengthToSkill[useSkillUnionIndex] += skillLength[useSkillUnionIndex];
            
            useSkillChargeCalculation(lengthToSkill,skillLength,useSkillUnionIndex);
        //}
    }
    writeDownSkillUseOrder();
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