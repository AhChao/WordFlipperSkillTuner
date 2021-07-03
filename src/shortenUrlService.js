function shortenLinkWithShrtco(link)
{
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.shrtco.de/v2/shorten?url="+link, false ); // false for synchronous request
    xmlHttp.send( null );
    var resp = JSON.parse(xmlHttp.responseText);
    d3.select("#formLinkButton").node().disabled = false;
	d3.select("#sharedLinkField").node().value = resp.result.full_short_link;
}