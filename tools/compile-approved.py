"""Compile reviewed strings from the three supplied release files. No prose fallback."""
import hashlib
import json
import re
import sys
from pathlib import Path

source = Path(sys.argv[1])
root = Path(__file__).resolve().parents[1]
index = json.loads(next(source.glob('*指纹*.json')).read_bytes())
audit = json.loads(next(source.glob('*静态*.json')).read_bytes())
document = (source / index['file']).read_bytes()
digest = lambda b: hashlib.sha256(b).hexdigest()
if digest(document) != index['documentSha256'] or audit['sha256'] != digest(document):
    raise ValueError('document fingerprint mismatch')
lines = document.decode().splitlines(keepends=True)
library = {}
for row in index['scenes']:
    offset = row['lineInCompiled'] - 1
    block = ''.join(lines[offset:])[:row['textChars']]
    if not row['approved'] or digest(block.encode()) != row['contentSha256']:
        raise ValueError(row['eventId'])
    # Historical index entries end at the first act heading. Their reviewed
    # acts are authenticated by the compiled document hash above.
    if row['group']=='historical':
        end=next(i for i in range(offset+1,len(lines)) if re.match(r'^#{1,2} ',lines[i]))
        block=''.join(lines[offset:end])
    library[row['eventId']] = (offset, block.splitlines(), row['contentSha256'])
assert len(library) == index['approvedSceneCount'] == 113

def clean(line):
    return line.replace('*', '').strip()

catalog = {}
for key in ('P-S01', 'P-E01', 'P-S02'):
    offset, block, fingerprint = library[key]
    acts = [i for i,s in enumerate(block) if re.match(r'^\*\*第[一二三]幕', s)]
    branches = [i for i,s in enumerate(block) if re.match(r'^\*\*(选择)?[ABC][：｜]', s)]
    options = [i for i,s in enumerate(block) if re.match(r'^- [ABC]\. ', s)]
    end = next(i for i,s in enumerate(block) if s.startswith('**已审事实结果'))
    text = lambda a,b: [clean(s) for s in block[a:b] if s.strip()]
    body = text(acts[0]+1, options[0])
    if body[-1] == '玩家选择':
        body.pop()
    choices = {}
    for j,i in enumerate(options):
        letter = block[i][2]
        choices[letter] = {'label':block[i][5:], 'reply':text(branches[j]+1,(branches+[acts[2]])[j+1])}
    catalog[key] = {'title':re.search('《(.+?)》',block[0])[1],'variantId': 'v1' if key=='P-S02' else 'v2',
                    'fingerprint':fingerprint,'body':body,'choices':choices,'closing':text(acts[2]+1,end)}

# Only explicit player-facing line ranges are compiled. Table consequence columns stay out of the bundle.
def scene(key, start, end, choices, replies=None, variant='main'):
    offset, block, fingerprint = library[key.split('@')[0]]
    def line(n):
        assert 0 <= n-offset-1 < len(block), (key,n)
        return block[n-offset-1]
    def prose(a,b):
        return [clean(line(n)) for n in range(a,b+1) if line(n).strip()]
    opts = {}
    for letter,n in choices.items():
        s = line(n)
        if s.startswith('|'):
            label = re.sub(r'^[ABC]\. ', '', clean(s.split('|')[1]))
        else:
            label = clean(s.split('. ',1)[1])
        assert label.startswith('“') and label.endswith('”'), (key,label)
        opts[letter] = {'label':label,'reply':(replies or {}).get(letter,[])}
    catalog[key] = {'title':re.search('《(.+?)》',block[0])[1],'variantId':variant,'fingerprint':fingerprint,
                    'body':prose(start,end),'choices':opts,'closing':[]}

def table(key,a,b,first):
    scene(key,a,b,dict(A=first,B=first+1,C=first+2))

table('O01',2410,2418,2422)
table('O02',2428,2436,2440)
table('O03',2446,2454,2458)
for choice in ['A','B']:
    catalog['O03']['choices'][choice]['reply']=[clean(lines[i-1]) for i in [2464,2466,2468,2470]]
table('O04',2476,2478,2482)
table('O05',2490,2498,2502)
table('O06',2508,2516,2520)
table('O07',2528,2534,2538)
table('O08',2546,2556,2560)
table('Q01',3229,3239,3243)
table('Q02',3249,3255,3259)
table('Q03',3265,3267,3271)
scene('Q04',3279,3287,{})
# Approved numbered choices sometimes share a line with executor notes.
# Boundaries below always select an exact substring of that numbered source line.
def numbered(key, a,b, options, feedback):
    scene(key,a,b,dict(zip("ABC",options)),variant="v2")
    for letter, parts in zip("ABC", feedback):
        for n,stop in parts:
            value=lines[n-1].strip().removeprefix('- ')
            if stop:
                assert stop in value
                value=value.split(stop)[0]
            catalog[key]['choices'][letter]['reply'].append(clean(value))

