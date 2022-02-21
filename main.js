let url = "https://github.com/topics";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const pdfkit = require("pdfkit");
request(url, cb);
function cb(err, response, html) {
    if (err) {
        console.log(err);
    }
    else if (response.statusCode == 404) {
        console.log("Page not found");
    }
    else {
        // console.log(html);   //To check whethr we got the html from the server or not
        getTopicLinks(html);
    }

}
function getTopicLinks(html) {
    let $ = cheerio.load(html);
    let linksElemArr = $(".no-underline.d-flex.flex-column.flex-justify-center");
    for (let i = 0; i < linksElemArr.length; i++) {
        let href = $(linksElemArr[i]).attr("href"); //link attribute
        // console.log(href);
        let topic = href.split("/").pop();
        let fulllink = `https://github.com/${href}`; // concatenate ${}
        // console.log(fulllink);
        getrepospagehtml(fulllink, topic);
    }
}

function getrepospagehtml(url, topic) { //full link will be passed here
    request(url, cb);
    function cb(err, response, html) {
        if (err) {
            console.log(err);
        }
        else if (response.statusCode == 404) {
            console.log("Page not found");
        }
        else {
            // console.log(html); // To get the html of all repos of that topic
            getreposlink(html);
        }
    }
    function getreposlink(html) {
        let $ = cheerio.load(html);
        let headingarr = $(".f3.color-fg-muted.text-normal.lh-condensed");    //to get the headings of the top 8 repo
        console.log(topic); // to get the topic name and then after wards its top 8 repo
        for (let i = 0; i < 10; i++) {
            let twoanchors = $(headingarr[i]).find("a");  //anchor
            let link = $(twoanchors[1]).attr("href");
            //    console.log(link);
            let fulllink = `https://github.com${link}/issues`;  //concatenate ${} for issues page
            let repoName = link.split("/").pop();

            getIssuehtml(fulllink, topic, repoName);

        }
        console.log("******************");

    }

}

function getIssuehtml(url, topic, repoName) { //full link will be passed here
    request(url, cb);
    function cb(err, response, html) {
        if (err) {
            console.log(err);
        }
        else if (response.statusCode == 404) {
            console.log("Page not found");
        }
        else {
            // console.log(html); // To get the html of all repos of that topic
            // getreposlink(html);
            // console.log(html);
            getissues(html);
        }
    }
    function getissues(html) {
        let $ = cheerio.load(html);
        let issueselemArr = $(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
        let arr = [];   //to fill the array with issues
        for (let i = 0; i < issueselemArr.length; i++) {
            let link = $(issueselemArr[i]).attr("href");
            // console.log(link);
            arr.push(link);
        }
        // console.log(topic,"       ",arr );
        let folderpath = path.join(__dirname, topic);    // topic name folder created
        dircreator(folderpath);
        let filepath = path.join(folderpath, repoName + " .pdf");
        let text = JSON.stringify(arr);
        let pdfDoc = new pdfkit();  //object
        pdfDoc.pipe(fs.createWriteStream(filepath));
        pdfDoc.text(text);
        pdfDoc.end();
        // fs.writeFileSync(filepath,);

    }
}

function dircreator(folderpath) {
    if (fs.existsSync(folderpath) == false) // to check if folder path exists,if not then create one
    {
        fs.mkdirSync(folderpath);
    }
}

