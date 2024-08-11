
/*******************************************************************************
 General Margin Convention
*******************************************************************************/


var margin = { top: 20, right: 10, bottom: 100, left: 60 },
    width = 240 - margin.right - margin.left,
    height = 140 - margin.top - margin.bottom;


// Margin Age

const marginBar = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 60
},
    width1 = 400 - marginBar.right - marginBar.left,
    height1 = 300 - marginBar.top - marginBar.bottom;



/*******************************************************************************
Define SVG's
*******************************************************************************/


// SVG_amountspend

var svg_amountSpend = d3.select("#Amount_Spend")
    .append("svg")
    .attr({
        "width": width + margin.right + margin.left,
        "height": height + margin.top + margin.bottom
    })
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");


// SVG_Clicks

var svg_Clicks = d3.select("#Clicks")
    .append("svg")
    .attr({
        "width": width + margin.right + margin.left,
        "height": height + margin.top + margin.bottom
    })
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");


// SVG_CPM

var svg_CPM = d3.select("#CPM")
    .append("svg")
    .attr({
        "width": width + margin.right + margin.left,
        "height": height + margin.top + margin.bottom
    })
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");


// SVG_CTR

var svg_CTR = d3.select("#CTR")
    .append("svg")
    .attr({
        "width": width + margin.right + margin.left,
        "height": height + margin.top + margin.bottom
    })
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");


// SVG_Impressions

var svg_Impressions = d3.select("#impressions")
    .append("svg")
    .attr({
        "width": width + margin.right + margin.left,
        "height": height + margin.top + margin.bottom
    })
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");


// SVG_Age

var svg_Age = d3.select("#Age")
    .append("svg").attr({
        "width": width1 + marginBar.right + marginBar.left,
        "height": height1 + marginBar.top + marginBar.bottom
    })
    .append("g")
    .attr("transform", "translate(" + marginBar.left + "," + marginBar.right + ")");


// SVG_Gender

var svg_Gender = d3.select("#Age")
    .append("svg").attr({
        "width": width1 + marginBar.right + marginBar.left,
        "height": height1 + marginBar.top + marginBar.bottom
    })
    .append("g")
    .attr("transform", "translate(" + marginBar.left + "," + marginBar.right + ")");


// Define SVG_AgeGender

var svg_AgeGender = d3.select("#AgeGender").append("svg")
    .attr("width", width1 + marginBar.left + marginBar.right)
    .attr("height", height1 + marginBar.top + marginBar.bottom)
    .append("g")
    .attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");



/*******************************************************************************
Import Data & Build Charts
*******************************************************************************/



