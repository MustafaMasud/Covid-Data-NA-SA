function Both() {
  
  var svg = d3.select("svg#map")
  var svgDetails = d3.select("svg#details")
  var svgCases = d3.select("svg#cases")
  var svgDeaths = d3.select("svg#deaths")
  var svgPieCases = d3.select("svg#pieCases")
  var svgPieDeaths = d3.select("svg#pieDeaths")
  var width = 1000
  var height = 1000

  // Map and projection
  var projection = d3.geoMercator()
    .scale(200)
    .center([-80,50])
    .translate([width / 2, height / 2]);

  // Load external data 
  d3.queue()
    .defer(d3.json, "NASA.geo.json")
    .defer(d3.csv, "Data.csv")
    .await(ready);

  function ready(error, topo, covidData) {

    var sortedList = covidData;
    var extent = d3.extent(covidData, d => d["Weekly Case % Change"]);
    
    var colorScale = d3.scaleLinear()
    .domain(extent)
    .range(["white","#8b0000"]);
    
    // Draw the map
    svg.append("g").selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")

        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )

    svg.selectAll("path")
    .data(covidData)
    .attr("fill" ,d => colorScale(d["Weekly Case % Change"]))
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    svg.selectAll("path")
    .data(covidData)
    .append('title')
    .text(d=>d['Country/Other']+"\n")

    svg.selectAll("path").data(covidData)
    .on('click', function(d) {
      svgDetails.selectAll("text").remove()
      svgCases.selectAll("g").remove()
      svgCases.selectAll("rect").remove()
      svgCases.selectAll("text").remove()
      svgDeaths.selectAll("g").remove()
      svgDeaths.selectAll("rect").remove()
      svgDeaths.selectAll("text").remove()
      svgPieDeaths.selectAll("g").remove()
      svgPieDeaths.selectAll("rect").remove()
      svgPieDeaths.selectAll("text").remove()
      svgPieCases.selectAll("g").remove()
      svgPieCases.selectAll("rect").remove()
      svgPieCases.selectAll("text").remove()
      
        var countryName = d["Country/Other"];
        var population = d["Population"];
        var prevWeekCases = d["Cases in the last 7 days"]
        var nextWeekCases = d["Cases in the preceding 7 days"]
        var prevWeekDeaths = d["Deaths in the last 7 days"]
        var nextWeekDeaths = d["Deaths in the preceding 7 days"]
        var percentChangeCases = d["Cases in the last 7 days/1M pop"]
        var percentChangeDeaths = d["Deaths in the last 7 days/1M pop"]
        var weekChange = parseInt(d["Weekly Case % Change"])
        var weekChangeD = parseInt(d["Weekly Death % Change"])
        var totalCases = parseInt(prevWeekCases)+parseInt(nextWeekCases)
        var totalDeaths = parseInt(prevWeekDeaths)+parseInt(nextWeekDeaths)

        d3.select('.Details').style('visibility','visible')
        window.scrollTo({
          top: 1000,
          left: 0,
          behavior: 'smooth'
        });
        svgDetails.append("text").attr("x", 300).attr("y", 50).text('Details of ' +countryName).style("font-size", "40px")
        svgDetails.append("text").attr("x", 300).attr("y", 90).text('Population: ' +population).style("font-size", "20px")
        svgDetails.append("text").attr("x", 300).attr("y", 120).text("Hover over Bar Graphs/Pie Charts for accurate measure").style("font-size", "20px")
        
        xScale = d3.scaleLinear().domain([0,350000]).range([0,890]);
        xAxis = d3.axisBottom().scale(xScale).tickSize(10).ticks(8);
        svgCases.append("g").attr("id","xAxisG").attr("transform","translate(90,150)").call(xAxis);

        //Y
        yScale = d3.scaleBand().domain(['Current Week','Preceeding Week']).range([0,100]);
        yAxis = d3.axisLeft().scale(yScale).tickSize(0);
        svgCases.append("g").attr("id","yAxisG").attr("transform","translate(90,50)").call(yAxis);
        
        //Visualization
        svgCases.append("text").attr("x", 350).attr("y", 15).text('Covid-19 Cases, Total Cases: ' + totalCases).style("font-size", "20px")
        svgCases
            .selectAll("rect")
            .data(prevWeekCases)
            .enter()
            .append("rect")
                .attr("width", xScale(prevWeekCases))
                .attr("height", 25)
                .attr("y",  65 )
                .attr("x", 92)
                .style("fill", "#FE9922")
                .style("stroke", "#9A8B7A")
                .style("stroke-width", "1px")
                .append("title")
                .text('Cases: ' +prevWeekCases +'\n'+
                      'Per 1M/Pop: '+percentChangeCases)
        
          svgCases
                .append("rect")
                    .attr("width", xScale(nextWeekCases))
                    .attr("height", 25)
                    .attr("y",  112 )
                    .attr("x", 92)
                    .style("fill", "#FE9922")
                    .style("stroke", "#9A8B7A")
                    .style("stroke-width", "1px")
                    .append("title")
                    .text('Cases: ' +nextWeekCases +'\n'+
                      'Per 1M/Pop: '+percentChangeCases)
          
        //Deaths
        xScale = d3.scaleLinear().domain([0,9000]).range([0,890]);
        xAxis = d3.axisBottom().scale(xScale).tickSize(10).ticks(8);
        svgDeaths.append("g").attr("id","xAxisG").attr("transform","translate(90,150)").call(xAxis);

        //Y
        yScale = d3.scaleBand().domain(['Current Week','Preceeding Week']).range([0,100]);
        yAxis = d3.axisLeft().scale(yScale).tickSize(0);
        svgDeaths.append("g").attr("id","yAxisG").attr("transform","translate(90,50)").call(yAxis);

        //Visualization
        svgDeaths.append("text").attr("x", 350).attr("y", 15).text('Covid-19 Deaths, Total Deaths: ' + totalDeaths).style("font-size", "20px")
        svgDeaths
            .selectAll("rect")
            .data(prevWeekDeaths)
            .enter()
            .append("rect")
                .attr("width", xScale(prevWeekDeaths))
                .attr("height", 25)
                .attr("y",  65 )
                .attr("x", 92)
                .style("fill", "#FE9922")
                .style("stroke", "#9A8B7A")
                .style("stroke-width", "1px")
                .append("title")
                .text('Deaths: ' +prevWeekDeaths +'\n'+
                'Per 1M/Pop: '+percentChangeDeaths)
        
          svgDeaths
                .append("rect")
                    .attr("width", xScale(nextWeekDeaths))
                    .attr("height", 25)
                    .attr("y",  112 )
                    .attr("x", 92)
                    .style("fill", "#FE9922")
                    .style("stroke", "#9A8B7A")
                    .style("stroke-width", "1px")
                    .append("title")
                    .text('Deaths: ' +nextWeekDeaths +'\n'+
                    'Per 1M/Pop: '+percentChangeDeaths)

          //piechart cases
          var pieChart = d3.pie().sort(null);
          var total = 100 - Math.abs(weekChange)
          var yourPie = pieChart([total,Math.abs(weekChange)]);
          
          
          //added inner radius 
          var newArc = d3.arc();
          newArc.innerRadius(1)
            .outerRadius(100);
          
          var fillScale = d3.scaleOrdinal()
            .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F"]);
          svgPieCases.append("text").attr("x", 80).attr("y", 15).text('Weekly % (+)increase/(-)decrease in cases').style("font-size", "20px")
          svgPieCases.append("text").attr("x", 170).attr("y", 77).text(weekChange).style("font-size", "20px")
          svgPieCases
            .append("g")
              .attr("transform","translate(200,190)")
            .selectAll("path")
            .data(yourPie)
            .enter()
            .append("path")
              .attr("d", newArc)
              .style("fill", (d,i) => fillScale(i))
              .style("stroke", "black")
              .style("stroke-width", "2px")
              .append("title")
              .text(weekChange)

          total = 100 - Math.abs(weekChangeD)
          var yourPie = pieChart([total,Math.abs(weekChangeD)]);
          svgPieDeaths.append("text").attr("x", 0).attr("y", 15).text('Weekly % (+)increase/(-)decrease in deaths').style("font-size", "20px")
          svgPieDeaths.append("text").attr("x", 140).attr("y", 77).text(weekChangeD).style("font-size", "20px")
          svgPieDeaths
              .append("g")
                .attr("transform","translate(150,190)")
              .selectAll("path")
              .data(yourPie)
              .enter()
              .append("path")
                .attr("d", newArc)
                .style("fill", (d,i) => fillScale(i))
                .style("stroke", "black")
                .style("stroke-width", "2px")
                .append("title")
                .text(weekChangeD)
        
    })
    

    function compare( a, b ) {
      if ( parseInt(a["Cases in the last 7 days/1M pop"]) < parseInt(b["Cases in the last 7 days/1M pop"]) ){
        return -1;
      }
      if ( parseInt(a["Cases in the last 7 days/1M pop"])  > parseInt(b["Cases in the last 7 days/1M pop"]) ){
        return 1;
      }
      return 0;
    }
    
    sortedList.sort( compare );
   
    // Handmade legend
    svg.append("text").attr("x", 50).attr("y", 170).text("Top 5 countries with lowest cases / 1M ").style("font-size", "15px").style("font-weight","bold").attr("alignment-baseline","middle")
    var c = 0;
    for (var i = 0; i<=4;i++){
      
      c+=15;
    svg.data([sortedList[0+i]]).append("text")
    .attr("x", 50).attr("y", 190+c)
    .text(d=> d["Country/Other"] + ':' + d["Cases in the last 7 days/1M pop"]).style("font-size", "15px")//.attr("alignment-baseline","middle")
    }

    svg.append("text").attr("x", 50).attr("y", 50).text("Bottom 5 countries with lowest cases / 1M ").style("font-size", "15px").style("font-weight","bold").attr("alignment-baseline","middle")
    var c = 0;
    for (var i = 0; i<=4;i++){
      
      c+=15;
    svg.data([sortedList[45+i]]).append("text")
    .attr("x", 50).attr("y", 70+c)
    .text(d=> d["Country/Other"] + ':' + d["Cases in the last 7 days/1M pop"]).style("font-size", "15px")//.attr("alignment-baseline","middle")
    }

    
  }
  svg.selectAll("g").remove();
  svg.selectAll("text").remove();
  
}

