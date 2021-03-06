const request = require('request');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

const url = 'http://news.naver.com/main/main.nhn?mode=LSD&mid=shm&sid1=105';
const iconv = require('iconv-lite');

const date = new Date(); // 날짜

let title;
const arrayTitle = [];

function sendMail(arHeadline) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'bgdonghwi@gmail.com',
      pass: 'password',
    },
  });

    // setup email data with unicode symbols
  const mailOptions = {
    from: 'bgdonghwi@gmail.com', // sender address
    to: 'rkdehdgnl0328@gmail.com', // list of receivers
    subject: `${date.toLocaleDateString()} Today News`, // Subject line
    // html body
    html: `${`<h1>IT/과학 실시간 뉴스 헤드라인</h1><h2>${arHeadline}</h2><br/>
    <a href="http://www.infopub.co.kr">` +
        '<img src="http://www.infopub.co.kr/pdspool/common/main_top/2016-11-02.jpg"/></p></a>'}`
    ,
  };

    // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Message sent: ${info.response}`);
    }
    transporter.close();
  });
}

const parse = (decodedResult) => {
  const $ = cheerio.load(decodedResult);
  const titles = $('div.cluster_head').find('h2');

  for (let i = 0; i < titles.length; i += 1) {
    title = $(titles[i]).text();
    arrayTitle[i] = title.trim();
  }
  return arrayTitle;
};

request({
  uri: url,
  method: 'GET',
  encoding: null,
}, (err, res, body) => {
  const decodedResult = iconv.decode(body, 'euc-kr');
  const arTitles = parse(decodedResult);
  sendMail(arTitles);
});

