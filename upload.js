const dotenv = require('dotenv');
const readline = require('readline');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');

dotenv.config();

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))
}

function baseName(str) {
  let base = new String(str).substring(str.lastIndexOf('/') + 1);
  if (base.lastIndexOf(".") != -1) {
    base = base.substring(0, base.lastIndexOf("."));
  }
  return base;
}

const publicDirPath = './client/public/'

async function doUpload() {
  const videoMeta = {
    title: '',
    filePath: '',
  }

  let ans = await askQuestion("What is the title of the video? ");
  videoMeta.title = ans;

  ans = await askQuestion("What is the absolute path of the video? ");
  videoMeta.filePath = ans;

  const base = baseName(videoMeta.filePath);

  fs.mkdirSync(`${publicDirPath}240`, {recursive: true});
  fs.mkdirSync(`${publicDirPath}480`, {recursive: true});
  fs.mkdirSync(`${publicDirPath}1080`, {recursive: true});
  fs.mkdirSync(`${publicDirPath}4096`, {recursive: true});

  ffmpeg(videoMeta.filePath)
    .output(`${publicDirPath}240/${base}.mp4`)
    .videoCodec('libx264')
    .size('426x240')
    .output(`${publicDirPath}480/${base}.mp4`)
    .videoCodec('libx264')
    .size('848x480')
    .output(`${publicDirPath}1080/${base}.mp4`)
    .videoCodec('libx264')
    .size('1920x1080')
    .output(`${publicDirPath}4096/${base}.mp4`)
    .videoCodec('libx264')
    .size('3840x2160')
    .on('error', function (error) {
      console.log('An error occurred: ' + error.message);
    })
    .on('progress', function (progress) {
      console.log('... frames: ' + progress.frames);
    })
    .on('end', async function () {
      console.log('Finished processing');
      try {
        const response = await axios.post(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/videos`, {title: videoMeta.title, filePath: `${base}.mp4`});
        console.log(`You can watch the video at http://localhost:3000/watch/${response.data.insertId}`);
      } catch (error) {
        console.log('Error creating db entry', error);
      }
    })
    .run();

}

doUpload();