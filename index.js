require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var shorturl_list = []
var shorturl_number = 1

function check_shorturl(input, type='url'){
  for (let i = 0; i < shorturl_list.length; i++){
    if (type == 'url'){
      if (shorturl_list[i]["original_url"]== input){
        return shorturl_list[i]
      }
    }else{
      if (shorturl_list[i]["short_url"] == input){
        return shorturl_list[i]["original_url"]
      }
    }
  }
  return false
}

app.post('/api/shorturl', urlencodedParser, function (req, res) {
  let protocol = "https://"
  let input_url = req.body.url;
  if (input_url.startsWith(protocol)){
    let old_shorturl = check_shorturl(input_url)
    if (old_shorturl == false){
      shorturl_list.push({original_url:input_url, short_url:shorturl_number})
      res.json({ original_url : input_url, short_url : shorturl_number})
      shorturl_number += 1;
    }
    else{
      res.json(old_shorturl)
    }    
  }else{
    res.json({error: 'invalid url'})
  }
})

app.get("/api/shorturl/:shortcode",(req, res) => {
  let user_input = req.params.shortcode;
  let old_shorturl = check_shorturl(user_input, 'short')
  if (old_shorturl !== false){
    return res.redirect(old_shorturl);
  }else{
    res.json({error:"No short URL found for the given input"})
  }
})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