function NA() {
  
  var svg = d3.select("svg#map")
  var svgDetails = d3.select("svg#details")
  var svgCases = d3.select("svg#cases")
  var svgDeaths = d3.select("svg#deaths")
  var svgPieCases = d3.select("svg#pieCases")
  var svgPieDeaths = d3.select("svg#pieDeaths")
  var width = 1000
  var height = 1000


  // Map and projection
  var projection = d3.geoMercator()
    .scale(250)
    .center([-100,50])
    .translate([width / 2, height / 2]);


  // Load external data and boot
  d3.queue()
    .defer(d3.json, "NA.geo.json")
    .defer(d3.csv, "NA.csv")
    .await(ready);

  function ready(error, topo, covidData) {
    var sortedList = covidData
    var extent = d3.extent(covidData, d => d["Weekly Case % Change"]);
    var colorScale = d3.scaleLinear()
    .domain(extent)
    .range(["white","#8b0000"]);
    
    // Draw the map
    svg.append("g").selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )

    svg.selectAll("path")
    .data(covidData)
    .attr("fill" ,d => colorScale(d["Weekly Case % Change"]))
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    svg.selectAll("path")
    .data(covidData)
    .append('title')
    .text(d=>d['Country/Other'])

    svg.selectAll("path").data(covidData)
    .on('click', function(d) {
      svgDetails.selectAll("text").remove()
      svgCases.selectAll("g").remove()
      svgCases.selectAll("rect").remove()
      svgCases.selectAll("text").remove()
      svgDeaths.selectAll("g").remove()
      svgDeaths.selectAll("rect").remove()
      svgDeaths.selectAll("text").remove()
      svgPieDeaths.selectAll("g").remove()
      svgPieDeaths.selectAll("rect").remove()
      svgPieDeaths.selectAll("text").remove()
      svgPieCases.selectAll("g").remove()
      svgPieCases.selectAll("rect").remove()
      svgPieCases.selectAll("text").remove()
      
        var countryName = d["Country/Other"];
        var population = d["Population"];
        var prevWeekCases = d["Cases in the last 7 days"]
        var nextWeekCases = d["Cases in the preceding 7 days"]
        var prevWeekDeaths = d["Deaths in the last 7 days"]
        var nextWeekDeaths = d["Deaths in the preceding 7 days"]
        var percentChangeCases = d["Cases in the last 7 days/1M pop"]
        var percentChangeDeaths = d["Deaths in the last 7 days/1M pop"]
        var weekChange = parseInt(d["Weekly Case % Change"])
        var weekChangeD = parseInt(d["Weekly Death % Change"])
        var totalCases = parseInt(prevWeekCases)+parseInt(nextWeekCases)
        var totalDeaths = parseInt(prevWeekDeaths)+parseInt(nextWeekDeaths)

        d3.select('.Details').style('visibility','visible')
        window.scrollTo({
          top: 1000,
          left: 0,
          behavior: 'smooth'
        });
        svgDetails.append("text").attr("x", 300).attr("y", 50).text('Details of ' +countryName).style("font-size", "40px")
        svgDetails.append("text").attr("x", 300).attr("y", 90).text('Population: ' +population).style("font-size", "20px")
        svgDetails.append("text").attr("x", 300).attr("y", 120).text("Hover over Bar Graphs/Pie Charts for accurate measure").style("font-size", "20px")

        xScale = d3.scaleLinear().domain([0,350000]).range([0,890]);
        xAxis = d3.axisBottom().scale(xScale).tickSize(10).ticks(8);
        svgCases.append("g").attr("id","xAxisG").attr("transform","translate(90,150)").call(xAxis);

        //Y
        yScale = d3.scaleBand().domain(['Current Week','Preceeding Week']).range([0,100]);
        yAxis = d3.axisLeft().scale(yScale).tickSize(0);
        svgCases.append("g").attr("id","yAxisG").attr("transform","translate(90,50)").call(yAxis);
        
        //Visualization
        svgCases.append("text").attr("x", 350).attr("y", 15).text('Covid-19 Cases, Total Cases: ' + totalCases).style("font-size", "20px")
        svgCases
            .selectAll("rect")
            .data(prevWeekCases)
            .enter()
            .append("rect")
                .attr("width", xScale(prevWeekCases))
                .attr("height", 25)
                .attr("y",  65 )
                .attr("x", 92)
                .style("fill", "#FE9922")
                .style("stroke", "#9A8B7A")
                .style("stroke-width", "1px")
                .append("title")
                .text('Cases: ' +prevWeekCases +'\n'+
                      'Per 1M/Pop: '+percentChangeCases)
        
          svgCases
                .append("rect")
                    .attr("width", xScale(nextWeekCases))
                    .attr("height", 25)
                    .attr("y",  112 )
                    .attr("x", 92)
                    .style("fill", "#FE9922")
                    .style("stroke", "#9A8B7A")
                    .style("stroke-width", "1px")
                    .append("title")
                    .text('Cases: ' +nextWeekCases +'\n'+
                      'Per 1M/Pop: '+percentChangeCases)
          
        //Deaths
        xScale = d3.scaleLinear().domain([0,9000]).range([0,890]);
        xAxis = d3.axisBottom().scale(xScale).tickSize(10).ticks(8);
        svgDeaths.append("g").attr("id","xAxisG").attr("transform","translate(90,150)").call(xAxis);

        //Y
        yScale = d3.scaleBand().domain(['Current Week','Preceeding Week']).range([0,100]);
        yAxis = d3.axisLeft().scale(yScale).tickSize(0);
        svgDeaths.append("g").attr("id","yAxisG").attr("transform","translate(90,50)").call(yAxis);

        //Visualization
        svgDeaths.append("text").attr("x", 350).attr("y", 15).text('Covid-19 Deaths, Total Deaths: ' + totalDeaths).style("font-size", "20px")
        svgDeaths
            .selectAll("rect")
            .data(prevWeekDeaths)
            .enter()
            .append("rect")
                .attr("width", xScale(prevWeekDeaths))
                .attr("height", 25)
                .attr("y",  65 )
                .attr("x", 92)
                .style("fill", "#FE9922")
                .style("stroke", "#9A8B7A")
                .style("stroke-width", "1px")
                .append("title")
                .text('Deaths: ' +prevWeekDeaths +'\n'+
                'Per 1M/Pop: '+percentChangeDeaths)
        
          svgDeaths
                .append("rect")
                    .attr("width", xScale(nextWeekDeaths))
                    .attr("height", 25)
                    .attr("y",  112 )
                    .attr("x", 92)
                    .style("fill", "#FE9922")
                    .style("stroke", "#9A8B7A")
                    .style("stroke-width", "1px")
                    .append("title")
                    .text('Deaths: ' +nextWeekDeaths +'\n'+
                    'Per 1M/Pop: '+percentChangeDeaths)

          //piechart cases
          var pieChart = d3.pie().sort(null);
          var total = 100 - Math.abs(weekChange)
          var yourPie = pieChart([total,Math.abs(weekChange)]);
          
          
          //added inner radius 
          var newArc = d3.arc();
          newArc.innerRadius(1)
            .outerRadius(100);
          
          var fillScale = d3.scaleOrdinal()
            .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F"]);
          svgPieCases.append("text").attr("x", 80).attr("y", 15).text('Weekly % (+)increase/(-)decrease in cases').style("font-size", "20px")
          svgPieCases.append("text").attr("x", 170).attr("y", 77).text(weekChange).style("font-size", "20px")
          svgPieCases
            .append("g")
              .attr("transform","translate(200,190)")
            .selectAll("path")
            .data(yourPie)
            .enter()
            .append("path")
              .attr("d", newArc)
              .style("fill", (d,i) => fillScale(i))
              .style("stroke", "black")
              .style("stroke-width", "2px")
              .append("title")
              .text(weekChange)

          total = 100 - Math.abs(weekChangeD)
          var yourPie = pieChart([total,Math.abs(weekChangeD)]);
          svgPieDeaths.append("text").attr("x", 0).attr("y", 15).text('Weekly % (+)increase/(-)decrease in deaths').style("font-size", "20px")
          svgPieDeaths.append("text").attr("x", 140).attr("y", 77).text(weekChangeD).style("font-size", "20px")
          svgPieDeaths
              .append("g")
                .attr("transform","translate(150,190)")
              .selectAll("path")
              .data(yourPie)
              .enter()
              .append("path")
                .attr("d", newArc)
                .style("fill", (d,i) => fillScale(i))
                .style("stroke", "black")
                .style("stroke-width", "2px")
                .append("title")
                .text(weekChangeD)
      })

    function compare( a, b ) {
      if ( parseInt(a["Cases in the last 7 days/1M pop"]) < parseInt(b["Cases in the last 7 days/1M pop"]) ){
        return -1;
      }
      if ( parseInt(a["Cases in the last 7 days/1M pop"])  > parseInt(b["Cases in the last 7 days/1M pop"]) ){
        return 1;
      }
      return 0;
    }
    
    sortedList.sort( compare );
   
    // Handmade legend
    svg.append("text").attr("x", 50).attr("y", 170).text("Top 5 countries with lowest cases / 1M ").style("font-size", "15px").style("font-weight","bold").attr("alignment-baseline","middle")
    var c = 0;
    for (var i = 0; i<=4;i++){
      
      c+=15;
    svg.data([sortedList[0+i]]).append("text")
    .attr("x", 50).attr("y", 190+c)
    .text(d=> d["Country/Other"] + ':' + d["Cases in the last 7 days/1M pop"]).style("font-size", "15px")//.attr("alignment-baseline","middle")
    }

    svg.append("text").attr("x", 50).attr("y", 50).text("Bottom 5 countries with lowest cases / 1M ").style("font-size", "15px").style("font-weight","bold").attr("alignment-baseline","middle")
    var c = 0;
    for (var i = 0; i<=4;i++){
      
      c+=15;
    svg.data([sortedList[32+i]]).append("text")
    .attr("x", 50).attr("y", 70+c)
    .text(d=> d["Country/Other"] + ':' + d["Cases in the last 7 days/1M pop"]).style("font-size", "15px")//.attr("alignment-baseline","middle")
    }

  }
  svg.selectAll("g").remove();
  svg.selectAll("text").remove();

}

