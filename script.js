// 超时信号辅助函数（用于不支持AbortSignal.timeout的浏览器）
function createTimeoutSignal(timeout) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller.signal;
}

// 主题切换功能
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
const body = document.body;

// 从localStorage读取主题设置
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// 初始化主题
function initTheme() {
    if (isDarkMode) {
        body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
        themeText.textContent = '白天模式';
    } else {
        body.classList.remove('dark-mode');
        themeIcon.textContent = '🌙';
        themeText.textContent = '夜间模式';
    }
}

// 切换主题
function toggleTheme() {
    isDarkMode = !isDarkMode;
    body.classList.toggle('dark-mode');
    
    if (isDarkMode) {
        themeIcon.textContent = '☀️';
        themeText.textContent = '白天模式';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = '夜间模式';
    }
    
    // 保存到localStorage
    localStorage.setItem('darkMode', isDarkMode.toString());
}

// 主题切换按钮事件
themeToggle.addEventListener('click', toggleTheme);

// 搜索功能
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchEngineBtn = document.getElementById('searchEngineBtn');
const searchEngineMenu = document.getElementById('searchEngineMenu');
const engineIcon = document.getElementById('engineIcon');
const engineText = document.getElementById('engineText');
const categories = document.querySelectorAll('.category');
const linkCards = document.querySelectorAll('.link-card');

// 当前选择的搜索引擎
let currentEngine = 'site';

// 搜索引擎配置
const searchEngines = {
    site: {
        name: '站内',
        icon: '🔍',
        action: performSiteSearch
    },
    baidu: {
        name: '百度',
        icon: 'B',
        url: 'https://www.baidu.com/s?wd='
    },
    google: {
        name: 'Google',
        icon: 'G',
        url: 'https://www.google.com/search?q='
    },
    bing: {
        name: 'Bing',
        icon: 'B',
        url: 'https://www.bing.com/search?q='
    },
    sogou: {
        name: '搜狗',
        icon: '搜',
        url: 'https://www.sogou.com/web?query='
    }
};

// 动态背景壁纸
function loadDynamicBackground() {
    const bgElement = document.getElementById('dynamicBackground');
    
    // 使用Unsplash API获取高质量壁纸
    // 主题：nature, technology, space, abstract等
    const categories = ['nature', 'technology', 'space', 'abstract', 'minimalist', 'architecture'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // 使用Unsplash Source（无需API密钥的简单方式）
    const imageUrl = `https://source.unsplash.com/1920x1080/?${randomCategory},wallpaper,4k`;
    
    const img = new Image();
    img.onload = function() {
        bgElement.style.backgroundImage = `url(${imageUrl})`;
        bgElement.classList.add('loaded');
    };
    img.onerror = function() {
        // 如果加载失败，使用备用壁纸
        const fallbackUrls = [
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920',
            'https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=1920',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920'
        ];
        const fallbackUrl = fallbackUrls[Math.floor(Math.random() * fallbackUrls.length)];
        bgElement.style.backgroundImage = `url(${fallbackUrl})`;
        bgElement.classList.add('loaded');
    };
    img.src = imageUrl;
}

// 站内搜索
function performSiteSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
        // 显示所有
        categories.forEach(category => {
            category.classList.remove('hidden');
            category.querySelectorAll('.link-card').forEach(card => {
                card.classList.remove('hidden');
            });
        });
        return;
    }
    
    // 搜索过滤
    categories.forEach(category => {
        let hasVisibleLinks = false;
        const links = category.querySelectorAll('.link-card');
        
        links.forEach(card => {
            const linkName = card.getAttribute('data-name').toLowerCase();
            const categoryName = category.getAttribute('data-category').toLowerCase();
            
            if (linkName.includes(searchTerm) || categoryName.includes(searchTerm)) {
                card.classList.remove('hidden');
                hasVisibleLinks = true;
            } else {
                card.classList.add('hidden');
            }
        });
        
        // 如果有可见的链接，显示分类；否则隐藏分类
        if (hasVisibleLinks) {
            category.classList.remove('hidden');
        } else {
            category.classList.add('hidden');
        }
    });
    
    // 滚动到第一个可见的分类
    scrollToFirstVisible();
}

