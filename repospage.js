const request = require("request");
const cheerio = require("cheerio");
const getIssuehtml = require("./issues");
function getrepospagehtml(url,topic){ //full link will be passed here
    request(url,cb);
    function cb(err,response,html){
        if(err){
            console.log(err);
        }
        else if(response.statusCode == 404){
            console.log("Page not found");
        }
        else{
            // console.log(html); // To get the html of all repos of that topic
            getreposlink(html);
        }
    }
    function getreposlink(html){
       let $=cheerio.load(html);
      let headingarr = $(".f3.color-fg-muted.text-normal.lh-condensed");    //to get the headings of the top 8 repo
      console.log(topic); // to get the topic name and then after wards its top 8 repo
      for(let i=0;i<8;i++){
          let twoanchors = $(headingarr[i]).find("a");  //anchor
          let link = $(twoanchors[1]).attr("href");
        //    console.log(link);
        let fulllink = `https://github.com${link}/issues`;  //concatenate ${} for issues page
        let repoName = link.split("/").pop();
        
        getIssuehtml(fulllink , topic,repoName);

      }
      console.log("******************");

      }
      
    }



module.exports = getrepospagehtml;  //we exported that function so that we can use in main.js