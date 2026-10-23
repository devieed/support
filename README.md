# Z-Rex Support

`support.z-rex.net` 的静态支持站。目录、下载页、测试群组，以及给 AdMob 抓取的根目录 `app-ads.txt`。

## 编译结果在哪

`npm run build` 只往 `dist/` 里写。里面是整站可发布的文件：各语言的 HTML、`sitemap.xml`、`404.html`，以及从源码复制过去的 `css/`、`js/`、`assets/`、`favicon.svg`、`app-ads.txt`、`robots.txt`、`CNAME`、`_headers`。

`dist/` 已经写进 `.gitignore`。不要提交它。Cloudflare Pages 拉到仓库后会自己执行 `npm run build`，再用 `dist/` 作为网站根目录。

仓库根目录里以前生成过的 `index.html`、`apps/`、`zh-Hans/` 等页面已经不再作为源码。下次提交会把这些已跟踪的生成文件从 Git 里去掉。源码仍然留在 `content/`、`assets/`、`css/`、`js/`。

本地预览：

```bash
npm run dev
```

打开 `http://127.0.0.1:4173`。它先构建 `dist/`，再从这个目录提供页面。保存 `content/`、`css/`、`js/`、`assets/`、`app-ads.txt` 后会重新构建并刷新。JSON 写错时页面留在上一版，右下角显示构建错误。`Ctrl+C` 停止。

只生成、不预览：

```bash
npm run build
```

需要 Node 22。WSL 里用已安装的 Node 22 即可。

## Cloudflare Pages

在 Pages 里连接这个仓库，构建配置填：

- 构建命令：`npm run build`
- 构建输出目录：`dist`
- 环境变量：`NODE_VERSION` = `22`

自定义域名填 `support.z-rex.net`。如果这条记录以前指向 GitHub Pages，改成 Pages 项目给出的地址。SSL 用 Full (strict)。

不要对这个主机开 Bot Fight、JS Challenge 或 “I'm Under Attack”。AdMob 的爬虫要直接拿到 HTTP 200 的纯文本。`robots.txt` 不要禁止抓取。

构建完成后，`https://support.z-rex.net/app-ads.txt` 必须能直接打开。这个文件在源码根目录，构建时复制到 `dist/` 根目录，所以线上路径仍是域名根。

每个应用在 Play 管理中心的商店设置里，把开发者网站改成 `https://support.z-rex.net`。AdMob 只用主机名，不看后面的路径。改完后最多等 24 小时，或在 AdMob 的 app-ads.txt 页面点 “Check for updates”。

以前那些单独域名如果暂时改不了商店资料，可以让旧域名的 `/app-ads.txt` 301 到 `https://support.z-rex.net/app-ads.txt`。爬虫允许跳到别的域名。

## 你要手改的文件

| 文件 | 作用 |
| --- | --- |
| `content/site.json` | 站名、域名、邮箱、测试群组链接 |
| `content/apps.json` | 每一款游戏、应用、网站 |
| `assets/apps/<目录>/` | 图标、封面、截图 |
| `app-ads.txt` | AdMob 要抓的发布商声明 |
| `content/i18n/*.json` | 网站自己的界面文字，不是每款产品的介绍 |
| `content/legal/` | 本支持站的隐私政策和使用条款，只有英文 |
| `robots.txt` | 爬虫规则和站点地图地址 |

`css/` 和 `js/` 是站点样式和语言菜单，平时不用改。

## `content/site.json`

```json
{
  "name": "Z-Rex",
  "supportLabel": "Support",
  "domain": "https://support.z-rex.net",
  "email": "support@z-rex.net",
  "year": 2026,
  "betaGroupUrl": "",
  "ogImage": "",
  "legalUpdated": "2026-09-30"
}
```

- `name`：页眉、页脚和分享信息里的名字。
- `supportLabel`：页眉标志旁边的小字，八种语言都用这一份，不翻译。
- `domain`：站点的正式地址，带 `https://`，不要以 `/` 结尾。规范链接、站点地图、Open Graph 都用它。改域名时这里要一起改。
- `email`：页脚和详情页「支持」按钮的收件地址。隐私政策、使用条款正文里的邮箱也会换成这个。
- `year`：页脚版权年份。
- `betaGroupUrl`：加入测试群组的链接，例如 Google Group。访客打开它、加入群组之后就可以参与测试。留空时，测试页显示「加入链接还没有公布」，不出现按钮。
- `ogImage`：首页以及没有自己封面的页面，分享到社交平台时用的图。填 `/` 开头的本地路径或 `https://` 地址，建议 1200×630 的 PNG 或 JPG。留空就不输出分享图。文件不存在时也当作没填。
- `legalUpdated`：隐私政策和使用条款页上的「最近更新」日期，写成 `YYYY-MM-DD`。

## `content/apps.json`

这是一个数组，每一项是一款作品。至少要有英文 `text.en`。某种语言整段没写时，页面用英文。