// 站外搜索
function performExternalSearch(query) {
    const engine = searchEngines[currentEngine];
    if (engine && engine.url) {
        const searchUrl = engine.url + encodeURIComponent(query);
        window.open(searchUrl, '_blank');
    }
}

// 执行搜索
function executeSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    if (currentEngine === 'site') {
        performSiteSearch(query);
    } else {
        performExternalSearch(query);
    }
}

// 切换搜索引擎
function switchSearchEngine(engine) {
    currentEngine = engine;
    const engineConfig = searchEngines[engine];
    
    if (engineConfig) {
        engineIcon.textContent = engineConfig.icon;
        engineText.textContent = engineConfig.name;
        searchEngineBtn.setAttribute('data-engine', engine);
        
        // 更新选项状态
        document.querySelectorAll('.engine-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-engine') === engine) {
                option.classList.add('active');
            }
        });
        
        // 更新输入框提示
        if (engine === 'site') {
            searchInput.placeholder = '搜索网站或输入关键词搜索...';
        } else {
            searchInput.placeholder = `在${engineConfig.name}中搜索...`;
        }
    }
    
    // 关闭菜单
    searchEngineMenu.classList.remove('show');
}

// 搜索输入框事件
searchInput.addEventListener('input', function(e) {
    // 只有在站内搜索模式下才实时过滤
    if (currentEngine === 'site') {
        performSiteSearch(e.target.value);
    }
});

// 搜索按钮点击
searchBtn.addEventListener('click', executeSearch);

// 回车键搜索
searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
    }
});

// 搜索引擎选择器事件
searchEngineBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    searchEngineBtn.classList.toggle('active');
    searchEngineMenu.classList.toggle('show');
});

// 选择搜索引擎
document.querySelectorAll('.engine-option').forEach(option => {
    option.addEventListener('click', function() {
        const engine = this.getAttribute('data-engine');
        switchSearchEngine(engine);
    });
});

// 点击外部关闭菜单
document.addEventListener('click', function(e) {
    if (!searchEngineBtn.contains(e.target) && !searchEngineMenu.contains(e.target)) {
        searchEngineMenu.classList.remove('show');
        searchEngineBtn.classList.remove('active');
    }
});

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    
    // ESC 清空搜索
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
    }
});

// 添加点击外部关闭搜索结果的动画效果
document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target)) {
        // 可以在这里添加额外的交互逻辑
    }
});

// 平滑滚动到搜索结果
function scrollToFirstVisible() {
    const firstVisible = document.querySelector('.category:not(.hidden)');
    if (firstVisible) {
        firstVisible.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 从URL中提取域名
function getDomainFromUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace(/^www\./, '');
    } catch (e) {
        // 如果不是完整URL，尝试直接使用
        return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    }
}

// 获取网站的favicon URL
function getFaviconUrl(url) {
    const domain = getDomainFromUrl(url);
    // 使用Google的favicon服务
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

// 为所有链接设置favicon
function setAllFavicons() {
    const linkCards = document.querySelectorAll('.link-card[href]');
    linkCards.forEach(card => {
        const href = card.getAttribute('href');
        if (href) {
            const iconDiv = card.querySelector('.link-icon');
            if (iconDiv) {
                // 检查是否已经有img标签
                let img = iconDiv.querySelector('img');
                
                // 如果没有img标签，创建一个
                if (!img) {
                    img = document.createElement('img');
                    img.alt = card.getAttribute('data-name') || '';
                    const originalContent = iconDiv.innerHTML.trim();
                    iconDiv.innerHTML = '';
                    iconDiv.appendChild(img);
                }
                
                // 设置favicon URL
                img.src = getFaviconUrl(href);
                
                // 如果加载失败，使用备用方案
                img.onerror = function() {
                    // 尝试直接访问网站的favicon
                    const domain = getDomainFromUrl(href);
                    this.src = `https://${domain}/favicon.ico`;
                    this.onerror = function() {
                        // 如果还是失败，尝试另一个备用favicon服务
                        this.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
                        this.onerror = function() {
                            // 最后备用：显示默认链接图标
                            iconDiv.innerHTML = '🔗';
                            iconDiv.style.fontSize = '2rem';
                        };
                    };
                };
            }
        }
    });
}

// 页面加载完成后设置所有favicon
// 如果DOMContentLoaded已经触发，立即执行；否则等待
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initTheme(); // 初始化主题
        setAllFavicons();
        loadDynamicBackground();
    });
} else {
    // DOM已经加载完成，立即执行
    initTheme(); // 初始化主题
    setAllFavicons();
    loadDynamicBackground();
    fetchWeiboHot(); // 初始化微博热搜
    fetchBaiduHot(); // 初始化百度热搜
}

