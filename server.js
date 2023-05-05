const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    req.url = '/repo';
  }
  
  const filesDir = path.join(__dirname, req.url);
  
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found');
      return;
    }
    
    let fileLinks = '';
    
    files.forEach((fileName) => {
      const filePath = `${req.url}/${fileName}`;
      
      const fileStats = fs.statSync(path.join(filesDir, fileName));
      const fileSizeInBytes = fileStats.size;
      
      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
      let fileSizeInMB = fileSizeInBytes / (1024 * 1024);
      let i = 0;
      
      while (fileSizeInMB >= 1024 && i < units.length - 1) {
        fileSizeInMB /= 1024;
        i++;
      }
      
      fileSizeInMB = fileSizeInMB.toFixed(2) + ' ' + units[i];
      const fileSizeText = fileSizeInBytes < 1024 * 1024 * 1024 ? fileSizeInMB : '-';
      
      const fileExtension = path.extname(fileName).toLowerCase();
      const fileIcon = getFileIcon(fileExtension);
      
      fileLinks += `<li><span class="icon">${fileIcon}</span><a href="${filePath}" class="name">${fileName}</a><span class="size">${fileSizeText}</span></li>`;
    });
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Files</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              color: #333;
              background-color: #f5f5f5;
            }
            
            h1 {
              margin-top: 50px;
              margin-bottom: 20px;
              text-align: center;
              font-size: 32px;
              color: #333;
            }
            
            ul {
              list-style: none;
              margin: 0;
              padding: 0;
            }
            
            li {
              padding: 10px 20px;
              background-color: #fff;
              border-bottom: 1px solid #ddd;
              display: flex;
              align-items: center;
            }
            
            li:last-child {
              border-bottom: none;
            }
            
            li:hover {
              background-color: #f9f9f9;
            }
            
            .icon {
              margin-right: 10px;
            }
            
            .name {
              flex-grow: 1;
            }
            
            .size {
              margin-left: 20px;
              font-size: 14px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <h1>Files</h1>
          <ul>
            ${fileLinks}
          </ul>
        </body>
      </html>`);
    res.end();
  });
});

function getFileIcon(extension) {
  switch (extension) {
    case '.txt':
      return '<i class="far fa
