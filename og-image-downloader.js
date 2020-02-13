const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const readline = require("readline");
const lines = [];
const urlList = [];
const stream = fs.createReadStream("./list.txt", "utf-8");
const reader = readline.createInterface({ input: stream });

var c = 1;

const readFile = function() {
    var i, a = 0;

    reader.on('line', function(line) {
        lines[i] = line;
        // find lines starts with 'http'
        if (lines[i].startsWith('http')) {
            console.log('url No.'+(a+1)+':' + line);
            downloadImages(line, a);
            a++;
        }

        i++;

    });
    reader.on('close', function() {
        console.log("end of reading");
    });

};

const downloadImages = function(url, a) {

    //ヘッダーを定義
    var headers = {
        'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Mobile Safari/537.36'
    }

    //オプションを定義
    var options = {
        url: url,
        method: 'GET',
        headers: headers,
    }

    //リクエスト送信
    request(options, function(error, response, body) {
        //コールバックで色々な処理
        if (error || !body) {
            return;
        }

        const $ = cheerio.load(body);

        // set ogp image url
        if($("meta[property='og:image']").attr("content")) {
            var imgurl2 = $("meta[property='og:image']").attr("content");
        }

        // download it
        if (imgurl2) {
            console.log('download: '+(a+1) + ".jpg\nfrom: " + imgurl2);

            a++;
            if (a < 10) {
                var filename = "./img/0" + a + ".jpg";
            } else {
                var filename = "./img/" + a + ".jpg";
            }

            if (imgurl2.endsWith("png")) {
                filename = filename.slice(0, -4);
                filename += ".png"

            }

            request(imgurl2).pipe(fs.createWriteStream(filename));
            c++;
        }

    })


};

readFile();