d3.csv("assets/Data/d3_prepared.csv", function (error, data) {
    if (error) console.log("Error: data not loaded!");


    // Add Campaign ID Filter



    var selected_campaign_id = ['25012575', '25012580', '24934154']


    var data = data.filter(function (row) {
        if (selected_campaign_id.includes(row['campaign_id'])) {
            return row['campaign_id'];
        }
    })













    /*******************************************************************************
    Amount Spend
    *******************************************************************************/


    // Add title Amount Spend

    svg_amountSpend.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 - 22)
        .attr("y", height / 2 + 22)
        .style("text-anchor", "left")
        .attr("font-family", 'Times New Roman')
        //.attr("font-weight", 'bold')
        .attr("font-size", '20px')
        .text("Amount Spend");


    // Add Ad Spend data


    // Dictionery: {key: campaign_id, values: sum of media_cost}
    data_mediaCost = d3.nest()
        .key(function (d) { return d.campaign_id; })
        .rollup(function (v) { return d3.sum(v, function (d) { return d.media_cost; }); })
        .entries(data);
    //console.log(JSON.stringify(data));

    var total_mediaCost = d3.sum(data_mediaCost, function (d) { return d.values; });
    //console.log(JSON.stringify(total_mediaCost));



    // Calculate Ad Spend

    amount_spend = total_mediaCost / 1000
    //console.log(JSON.stringify(amount_spend));



    // Format Ad Spend

    var formatMoney = function (d) { return "$" + d3.format(",.2f")(d); };

    var amount_spend_F = formatMoney(amount_spend)
    //console.log(JSON.stringify(amount_spend_F));


    //Add Ad Spend Text

    svg_amountSpend.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 - 22)
        .attr("y", height / 2 + 85)
        .style("text-anchor", "left")
        .attr("font-family", 'Times New Roman')
        .attr("font-weight", 'bold')
        .attr("font-size", '50px')
        .text(amount_spend_F);




    /*******************************************************************************
    File: Clicks.js
    *******************************************************************************/



    // Add title Clicks

    svg_Clicks.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 - 22)
        .attr("y", height / 2 + 22)
        .style("text-anchor", "left")
        .attr("font-family", 'Times New Roman')
        //.attr("font-weight", 'bold')
        .attr("font-size", '20px')
        .text("Clicks");


    // Add Clicks data


    // Dictionery: {key: campaign_id, values: sum of clicks}
    data_Clicks = d3.nest()
        .key(function (d) { return d.campaign_id; })
        .rollup(function (v) { return d3.sum(v, function (d) { return d.clicks; }); })
        .entries(data);
    //console.log(JSON.stringify(data));

    var total_clicks = d3.sum(data_Clicks, function (d) { return d.values; });

    var total_clicks_F = d3.format(",")(total_clicks)

    ///console.log(JSON.stringify(total_clicks_F));


    svg_Clicks.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 - 22)
        .attr("y", height / 2 + 85)
        .style("text-anchor", "left")
        .attr("font-family", 'Times New Roman')
        .attr("font-weight", 'bold')
        .attr("font-size", '50px')
        .text(total_clicks_F);




    /*******************************************************************************
    File: Impressions.js
    *******************************************************************************/



    // Add title Impressions

    svg_Impressions.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 - 22)
        .attr("y", height / 2 + 22)
        .style("text-anchor", "left")
        .attr("font-family", 'Times New Roman')
        //.attr("font-weight", 'bold')
        .attr("font-size", '20px')
        .text("Impressions");


    // Add Impression data


    // Dictionery: {key: campaign_id, values: sum of impressions}
    data_Impressions = d3.nest()
        .key(function (d) { return d.campaign_id; })
        .rollup(function (v) { return d3.sum(v, function (d) { return d.impressions; }); })
        .entries(data);
    //console.log(JSON.stringify(data));

    var total_impressions = d3.sum(data_Impressions, function (d) { return d.values; });

    var total_impressions_F = d3.format(",")(total_impressions)

    ///console.log(JSON.stringify(total_impressions_F));


    svg_Impressions.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 - 22)
        .attr("y", height / 2 + 85)
        .style("text-anchor", "left")
        .attr("font-family", 'Times New Roman')
        .attr("font-weight", 'bold')
        .attr("font-size", '50px')
        .text(total_impressions_F);




    /*******************************************************************************
    File: CTR.js
    *******************************************************************************/


    // Add title CTR

    svg_CTR.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 - 30)
        .attr("y", height / 2 + 22)
        .style("text-anchor", "left")
        .attr("font-family", 'Times New Roman')
        //.attr("font-weight", 'bold')
        .attr("font-size", '20px')
        .text("CTR");


    // Compute CTR


    var CTR = total_clicks / total_impressions

    //console.log(JSON.stringify(CTR));



    // Format CTR


    var CTR_F = d3.format(",.2%")(CTR)

    //console.log(JSON.stringify(CTR_F));


    svg_CTR.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 - 22)
        .attr("y", height / 2 + 85)
        .style("text-anchor", "left")
        .attr("font-family", 'Times New Roman')
        .attr("font-weight", 'bold')
        .attr("font-size", '50px')
        .text(CTR_F);




    /*******************************************************************************
    File: CPM.js
    *******************************************************************************/



    // Add title CPM

    svg_CPM.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 - 22)
        .attr("y", height / 2 + 22)
        .style("text-anchor", "left")
        .attr("font-family", 'Times New Roman')
        //.attr("font-weight", 'bold')
        .attr("font-size", '20px')
        .text("CPM");


    // Calculate CPM

    CPM = amount_spend / (total_impressions / 1000)



    // Format CPM

    var formatMoney = function (d) { return "$" + d3.format(",.2f")(d); };

    var CPM_F = formatMoney(CPM)
    //console.log(JSON.stringify(CPM_F));



    //Add CPM Text

    svg_CPM.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 - 22)
        .attr("y", height / 2 + 85)
        .style("text-anchor", "left")
        .attr("font-family", 'Times New Roman')
        .attr("font-weight", 'bold')
        .attr("font-size", '50px')
        .text(CPM_F);




    /*******************************************************************************
    File: Age.js
    *******************************************************************************/



    // define x and y scales
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width1], 0.2, 0.2);

    var yScale = d3.scale.linear()
        .range([height1, 0]);

    // define x axis and y axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");




    // Set priority order 


    var priority_order = ['Under 18', 'Unknown', "18-24", '25-34', '35-44', '45-54', '55-64', '65+'];
    data_AgeGroupImpressions = d3.nest()
        //.key(function(d) { return d.age_group; }).sortKeys(d3.ascending)
        .key(function (d) { return d.age_group; }).sortKeys(function (a, b) { return priority_order.indexOf(a) - priority_order.indexOf(b); })
        .rollup(function (v) { return v.length; })
        .entries(data);
    //remove Unknown column values
    data_AgeGroupImpressions = data_AgeGroupImpressions.filter(function (d) { return d.key !== 'Unknown'; });
    //alert(JSON.stringify(data));



    // Specify the domains of the x and y scales
    xScale.domain(data_AgeGroupImpressions.map(function (d) { return d.key; }));
    yScale.domain([0, d3.max(data_AgeGroupImpressions, function (d) { return d.values; })]);

    svg_Age.selectAll('rect')
        .data(data_AgeGroupImpressions)
        .enter()
        .append('rect')
        .on("mouseover", function (d) { d3.select(this).attr("r", 10).style("fill", "rgb(20, 20, 220)"); })
        .on("mouseout", function (d) { d3.select(this).attr("r", 10).style("fill", function (d, i) { return 'rgb(20, 20, ' + ((i * 30) + 100) + ')' }); })
        .attr("height", 0)
        .attr("y", height1)
        .transition().duration(3000)
        .delay(function (d, i) { return i * 200; })
        // attributes can be also combined under one .attr
        .attr({
            "x": function (d) { return xScale(d.key); },
            "y": function (d) { return yScale(d.values); },
            "width": xScale.rangeBand(),
            "height": function (d) { return height1 - yScale(d.values); }
        })
        .style("fill", function (d, i) { return 'rgb(20, 20, ' + ((i * 30) + 100) + ')' });


    svg_Age.selectAll('text')
        .data(data_AgeGroupImpressions)
        .enter()
        .append('text')



        .text(function (d) {
            return d.values;
        })
        .attr({
            "x": function (d) { return xScale(d.key) + xScale.rangeBand() / 2; },
            "y": function (d) { return yScale(d.values) + 12; },
            "font-family": 'sans-serif',
            "font-size": '13px',
            "font-weight": 'bold',
            "fill": 'white',
            "text-anchor": 'middle'
        });

    // Draw xAxis and position the label
    svg_Age.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-60)")
        .style("text-anchor", "end")
        .attr("font-size", "10px");


    svg_Age.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width1 / 2)
        .attr("y", height1 + 70)
        .style("text-anchor", "middle")
        .text("Age");


    // Draw yAxis and postion the label
    svg_Age.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height1 / 2)
        .attr("dy", "-4.0em")
        .style("text-anchor", "middle")
        .text("Impressions");




    /*******************************************************************************
    File: GenderPL.js
    *******************************************************************************/



    // Set priority order
    var priority_order = ['Male', 'Female', "Unknown"];

    data_GenderImpressions = d3.nest()
        .key(function (d) { return d.gender_transformed; }).sortKeys(function (a, b) { return priority_order.indexOf(a) - priority_order.indexOf(b); })
        .rollup(function (v) { return v.length; })
        .entries(data);


    //Define x & y scales

    var x = d3.scale.linear()
        .range([0, width1])
        .domain([0, d3.max(data_GenderImpressions, function (d) { return d.values; })]);



    var y = d3.scale.ordinal()
        .rangeRoundBands([height1, 0], 0.2, 0.2)
        .domain(data_GenderImpressions.map(function (d) { return d.key; }));


    // Make y axis

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .orient("left");

    var gy = svg_Gender.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var bars = svg_Gender.selectAll(".bar")
        .data(data_GenderImpressions)
        .enter()
        .append("g");



    //Make x axis

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    svg_Gender.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", " 7 em")
        .attr("dy", ".8em")
        //.attr("transform", "rotate(-60)" )
        .style("text-anchor", "middle")
        .attr("font-size", "10px")
        ;


    svg_Gender.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width1 / 2)
        .attr("y", height1 + 55)
        .style("text-anchor", "middle")
        .text("Impressions");


    // Append rects

    bars.append("rect")
        .attr("class", "bar")
        .on("mouseover", function (d) { d3.select(this).attr("r", 10).style("fill", "rgb(20, 20, 220)"); })
        .on("mouseout", function (d) { d3.select(this).attr("r", 10).style("fill", function (d, i) { return 'rgb(20, 20, ' + ((i * 30) + 100) + ')' }); })
        .attr("y", function (d) {
            return y(d.key);
        })
        .attr("height", y.rangeBand())
        .attr("x", 0)
        .attr("width", function (d) {
            return 0
        })
        .transition().duration(3000)
        .delay(function (d, i) { return i * 200; })
        .attr({
            //"y": function(d) { return y(d.values); },
            // "x": function(d) { return x(d.values); },
            //"height": y.rangeBand(),
            "width": function (d) { return 0 + x(d.values); }
        })
        .style("fill", function (d, i) { return 'rgb(20, 20, ' + ((i * 30) + 100) + ')' })

        ;


    //add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.key) + y.rangeBand() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.values) - 36;
        })
        .text(function (d) {
            return d.values;
        })
        .attr({
            "font-family": 'sans-serif',
            "font-size": '13px',
            "font-weight": 'bold',
            "fill": 'white'
        });




    /*******************************************************************************
    File: Age & Gender.js
    *******************************************************************************/



    function tornadoChart() {



        var x = d3.scale.linear()
            .range([0, width1]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, height1], 0.1);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(7)

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickSize(0)



        function chart(selection) {
            selection.each(function (data) {

                x.domain(d3.extent(data, function (d) { return d.interactions; })).nice();
                y.domain(data.map(function (d) { return d.age; }));

                var minInteractions = Math.min.apply(Math, data.map(function (o) { return o.interactions; }))
                yAxis.tickPadding(Math.abs(x(minInteractions) - x(0)) + 10);

                var bar = svg_AgeGender.selectAll(".bar")
                    .data(data)

                bar.enter().append("rect")
                    //.on("mouseover", function (d) { d3.select(this).attr("r", 10).style("fill", "rgb(20, 20, 220)"); })
                    //.on("mouseout", function (d) { d3.select(this).attr("r", 10).style("fill", function (d, i) { return 'rgb(20, 20, ' + ((i * 30) + 100) + ')' }); })
                    .attr("class", function (d) { return "bar bar--" + (d.interactions < 0 ? "negative" : "positive"); })
                    .attr("x", function (d) { return x(Math.min(0, d.interactions)); })
                    .attr("y", function (d) { return y(d.age); })
                    .attr("width", function (d) { return Math.abs(x(d.interactions) - x(0)); })
                    .attr("height", y.rangeBand())




                bar.enter().append('text')
                    .attr("text-anchor", "middle")
                    .attr("x", function (d, i) {
                        return x(Math.min(0, d.interactions)) + (Math.abs(x(d.interactions) - x(0)) / 2);
                    })
                    .attr("y", function (d, i) {
                        return y(d.age) + (y.rangeBand() / 2);
                    })
                    .attr("dy", ".35em")
                    .text(function (d) { return Math.abs(d.interactions) })
                    .style("fill", "#000")
                    .style("font-size", "10px")
                    .attr("font-family", 'Times New Roman')
                //.attr("font-weight", 'bold')




                svg_AgeGender.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height1 + ")")
                    .call(xAxis)
                    .style("fill", "#000")                
                    .selectAll('.tick text')
                    .text(function (d) { if (d < 0) return -d; else return d; });


                svg_AgeGender.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + x(0) + ",0)")
                    .call(yAxis)
                    .style("fill", "#000");

                svg_AgeGender.append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "middle")
                    .attr("x", width1 / 2 - 30)
                    .attr("y", height1 + 55)
                    .style("text-anchor", "middle")
                    .style("fill", "#000")
                    .text("Impressions");
            });
        }

        return chart;
    }

    // Calculations

    var m_imp_Under18 = 0;


    // Under 18


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === 'Under 18') {
            m_imp_Under18 = m_imp_Under18 + parseInt(rec.male_impressions);
            //console.log('impressions are: ' + m_imp_Under18);
        }
    })

    console.log('Male Impressions Under 18 are: ' + m_imp_Under18);



    var f_imp_Under18 = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === 'Under 18') {
            f_imp_Under18 = f_imp_Under18 + parseInt(rec.female_impressions);
            //console.log('impressions are: ' + f_imp_Under18);
        }
    })

    console.log('Female Impressions Under 18 are: ' + f_imp_Under18);


    // 18-24



    var m_imp_18to24 = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '18-24') {
            m_imp_18to24 = m_imp_18to24 + parseInt(rec.male_impressions);
            //console.log('impressions are: ' + m_imp_18to24);
        }
    })

    console.log('Male Impressions between 18-24 are: ' + m_imp_18to24);



    var f_imp_18to24 = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '18-24') {
            f_imp_18to24 = f_imp_18to24 + parseInt(rec.female_impressions);
            //console.log('impressions are: ' + f_imp_18to24);
        }
    })

    console.log('Female Impressions between 18-24 are: ' + f_imp_18to24);




    // 25-34



    var m_imp_25to34 = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '25-34') {
            m_imp_25to34 = m_imp_25to34 + parseInt(rec.male_impressions);
            //console.log('impressions are: ' + m_imp_25to34);
        }
    })

    console.log('Male Impressions between 25-34 are: ' + m_imp_25to34);



    var f_imp_25to34 = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '25-34') {
            f_imp_25to34 = f_imp_25to34 + parseInt(rec.female_impressions);
            //console.log('impressions are: ' + f_imp_25to34);
        }
    })

    console.log('Female Impressions between 25-34 are: ' + f_imp_25to34);




    // 35-44



    var m_imp_35to44 = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '35-44') {
            m_imp_35to44 = m_imp_35to44 + parseInt(rec.male_impressions);
            //console.log('impressions are: ' + m_imp_35to44);
        }
    })



    console.log('Male Impressions between 35-44 are: ' + m_imp_35to44);



    var f_imp_35to44 = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '35-44') {
            f_imp_35to44 = f_imp_35to44 + parseInt(rec.female_impressions);
            //console.log('impressions are: ' + f_imp_35to44);
        }
    })

    console.log('Female Impressions between 35-44 are: ' + f_imp_35to44);




    // 45-54


    var m_imp_45to54 = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '45-54') {
            m_imp_45to54 = m_imp_45to54 + parseInt(rec.male_impressions);
            //console.log('impressions are: ' + m_imp_45to54);
        }
    })

    console.log('Male Impressions between 45-54 are: ' + m_imp_45to54);



    var f_imp_45to54 = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '45-54') {
            f_imp_45to54 = f_imp_45to54 + parseInt(rec.female_impressions);
            //console.log('impressions are: ' + f_imp_45to54);
        }
    })

    console.log('Female Impressions between 45-54 are: ' + f_imp_45to54);



    // 55-64


    var m_imp_55to64 = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '55-64') {
            m_imp_55to64 = m_imp_55to64 + parseInt(rec.male_impressions);
            //console.log('impressions are: ' + m_imp_55to64);
        }
    })

    console.log('Male Impressions between 55-64 are: ' + m_imp_55to64);



    var f_imp_55to64 = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '55-64') {
            f_imp_55to64 = f_imp_55to64 + parseInt(rec.female_impressions);
            //console.log('impressions are: ' + f_imp_55to64);
        }
    })

    console.log('Female Impressions between 55-64 are: ' + f_imp_55to64);



    // 65+


    var m_imp_65Plus = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '65+') {
            m_imp_65Plus = m_imp_65Plus + parseInt(rec.male_impressions);
            //console.log('impressions are: ' + m_imp_65Plus);
        }
    })

    console.log('Male Impressions with 65+ age are: ' + m_imp_65Plus);



    var f_imp_65Plus = 0;


    data.forEach(rec => {
        //console.log('record is: ' + JSON.stringify(rec))
        //console.log()
        if (rec.age_group === '65+') {
            f_imp_65Plus = f_imp_65Plus + parseInt(rec.female_impressions);
            //console.log('impressions are: ' + f_imp_65Plus);
        }
    })

    console.log('Female Impressions with 65+ age are: ' + f_imp_65Plus);






