const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// 首先添加CORS支持（中间件必须放在路由前）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

// 然后再配置静态文件服务
const IMG_DIR = path.join(__dirname, 'img');
app.use('/img', express.static(IMG_DIR));
app.use(express.static(__dirname)); // 添加这一行，允许访问 index.html

// 获取图片和视频列表
// 添加了CORS支持
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

// 改进了媒体文件获取功能
app.get('/media-list', (req, res) => {
    fs.readdir(IMG_DIR, (err, files) => {
        if (err) {
            console.error('读取文件失败:', err);
            return res.status(500).json({ error: '读取文件失败: ' + err.message });
        }
        // 使用更完善的正则表达式匹配更多文件格式
        const images = files.filter(f => /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(f));
        const videos = files.filter(f => /\.(mp4|webm|ogg|avi|mov|mkv)$/i.test(f));
        console.log('找到的图片:', images);
        console.log('找到的视频:', videos);
        res.json({ images, videos });
    });
});

console.log('IMG_DIR:', IMG_DIR);

app.listen(3000, () => {
    console.log('服务器已启动，端口 3000');
});