// 每30分钟更换一次背景
setInterval(loadDynamicBackground, 30 * 60 * 1000);


// 宠物猫拖动功能
const petCat = document.getElementById('petCat');
let isDragging = false;
let currentX = 0;
let currentY = 0;
let initialX = 0;
let initialY = 0;

// 鼠标按下
petCat.addEventListener('mousedown', dragStart);

// 触摸事件支持（移动端）
petCat.addEventListener('touchstart', dragStart, { passive: false });

function dragStart(e) {
    if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - currentX;
        initialY = e.touches[0].clientY - currentY;
    } else {
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
    }

    if (e.target.closest('.pet-cat')) {
        isDragging = true;
        petCat.classList.add('dragging');
        
        // 阻止默认行为
        e.preventDefault();
        
        // 鼠标移动
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        
        // 鼠标释放
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }
}

function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
    } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
    }
    
    // 限制在屏幕范围内
    const maxX = window.innerWidth - petCat.offsetWidth;
    const maxY = window.innerHeight - petCat.offsetHeight;
    
    currentX = Math.max(0, Math.min(currentX, maxX));
    currentY = Math.max(0, Math.min(currentY, maxY));
    
    setTranslate(currentX, currentY, petCat);
}

function dragEnd() {
    isDragging = false;
    petCat.classList.remove('dragging');
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', dragEnd);
    
    // 添加一个小幅弹跳效果
    setTimeout(() => {
        petCat.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
            petCat.style.transition = '';
        }, 300);
    }, 100);
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

// 初始化位置（右下角）
function initPetCatPosition() {
    const maxX = window.innerWidth - petCat.offsetWidth;
    const maxY = window.innerHeight - petCat.offsetHeight;
    currentX = maxX;
    currentY = maxY;
    setTranslate(currentX, currentY, petCat);
}

// 窗口大小改变时调整位置
window.addEventListener('resize', () => {
    if (!isDragging) {
        const maxX = window.innerWidth - petCat.offsetWidth;
        const maxY = window.innerHeight - petCat.offsetHeight;
        currentX = Math.min(currentX, maxX);
        currentY = Math.min(currentY, maxY);
        setTranslate(currentX, currentY, petCat);
    }
});

// 猫的眼睛跟随鼠标
document.addEventListener('mousemove', (e) => {
    if (isDragging) return;
    
    const catRect = petCat.getBoundingClientRect();
    const catCenterX = catRect.left + catRect.width / 2;
    const catCenterY = catRect.top + catRect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const angle = Math.atan2(mouseY - catCenterY, mouseX - catCenterX);
    const distance = Math.min(30, Math.sqrt(Math.pow(mouseX - catCenterX, 2) + Math.pow(mouseY - catCenterY, 2)));
    
    const pupilX = Math.cos(angle) * Math.min(2, distance / 15);
    const pupilY = Math.sin(angle) * Math.min(1, distance / 15);
    
    const pupils = petCat.querySelectorAll('.cat-pupil');
    pupils.forEach(pupil => {
        pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
    });
});

// 页面加载完成后初始化宠物猫位置
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPetCatPosition);
} else {
    initPetCatPosition();
}

