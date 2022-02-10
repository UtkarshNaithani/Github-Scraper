const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const pdfkit = require("pdfkit"); 
function getIssuehtml(url,topic,repoName){ //full link will be passed here
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
            // getreposlink(html);
            // console.log(html);
            getissues(html);
        }
    }
    function getissues(html){
        let $ = cheerio.load(html);
        let issueselemArr = $(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
        let arr = [];   //to fill the array with issues
        for(let i=0;i<issueselemArr.length;i++){
            let link = $(issueselemArr[i]).attr("href");
            // console.log(link);
            arr.push(link);
        }
        // console.log(topic,"       ",arr );
        let folderpath = path.join(__dirname,topic);    // topic name folder created
        dircreator(folderpath);
        let filepath = path.join(folderpath,repoName + " .pdf");
        let text = JSON.stringify(arr);
        let pdfDoc = new pdfkit();  //object
        pdfDoc.pipe(fs.createWriteStream(filepath));
        pdfDoc.text(text);
        pdfDoc.end();
        // fs.writeFileSync(filepath,);

    }
}
module.exports = getIssuehtml;
function dircreator(folderpath){
    if(fs.existsSync(folderpath)==false) // to check if folder path exists,if not then create one
    {
        fs.mkdirSync(folderpath);
    }
}