function SA() {
  
  var svg = d3.select("svg#map")
  var svgDetails = d3.select("svg#details")
  var svgCases = d3.select("svg#cases")
  var svgDeaths = d3.select("svg#deaths")
  var svgPieCases = d3.select("svg#pieCases")
  var svgPieDeaths = d3.select("svg#pieDeaths")
  var width = 700
  var height = 800


  // Map and projection
  var projection = d3.geoMercator()
    .scale(350)
    .center([-80,-20])
    .translate([width / 2, height / 2]);

  

  // Load external data and boot
  d3.queue()
    .defer(d3.json, "SA.geo.json")
    .defer(d3.csv, "SA.csv")
    .await(ready);

  function ready(error, topo, covidData) {
    var sortedList = covidData
    var colorScale = d3.scaleLinear()
    .domain([-100,96])
    .range(["white","#8b0000"]);

    svg.append("g").selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )
    svg.selectAll("path")
    .data(covidData)
    .attr("fill" ,d => colorScale(d["Weekly Case % Change"]))
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    svg.selectAll("path")
    .data(covidData)
    .append('title')
    .text(d=>d['Country/Other'])

    svg.selectAll("path").data(covidData)
    .on('click', function(d) {
      svgDetails.selectAll("text").remove()
      svgCases.selectAll("g").remove()
      svgCases.selectAll("rect").remove()
      svgCases.selectAll("text").remove()
      svgDeaths.selectAll("g").remove()
      svgDeaths.selectAll("rect").remove()
      svgDeaths.selectAll("text").remove()
      svgPieDeaths.selectAll("g").remove()
      svgPieDeaths.selectAll("rect").remove()
      svgPieDeaths.selectAll("text").remove()
      svgPieCases.selectAll("g").remove()
      svgPieCases.selectAll("rect").remove()
      svgPieCases.selectAll("text").remove()
      
        var countryName = d["Country/Other"];
        var population = d["Population"];
        var prevWeekCases = d["Cases in the last 7 days"]
        var nextWeekCases = d["Cases in the preceding 7 days"]
        var prevWeekDeaths = d["Deaths in the last 7 days"]
        var nextWeekDeaths = d["Deaths in the preceding 7 days"]
        var percentChangeCases = d["Cases in the last 7 days/1M pop"]
        var percentChangeDeaths = d["Deaths in the last 7 days/1M pop"]
        var weekChange = parseInt(d["Weekly Case % Change"])
        var weekChangeD = parseInt(d["Weekly Death % Change"])
        var totalCases = parseInt(prevWeekCases)+parseInt(nextWeekCases)
        var totalDeaths = parseInt(prevWeekDeaths)+parseInt(nextWeekDeaths)

        d3.select('.Details').style('visibility','visible')
        window.scrollTo({
          top: 1000,
          left: 0,
          behavior: 'smooth'
        });
        svgDetails.append("text").attr("x", 300).attr("y", 50).text('Details of ' +countryName).style("font-size", "40px")
        svgDetails.append("text").attr("x", 300).attr("y", 90).text('Population: ' +population).style("font-size", "20px")
        svgDetails.append("text").attr("x", 300).attr("y", 120).text("Hover over Bar Graphs/Pie Charts for accurate measure").style("font-size", "20px")

  
        xScale = d3.scaleLinear().domain([0,350000]).range([0,890]);
        xAxis = d3.axisBottom().scale(xScale).tickSize(10).ticks(8);
        svgCases.append("g").attr("id","xAxisG").attr("transform","translate(90,150)").call(xAxis);

        //Y
        yScale = d3.scaleBand().domain(['Current Week','Preceeding Week']).range([0,100]);
        yAxis = d3.axisLeft().scale(yScale).tickSize(0);
        svgCases.append("g").attr("id","yAxisG").attr("transform","translate(90,50)").call(yAxis);
       
        //Visualization
        svgCases.append("text").attr("x", 350).attr("y", 15).text('Covid-19 Cases, Total Cases: ' + totalCases).style("font-size", "20px")
        svgCases
            .selectAll("rect")
            .data(prevWeekCases)
            .enter()
            .append("rect")
                .attr("width", xScale(prevWeekCases))
                .attr("height", 25)
                .attr("y",  65 )
                .attr("x", 92)
                .style("fill", "#FE9922")
                .style("stroke", "#9A8B7A")
                .style("stroke-width", "1px")
                .append("title")
                .text('Cases: ' +prevWeekCases +'\n'+
                      'Per 1M/Pop: '+percentChangeCases)
        
          svgCases
                .append("rect")
                    .attr("width", xScale(nextWeekCases))
                    .attr("height", 25)
                    .attr("y",  112 )
                    .attr("x", 92)
                    .style("fill", "#FE9922")
                    .style("stroke", "#9A8B7A")
                    .style("stroke-width", "1px")
                    .append("title")
                    .text('Cases: ' +nextWeekCases +'\n'+
                      'Per 1M/Pop: '+percentChangeCases)
          
        //Deaths
        xScale = d3.scaleLinear().domain([0,9000]).range([0,890]);
        xAxis = d3.axisBottom().scale(xScale).tickSize(10).ticks(8);
        svgDeaths.append("g").attr("id","xAxisG").attr("transform","translate(90,150)").call(xAxis);

        //Y
        yScale = d3.scaleBand().domain(['Current Week','Preceeding Week']).range([0,100]);
        yAxis = d3.axisLeft().scale(yScale).tickSize(0);
        svgDeaths.append("g").attr("id","yAxisG").attr("transform","translate(90,50)").call(yAxis);
        //Visualization
        svgDeaths.append("text").attr("x", 350).attr("y", 15).text('Covid-19 Deaths, Total Deaths: ' + totalDeaths).style("font-size", "20px")
        svgDeaths
            .selectAll("rect")
            .data(prevWeekDeaths)
            .enter()
            .append("rect")
                .attr("width", xScale(prevWeekDeaths))
                .attr("height", 25)
                .attr("y",  65 )
                .attr("x", 92)
                .style("fill", "#FE9922")
                .style("stroke", "#9A8B7A")
                .style("stroke-width", "1px")
                .append("title")
                .text('Deaths: ' +prevWeekDeaths +'\n'+
                'Per 1M/Pop: '+percentChangeDeaths)
        
          svgDeaths
                .append("rect")
                    .attr("width", xScale(nextWeekDeaths))
                    .attr("height", 25)
                    .attr("y",  112 )
                    .attr("x", 92)
                    .style("fill", "#FE9922")
                    .style("stroke", "#9A8B7A")
                    .style("stroke-width", "1px")
                    .append("title")
                    .text('Deaths: ' +nextWeekDeaths +'\n'+
                    'Per 1M/Pop: '+percentChangeDeaths)

          //piechart cases
          var pieChart = d3.pie().sort(null);
          var total = 100 - Math.abs(weekChange)
          var yourPie = pieChart([total,Math.abs(weekChange)]);
          
          
          //added inner radius 
          var newArc = d3.arc();
          newArc.innerRadius(1)
            .outerRadius(100);
          
          var fillScale = d3.scaleOrdinal()
            .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F"]);
          svgPieCases.append("text").attr("x", 80).attr("y", 15).text('Weekly % (+)increase/(-)decrease in cases').style("font-size", "20px")
          svgPieCases.append("text").attr("x", 170).attr("y", 77).text(weekChange).style("font-size", "20px")
          svgPieCases
            .append("g")
              .attr("transform","translate(200,190)")
            .selectAll("path")
            .data(yourPie)
            .enter()
            .append("path")
              .attr("d", newArc)
              .style("fill", (d,i) => fillScale(i))
              .style("stroke", "black")
              .style("stroke-width", "2px")
              .append("title")
              .text(weekChange)

          total = 100 - Math.abs(weekChangeD)
          var yourPie = pieChart([total,Math.abs(weekChangeD)]);
          svgPieDeaths.append("text").attr("x", 0).attr("y", 15).text('Weekly % (+)increase/(-)decrease in deaths').style("font-size", "20px")
          svgPieDeaths.append("text").attr("x", 140).attr("y", 77).text(weekChangeD).style("font-size", "20px")
          svgPieDeaths
              .append("g")
                .attr("transform","translate(150,190)")
              .selectAll("path")
              .data(yourPie)
              .enter()
              .append("path")
                .attr("d", newArc)
                .style("fill", (d,i) => fillScale(i))
                .style("stroke", "black")
                .style("stroke-width", "2px")
                .append("title")
                .text(weekChangeD)
        
        
    })

    function compare( a, b ) {
      if ( parseInt(a["Cases in the last 7 days/1M pop"]) < parseInt(b["Cases in the last 7 days/1M pop"]) ){
        return -1;
      }
      if ( parseInt(a["Cases in the last 7 days/1M pop"])  > parseInt(b["Cases in the last 7 days/1M pop"]) ){
        return 1;
      }
      return 0;
    }
    
    sortedList.sort( compare );
   
    // Handmade legend
    svg.append("text").attr("x", 50).attr("y", 170).text("Top 5 countries with lowest cases / 1M ").style("font-size", "15px").style("font-weight","bold").attr("alignment-baseline","middle")
    var c = 0;
    for (var i = 0; i<=4;i++){
      
      c+=15;
    svg.data([sortedList[0+i]]).append("text")
    .attr("x", 50).attr("y", 190+c)
    .text(d=> d["Country/Other"] + ':' + d["Cases in the last 7 days/1M pop"]).style("font-size", "15px")//.attr("alignment-baseline","middle")
    }

    svg.append("text").attr("x", 50).attr("y", 50).text("Bottom 5 countries with lowest cases / 1M ").style("font-size", "15px").style("font-weight","bold").attr("alignment-baseline","middle")
    var c = 0;
    for (var i = 0; i<=4;i++){
      
      c+=15;
    svg.data([sortedList[9+i]]).append("text")
    .attr("x", 50).attr("y", 70+c)
    .text(d=> d["Country/Other"] + ':' + d["Cases in the last 7 days/1M pop"]).style("font-size", "15px")//.attr("alignment-baseline","middle")
    }

  }
  svg.selectAll("g").remove();
  svg.selectAll("text").remove();
}