// 音乐播放器功能
const musicPlayer = document.getElementById('musicPlayer');
const musicFloatBtn = document.getElementById('musicFloatBtn');
const musicToggle = document.getElementById('musicToggle');
const musicMinimize = document.getElementById('musicMinimize');
const musicTitle = document.getElementById('musicTitle');
const toggleIcon = document.getElementById('toggleIcon');

let isMusicPlaying = false;
let isMinimized = false;
let ap = null; // APlayer实例

// 初始化音乐播放器
function initMusicPlayer() {
    // 等待MetingJS脚本加载完成
    const checkMetingJS = setInterval(() => {
        if (window.MetingJSElement || document.querySelector('.aplayer')) {
            clearInterval(checkMetingJS);
            
            setTimeout(() => {
                try {
                    // 查找APlayer实例
                    const aplayerEl = document.querySelector('.aplayer');
                    if (aplayerEl) {
                        // MetingJS会将APlayer实例存储在元素的data属性或全局变量中
                        // 尝试多种方式获取实例
                        if (window.APlayer && window.APlayer.instances && window.APlayer.instances.length > 0) {
                            ap = window.APlayer.instances[0];
                        } else if (aplayerEl.aplayer) {
                            ap = aplayerEl.aplayer;
                        } else if (window.aplayers && window.aplayers.length > 0) {
                            ap = window.aplayers[0];
                        }
                        
                        if (ap) {
                            console.log('音乐播放器初始化成功');
                            // 监听播放事件
                            ap.on('play', () => {
                                isMusicPlaying = true;
                                updateMusicStatus();
                            });
                            ap.on('pause', () => {
                                isMusicPlaying = false;
                                updateMusicStatus();
                            });
                            ap.on('loadstart', () => {
                                updateMusicStatus();
                            });
                            
                            updateMusicStatus();
                            
                            // 尝试自动播放
                            setTimeout(() => {
                                try {
                                    if (ap && ap.audio) {
                                        ap.play();
                                    }
                                } catch (e) {
                                    console.log('自动播放被浏览器阻止，需要用户交互');
                                }
                            }, 500);
                        } else {
                            console.log('未找到APlayer实例，使用备用方案');
                            initFallbackPlayer();
                        }
                    } else {
                        console.log('未找到播放器元素，使用备用方案');
                        initFallbackPlayer();
                    }
                } catch (error) {
                    console.error('音乐播放器初始化错误:', error);
                    initFallbackPlayer();
                }
            }, 500);
        }
    }, 100);
    
    // 如果10秒后还没加载完成，使用备用方案
    setTimeout(() => {
        clearInterval(checkMetingJS);
        if (!ap && !document.getElementById('neteaseMusicFallback')) {
            console.log('MetingJS加载超时，使用备用方案');
            initFallbackPlayer();
        }
    }, 10000);
}

// 备用播放器方案（使用iframe）
function initFallbackPlayer() {
    const musicPlayerBody = document.getElementById('musicPlayerBody');
    musicPlayerBody.innerHTML = `
        <iframe 
            id="neteaseMusicFallback"
            frameborder="no" 
            border="0" 
            marginwidth="0" 
            marginheight="0" 
            width="100%" 
            height="90"
            src="https://music.163.com/outchain/player?type=0&id=3778678&auto=1&height=90">
        </iframe>
    `;
    
    const iframe = document.getElementById('neteaseMusicFallback');
    iframe.addEventListener('load', function() {
        isMusicPlaying = true;
        updateMusicStatus();
    });
}

// 更新音乐播放状态
function updateMusicStatus() {
    if (ap && ap.audio && ap.audio.currentTime > 0) {
        isMusicPlaying = !ap.audio.paused;
    }
    
    if (isMusicPlaying) {
        toggleIcon.textContent = '⏸️';
        if (ap && ap.list && ap.list.audios && ap.list.audios.length > 0) {
            const currentMusic = ap.list.audios[ap.list.index];
            musicTitle.textContent = `正在播放：${currentMusic.name}`;
        } else {
            musicTitle.textContent = '正在播放：网易云音乐';
        }
    } else {
        toggleIcon.textContent = '▶️';
        musicTitle.textContent = '网易云音乐';
    }
}

