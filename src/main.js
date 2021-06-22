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

const elements = document.querySelectorAll(ids.map(id => `#${id}`).join(', '));

function init()
{
    for(let i in ids)
    {
        inputDict[ids[i]] = document.getElementById(ids[i]);
    }
}

function clickCalculate()
{

}

function clickClear()
{
    for(let i in inputDict)
    {
        inputDict[i].value = '';
    }
}