numbered('E01',1609,1621,[1623,1627,1630], [[(1624,None),(1625,None)],[(1628,None)],[(1631,None),(1632,None),(1633,'没有报名')]])
numbered('E02',1639,1647,[1649,1652,1655], [[(1650,None),(1651,'记录真实')],[(1653,None),(1654,'记录稳健')],[(1656,None),(1657,'记录真实')]])
numbered('E03',1663,1671,[1673,1677,1681], [[(1674,None),(1675,None)],[(1678,None),(1679,None)],[(1682,None),(1683,None)]])
numbered('E04',1694,1700,[1702,1705,1708], [[(1703,None)],[(1706,None)],[(1709,None)]])
numbered('E05',1714,1718,[1720,1722,1724], [[(1721,None)],[(1723,None)],[(1725,None)]])
numbered('E06',1733,1743,[1745,1748,1751], [[(1746,None)],[(1749,None),(1750,None)],[(1752,None),(1753,None)]])
numbered('E07',1759,1765,[1767,1770,1773], [[(1768,None),(1769,None)],[(1771,None),(1772,None)],[(1774,None),(1775,None)]])
numbered('E08',1781,1785,[1787,1789,1791], [[],[],[]])
numbered('E09',1806,1814,[1816,1819,1822], [[(1817,None)],[(1820,None)],[(1823,None)]])
numbered('E10',1830,1834,[1836,1839], [[(1837,None)],[(1840,None)]])
numbered('E11',1868,1872,[1874,1876,1879], [[(1875,None)],[],[]])
numbered('E12',1889,1897,[1899,1901,1903], [[],[(1902,None)],[(1904,'几个人')]])
numbered('E13',1912,1918,[1920,1922,1924], [[],[],[]])
scene('E14',1935,1943,{})
numbered('E15',1961,1965,[1967,1970,1973], [[(1968,None)],[(1971,None)],[(1974,None)]])
catalog['E05']['closing']=[lines[1726].strip()]
catalog['E07']['closing']=[lines[1776].strip().split('进入E08')[0]]
catalog['E11']['closing']=[lines[1882].strip()]
def marked(n):
    return re.split(r'\*\*：|：\*\*',lines[n-1].strip(),maxsplit=1)[1].strip()
catalog['E03']['endings']={k:[marked(n)] for k,n in [('won',1686),('lost',1688)]}
catalog['E08']['endings']={k:[marked(n)] for k,n in [('improved',1794),('mixed',1796)]}
catalog['E14']['variants']={'lost':[lines[n-1].strip() for n in range(1947,1956,2)]}
catalog['E11']['choices']['B']['reply']=[marked(1878).split('只记录')[0]]
catalog['E11']['choices']['C']['reply']=[marked(1880)]
catalog['E11']['alternateC']=re.search('替代选项(“.+?”)',lines[1880])[1]
catalog['E12']['choices']['A']['reply']=[lines[1899].strip().split('**。')[1]]
catalog['E13']['choices']['C']['reply']=[lines[1924].strip().split('**。')[1].split('，比赛记录')[0]]
catalog['E13']['choices']['A']['reply']=[lines[1920].strip().removeprefix('- ').split('；')[0]]
catalog['E13']['choices']['B']['reply']=[lines[1922].strip().removeprefix('- ').split('；')[0]]
catalog['P-S02']['closing'].pop()  # Executor cue after the final narrative paragraph.
numbered('O-A01',4145,4157,[4159,4163,4167], [[(4160,None),(4161,None)],[(4164,None),(4165,None)],[(4168,None)]])
catalog['O-A01']['choices']['A']['reply'] += [clean(lines[n-1]) for n in range(4173,4186,2)]
numbered('O-A02',4789,4797,[4799,4801,4803], [[],[],[]])
numbered('O-A03',4812,4818,[4820,4822,4824], [[],[],[]])
for key,n in [('O-A02',4806),('O-A03',4827)]:
    for c in ['A','B']:
        catalog[key]['choices'][c]['reply']=[marked(n).split('此时仍没有')[0]]
numbered('E-A01',4704,4710,[4712,4715,4717], [[],[],[(4718,'这次不参加')]])
catalog['E-A01']['choices']['A']['reply']=[marked(4714).split('你没有参赛')[0]]
table('Q-U01',4006,4014,4018)
catalog['Q-U01']['closing']=[clean(lines[n-1]) for n in [4022,4024]]
for key in ['E-A01','O-A01','O-A02','O-A03','Q-U01']:
    catalog[key]['variantId']='v1'
table('D-H01',4315,4331,4335)
table('D-H01@practice',4343,4357,4361)
table('D-H01@review',4367,4379,4383)
for key,variant in [('D-H01','plan'),('D-H01@practice','practice'),('D-H01@review','review')]:
    catalog[key]['variantId']=variant