// 切换播放/暂停
musicToggle.addEventListener('click', function() {
    if (ap) {
        if (ap.audio.paused) {
            ap.play();
            isMusicPlaying = true;
        } else {
            ap.pause();
            isMusicPlaying = false;
        }
    } else {
        // 如果没有APlayer实例，尝试通过iframe控制
        const iframe = document.getElementById('neteaseMusicFallback');
        if (iframe) {
            // iframe内的播放控制需要用户交互，这里只是切换状态
            isMusicPlaying = !isMusicPlaying;
        }
    }
    updateMusicStatus();
});

// 定期检查播放状态和更新歌曲信息
setInterval(() => {
    if (ap && ap.audio) {
        const wasPlaying = isMusicPlaying;
        isMusicPlaying = !ap.audio.paused;
        if (wasPlaying !== isMusicPlaying) {
            updateMusicStatus();
        }
        
        // 更新当前播放的歌曲名称
        if (isMusicPlaying && ap.list && ap.list.audios && ap.list.audios.length > 0) {
            try {
                const currentMusic = ap.list.audios[ap.list.index];
                if (currentMusic && currentMusic.name) {
                    const titleText = `正在播放：${currentMusic.name}`;
                    if (musicTitle.textContent !== titleText) {
                        musicTitle.textContent = titleText;
                    }
                }
            } catch (e) {
                // 忽略错误
            }
        }
    }
}, 1000);

// 最小化/展开
musicMinimize.addEventListener('click', function() {
    isMinimized = !isMinimized;
    if (isMinimized) {
        musicPlayer.classList.add('minimized');
        musicFloatBtn.classList.add('show');
    } else {
        musicPlayer.classList.remove('minimized');
        musicFloatBtn.classList.remove('show');
    }
});

// 浮动按钮点击展开播放器
musicFloatBtn.addEventListener('click', function() {
    musicPlayer.classList.remove('hidden', 'minimized');
    musicFloatBtn.classList.remove('show');
    isMinimized = false;
});

// 拖动功能（简化版，主要是防止与页面其他元素冲突）
let isDraggingMusic = false;
let musicCurrentX = 0;
let musicCurrentY = 0;
let musicInitialX = 0;
let musicInitialY = 0;

musicPlayer.querySelector('.music-player-header').addEventListener('mousedown', function(e) {
    if (e.target.closest('.music-toggle') || e.target.closest('.music-minimize')) {
        return;
    }
    isDraggingMusic = true;
    const rect = musicPlayer.getBoundingClientRect();
    musicInitialX = e.clientX - rect.left;
    musicInitialY = e.clientY - rect.top;
    musicCurrentX = rect.left;
    musicCurrentY = rect.top;
});

document.addEventListener('mousemove', function(e) {
    if (!isDraggingMusic) return;
    e.preventDefault();
    
    const maxX = window.innerWidth - musicPlayer.offsetWidth;
    const maxY = window.innerHeight - musicPlayer.offsetHeight;
    
    musicCurrentX = Math.max(0, Math.min(e.clientX - musicInitialX, maxX));
    musicCurrentY = Math.max(0, Math.min(e.clientY - musicInitialY, maxY));
    
    musicPlayer.style.left = musicCurrentX + 'px';
    musicPlayer.style.bottom = 'auto';
    musicPlayer.style.top = musicCurrentY + 'px';
});

document.addEventListener('mouseup', function() {
    isDraggingMusic = false;
});

// 页面加载时初始化音乐播放器
// 使用window.onload确保MetingJS脚本已加载
window.addEventListener('load', function() {
    setTimeout(initMusicPlayer, 800);
});

// 如果页面已经加载完成，立即初始化
if (document.readyState === 'complete') {
    setTimeout(initMusicPlayer, 800);
}






