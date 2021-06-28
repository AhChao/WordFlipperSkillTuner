let drawTarget = "skillPainter";
let drawWitdh = document.getElementById("skillPainter").clientWidth;
let lineMargin = drawWitdh/10;
let lineWidth = drawWitdh/3.5;
let lineHeight = 50;
let primaryColor = "#0d6efd";
let secondaryColor = "#6c757d";
let warningColor = "#ffc107";
let textColor = "#000000";
let textXPadding = drawWitdh/12;
let textYPadding = drawWitdh/10;

function svgInit()
{
    d3.select("#"+drawTarget).append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",drawWitdh)
    .attr("height",2)
    .attr("fill",textColor);
}

function drawUnion(unionNo,text,yPos)
{
    console.log("drawUnion:",unionNo,text,yPos)
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
    .attr("x",x)
    .attr("y",y)
    .attr("width",lineWidth)
    .attr("height",lineHeight)
    .attr("fill",fillColor);
    d3.select("#"+drawTarget).append("text")
    .attr("x",textX)
    .attr("y",textY)
    .attr("fill",textColor)
    .text(text);
}