```json
{
  "slug": "beat-ghost",
  "category": "game",
  "sample": false,
  "featured": true,
  "icon": "/assets/apps/beat-ghost/logo.png",
  "cover": "/assets/apps/beat-ghost/banner.png",
  "screenshots": ["/assets/apps/beat-ghost/shot-1.jpg"],
  "status": "released",
  "platforms": ["android"],
  "accent": "#1d4ed8",
  "updated": "2026-09-30",
  "links": {
    "play": "https://play.google.com/store/apps/details?id=net.zrex.bestghost",
    "appstore": "",
    "web": "",
    "privacy": "https://example.com/privacy",
    "terms": "https://example.com/terms",
    "beta": ""
  },
  "text": {
    "en": {
      "name": "Beat Ghost",
      "tagline": "One short line.",
      "summary": "One sentence for search results and the card.",
      "body": ["First paragraph.", "Second paragraph."]
    }
  }
}
```

- `slug`：小写英文、数字和连字符，不能有空格和大写。页面地址是 `/apps/这个-slug/`。全站不能重复。
- `category`：`game`（游戏）、`app`（应用）、`pc`（电脑端）或 `site`（网站）。决定首页放进哪一栏。网站条目的「访问」按钮用 `links.web`，会离开本站。电脑端条目的下载按钮也用 `links.web`。
- `sample`：`true` 时详情页不进站点地图，搜索引擎看到 noindex。正式作品用 `false`。
- `featured`：`true` 的第一条会成为首页大横幅。都不写时，用第一条已发布的作品。
- `icon`：正方形图标。建议 512×512 的 PNG 或 WebP，直接用 Play 商店的高清图标。圆角由页面加，图本身不用切圆角。留空，或路径写了但文件还不在，就显示名称首字母加主题色。
- `cover`：1200×630 的横图。用在卡片顶部、首页横幅、详情页顶部，也是这款作品的分享预览图。分享图建议 PNG 或 JPG。没有封面时用主题色渐变。
- `screenshots`：竖屏截图数组，建议大约 1080×2340，按顺序横向滚动。空数组或不填就不显示截图区。数组里的空字符串会被跳过。
- `status`：`released` 只出现在对应分类。`beta` 同时出现在测试页的「正在测试」里。
- `platforms`：数组，可用 `android`、`ios`、`windows`、`web`。卡片上显示成 Android、iOS、Windows、网页。
- `accent`：主题色，`#` 加 6 位十六进制，例如 `#1d4ed8`。没有图标或封面时，背景用这个颜色。写错时退回默认紫色。
- `updated`：详情页「更新」一栏的日期，原文显示，不做格式转换。
- `links.play`：Google Play 地址。空字符串表示没有这个商店。
- `links.appstore`：App Store 地址。
- `links.web`：网站或网页版地址。`category` 为 `site` 时，这是离开本站的主链接。
- `links.privacy`：这款产品自己的隐私政策。站内只放跳转，不复制正文。
- `links.terms`：这款产品自己的服务条款。
- `links.beta`：这款产品单独的测试加入链接。可选。测试群组的总链接在 `site.json` 的 `betaGroupUrl`，不是这里。
- `text`：八个语言键是 `en`、`zh-Hans`、`zh-Hant`、`es`、`ja`、`ko`、`de`、`fr`。
- `text.<语言>.name`：这个语言下的产品名。
- `text.<语言>.tagline`：卡片和详情页标题下的一句短介绍。
- `text.<语言>.summary`：搜索结果、分享描述，以及详情页没用到的摘要。详情页正文用 `body`。
- `text.<语言>.body`：字符串数组，每一项是详情页的一段。

图片放在 `assets/apps/` 下，在 JSON 里用 `/` 开头的路径，也可以直接填 `https://` 地址。路径必须是 `/` 开头或 `https://`，否则构建报错。本地文件不存在不会报错，页面改用默认的字母或主题色。

## `app-ads.txt`

AdMob 后台复制出来的那一行，原样放在这个文件里，例如：

```text
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
```

这个文件要提交。它不是密钥：AdMob 必须能从公网读到它。构建时把它复制到 `dist/app-ads.txt`。

## 界面文案和本站条款

`content/i18n/` 里八个 JSON 是导航、首页口号、按钮、测试页说明、404。改中文口号时改 `zh-Hans.json` 的 `home.lead`，其他语言文件里的同一字段要一起改，否则那种语言还是旧句子。构建会检查每种语言是否包含英文里的全部键，缺键会失败。

`content/legal/privacy.html` 和 `terms.html` 是本支持站自己的隐私政策和使用条款，只有英文。正文里的域名和邮箱在构建时换成 `site.json` 的 `domain` 和 `email`。各产品的政策不要写在这里，用 `apps.json` 的 `links.privacy` 和 `links.terms` 跳出去。

`robots.txt` 里的 `Sitemap:` 要和 `site.json` 的 `domain` 一致，现在是 `https://support.z-rex.net/sitemap.xml`。

## 语言

英文在站点根路径。简体、繁体、西班牙文、日文、韩文、德文、法文分别在 `/zh-Hans/`、`/zh-Hant/`、`/es/`、`/ja/`、`/ko/`、`/de/`、`/fr/`。

首次打开英文地址时，按浏览器语言跳转。认不出来就留在英文。爬虫不会被跳走。右上角可以手动切换，选择会记在本机 `localStorage`。

隐私政策和使用条款的正文只有英文。
