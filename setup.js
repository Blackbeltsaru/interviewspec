const readline = require('readline');
const fs = require('fs');

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

function isYes(text) {
  return text.toLowerCase() === 'y' || text.toLowerCase === 'yes';
}

async function doSetup() {
  let ans = await askQuestion("Is ffmpeg installed? (y/n): ");
  if (!isYes(ans)) {
    console.log('Please install ffmpeg');
    return;
  }

  ans = await askQuestion("Is MySQL installed? (y/n): ");
  if (!isYes(ans)) {
    console.log('Please install ffmpeg');
  }

  ans = await askQuestion("Have you run dbAlters.sql? (y/n): ");
  if (!isYes(ans)) {
    console.log('Please run dbAlters.sql on your SQL instance');
  }

  const envParams = {
    dbhost: 'localhost',
    user: 'root',
    password: null,
    db: 'video_player_db',
    serverhost: 'localhost',
    serverport: '3001',
    
  }

  ans = await askQuestion("Enter DB_HOST: (localhost)? ");
  if (ans) envParams.dbhost = ans;

  ans = await askQuestion("Enter DB_USER: (root)? ");
  if (ans) envParams.user = ans;

  ans = await askQuestion("Enter DB_PASSWORD: ");
  envParams.password = ans;

  ans = await askQuestion("Enter DB name: (video_player_db)? ");
  if (ans) envParams.db = ans;
  
  ans = await askQuestion("Enter Server Host: (localhost)? ");
  if (ans) envParams.serverhost = ans;

  ans = await askQuestion("Enter Server Port: (3001)? ");
  if (ans) envParams.serverport = ans;

  fs.writeFile('./server/.env', 
  `DB_HOST=${envParams.dbhost}\nDB_USER=${envParams.user}\nDB_PASSWORD=${envParams.password}\nDB=${envParams.db}\nSERVER_PORT=${envParams.serverport}`, (err, data) => {
      if (err) return console.log(err);
  });

  fs.writeFile('./client/.env', 
  `REACT_APP_SERVER_HOST=${envParams.serverhost}\nREACT_APP_SERVER_PORT=${envParams.serverport}`, (err, data) => {
      if (err) return console.log(err);
  });

  
  fs.writeFile('./.env', 
  `SERVER_HOST=${envParams.serverhost}\nSERVER_PORT=${envParams.serverport}`, (err, data) => {
      if (err) return console.log(err);
  })

  console.log('Run "npm install" from server directory');
  console.log('Run "npm run start" from server directory');
  console.log('Run "npm install" from client directory');
  console.log('Run "npm run start" from client directory');
  console.log('Run "npm install" from this directory');
  console.log('Run "npm run start" from this directory');
}

doSetup();