# 导航网站

一个现代化的导航网站，可以帮助您快速访问常用网站。

## 功能特点

- ✨ 现代化的UI设计
- 🔍 实时搜索功能
- 📰 **每日热点新闻** - 自动获取最新新闻资讯
- 🔄 新闻自动刷新 - 每30分钟自动更新
- 📱 响应式设计，支持移动端
- 🎨 精美的卡片式布局
- ⌨️ 键盘快捷键支持

## 快速开始

### 方法一：直接打开（最简单）

直接双击 `index.html` 文件即可在浏览器中打开。

### 方法二：使用Python内置服务器

1. 打开终端/命令提示符
2. 进入项目目录
3. 运行以下命令：

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

然后在浏览器中访问：`http://localhost:8000`

### 方法三：使用Node.js的http-server

1. 安装 http-server（如果还没有安装）：
```bash
npm install -g http-server
```

2. 在项目目录运行：
```bash
http-server
```

3. 在浏览器中访问显示的地址（通常是 `http://localhost:8080`）

## 键盘快捷键

- `Ctrl/Cmd + K`: 聚焦搜索框
- `ESC`: 清空搜索并失去焦点

## 自定义

### 添加新网站

编辑 `index.html` 文件，在相应的分类下添加新的链接卡片：

```html
<a href="https://example.com" target="_blank" class="link-card" data-name="示例网站">
    <div class="link-icon">🔗</div>
    <div class="link-name">示例网站</div>
</a>
```

### 添加新分类

在 `index.html` 的 `<main>` 标签内添加新的分类区块：

```html
<div class="category" data-category="新分类名称">
    <h2>📁 新分类</h2>
    <div class="links-grid">
        <!-- 链接卡片 -->
    </div>
</div>
```

### 修改样式

编辑 `style.css` 文件来自定义颜色、字体、布局等。

### 配置新闻源

新闻功能默认会尝试从多个RSS源获取实时新闻。如果API不可用，会自动显示示例新闻数据。

要自定义新闻源，编辑 `script.js` 文件中的 `NEWS_SOURCES` 数组：

```javascript
const NEWS_SOURCES = [
    {
        name: '新闻源名称',
        url: 'RSS源的URL',
        maxItems: 6  // 最大新闻数量
    }
];
```

**可用的新闻RSS源示例：**
- BBC News: `https://feeds.bbci.co.uk/news/rss.xml`
- CNN: `http://rss.cnn.com/rss/edition.rss`
- 新浪新闻: `http://news.sina.com.cn/roll/`
- 腾讯新闻: `https://news.qq.com/`

**注意：** 由于浏览器的CORS限制，某些RSS源可能无法直接访问。如果遇到问题，网站会自动使用示例新闻数据。

## 文件结构

```
.
├── index.html      # 主页面（包含导航链接和新闻区域）
├── style.css       # 样式文件（包含新闻卡片样式）
├── script.js       # JavaScript逻辑（包含搜索和新闻获取功能）
└── README.md       # 说明文档
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

