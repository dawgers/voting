'use strict';
var width2 = 850, height2 = 500;
let impressions = {};
let path = d3.geo.path();

const svg9 = d3.select("#Map").append("svg")
    .attr("width", width2)
    .attr("height", height2);


queue()
    .defer(d3.json, "assets/Data/zips_us_topo.json")
    .await(ready);

let maxNum = 0;
let num = 0;


function ready(error, us) {
    let oldMin = 0;
    let newMax = 80;
    let newMin = 255;

    d3.csv("assets/Data/d3_prepared.csv", function (error, data) {
        if (error) throw error;
        data.forEach(rec => {
            if (impressions[rec.postal_code] === undefined) {
                num = parseInt(rec.impressions);
                impressions[rec.postal_code] = num;
                if (num > maxNum)
                    maxNum = num;

            } else {
                num = impressions[rec.postal_code] + parseInt(rec.impressions);
                impressions[rec.postal_code] = num;
                if (num > maxNum)
                    maxNum = num;
            }
        });
        let imps = Object.values(impressions);
        console.log('total objects are: ' + imps.length);
        imps.sort((a, b) => { return a - b });
        console.log('length is: ' + imps.length);
        let maxImps = imps[imps.length - 1];
        let distance = parseInt(maxImps / 4);
        let colorRangeMax = distance;
        console.log('colorRangeMax is: ' + colorRangeMax);
        for (let i = 1; i <= 4; i++) {
            let colorRangeHtml = ''
            if (i === 1) {
                colorRangeHtml = '<div style="float:left"><span class="color-block" style="background-color:rgb(0,' + newMin + ',0);"></span><h3 class="range-num">0 ... ' + colorRangeMax + '</h3></div>';
            } else {
                colorRangeHtml = '<div style="float:left"><span class="color-block" style="background-color:rgb(0,' + (newMin - (50 * (i - 1))) + ',0);"></span><h3 class="range-num">' + (colorRangeMax + 1) + ' ... ' + (colorRangeMax + distance) + '</h3></div>';
                colorRangeMax = colorRangeMax + distance;
            }

            $('#color-ranges').append(colorRangeHtml);
        }
        let oldRange = (maxNum - oldMin);
        let newRange = (newMax - newMin);
        svg9.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.zip_codes_for_the_usa).features)
            .enter().append("path")
            .attr("class", "zip")
            .attr("data-zip", function (d) { return d.properties.zip; })
            .attr("data-state", function (d) { return d.properties.state; })
            .attr("data-name", function (d) { return d.properties.name; })
            .attr("id", function (d) { return d.properties.zip; })
            .attr("d", path)
            .attr("fill", function (d) {
                if (impressions[d.properties.zip]) {
                    let oldValue = impressions[d.properties.zip];
                    let newValue = (((oldValue - oldMin) * newRange) / oldRange) + newMin;
                    //console.log('oldValue are: ' + oldValue + ' newValue is: ' + newValue);
                    //console.log(oldValue + ',' + newValue);
                    // console.log('new Value is: ' + newValue);
                    //80-255

                    let temp = parseInt(newValue);
                    if (temp === 254) {
                        $("#" + d.properties.zip).css({
                            'fill': 'rgb(0,' + newValue + ',0)'
                        });
                    } else if (temp === 253) {
                        $("#" + d.properties.zip).css({
                            'fill': 'rgb(0,200,0)'
                        });
                    } else if (temp === 252) {
                        $("#" + d.properties.zip).css({
                            'fill': 'rgb(0,150,0)'
                        });
                    } else if (temp === 251) {
                        $("#" + d.properties.zip).css({
                            'fill': 'rgb(0,100,0)'
                        });
                    }
                    /*$("#" + d.properties.zip).css({
                      'fill': 'rgba(0,' + newValue + ',0)'
                    });*/
                }
            })
            .append('span')
            .attr('class','tooltiptext')
            .text((d)=>{
                return d.properties.zip;
            });
        console.log(maxNum);
    });
    /*("#"+d.properties.zip)
       .datum(d) //attach this data for future reference
       .selectAll("path, polygon")
       .datum(d) //attach the data directly to *each* shape
       .attr("fill", colour(22));*/
}