// Code update


   // Set priority order 


   var AG_priority_order = ['Under 18', 'Unknown', "18-24", '25-34', '35-44', '45-54', '55-64', '65+'];
   data_AG_ImpressionsM = d3.nest()
       //.key(function(d) { return d.age_group; }).sortKeys(d3.ascending)
       .key(function (d) { return d.age_group; }).sortKeys(function (a, b) { return priority_order.indexOf(a) - priority_order.indexOf(b); })
       .rollup(function (leaves) { return d3.sum(leaves, function(d) {
           return d.male_impressions;
        });
    })
       .entries(data)
//       .map(function(d){
//        return { age_group: d.key, Male_impressions: d.values};
//       });
   //remove Unknown column values
   data_AG_ImpressionsM = data_AG_ImpressionsM.filter(function (d) { return d.key !== 'Unknown'; });

  // alert(JSON.stringify(data_AG_ImpressionsM[6] ));

// New Code End




    var data_AgeGender = { "Age&Gender": [{ "age": "Under 18", "gender": "male", "interactions": m_imp_Under18 }, { "age": "Under 18", "gender": "female", "interactions": -f_imp_Under18 }, { "age": "18-24", "gender": "male", "interactions": m_imp_18to24 }, { "age": "18-24", "gender": "female", "interactions": -f_imp_18to24 }, { "age": "25-34", "gender": "male", "interactions": m_imp_25to34 }, { "age": "25-34", "gender": "female", "interactions": -f_imp_25to34 }, { "age": "35-44", "gender": "male", "interactions": m_imp_35to44 }, { "age": "35-44", "gender": "female", "interactions": -f_imp_35to44 }, { "age": "45-54", "gender": "male", "interactions": m_imp_45to54 }, { "age": "45-54", "gender": "female", "interactions": -f_imp_45to54 }, { "age": "55-64", "gender": "male", "interactions": m_imp_55to64 }, { "age": "55-64", "gender": "female", "interactions": -f_imp_55to64 }, { "age": "65+", "gender": "male", "interactions": m_imp_65Plus }, { "age": "65+", "gender": "female", "interactions": -f_imp_65Plus }] };

    for (var i in data_AgeGender) {
        var chart = tornadoChart()
        d3.select("#AgeGender")
            .datum(data_AgeGender[i])
            .call(chart);



    }


    d3.select("svg")
        .attr("class", "center")





















});