catalog['D-H01']['choices']['B']['reply']=[lines[4335].split(' | ')[1].split('大家重新')[0]]
catalog['D-H01']['choices']['C']['reply']=[lines[4336].split(' | ')[1].split('本次正规')[0]]
numbered('E16',1985,1991,[1993,1997,2000], [[(1994,None),(1995,None)],[(1998,'真正老队友')],[(2001,None)]])
numbered('E17',2006,2010,[2012,2015,2018], [[(2013,None),(2014,'；')],[(2016,None),(2017,None)],[(2019,None)]])
numbered('E18',2026,2032,[2034,2038,2042], [[(2035,None)],[(2039,None),(2040,None)],[(2043,None),(2044,None)]])
catalog['E18']['endings']={k:[marked(n).split('进入E')[0]] for k,n in [('pass',2047),('fail',2049)]}
numbered('E19',2055,2057,[2059,2062,2065], [[(2060,None)],[(2063,None)],[(2066,None)]])
numbered('E20',2080,2086,[2088,2091,2093], [[(2089,None)],[],[(2094,None)]])
numbered('E21',2099,2105,[2107,2110], [[],[]])
# The second session is a separate dated event. Show its closing only after attendance.
scene('O-A02@session2',4795,4795,{},variant='session2')
catalog['O-A02@session2']['body']=[]
catalog['O-A02@session2']['closing']=catalog['O-A02']['choices']['A']['reply']
for letter in ['A','B']:
    catalog['O-A02']['choices'][letter]['reply']=[]
numbered('E10@overlap',1845,1851,[1853,1856,1860], [[(1854,None)],[(1857,None)],[(1861,None)]])
catalog['E10@overlap']['variantId']='overlap'
catalog['E10@overlap']['choices']['B']['reply'].append(marked(1859).split('你选择')[0])
scene('D-H01@arrival',4315,4315,{},variant='first-practice')
catalog['D-H01@arrival']['body']=[]
scene('C-DH01-2',4592,4598,{},variant='no-attendance')
scene('C-DH01-2@partial',4566,4588,{},variant='partial')
catalog['E-A01']['endings']={'played':[marked(4720).split('胜负在')[0]],'cancelled-short-roster':catalog['E-A01']['choices']['A']['reply']}
catalog['E-A01']['choices']['A']['reply']=[]
numbered('E-A02',4726,4732,[4734,4736,4738], [[(4735,'新对局')],[(4737,'其他队友')],[(4739,'这次邀约')]])
for letter in ['A','B']:
    catalog['E-A02']['choices'][letter]['reply'].append(marked(4741))
numbered('E-A03',4747,4751,[4753,4755,4757], [[(4754,'真正到场')],[],[(4758,'你继续')]])
scene('E-A03@practice',4749,4749,{},variant='practice')
scene('E-A03@finish',4749,4749,{},variant='finish')
for key in ['E-A03@practice','E-A03@finish']:
    catalog[key]['body']=[]
catalog['E-A03@finish']['closing']=[marked(4760).split('只有实际')[0]]
numbered('E-A04',4766,4772,[4774,4776,4778], [[],[],[]])
for letter in ['A','B']:
    catalog['E-A04']['choices'][letter]['reply']=[marked(4781).split('以后如果')[0]]
for key in ['E-A02','E-A03','E-A04']:
    catalog[key]['variantId']='v1'
scene('E19@assessment',2071,2073,{},variant='assessment')
catalog['E19@assessment']['endings']={
    'pass':[marked(2075).split('进入E22')[0]],
    'fail':[marked(2076).split('当前Tn')[0]]
}
numbered('E22',2117,2121,[2123,2126,2128], [[],[(2127,'进入下面')],[(2129,None)]])
catalog['E22']['choices']['A']['reply']=[lines[2124].strip().removeprefix('- ').split('进入E23')[0]]
scene('E22@negotiate',2136,2136,{},variant='negotiate')
catalog['E22@negotiate']['closing']=[marked(2138).split('你实际签署')[0]]
numbered('E23',2149,2155,[2157,2160,2163], [[(2158,None),(2159,None)],[(2161,None),(2162,None)],[(2164,None),(2165,None)]])
catalog['E23']['closing']=[lines[2166].strip()]
scene('E23@season',2173,2175,{},variant='season')
catalog['E23@season']['closing']=[]
# Check each serialized display fragment against its own authenticated scene.
def strings(node):
    if isinstance(node, list):
        yield from node
    elif isinstance(node, dict):
        for value in node.values():
            yield from strings(value)
    else:
        yield node
for key,scene_data in catalog.items():
    approved = clean('\n'.join(library[key.split('@')[0]][1]))
    for text_key in ['title','body','choices','closing','endings','variants','alternateC']:
        for fragment in strings(scene_data.get(text_key, [])):
            assert fragment and fragment in approved, (key,fragment)
    scene_data['textSha256']=digest(json.dumps(scene_data,ensure_ascii=False,sort_keys=True).encode())
    scene_data['choiceHashes'] = {letter:digest(choice['label'].encode()) for letter,choice in scene_data['choices'].items()}
content = "'use strict';\n// Generated by tools/compile-approved.py from fingerprinted human-reviewed text.\n"
content += 'globalThis.LifeApprovedText = '+json.dumps(catalog, ensure_ascii=False,indent=2)+';\n'
target = root/'approved-text.js'
if '--check' in sys.argv:
    assert target.read_text()==content
else:
    target.write_text(content)
print(f'{len(library)} verified source fingerprints, {len(catalog)} compiled scenes')
