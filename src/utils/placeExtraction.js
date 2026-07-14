const knownPlaces = [
  { name: 'Wukang Road', localName: '武康路', city: 'Shanghai', category: 'See', aliases: ['wukang road', 'wukang lu', '武康路'] },
  { name: 'Anfu Road', localName: '安福路', city: 'Shanghai', category: 'See', aliases: ['anfu road', '安福路'] },
  { name: 'Jia Jia Tang Bao', localName: '佳家汤包', city: 'Shanghai', category: 'Eat', aliases: ['jia jia tang bao', '佳家汤包'] },
  { name: "People's Square", localName: '人民广场', city: 'Shanghai', category: 'See', aliases: ["people's square", '人民广场'] },
  { name: 'The Bund', localName: '外滩', city: 'Shanghai', category: 'See', aliases: ['the bund', 'bund', '外滩'] },
  { name: 'Huanghe Road', localName: '黄河路', city: 'Shanghai', category: 'Eat', aliases: ['huanghe road', '黄河路'] },
  { name: "Jing'an Temple", localName: '静安寺', city: 'Shanghai', category: 'Stay', aliases: ["jing'an temple", 'jing an temple', '静安寺'] },
  { name: "People's Park", localName: '人民公园', city: 'Chengdu', category: 'Tea', aliases: ["people's park", '人民公园'] },
  { name: 'Heming Tea House', localName: '鹤鸣茶社', city: 'Chengdu', category: 'Tea', aliases: ['heming tea house', '鹤鸣茶社'] },
  { name: 'Chengdu Museum', localName: '成都博物馆', city: 'Chengdu', category: 'See', aliases: ['chengdu museum', '成都博物馆'] },
  { name: 'Wenshu Monastery', localName: '文殊院', city: 'Chengdu', category: 'See', aliases: ['wenshu monastery', 'wenshu temple', '文殊院'] },
  { name: 'Chengdu Panda Base', localName: '成都大熊猫繁育研究基地', city: 'Chengdu', category: 'See', aliases: ['chengdu panda base', 'panda research base', '成都大熊猫繁育研究基地'] },
  { name: 'Yulin West Road', localName: '玉林西路', city: 'Chengdu', category: 'Eat', aliases: ['yulin west road', 'yulin road', '玉林西路', '玉林路'] },
  { name: 'Chengdu Wuhou Shrine Museum', localName: '成都武侯祠博物馆', city: 'Chengdu', category: 'See', aliases: ['wuhou shrine', 'wuhou temple', '成都武侯祠博物馆', '武侯祠'] },
  { name: 'Xiaolongkan Hotpot', localName: '小龙坎火锅', city: 'Chengdu', category: 'Eat', aliases: ['小龙坎火锅', 'xiaolongkan hotpot', 'xiao long kan'] },
  { name: 'Xi’an City Wall at Yongning Gate', localName: '西安城墙（永宁门）', city: "Xi'an", category: 'See', aliases: ['xi’an city wall at yongning gate', "xi'an city wall at yongning gate", 'yongning gate', '永宁门', '西安城墙'] },
  { name: 'Great Mosque of Xi’an', localName: '西安化觉巷清真大寺', city: "Xi'an", category: 'See', aliases: ['great mosque of xi’an', "great mosque of xi'an", 'huajue lane mosque', '化觉巷清真大寺', '西安化觉巷清真大寺'] },
  { name: 'Shaanxi History Museum — main museum', localName: '陕西历史博物馆（本馆）', city: "Xi'an", category: 'See', aliases: ['shaanxi history museum', '陕西历史博物馆', '陕西历史博物馆（本馆）'] },
  { name: 'Da Ci’en Temple and Big Wild Goose Pagoda', localName: '大慈恩寺（大雁塔）', city: "Xi'an", category: 'See', aliases: ['da ci’en temple', "da ci'en temple", 'big wild goose pagoda', '大慈恩寺', '大雁塔'] },
  { name: 'Xi’an Museum and Small Wild Goose Pagoda', localName: '西安博物院（小雁塔）', city: "Xi'an", category: 'See', aliases: ['xi’an museum', "xi'an museum", 'small wild goose pagoda', '西安博物院', '小雁塔'] },
  { name: 'Emperor Qinshihuang’s Mausoleum Site Museum', localName: '秦始皇帝陵博物院', city: "Xi'an", category: 'See', aliases: ["emperor qinshihuang's mausoleum site museum", 'emperor qinshihuang’s mausoleum site museum', 'terracotta warriors museum', 'terracotta army museum', '秦始皇帝陵博物院', '兵马俑'] },
  { name: 'Guangdong Folk Arts Museum at Chen Clan Academy', localName: '广东民间工艺博物馆（陈家祠）', city: 'Guangzhou', category: 'See', aliases: ['guangdong folk arts museum', 'chen clan academy', 'chen clan ancestral hall', '广东民间工艺博物馆', '陈家祠'] },
  { name: 'Cantonese Opera Art Museum', localName: '粤剧艺术博物馆', city: 'Guangzhou', category: 'See', aliases: ['cantonese opera art museum', '粤剧艺术博物馆'] },
  { name: 'Shamian Island at the East Bridge', localName: '沙面岛（东桥入口）', city: 'Guangzhou', category: 'See', aliases: ['shamian island at the east bridge', 'shamian island', '沙面岛', '沙面东桥'] },
  { name: 'Nanyue King Museum — King’s Tomb Exhibition Area', localName: '南越王博物院（王墓展区）', city: 'Guangzhou', category: 'See', aliases: ['nanyue king museum king’s tomb exhibition area', "nanyue king museum king's tomb exhibition area", 'nanyue king museum tomb', '南越王博物院（王墓展区）', '王墓展区'] },
  { name: 'Nanyue King Museum — Palace Exhibition Area', localName: '南越王博物院（王宫展区）', city: 'Guangzhou', category: 'See', aliases: ['nanyue king museum palace exhibition area', 'nanyue king museum palace', '南越王博物院（王宫展区）', '王宫展区'] },
  { name: 'Guangdong Museum', localName: '广东省博物馆', city: 'Guangzhou', category: 'See', aliases: ['guangdong museum', 'guangdong provincial museum', '广东省博物馆'] },
  { name: 'Shenzhen Reform and Opening-Up Exhibition Hall', localName: '深圳改革开放展览馆（深圳市当代艺术与城市规划馆内）', city: 'Shenzhen', category: 'See', aliases: ['shenzhen reform and opening-up exhibition hall', 'shenzhen reform and opening up exhibition hall', '深圳改革开放展览馆'] },
  { name: 'Lianhua Hill Park south gate', localName: '莲花山公园南门', city: 'Shenzhen', category: 'See', aliases: ['lianhua hill park south gate', 'lianhuashan park south gate', '莲花山公园南门', '莲花山公园'] },
  { name: 'Nantou Ancient Town Museum at the south gate', localName: '南头古城博物馆（南门外）', city: 'Shenzhen', category: 'See', aliases: ['nantou ancient town museum', 'nantou ancient city museum', '南头古城博物馆', '南头古城南门'] },
  { name: 'Sea World Culture and Arts Center', localName: '海上世界文化艺术中心', city: 'Shenzhen', category: 'See', aliases: ['sea world culture and arts center', 'sea world culture and art center', '海上世界文化艺术中心'] },
  { name: 'Dafen Art Museum', localName: '大芬美术馆', city: 'Shenzhen', category: 'See', aliases: ['dafen art museum', '大芬美术馆'] },
  { name: 'Futian Checkpoint', localName: '福田口岸', city: 'Shenzhen', category: 'Move', aliases: ['futian checkpoint', 'futian port', '福田口岸'] },
  { name: 'Broken Bridge and Bai Causeway start', localName: '断桥残雪（白堤东端）', city: 'Hangzhou', category: 'See', aliases: ['broken bridge and bai causeway start', 'broken bridge', 'bai causeway start', '断桥残雪', '白堤东端'] },
  { name: 'Lingyin–Feilai Peak Scenic Area main entrance', localName: '灵隐飞来峰景区入口', city: 'Hangzhou', category: 'See', aliases: ['lingyin–feilai peak scenic area main entrance', 'lingyin-feilai peak scenic area main entrance', 'lingyin feilai peak', '灵隐飞来峰景区入口', '灵隐飞来峰'] },
  { name: 'China National Tea Museum — Shuangfeng Branch', localName: '中国茶叶博物馆（双峰馆区）', city: 'Hangzhou', category: 'Tea', aliases: ['china national tea museum shuangfeng branch', 'china national tea museum — shuangfeng branch', 'tea museum shuangfeng', '中国茶叶博物馆（双峰馆区）', '双峰馆区'] },
  { name: 'Southern Song Deshou Palace Site Museum', localName: '南宋德寿宫遗址博物馆', city: 'Hangzhou', category: 'See', aliases: ['southern song deshou palace site museum', 'deshou palace site museum', '南宋德寿宫遗址博物馆', '德寿宫'] },
  { name: 'China Beijing–Hangzhou Grand Canal Museum', localName: '中国京杭大运河博物馆', city: 'Hangzhou', category: 'See', aliases: ['china beijing–hangzhou grand canal museum', 'china beijing-hangzhou grand canal museum', 'beijing-hangzhou grand canal museum', '中国京杭大运河博物馆'] },
  { name: 'Liangzhu Museum', localName: '良渚博物院', city: 'Hangzhou', category: 'See', aliases: ['liangzhu museum', '良渚博物院'] },
  { name: 'Green Lake Park south gate', localName: '翠湖公园南门', city: 'Kunming', category: 'See', aliases: ['green lake park south gate', 'cuihu park south gate', '翠湖公园南门', '翠湖南门'] },
  { name: 'Kunming City Museum', localName: '昆明市博物馆', city: 'Kunming', category: 'See', aliases: ['kunming city museum', 'kunming municipal museum', '昆明市博物馆'] },
  { name: 'Yunnan Provincial Museum', localName: '云南省博物馆', city: 'Kunming', category: 'See', aliases: ['yunnan provincial museum', '云南省博物馆'] },
  { name: 'Kunming Dounan Flower Market main hall', localName: '昆明斗南花卉市场（主场馆）', city: 'Kunming', category: 'See', aliases: ['kunming dounan flower market main hall', 'dounan flower market main hall', 'dounan flower market', '昆明斗南花卉市场（主场馆）', '斗南花卉市场'] },
  { name: 'Haigeng Dam viewing section', localName: '海埂大坝（观景路观鸥段）', city: 'Kunming', category: 'See', aliases: ['haigeng dam viewing section', 'haigeng dam', '海埂大坝（观景路观鸥段）', '海埂大坝'] },
  { name: 'Stone Forest Scenic Area visitor center', localName: '石林风景区游客中心', city: 'Kunming', category: 'See', aliases: ['stone forest scenic area visitor center', 'stone forest visitor center', '石林风景区游客中心'] },
  { name: 'Dali Ancient City South Gate Visitor Center', localName: '大理古城南门游客中心', city: 'Dali', category: 'See', aliases: ['dali ancient city south gate visitor center', 'dali old town south gate visitor center', '大理古城南门游客中心'] },
  { name: 'Dali City Museum', localName: '大理市博物馆', city: 'Dali', category: 'See', aliases: ['dali city museum', 'dali municipal museum', '大理市博物馆'] },
  { name: 'Chongsheng Temple Three Pagodas Cultural Tourism Area entrance', localName: '崇圣寺三塔文化旅游区入口', city: 'Dali', category: 'See', aliases: ['chongsheng temple three pagodas cultural tourism area entrance', 'three pagodas entrance', '崇圣寺三塔文化旅游区入口', '崇圣寺三塔'] },
  { name: 'Yan Family Courtyard Museum', localName: '喜洲严家大院博物馆', city: 'Dali', category: 'See', aliases: ['yan family courtyard museum', 'xizhou yan family courtyard', '喜洲严家大院博物馆', '严家大院'] },
  { name: 'Longkan entrance to the Erhai Ecological Corridor', localName: '洱海生态廊道龙龛入口', city: 'Dali', category: 'See', aliases: ['longkan entrance to the erhai ecological corridor', 'longkan corridor entrance', '洱海生态廊道龙龛入口', '龙龛入口'] },
  { name: 'Cangshan Grand Cableway lower station', localName: '苍山大索道下站（天龙八部影视城）', city: 'Dali', category: 'Move', aliases: ['cangshan grand cableway lower station', 'cangshan cableway lower station', '苍山大索道下站（天龙八部影视城）', '苍山大索道下站'] },
  { name: 'Lijiang Ancient City Museum at Mufu', localName: '丽江古城博物院（木府）', city: 'Lijiang', category: 'See', aliases: ['lijiang ancient city museum at mufu', 'lijiang ancient city museum', 'mufu', '丽江古城博物院（木府）', '丽江古城博物院', '木府'] },
  { name: 'Black Dragon Pool Park south gate', localName: '黑龙潭公园南门', city: 'Lijiang', category: 'See', aliases: ['black dragon pool park south gate', 'black dragon pool south gate', '黑龙潭公园南门'] },
  { name: 'Shuhe Ancient Town north gate', localName: '束河古镇北门', city: 'Lijiang', category: 'See', aliases: ['shuhe ancient town north gate', 'shuhe north gate', '束河古镇北门'] },
  { name: 'Baisha Murals Scenic Area ticket office', localName: '白沙壁画景区售票处', city: 'Lijiang', category: 'See', aliases: ['baisha murals scenic area ticket office', 'baisha murals ticket office', '白沙壁画景区售票处', '白沙壁画'] },
  { name: 'Jade Dragon Snow Mountain new visitor service center', localName: '玉龙雪山新游客服务中心', city: 'Lijiang', category: 'See', aliases: ['jade dragon snow mountain new visitor service center', 'jade dragon snow mountain visitor center', '玉龙雪山新游客服务中心'] },
  { name: 'Glacier Park Cableway lower station', localName: '冰川公园索道下站', city: 'Lijiang', category: 'Move', aliases: ['glacier park cableway lower station', 'glacier park lower station', '冰川公园索道下站'] },
  { name: 'Guilin Museum — Lingui building', localName: '桂林博物馆（临桂馆）', city: 'Guilin', category: 'See', aliases: ['guilin museum lingui building', 'guilin museum — lingui building', 'guilin museum', '桂林博物馆（临桂馆）', '桂林博物馆'] },
  { name: 'Duxiu Peak–Jingjiang Princes’ City at Zhengyang Gate', localName: '独秀峰王城景区（正阳门）', city: 'Guilin', category: 'See', aliases: ['duxiu peak–jingjiang princes’ city at zhengyang gate', "duxiu peak-jingjiang princes' city at zhengyang gate", 'jingjiang princes city zhengyang gate', '独秀峰王城景区（正阳门）', '独秀峰王城景区正阳门'] },
  { name: 'Elephant Trunk Hill Scenic Area Gate 1', localName: '象鼻山景区1号门', city: 'Guilin', category: 'See', aliases: ['elephant trunk hill scenic area gate 1', 'elephant trunk hill gate 1', '象鼻山景区1号门', '象山景区1号门'] },
  { name: 'Reed Flute Cave visitor center', localName: '芦笛岩景区游客中心', city: 'Guilin', category: 'See', aliases: ['reed flute cave visitor center', 'reed flute cave', '芦笛岩景区游客中心', '芦笛岩'] },
  { name: 'Mopan Mountain Passenger Port', localName: '磨盘山客运港码头', city: 'Guilin', category: 'Move', aliases: ['mopan mountain passenger port', 'mopan mountain passenger port wharf', '磨盘山客运港码头', '磨盘山码头'] },
  { name: 'Zhujiang Passenger Port', localName: '竹江客运港码头', city: 'Guilin', category: 'Move', aliases: ['zhujiang passenger port', 'zhujiang passenger port wharf', '竹江客运港码头', '竹江码头'] },
  { name: 'Yangshuo Railway Station', localName: '阳朔站', city: 'Yangshuo', category: 'Move', aliases: ['yangshuo railway station', 'yangshuo station', '阳朔站'] },
  { name: 'Xingping Chaobanshan Wharf', localName: '兴坪朝板山码头', city: 'Yangshuo', category: 'Move', aliases: ['xingping chaobanshan wharf', 'chaobanshan wharf', '兴坪朝板山码头', '朝板山码头'] },
  { name: 'Yangshuo Longtoushan Wharf', localName: '阳朔龙头山码头', city: 'Yangshuo', category: 'Move', aliases: ['yangshuo longtoushan wharf', 'longtoushan wharf', '阳朔龙头山码头', '龙头山码头'] },
  { name: 'Jima Wharf on the Yulong River', localName: '遇龙河景区骥马码头', city: 'Yangshuo', category: 'Move', aliases: ['jima wharf on the yulong river', 'jima wharf', '遇龙河景区骥马码头', '骥马码头'] },
  { name: 'Gongnong Bridge comprehensive wharf', localName: '工农桥综合码头', city: 'Yangshuo', category: 'Move', aliases: ['gongnong bridge comprehensive wharf', 'gongnong bridge wharf', '工农桥综合码头'] },
  { name: 'Shuangliu Ferry Pavilion in Jiuxian', localName: '旧县村双流义渡亭', city: 'Yangshuo', category: 'See', aliases: ['shuangliu ferry pavilion in jiuxian', 'shuangliu ferry pavilion', '旧县村双流义渡亭', '双流义渡亭'] },
  { name: 'Zhangjiajie West Railway Station', localName: '张家界西站', city: 'Zhangjiajie', category: 'Move', aliases: ['zhangjiajie west railway station', 'zhangjiajie west station', '张家界西站'] },
  { name: 'Wulingyuan East Gate at the landmark gate', localName: '武陵源标志门（东门）', city: 'Zhangjiajie', category: 'See', aliases: ['wulingyuan east gate at the landmark gate', 'wulingyuan east gate', 'wujiayu ticket station', '武陵源标志门（东门）', '武陵源标志门', '吴家峪门票站'] },
  { name: 'Zhangjiajie National Forest Park South Gate', localName: '张家界国家森林公园南门（森林公园门票站）', city: 'Zhangjiajie', category: 'See', aliases: ['zhangjiajie national forest park south gate', 'forest park south gate', '张家界国家森林公园南门（森林公园门票站）', '张家界国家森林公园南门', '森林公园门票站'] },
  { name: 'Tianzi Mountain Cableway lower station', localName: '天子山索道下站', city: 'Zhangjiajie', category: 'Move', aliases: ['tianzi mountain cableway lower station', 'tianzi mountain cableway station', '天子山索道下站'] },
  { name: 'Bailong Elevator lower station', localName: '百龙天梯下站', city: 'Zhangjiajie', category: 'Move', aliases: ['bailong elevator lower station', 'bailong elevator', '百龙天梯下站'] },
  { name: 'Tianmen Mountain Cableway lower station', localName: '天门山索道下站', city: 'Zhangjiajie', category: 'Move', aliases: ['tianmen mountain cableway lower station', 'tianmen mountain cableway station', '天门山索道下站'] },
  { name: 'Suzhou Railway Station', localName: '苏州站', city: 'Suzhou', category: 'Move', aliases: ['suzhou railway station', 'suzhou station', '苏州站'] },
  { name: 'Humble Administrator’s Garden entrance', localName: '拙政园入口（东北街178号）', city: 'Suzhou', category: 'See', aliases: ['humble administrator’s garden entrance', "humble administrator's garden entrance", 'humble administrators garden entrance', '拙政园入口（东北街178号）', '拙政园入口'] },
  { name: 'Suzhou Museum main building', localName: '苏州博物馆本馆', city: 'Suzhou', category: 'See', aliases: ['suzhou museum main building', 'suzhou museum', '苏州博物馆本馆'] },
  { name: 'Master-of-the-Nets Garden', localName: '网师园', city: 'Suzhou', category: 'See', aliases: ['master-of-the-nets garden', 'master of the nets garden', 'master-of-nets garden', '网师园'] },
  { name: 'Lingering Garden entrance', localName: '留园入口（留园路338号）', city: 'Suzhou', category: 'See', aliases: ['lingering garden entrance', 'lingering garden', '留园入口（留园路338号）', '留园入口'] },
  { name: 'Tiger Hill Scenic Area South Gate', localName: '虎丘山风景名胜区南门', city: 'Suzhou', category: 'See', aliases: ['tiger hill scenic area south gate', 'tiger hill south gate', '虎丘山风景名胜区南门', '虎丘南门'] },
  { name: 'Nanjing South Railway Station', localName: '南京南站', city: 'Nanjing', category: 'Move', aliases: ['nanjing south railway station', 'nanjing south station', '南京南站'] },
  { name: 'Nanjing Museum', localName: '南京博物院', city: 'Nanjing', category: 'See', aliases: ['nanjing museum', '南京博物院'] },
  { name: 'Nanjing Massacre history exhibition at Gate 1', localName: '侵华日军南京大屠杀遇难同胞纪念馆（南京大屠杀史实展1号门）', city: 'Nanjing', category: 'See', aliases: ['nanjing massacre history exhibition at gate 1', 'nanjing massacre history exhibition', '侵华日军南京大屠杀遇难同胞纪念馆（南京大屠杀史实展1号门）', '南京大屠杀史实展1号门'] },
  { name: 'Sun Yat-sen Mausoleum at Bo’ai Square', localName: '中山陵（博爱广场入口）', city: 'Nanjing', category: 'See', aliases: ['sun yat-sen mausoleum at bo’ai square', "sun yat-sen mausoleum at bo'ai square", 'sun yat-sen mausoleum', '中山陵（博爱广场入口）', '中山陵博爱广场'] },
  { name: 'Ming Xiaoling Scenic Area Gate 3', localName: '明孝陵景区3号门', city: 'Nanjing', category: 'See', aliases: ['ming xiaoling scenic area gate 3', 'ming xiaoling gate 3', '明孝陵景区3号门', '明孝陵3号门'] },
  { name: 'Nanjing City Wall at Zhonghua Gate Barbican', localName: '南京城墙中华门瓮城景区', city: 'Nanjing', category: 'See', aliases: ['nanjing city wall at zhonghua gate barbican', 'zhonghua gate barbican', '南京城墙中华门瓮城景区', '中华门瓮城'] },
  { name: 'Wuhan Railway Station', localName: '武汉站', city: 'Wuhan', category: 'Move', aliases: ['wuhan railway station', 'wuhan station', '武汉站'] },
  { name: 'Hubei Provincial Museum South Gate', localName: '湖北省博物馆南门', city: 'Wuhan', category: 'See', aliases: ['hubei provincial museum south gate', 'hubei museum south gate', '湖北省博物馆南门'] },
  { name: 'East Lake Greenway at Lake Light Prelude', localName: '东湖绿道湖光序曲驿站', city: 'Wuhan', category: 'See', aliases: ['east lake greenway at lake light prelude', 'lake light prelude', '东湖绿道湖光序曲驿站', '湖光序曲驿站'] },
  { name: 'Yellow Crane Tower Park South Gate', localName: '黄鹤楼公园南门', city: 'Wuhan', category: 'See', aliases: ['yellow crane tower park south gate', 'yellow crane tower south gate', '黄鹤楼公园南门'] },
  { name: 'Zhonghua Road No. 1 Ferry Terminal', localName: '中华路1号码头', city: 'Wuhan', category: 'Move', aliases: ['zhonghua road no. 1 ferry terminal', 'zhonghua road no 1 ferry terminal', 'zhonghua road number 1 ferry terminal', '中华路1号码头', '中华路一号码头'] },
  { name: 'Wuhan Customs House Museum', localName: '江汉关博物馆', city: 'Wuhan', category: 'See', aliases: ['wuhan customs house museum', 'jianghanguan museum', '江汉关博物馆'] },
  { name: 'Qingdao Railway Station', localName: '青岛站', city: 'Qingdao', category: 'Move', aliases: ['qingdao railway station', 'qingdao station', '青岛站'] },
  { name: 'Qingdao Tianhou Temple', localName: '青岛天后宫', city: 'Qingdao', category: 'See', aliases: ['qingdao tianhou temple', 'qingdao tianhou palace', '青岛天后宫'] },
  { name: "Qingdao German Governor's Residence Museum", localName: '青岛德国总督楼旧址博物馆', city: 'Qingdao', category: 'See', aliases: ["qingdao german governor's residence museum", 'qingdao german governor’s residence museum', 'german governor residence museum', '青岛德国总督楼旧址博物馆'] },
  { name: 'Tsingtao Brewery Museum', localName: '青岛啤酒博物馆', city: 'Qingdao', category: 'See', aliases: ['tsingtao brewery museum', 'qingdao beer museum', '青岛啤酒博物馆'] },
  { name: 'Qingdao First Bathing Beach', localName: '青岛第一海水浴场', city: 'Qingdao', category: 'See', aliases: ['qingdao first bathing beach', 'first bathing beach qingdao', '青岛第一海水浴场'] },
  { name: 'Laoshan Scenic Area Visitor Service Center at Dahedong', localName: '崂山游客服务中心（大河东）', city: 'Qingdao', category: 'See', aliases: ['laoshan scenic area visitor service center at dahedong', 'laoshan visitor service center at dahedong', 'dahedong visitor service center', '崂山游客服务中心（大河东）', '崂山大河东游客服务中心'] },
  { name: 'Changsha South Railway Station', localName: '长沙南站', city: 'Changsha', category: 'Move', aliases: ['changsha south railway station', 'changsha south station', '长沙南站'] },
  { name: 'Hunan Museum', localName: '湖南博物院', city: 'Changsha', category: 'See', aliases: ['hunan museum', '湖南博物院'] },
  { name: 'Yuelu Academy', localName: '岳麓书院', city: 'Changsha', category: 'See', aliases: ['yuelu academy', '岳麓书院'] },
  { name: 'Orange Isle Scenic Area', localName: '橘子洲景区', city: 'Changsha', category: 'See', aliases: ['orange isle scenic area', 'orange isle', 'juzizhou scenic area', '橘子洲景区'] },
  { name: 'Changsha Bamboo Slips Museum', localName: '长沙简牍博物馆', city: 'Changsha', category: 'See', aliases: ['changsha bamboo slips museum', 'changsha bamboo and wooden slips museum', '长沙简牍博物馆'] },
  { name: 'Du Fu Pavilion', localName: '杜甫江阁', city: 'Changsha', category: 'See', aliases: ['du fu pavilion', 'dufu pavilion', '杜甫江阁'] },
  { name: 'Xiamen North Railway Station', localName: '厦门北站', city: 'Xiamen', category: 'Move', aliases: ['xiamen north railway station', 'xiamen north station', '厦门北站'] },
  { name: 'Xiamen International Cruise Center Gulangyu Wharf', localName: '邮轮中心厦鼓码头（东渡客运码头）', city: 'Xiamen', category: 'Move', aliases: ['xiamen international cruise center gulangyu wharf', 'cruise center gulangyu wharf', '邮轮中心厦鼓码头', '东渡客运码头'] },
  { name: 'Sanqiutian Wharf', localName: '鼓浪屿三丘田码头', city: 'Xiamen', category: 'Move', aliases: ['sanqiutian wharf', 'sanqiutian ferry terminal', '鼓浪屿三丘田码头', '三丘田码头'] },
  { name: 'Overseas Chinese Museum', localName: '华侨博物院', city: 'Xiamen', category: 'See', aliases: ['overseas chinese museum', '华侨博物院'] },
  { name: 'Nanputuo Temple', localName: '南普陀寺', city: 'Xiamen', category: 'See', aliases: ['nanputuo temple', 'south putuo temple', '南普陀寺'] },
  { name: 'Xiamen Botanical Garden West Gate', localName: '厦门园林植物园西大门', city: 'Xiamen', category: 'See', aliases: ['xiamen botanical garden west gate', 'xiamen garden botanical garden west gate', '厦门园林植物园西大门', '植物园西大门'] },
  { name: 'Forbidden City', localName: '故宫', city: 'Beijing', category: 'See', aliases: ['forbidden city', '故宫'] },
  { name: 'Temple of Heaven', localName: '天坛', city: 'Beijing', category: 'See', aliases: ['temple of heaven', '天坛'] },
  { name: 'Mutianyu Great Wall', localName: '慕田峪长城', city: 'Beijing', category: 'See', aliases: ['mutianyu', '慕田峪'] },
  { name: 'Shanghai Museum', localName: '上海博物馆', city: 'Shanghai', category: 'See', aliases: ['shanghai museum', '上海博物馆'] },
  { name: 'Xintiandi', localName: '新天地', city: 'Shanghai', category: 'See', aliases: ['xintiandi', '新天地'] },
  { name: 'Longhua Temple', localName: '龙华寺', city: 'Shanghai', category: 'See', aliases: ['longhua temple', '龙华寺'] },
  { name: 'Yu Garden', localName: '豫园', city: 'Shanghai', category: 'See', aliases: ['yu garden', 'yuyuan', '豫园'] },
  { name: 'Nanjing Road Pedestrian Street', localName: '南京路步行街', city: 'Shanghai', category: 'See', aliases: ['nanjing road', '南京路步行街'] },
  { name: 'City God Temple', localName: '城隍庙', city: 'Shanghai', category: 'Eat', aliases: ['city god temple', '城隍庙'] },
];

