function getPlot(id) {
    d3.json("Data/samples.json").then((data)=> {  
        
        var samples = data.samples.filter(d => d.id.toString() === id)[0];
        
        var result = data.metadata.filter(meta => meta.id.toString() === id)[0];;
  
        var values = samples.sample_values.slice(0, 10).reverse();
  
        var otuID = (samples.otu_ids.slice(0, 10)).reverse().map(d => "OTU " + d);
    
        var labels = samples.otu_labels.slice(0, 10);
  
        var trace = {
            x: values,
            y: otuID,
            text: labels,
            width: .75,
            marker: {
              color: 'rgb(26, 128, 201)'},
            type:"bar",
            orientation: "h",
        };
  
        var bar_data = [trace];
  
        var bar_layout = {
            yaxis:{
                tickmode:"auto",
            },
            height: 550
        };
  
        Plotly.newPlot("bar", bar_data, bar_layout);
        
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
            },
            text: samples.otu_labels
  
        };
  
        var bubble_layout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1200
        };
  
        var bubble_data = [trace1];
  
        Plotly.newPlot("bubble", bubble_data, bubble_layout); 
  
        
        var gauge_data = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: result.wfreq, 
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   bar: { color: "rgb(61, 209, 194)" },
                   steps: [
                    { range: [0, 2], color: "rgb(250, 244, 222)" },
                    { range: [2, 4], color: "rgb(250, 232, 167)" },
                    { range: [4, 6], color: "rgb(252, 223, 119)" },
                    { range: [6, 8], color: "rgb(252, 212, 68)" },
                    { range: [8, 9], color: "rgb(227, 178, 2)" },
                  ]}
              
          }
        ];
        var gauge_layout = { 
            width: 600, 
            height: 600, 
          };
        Plotly.newPlot("gauge", gauge_data, gauge_layout);
      });
  }  

  function getInfo(id) {
    d3.json("Data/samples.json").then((data)=> {
        
        var metadata = data.metadata;

        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        var demographicInfo = d3.select("#sample-metadata");
        
        demographicInfo.html("");

        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0] + ": " + key[1] + "\n");    
        });
    });
}

function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

function init() {
    var dropdown = d3.select("#selDataset");

    d3.json("Data/samples.json").then((data)=> {

        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();