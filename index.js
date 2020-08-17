const AWS = require('aws-sdk');
const fs = require('fs'); 
const Jimp = require("jimp");

var base64stro;
exports.handler = (event, context_received, callback_received) => {
    
console.log('event -------- '+ event );
	const body = JSON.parse(event.body);
	//console.log('base64str -------- '+ body.base64str );
	var base64str=body.base64str;
	var buffer = new Buffer(base64str.toString(), 'base64');
	
	
	
	Jimp.read(buffer, async function(err, image) {
    if (err) {
        console.error(err);
        // TODO handle error
    }

image.brightness(0.20);          // adjust the brighness by a value -1 to +1
image.contrast(0.20);
//image.invert();

  await image.invert().getBase64(Jimp.MIME_JPEG, function (err, src) {
  base64stro = src;
  var base64strArr=base64stro.split(',');
  console.log(base64strArr[1]);
  var base64stroEle=base64strArr[1];
  base64stro  = base64stroEle.replace(/\+/g, '-').replace(/\//g, '_');
      })
	  
  console.log("Edited Image-----" + base64stro);
  callback_received(null, {
      statusCode: 201,
      body: JSON.stringify({
        data: base64stro,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
	
});
   
   
};

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
};