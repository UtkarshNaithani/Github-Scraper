let url = "https://github.com/topics";
const request = require("request");
const cheerio = require("cheerio");
const getrepospagehtml = require("./repospage");//Your module
request(url,cb);
function cb(err,response,html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("Page not found");
    }
    else{
        // console.log(html);   //To check whethr we got the html from the server or not
        getTopicLinks(html);
    }

}
function getTopicLinks(html){
    let $ = cheerio.load(html);
    let linksElemArr = $(".no-underline.d-flex.flex-column.flex-justify-center");
    for(let i=0;i<linksElemArr.length;i++){
    let href = $(linksElemArr[i]).attr("href"); //link attribute
    // console.log(href);
    let topic = href.split("/").pop(); 
    let fulllink = `https://github.com/${href}`; // concatenate ${}
    // console.log(fulllink);
    getrepospagehtml(fulllink,topic);
    }
}
