let drawTarget = "skillPainter";
let drawWitdh = document.getElementById("skillPainter").clientWidth;
let lineMargin = drawWitdh/10;
let lineWidth = drawWitdh/4;
let lineHeight = 50;
let primaryColor = "#0d6efd";
let secondaryColor = "#6c757d";
let warningColor = "#ffc107";
let textColor = "#000000";
let textXPadding = drawWitdh/16;
let textYPadding = drawWitdh/16;
let sizeScale = 0.5;
let distanceScale = 0.5;

function svgInit()
{
    drawBaseLine();
}

function cleanSVG()
{
    d3.select("#"+drawTarget).selectAll("*").remove();
    drawBaseLine();
}

function drawBaseLine()
{
    d3.select("#"+drawTarget).append("rect")
    .attr("x",20)
    .attr("y",0)
    .attr("width",drawWitdh)
    .attr("height",2)
    .attr("fill",textColor);
    d3.select("#"+drawTarget).append("text")
    .attr("x",0)
    .attr("y",10)
    .text("0")
    .attr("fill",textColor);
}

function drawUnion(unionNo,text,yPos)
{
    let x;
    let y = yPos;
    let fillColor;
    if(unionNo == 1)
    {
        x = lineMargin;
        fillColor = primaryColor;
    }
    if(unionNo == 2)
    {
        x = lineMargin*2 + lineWidth;
        fillColor = secondaryColor;
    }
    if(unionNo == 3)
    {
        x = lineMargin*3 + lineWidth*2;
        fillColor = warningColor;
    }

    let textX = x + textXPadding;
    let textY = yPos+textYPadding;

    d3.select("#"+drawTarget).append("rect")
    .attr("x",x*distanceScale)
    .attr("y",y*distanceScale)
    .attr("width",lineWidth*sizeScale)
    .attr("height",lineHeight*sizeScale)
    .attr("fill",fillColor)
    .attr("stroke","black")
    .attr("stroke-width","2");
    d3.select("#"+drawTarget).append("text")
    .attr("x",textX*distanceScale)
    .attr("y",textY*distanceScale)
    .attr("fill",textColor)
    .text(text);

    let svgHeight = d3.select("#"+drawTarget).attr("height");
    let rectBottomBorder = lineHeight*sizeScale + y*distanceScale;
    if(svgHeight < rectBottomBorder)
    {
        d3.select("#"+drawTarget).attr("height",rectBottomBorder);
    }
}