export const DEFAULT_MAINLAND_MAP_PROVIDER = 'amap';

export function mapProviderUrl(provider, place) {
  return provider === 'apple' ? appleMapsUrl(place) : amapUrl(place);
}

export function sourceFromShareOrLink(locationSearch, pastedLink) {
  const params = new URLSearchParams(locationSearch || '');
  const title = params.get('title') || '';
  const text = params.get('text') || '';
  const url = params.get('url') || pastedLink || '';
  return normalizeSource({ title, text, url });
}

export function normalizeSource({ title = '', text = '', url = '' } = {}) {
  const decodedUrl = safeDecode(url);
  const bits = [title, text, decodedUrl, textFromUrl(decodedUrl)].filter(Boolean);
  return { url: decodedUrl, text: bits.map(compactLines).filter(Boolean).join('\n'), platform: detectPlatform(decodedUrl) };
}

export function extractTripPlaces(source) {
  const raw = typeof source === 'string' ? normalizeSource({ url: source }) : normalizeSource(source);
  const text = raw.text;
  const results = [];
  let structuredCount = 0;
  for (const line of text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
    const structured = line.match(/^\s*\d{1,2}[.)、:]\s+(.+?)\s*\/\s*([\p{Script=Han}A-Za-z0-9·（）()\-\s]+?)\s+[—–-]\s+([A-Za-z][A-Za-z'’ .\-]+?)(?:\s+[—–-]\s+(.+))?$/u);
    if (!structured) continue;
    structuredCount += 1;
    add({
      name: cleanName(structured[1]),
      localName: cleanName(structured[2]),
      city: cleanName(structured[3]),
      category: inferCategory(line),
      confidence: 'structured list',
      sourceUrl: raw.url,
      sourcePlatform: raw.platform,
      note: cleanNote(line),
    });
  }
  if (!structuredCount) {
    for (const place of knownPlaces) {
      const haystack = text.toLowerCase();
      if ([place.name, ...place.aliases].some((alias) => aliasMentioned(haystack, alias))) {
        add({ ...place, confidence: 'known place', sourceUrl: raw.url, sourcePlatform: raw.platform, note: evidenceLine(text, place) });
      }
    }
  }
  const lines = text.split(/\n|。|；|;|•|·/).map((line) => line.trim()).filter(Boolean);
  const chinesePlace = /([\u4e00-\u9fa5A-Za-z0-9'’&·\-\s]{2,28}?(?:路|街|巷|寺|站|机场|公园|广场|市场|博物馆|酒店|饭店|餐厅|茶社|茶馆|火锅|小吃|面馆|咖啡|书店|中心|外滩))/g;
  const englishSignals = /\b(?:at|near|around|inside|to|from|on|visited|stay near|walk to|lunch at|sunset at|save|recommend(?:ed|ing)?)\s+([A-Z][A-Za-z'’&\-.]+(?:\s+[A-Z][A-Za-z'’&\-.]+){0,5})/g;
  for (const line of lines) {
    if (/^\s*\d{1,2}[.)、:]\s+.+?\s*\/\s*[\p{Script=Han}].+?\s+[—–-]\s+/u.test(line)) continue;
    for (const match of line.matchAll(chinesePlace)) addCandidate(match[1], line, raw);
    for (const match of line.matchAll(englishSignals)) addCandidate(match[1], line, raw);
    const listItem = line.match(/^(?:\s*(?:\d{1,2}[.)、:]|[-*]))\s+(.{2,64})$/);
    if (listItem) {
      const candidate = listItem[1].split(/\s+(?:[-–—]|near|in)\s+/i)[0].trim();
      if (candidate.length <= 42 && (/\p{Script=Han}/u.test(candidate) || /^[A-Z][A-Za-z0-9'’&.\- ]+$/.test(candidate))) {
        addCandidate(candidate, line, raw);
      }
    }
  }
  results.sort((a, b) => sourceIndex(text, a) - sourceIndex(text, b));
  return { source: raw, places: results.slice(0, 8), needsMoreText: Boolean(raw.url && results.length === 0) };

  function addCandidate(rawName, line, sourceMeta) {
    const name = cleanName(rawName);
    if (!name) return;
    add({ name, city: inferCity(line), category: inferCategory(line), confidence: 'text match', sourceUrl: sourceMeta.url, sourcePlatform: sourceMeta.platform, note: cleanNote(line) });
  }
  function add(place) {
    const maxNameLength = place.confidence === 'structured list' ? 72 : 42;
    if (!place.name || place.name.length < 2 || place.name.length > maxNameLength) return;
    if (/^(day|start|in|for|the|near|then|lunch|sunset|stay|china|shanghai|beijing|chengdu|xi'an)$/i.test(place.name)) return;
    const key = String(place.name).toLowerCase() + '|' + String(place.city || '').toLowerCase();
    const candidateAliases = aliasesFor(place);
    const duplicate = results.some((item) => {
      if (String(item.name).toLowerCase() + '|' + String(item.city || '').toLowerCase() === key) return true;
      if (item.city && place.city && String(item.city).toLowerCase() !== String(place.city).toLowerCase()) return false;
      return aliasesFor(item).some((alias) => candidateAliases.includes(alias));
    });
    if (!duplicate) results.push(place);
  }
}

function sourceIndex(text, place) {
  const indexes = aliasesFor(place)
    .map((alias) => String(text || '').toLowerCase().indexOf(alias))
    .filter((index) => index >= 0);
  return indexes.length ? Math.min(...indexes) : Number.MAX_SAFE_INTEGER;
}

export function appleMapsUrl(place) {
  const coordinate = coordinateForPlace(place);
  if (coordinate) {
    const label = encodeURIComponent(displayName(place));
    return 'https://maps.apple.com/?ll=' + coordinate.lat + ',' + coordinate.lon + '&q=' + label;
  }
  return 'https://maps.apple.com/?q=' + encodeURIComponent(displayName(place));
}
export function amapUrl(place) {
  const coordinate = coordinateForPlace(place);
  if (coordinate) {
    const label = encodeURIComponent(displayName(place));
    return 'https://uri.amap.com/marker?position=' + coordinate.lon + ',' + coordinate.lat + '&name=' + label + '&src=chinatravelmadeeasy&coordinate=gaode&callnative=1';
  }
  return 'https://uri.amap.com/search?keyword=' + encodeURIComponent(displayName(place)) + '&view=map&src=chinatravelmadeeasy&callnative=1';
}
export function displayName(place) {
  const names = Array.from(new Set([place.name, place.localName].filter(Boolean)));
  return [names.join(' / '), place.city].filter(Boolean).join(', ');
}

function coordinateForPlace(place) {
  const lat = Number(place?.latitude ?? place?.lat);
  const lon = Number(place?.longitude ?? place?.lon ?? place?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat: lat.toFixed(5), lon: lon.toFixed(5) };
}

function textFromUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const params = ['q', 'query', 'keyword', 'keywords', 'caption', 'title', 'text', 'description', 'place', 'poi'].map((key) => parsed.searchParams.get(key)).filter(Boolean);
    const slug = parsed.pathname.split(/[\/_.-]+/).filter((part) => part && !/^\d+$/.test(part) && part.length > 1).join(' ');
    return compact([...params, slug].join(' '));
  } catch { return url; }
}
function detectPlatform(url) {
  if (/douyin|tiktok/i.test(url)) return 'TikTok/Douyin';
  if (/reddit/i.test(url)) return 'Reddit';
  if (/instagram/i.test(url)) return 'Instagram';
  if (/google|maps\.apple|amap/i.test(url)) return 'Map link';
  return url ? 'Web link' : 'Pasted text';
}
function cleanName(value) {
  return String(value || '')
    .replace(/^[\s:：,，.。\-–—]+|[\s:：,，.。\-–—]+$/g, '')
    .replace(/^(?:the|at|near|around|inside|to|from|on|walk to|lunch at|sunset at|save|recommend(?:ed|ing)?)\s+/i, '')
    .replace(/^(?:start|then|go|visit|visited|stay|lunch|dinner|morning walk|sunset)\s+(?:at|on|near|around|inside|to)\s+/i, '')
    .replace(/^.*\b(?:kept recommending|kept mentioning|mentioned|mentions|recommend|recommended|suggested)\s+/i, '')
    .replace(/^.*?\b(?:at|near|around|inside|to|from|on)\s+(?=[\u4e00-\u9fa5])/i, '')
    .replace(/^(?:第?[一二三四五六七八九十0-9]+天|早上|上午|中午|下午|晚上|先去|再去|然后去|去)+\s*/u, '')
    .replace(/^(?:and|then)\s+/i, '')
    .trim();
}
function inferCity(text) {
  if (/上海|Shanghai|Bund|Jing'an|Wukang|Anfu|People's Square|Huanghe|外滩|静安寺|武康路/i.test(text)) return 'Shanghai';
  if (/成都|Chengdu|Heming|People's Park|Wenshu|Panda Base|Wuhou|Yulin|小龙坎|鹤鸣|人民公园|文殊院|熊猫繁育|武侯祠|玉林西路/i.test(text)) return 'Chengdu';
  if (/北京|Beijing|Forbidden|Temple of Heaven|Mutianyu|故宫|天坛|慕田峪/i.test(text)) return 'Beijing';
  if (/西安|Xi'an|Terracotta|Muslim Quarter/i.test(text)) return "Xi'an";
  if (/广州|Guangzhou|Cantonese Opera|Chen Clan|Shamian|Nanyue King|Guangdong Museum|陈家祠|粤剧艺术|沙面岛|南越王博物院|广东省博物馆/i.test(text)) return 'Guangzhou';
  if (/深圳|Shenzhen|Lianhua Hill|Nantou|Sea World Culture|Dafen|Futian Checkpoint|莲花山|南头古城|海上世界文化|大芬美术馆|福田口岸/i.test(text)) return 'Shenzhen';
  if (/杭州|Hangzhou|Broken Bridge|Bai Causeway|Lingyin|Feilai Peak|Shuangfeng|Deshou Palace|Liangzhu|断桥残雪|白堤|灵隐飞来峰|双峰馆区|德寿宫|中国京杭大运河博物馆|良渚博物院/i.test(text)) return 'Hangzhou';
  if (/昆明|Kunming|Green Lake|Cuihu|Dounan|Haigeng|Stone Forest|翠湖公园|昆明市博物馆|云南省博物馆|斗南花卉市场|海埂大坝|石林风景区/i.test(text)) return 'Kunming';
  if (/大理|\bDali\b|Cangshan|Erhai|Longkan|Xizhou|Yan Family Courtyard|Three Pagodas|苍山|洱海|龙龛|喜洲|严家大院|崇圣寺三塔/i.test(text)) return 'Dali';
  if (/丽江|\bLijiang\b|Mufu|Black Dragon Pool|Shuhe|Baisha Murals|Jade Dragon Snow Mountain|Glacier Park|木府|黑龙潭|束河|白沙壁画|玉龙雪山|冰川公园/i.test(text)) return 'Lijiang';
  if (/阳朔|\bYangshuo\b|Xingping|Chaobanshan|Longtoushan|Yulong River|Jima Wharf|Gongnong Bridge|Jiuxian|兴坪|朝板山|龙头山|遇龙河|骥马码头|工农桥|旧县村|双流义渡亭/i.test(text)) return 'Yangshuo';
  if (/桂林|\bGuilin\b|Lingui|Duxiu Peak|Jingjiang Princes|Elephant Trunk Hill|Reed Flute Cave|Mopan Mountain|Zhujiang Passenger|临桂|独秀峰|靖江王城|象鼻山|芦笛岩|磨盘山客运港|竹江客运港/i.test(text)) return 'Guilin';
  if (/张家界|\bZhangjiajie\b|Wulingyuan|Wujiayu|Tianzi Mountain|Bailong Elevator|Tianmen Mountain|武陵源|吴家峪|天子山|百龙天梯|天门山/i.test(text)) return 'Zhangjiajie';
  if (/苏州|\bSuzhou\b|Humble Administrator|Master-of-the-Nets|Master of the Nets|Lingering Garden|Tiger Hill|拙政园|网师园|留园|虎丘/i.test(text)) return 'Suzhou';
  if (/南京南站|南京博物院|南京大屠杀史实展|侵华日军南京大屠杀|中山陵|明孝陵|中华门瓮城|Nanjing South|Nanjing Museum|Nanjing Massacre history exhibition|Sun Yat-sen Mausoleum|Ming Xiaoling|Zhonghua Gate Barbican/i.test(text)) return 'Nanjing';
  if (/武汉站|湖北省博物馆南门|湖光序曲|黄鹤楼公园南门|中华路1号码头|中华路一号码头|江汉关博物馆|Wuhan Railway|Hubei Provincial Museum South Gate|Lake Light Prelude|Yellow Crane Tower Park South Gate|Zhonghua Road (?:No\.?|Number) 1 Ferry|Wuhan Customs House Museum/i.test(text)) return 'Wuhan';
  if (/青岛站|青岛天后宫|青岛德国总督楼旧址博物馆|青岛啤酒博物馆|青岛第一海水浴场|崂山游客服务中心|Qingdao Railway|Qingdao Tianhou|Qingdao German Governor|Tsingtao Brewery Museum|Qingdao First Bathing Beach|Laoshan Scenic Area Visitor Service Center/i.test(text)) return 'Qingdao';
  if (/长沙南站|湖南博物院|岳麓书院|橘子洲景区|长沙简牍博物馆|杜甫江阁|Changsha South Railway|Hunan Museum|Yuelu Academy|Orange Isle Scenic Area|Changsha Bamboo Slips Museum|Du Fu Pavilion/i.test(text)) return 'Changsha';
  if (/厦门北站|邮轮中心厦鼓码头|东渡客运码头|三丘田码头|华侨博物院|南普陀寺|厦门园林植物园西大门|Xiamen North Railway|Xiamen International Cruise Center Gulangyu Wharf|Sanqiutian Wharf|Overseas Chinese Museum|Nanputuo Temple|Xiamen Botanical Garden West Gate/i.test(text)) return 'Xiamen';
  return '';
}
function inferCategory(text) {
  const subject = String(text || '')
    .replace(/^\s*\d{1,2}[.)、:]\s+/, '')
    .split(/\s+\/\s+|\s+[—–-]\s+/)[0];
  if (/flower market|scenic area (?:visitor cent(?:er|re)|.*(?:gate|entrance))|greenway.*(?:prelude|portal|gateway)|花卉市场|景区(?:游客中心|.*(?:门|入口))|绿道.*(?:驿站|入口)/i.test(subject)) return 'See';
  if (/food|lunch|snack|restaurant|hotpot|bao|noodle|bakery|market|小吃|火锅|餐厅|饭店|面馆|咖啡|汤包|市场/i.test(subject)) return 'Eat';
  if (/hotel|stay|lobby|酒店|民宿/i.test(subject)) return 'Stay';
  if (/station|airport|metro|train|checkpoint|\bport\b|wharf|pier|terminal|cableway|ropeway|elevator|站|机场|口岸|码头|航站楼|索道|天梯/i.test(subject)) return 'Move';
  if (/\btea(?:\s*house)?\b|teahouse|茶社|茶馆|茶/i.test(subject)) return 'Tea';
  if (/museum|mosque|temple|pagoda|wall|monastery|shrine|garden|park|promenade|trail|island|isle|bridge|art(?:s)? center|gallery|exhibition hall|博物馆|清真|寺|塔|城墙|公园|花园|海滨|步道|岛|桥|美术馆|艺术中心|展览馆/i.test(subject)) return 'See';
  if (/food|lunch|snack|restaurant|hotpot|bao|小吃|火锅|餐厅|饭店|面馆|咖啡|汤包/i.test(text)) return 'Eat';
  if (/hotel|stay|lobby|酒店|民宿/i.test(text)) return 'Stay';
  if (/station|airport|metro|train|checkpoint|\bport\b|wharf|pier|terminal|cableway|ropeway|elevator|站|机场|口岸|码头|航站楼|索道|天梯/i.test(text)) return 'Move';
  if (/\btea\b|茶/i.test(text)) return 'Tea';
  return 'See';
}
function evidenceLine(text, place) {
  const aliases = [place.name, ...place.aliases].map((alias) => alias.toLowerCase());
  return cleanNote(text.split(/\n|。|；|;|•/).find((line) => !/^https?:/i.test(line.trim()) && aliases.some((alias) => line.toLowerCase().includes(alias))) || 'Found in the shared link metadata.');
}
function aliasesFor(place) {
  return [place.name, place.localName, ...(place.aliases || [])].map((alias) => String(alias || '').toLowerCase()).filter(Boolean);
}
function aliasMentioned(haystack, alias) {
  const needle = String(alias || '').toLowerCase();
  if (!needle) return false;
  if (/\p{Script=Han}/u.test(needle)) return haystack.includes(needle);
  if (needle === 'bund' && /\bbund\s+(?:hotel|hostel|inn|residence)\b/i.test(haystack) && !/\bthe bund\b/i.test(haystack)) return false;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(?:^|[^a-z0-9])' + escaped + '(?:$|[^a-z0-9])', 'i').test(haystack);
}
function cleanNote(line) { return compact(String(line || '').replace(/^[-\s]+/, '')).slice(0, 150); }
function compactLines(value) { return String(value || '').split(/\r?\n/).map(compact).filter(Boolean).join('\n'); }
function compact(value) { return String(value || '').replace(/%20/g, ' ').replace(/[+_]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function safeDecode(value) { try { return decodeURIComponent(String(value || '')); } catch { return String(value || ''); } }
