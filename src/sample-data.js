// Original fictional examples for the public demo. No private diary excerpts.
export const asset = (name) => `${import.meta.env.BASE_URL}images/${name}.svg`

export const sampleEntries = [
  {
    id: 'rain', date: '03.05', year: '2026', title: '把一场雨慢慢看完',
    excerpt: '末班车离开以后，雨还没有停。站台上只剩下一盏灯，替所有没说完的话亮着。',
    body: '虚构演示记录。想拍一个没有对白的短片：雨、站台和等车的人。镜头停留久一点，让空白成为叙事的一部分。',
    image: asset('rain'), tone: '深水蓝', tags: ['雨', '站台', '留白'],
    aiLine: '有时，停留也是一种抵达。', doodle: 'tide', position: 'float-a',
  },
  {
    id: 'tunnel', date: '03.14', year: '2026', title: '第二次经过这条隧道',
    excerpt: '火车穿过隧道时，窗户短暂地变成镜子。再出来，山和海都比记忆里近了一点。',
    body: '虚构演示记录。用重复的隧道镜头，讲一个关于错过与重逢的故事。人物不必解释，只需要在下一站回头。',
    image: asset('tunnel'), tone: '余烬黄', tags: ['镜头', '隧道', '重逢'],
    aiLine: '重生也许是带着新目光，经过同一个地方。', doodle: 'tunnel', position: 'float-b',
  },
  {
    id: 'mist', date: '03.16', year: '2026', title: '地图上没有的水域',
    excerpt: '梦里有一条很长的走廊，尽头不是门，而是一片泛着白雾的水。有人在对岸轻轻摇铃。',
    body: '虚构演示记录。把不合逻辑的空间留在纸上。等清晨来临，仍然能认出梦里那一点潮湿。',
    image: asset('mist'), tone: '雾白', tags: ['梦', '走廊', '铃铛'],
    aiLine: '梦替还没找到的地方，留下了坐标。', doodle: 'corridor', position: 'float-c',
  },
  {
    id: 'yellow', date: '03.21', year: '2026', title: '雾里有一小块黄色',
    excerpt: '今天只想记住一种颜色：阴天里，一把没有被风吹走的黄色伞。',
    body: '虚构演示记录。不急着给画面配上道理。先把那一点亮，放在可以再次看见的地方。',
    image: asset('yellow'), tone: '雨衣黄', tags: ['雾气', '黄色', '街角'],
    aiLine: '颜色有时先于答案抵达。', doodle: 'bell', position: 'float-d',
  },
  {
    id: 'pearl', date: '03.28', year: '2026', title: '一枚还没有名字的光',
    excerpt: '培养皿里有一枚小小的光。它没有催促我，只在我经过时，轻轻亮了一下。',
    body: '虚构演示记录。如果做一个电子伙伴，希望它安静、好奇，不需要喂养打卡，也不因为缺席而惩罚任何人。',
    image: asset('pearl'), tone: '旧瓷青', tags: ['培养皿', '微光', '陪伴'],
    aiLine: '被记住的东西，正在缓慢长出形状。', doodle: 'shell', position: 'float-e',
  },
]

export const sampleRecommendations = {
  rain: ['《花样年华》', '戴望舒〈雨巷〉', '坂本龙一 · Aqua'],
  tunnel: ['《堤》', '博尔赫斯〈小径分岔的花园〉', '宇多田光 · One Last Kiss'],
  mist: ['《潜行者》', '卞之琳〈断章〉', 'Brian Eno · An Ending (Ascent)'],
  yellow: ['《天使爱美丽》', '谷川俊太郎〈二十亿光年的孤独〉', 'Nils Frahm · Ambre'],
  pearl: ['《海洋之歌》', '威廉·布莱克〈天真的预言〉', 'Debussy · Rêverie'],
}
