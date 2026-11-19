'use strict';

// Chapter rules read committed facts. Results are applied by the existing turn transaction.
globalThis.LifeChapters=(()=>{
  const age=r=>LifeContent.ages[r.slot-1];
  const ref=(f,a)=>({branch:f.branch??null,slot:f.slot,eventId:f.eventId,choiceId:f.choiceId,...(a?{actionId:a.actionId}:{})});
  function records(r,id){
    return r.facts.flatMap(f=>(f.actions??[]).filter(a=>a.actionId===id).map(a=>({f,a,source:ref(f,a)})));
  }
  const last=(r,id)=>records(r,id).at(-1);
  const passed=(r,id)=>last(r,id)?.a.result.outcome==='通过';
  const has=(r,id)=>!!last(r,id);
  const src=(r,...ids)=>ids.flatMap(id=>{const hit=last(r,id);return hit?[hit.source]:[];});
  const sample=(r,id)=>r.facts.filter(f=>f.inspected===id).slice(-1).map(f=>ref(f));
  const method=(id,label,detail,retry=false)=>({id,label,detail,retry});
  const Q='qualification',I='investment';
  function desk(id,label,window,kind,station,methods,config={}){
    const {when=()=>true,repeat=false,route,...rest}=config;
    return {id,label,kind,station,methods,window,after:route==='03',until:window[1],time:1,energy:1,money:0,...rest,
      available:r=>r.slot>=window[0]&&r.slot<=window[1]&&(!route||repeat||!has(r,route+'-'+id))&&when(r)};
  }
  function exam(id,label,window,route,station,methods,gate,judge,config={}){
    return desk(id,label,window,'fate-result',station,methods,{route,attempt:r=>id+'-'+(2008+age(r)),qualification:gate,judge,
      next:'这次结果会留下。下一次机会仍要重新准备。',...config});
  }
  const nudge=method('retry','先照抄上一页','两处材料对不上。再看一次标记的位置。',true);
  const drill=desk('pair','和替补一起排开局',[13,35],I,'录像室 · 对面连续两局从河道夹击，前排的视野只有一侧。',[
    method('cover','后排先守退路','前排回头时看见了你的标记，撤退时两个人都还在。'),
    method('swap','让替补换到侧翼','替补先报了两边脚步，队友把第一次交手拖到了集合后。')],{route:'01',repeat:true});
  const arena=[drill,
    desk('open-room','借社区机位打一场公开练习',[23,30],'contact','社区公开日 · 原队四缺一，桌旁有张空白位置表。',[
      method('fill','填补位，听队友报点','你打完了两轮补位，把下一次公开试训的时间记了下来。')],{route:'01'}),
    exam('trial','参加公开试训',[18,34],'01','试训席 · 两个队友同时要你补防。录像里侧翼先露出空档。',[
      method('side','回应侧翼，再报换防时间','教练留下了这次换防的记录。')],r=>has(r,'01-replay')&&has(r,'01-pair')?src(r,'01-replay','01-pair'):[],(p,x)=>p.length+x>=2,{repeat:true}),
    desk('roster','在训练队名单上签位置',[19,35],Q,'队伍名单 · 试训反馈写着「补位」。名单上还缺替补位置。',[
      method('sub','签替补席，参加合练','你的名字排进训练队。教练把下期合同单另外留给你。')],{route:'01',when:r=>passed(r,'01-trial'),proof:r=>src(r,'01-trial')}),
    desk('pro','签短约并交还原岗位班表',[23,35],Q,'合同桌 · 短约写明训练时段和随队责任，原来的整班需要交回。',[
      method('sign','核对上场条款，签约','你签下职业短约，报酬从本期换成队伍工资。')],{route:'01',when:r=>has(r,'01-roster'),proof:r=>src(r,'01-roster'),resolve:()=>({newJob:'player'})}),
    desk('regional','为地区赛对手重排站位',[24,37],I,'战术板 · 对手这次故意放空中路，你们要决定谁看后侧。',[
      method('scout','留观察位，自己压后','你在正式地区赛上看住了后侧。队长把上场记录交给联赛核验。'),
      method('bench','在场边记换防','替补记录交给教练。队伍的上场单里没有你的名字。')],{route:'01',repeat:true,when:r=>r.career==='player',resolve:(r,m)=>({played:m.id==='scout'})}),
    exam('cup','参加职业邀请赛决胜局',[27,38],'01','赛场 · 最后一轮，队长询问你是否承担后场指挥。',[
      method('play','上场接指挥位','耳机里队友复述了你的换防口令。')],r=>r.career==='player'&&last(r,'01-regional')?.a.result.played?src(r,'01-regional'):[],(p,x)=>p.length+x>=4,{when:r=>r.career==='player',repeat:true,
      resolve:(r,m,v)=>({detail:v.outcome==='通过'?'终局比分锁定，你以实际出场队员的身份拿到邀请赛冠军。':'这一届没有拿到冠军。你把最后一轮失位留在了录像里。'})}),
    desk('world-entry','凭邀请赛成绩核验世界赛名额',[28,37],Q,'报名台 · 名额属于本届阵容。核对队伍成绩、合同和本人上场单以后，才能递交名单。',[
      method('list','对照三张表，递交本届名单','队务收下了成绩、合同和出场单。本届世界赛报名获准。')],{route:'01',when:r=>r.career==='player'&&passed(r,'01-cup')&&has(r,'01-pro')&&last(r,'01-regional')?.a.result.played,
      proof:r=>src(r,'01-cup','01-pro','01-regional'),resolve:r=>({season:2008+age(r)+1})}),
    exam('world-series','为本届世界赛打最后一个赛段',[29,38],'01','决胜局 · 对手连放两次假视野。前场要你确认之前练过的回撤点。',[
      method('rotate','自己上场，呼叫回撤后换防','队友复述了换防指令。')],r=>src(r,'01-world-entry','01-regional'),(p,x)=>p.length+x>=4,{
      when:r=>r.career==='player'&&last(r,'01-world-entry')?.a.result.season===2008+age(r),completeOnPass:true,
      resolve:(r,m,v)=>({detail:v.outcome==='通过'?'你在决胜局亲自上场。奖牌递过来时，队友还在学你最后那句报点。':'你打完了这个赛段。比分停在对手那边，队友仍把这届阵容照递给你。',played:true})}),
    desk('world-sheet','核对旧世界赛的本人上场单',[40,40],Q,'散场后的技术台 · 拿赛果表对照自己的出场记录。',[method('verify','圈出自己的出场栏','世界赛决胜局的上场记录和冠军成绩对上了。')],{route:'01',time:0,proof:r=>r.facts.filter(f=>f.highlights.includes('world')).map(f=>ref(f)),when:r=>r.facts.some(f=>f.highlights.includes('world')&&f.trace?.commands.includes('final:play')),resolve:()=>({achieved:true})}),
    desk('retire','到训练室做最后一次交班',[30,39],Q,'退队日 · 有人需要接过你写过的战术板，也可以把录像留在这里。',[
      method('mentor','留下录像，去队务岗','下一任替补沿着你标的时间点回看。你改领队务岗位工资。'),
      method('leave','收起自己的耳机','你交还了队服，停领选手工资。')],{route:'01',after:true,when:r=>r.career==='player'&&has(r,'01-regional'),proof:r=>src(r,'01-regional'),resolve:(r,m)=>({newJob:m.id==='mentor'?'office':null})})];
  const ug='03-enrol',ms='03-enrol-ms';
  const enrollment=r=>[last(r,ug),last(r,ms)].filter(Boolean).sort((a,b)=>b.f.slot-a.f.slot)[0];
  const studyId=(r,id)=>last(r,id)?.f.slot>=(enrollment(r)?.f.slot??99);
  const school=[
    desk('tutorial','拿错题去找一起讲过题的人',[9,34],I,'自习桌 · 旧错题里那一步约分，阿宁要你先解释符号为什么能消掉。',[
      method('explain','先写取值范围，再互换演算','阿宁把零代回去，和你一起划掉了不成立的那一行。')],{route:'03',when:r=>r.facts.some(f=>f.choiceId==='life-7-1')&&!r.facts.some(f=>f.relations?.some(c=>c.id==='friend'&&c.status==='lost')),proof:r=>r.facts.filter(f=>f.choiceId==='life-7-1').map(f=>ref(f))}),
    desk('register-school','在学校核验高考报名表',[12,12],Q,'报名台 · 核对本市学籍、应届高中资格、选考科目与照片。',[method('verify','核对学籍和物理选考栏','本场景的京籍应届普通高中材料通过现场确认，准考信息留档。')],{route:'03',time:0}),
    desk('paper','完成统考卷并核对答题卡',[13,13],Q,'考场 · 草稿有两个根，题干限定分母不为零。',[
      method('domain','排除使分母为零的根','你把有效解写入答题卡，实际交卷。'),method('both','把两个候选根都写上','交卷后你才发现，多写的那个根让分母为零。')],{route:'03',when:r=>has(r,'03-register-school'),proof:r=>src(r,'03-register-school','03-revise'),resolve:(r,m)=>({scoreReady:has(r,'03-revise')&&m.id==='domain',examYear:2026})}),
    ...['ug','ms'].map(level=>desk('apply-'+level,level==='ug'?'用往届生材料参加普通高考报名':'以本科毕业学历报名硕士统考',[25,36],Q,
      level==='ug'?'核验台 · 京籍往届高中毕业，在校高校学籍和禁考状态须先排除。':'研招台 · 本场只接受已核验的本科毕业学历；选定北大计算机学术硕士。',
      [method('check','逐栏核验并签报名表','报名点核对了个人材料。本次报名只对应这次考试。')],{route:'03',repeat:true,money:30,
        when:r=>has(r,level==='ug'?'03-ask-undergrad':'03-degree')&&(level==='ug'||has(r,'03-ask-grad'))&&!activeStudy(r)&&(!last(r,'03-apply-'+level)||age(r)>last(r,'03-apply-'+level).f.age+1),
        proof:r=>src(r,level==='ug'?'03-ask-undergrad':'03-ask-grad','03-degree'),resolve:r=>({level,examYear:2008+age(r)+1,policy:'BJ-2026',school:'北京大学'})})),
    ...['ug','ms'].map(level=>exam('exam-'+level,level==='ug'?'参加普通高考，填报北大志愿':'参加硕士初试并完成专业复试',[26,39],'03',
      level==='ug'?'考场和志愿表 · 选考物理，复查那道容易漏定义域的题。':'复试桌 · 导师请你解释本科项目里一次失败的验证。',
      [method('submit',level==='ug'?'核卷、交卷并提交第一志愿':'提交初试卷，陈述项目复核过程','本届考核结束，投档与复试记录已归档。')],
      r=>src(r,'03-apply-'+level,'03-revise'),(p,x)=>p.filter(e=>e.action.actionId==='03-revise').length+x>=2,
      {repeat:true,money:60,when:r=>last(r,'03-apply-'+level)?.a.result.examYear===2008+age(r)&&!!last(r,'03-revise')&&last(r,'03-revise').f.slot>last(r,'03-apply-'+level).f.slot,
        resolve:(r,m,v)=>({level,school:'北京大学',examYear:2008+age(r),detail:v.outcome==='通过'?'本届成绩达到遴选要求。下一步可核对院校的录取名单。':'这一次成绩未达到遴选要求。之前的学习和工作经历都还在。'})})),
    ...['ug','ms'].map(level=>desk('offer-'+level,level==='ug'?'核对本科投档与录取通知':'核对硕士拟录取和最终通知',[27,39],Q,
      '招生公示板 · 名单按准考编号和学段排列。找到本人的编号，再看学校盖章的通知。',[
        method('number','核验自己的编号与学段','你收好了北京大学的正式录取通知。入学还需自行办理。')],{route:'03',repeat:true,time:0,when:r=>{
          const result=last(r,'03-exam-'+level);return passed(r,'03-exam-'+level)&&age(r)-result.f.age<=1&&(!last(r,'03-offer-'+level)||last(r,'03-offer-'+level).f.slot<result.f.slot);
        },proof:r=>src(r,'03-exam-'+level),resolve:r=>({school:'北京大学',level,examYear:last(r,'03-exam-'+level).a.result.examYear})})),
    ...['ug','ms'].map(level=>desk(level==='ug'?'enrol':'enrol-ms',level==='ug'?'持本科通知书报到、选择课程':'持硕士通知书办理全日制入学',[15,40],Q,'注册台 · 确认实际就读、课程方向和离岗安排。',[
      method('compute','计算方向，登记机房课','你领到课表，把机房开放时间贴在宿舍桌前。')],{route:'03',repeat:true,
      when:r=>!activeStudy(r)&&(level==='ug'&&r.slot===15&&has(r,'03-paper')&&r.facts.some(f=>f.slot===14&&f.trace?.commands.some(c=>['admit:reach','admit:steady'].includes(c)))||
        has(r,'03-offer-'+level)&&age(r)-last(r,'03-exam-'+level).f.age<=1&&(!enrollment(r)||last(r,'03-offer-'+level).f.slot>enrollment(r).f.slot)),
      proof:r=>src(r,'03-paper','03-offer-'+level).concat(r.facts.filter(f=>r.slot===15&&f.slot===14).map(f=>ref(f))),
      resolve:r=>({level,school:r.slot===15&&!r.facts.some(f=>f.highlights.includes('school'))?'备选本科院校':'北京大学',entryYear:2008+age(r),years:level==='ug'?4:3,newJob:null})})),
    desk('course','选课后完成一次实验',[16,42],I,'机房 · 同一输入，两组输出不同。助教让你保留可复查的过程。',[
      method('compare','固定输入，逐列对照输出','实验本里留下了第一次能复现差异的样例。')],{route:'03',repeat:true,when:r=>!specialStudy(r)&&activeStudy(r)&&!studyId(r,'03-course'),proof:r=>[enrollment(r).source]}),
    desk('project','拿实验本去做课程项目',[17,43],I,'课题组 · 上次留下的反例今天又出现了。',[method('repeat','用旧样例复核新方案','新方案和旧样例一起进入课程作品档案。')],{route:'03',repeat:true,when:r=>!specialStudy(r)&&activeStudy(r)&&studyId(r,'03-course')&&!studyId(r,'03-project'),proof:r=>src(r,'03-course')}),
    desk('degree','提交课程档案和毕业答辩',[19,44],Q,'答辩桌 · 老师翻开你的实验本，问新方案改掉了哪一处错误。',[method('defend','用两版结果回答并核验学分','答辩和培养环节核验完成，毕业材料入档。')],{route:'03',repeat:true,when:r=>!specialStudy(r)&&activeStudy(r)&&studyId(r,'03-project')&&age(r)-enrollment(r).f.age>=enrollment(r).a.result.years,
      proof:r=>[enrollment(r).source,...src(r,'03-course','03-project')],resolve:r=>({...degreeFields(r),achieved:enrollment(r).a.result.school==='北京大学'})})];
  function specialStudy(r){return [['08-medentry','08-diploma'],['J08-college','J08-teachdegree']].some(([start,end])=>has(r,start)&&!has(r,end)&&!r.facts.some(f=>f.slot>last(r,start).f.slot&&f.careerAfter&&f.careerAfter!==f.careerBefore));}
  function degreeFields(r){const a=enrollment(r).a.result;return {school:a.school,level:a.level,entryYear:a.entryYear,graduationYear:2008+age(r)};}
  function activeStudy(r){if(specialStudy(r))return true;const e=enrollment(r);return !!e&&(!last(r,'03-degree')||last(r,'03-degree').f.slot<e.f.slot)&&!r.facts.some(f=>f.slot>e.f.slot&&f.careerAfter&&f.careerBefore!==f.careerAfter);}
  const house=[
    desk('give-notice','退租，暂时回到合住的房间',[27,45],Q,'钥匙交还窗口 · 清点留下和随身带走的东西，结清这一期租金，退回原押金。',[
      method('return','核对押金收据，退还钥匙','你带走自己的物件。旧地址留在履历里，往后可以重新看房。')],{route:'29',after:true,repeat:true,when:r=>!!residence(r),proof:r=>[residence(r).source],resolve:r=>({endLease:true,depositBack:residence(r).a.result.rent})}),
    desk('walk-block','走两条通勤路，记下想住的地方',[16,40],'contact','看房本 · 河街离站点近、夜里车多；里巷离家人近、早班多一趟车。',
      [method('river','从河街走到工作站','你想住在河街。收班以后，还能沿河走回去。'),method('lane','从里巷试走早班路','你想住在里巷。屋子小一点，但附近有人照应。')],{route:'29',repeat:true,
      resolve:(r,m)=>({place:m.id,reason:m.detail,...(last(r,'J03-drop')?.a.result.delivered?{streetEvidence:last(r,'J03-drop').source}:{})})}),
    ...[['river',180,'河街'],['lane',100,'里巷']].map(([place,price,name])=>desk('lease-'+place,'签'+name+'租约（首期及押金 '+price+' 元）',[24,42],Q,
      name+'租约 · '+(place==='river'?'押金 90、首期 90；靠近站点，夜班后少走两站。':'押金 50、首期 50；房间小，上早班需多转一趟。'),
      [method('solo','一个人签，核对交钥匙日期','你接过钥匙，今晚开始在这里睡。')],{route:'29',repeat:true,money:price,when:r=>place!==residence(r)?.a.result.place,resolve:r=>({place,name,rent:price/2,depositBack:residence(r)?.a.result.rent??0,commute:place==='lane'&&['factory','delivery'].includes(r.career)?1:0}),proof:r=>src(r,'29-walk-block')})),
    desk('settle-room','布置搬进来的第一角',[25,43],I,'靠窗的一角 · 床头或抽屉留给仍在手里的物件，也可以只把椅子搬到光里。',
      [method('chair','把椅子挪到窗边','椅子挪过来，晚饭时能看见天色慢慢暗下去。'),method('drawer','把手边的旧物收进抽屉','抽屉里留了一格。'),method('shelf','把仍在身边的纪念物摆到桌角','你给桌角留出了一小块地方。')],{route:'29',repeat:true,when:r=>r.slot!==28&&!!residence(r),
      proof:r=>[residence(r).source],resolve:(r,m)=>{const item=m.id!=='chair'?keepsake(r):null;return {place:residence(r).a.result.place,item,placement:m.id,detail:item?'你把'+LifeContent.items[item][0]+(m.id==='drawer'?'收进抽屉。':'摆在桌角。'):m.id==='chair'?m.detail:'桌角空着，给将来带回来的东西留了位置。'};}}),
    desk('return-home','下班回家，把窗边漏雨的缝补好',[26,44],I,'回家的夜里 · 风从旧窗框钻进来。先看水痕从哪边开始。',[
      method('seal','沿水痕封窗，再开半扇透气','下一场雨来时，窗下那张椅子还是干的。')],{route:'29',repeat:true,money:15,when:r=>sameHome(r,'29-settle-room'),proof:r=>[residence(r).source,...src(r,'29-settle-room')]}),
    desk('stay','回到住过多年的那扇窗前',[29,46],Q,'门口 · 你还记得大雨时该先关哪半扇窗。',[
      method('open','推开那半扇窗','你先推开不漏雨的那半边。这么多年，身体比钥匙还记得怎么回家。')],{route:'29',when:r=>sameHome(r,'29-return-home')&&age(r)-residence(r).f.age>=3,proof:r=>[residence(r).source,...src(r,'29-settle-room','29-return-home')],resolve:r=>({achieved:true,place:residence(r).a.result.name})})];
  function residence(r){const latest=[last(r,'29-lease-river'),last(r,'29-lease-lane'),last(r,'29-give-notice')].filter(Boolean).sort((a,b)=>b.f.slot-a.f.slot)[0];return latest?.a.result.endLease?null:latest;}
  function sameHome(r,id){return (last(r,id)?.f.slot??0)>(residence(r)?.f.slot??99);}
  function keepsake(r){
    const items=Object.assign({},...r.facts.map(f=>f.trace?.items));
    return ['lamp','yearbook','yoyo','letter','badge','map','tools'].find(k=>['display','stored'].includes(items[k]))??null;
  }
  const shift=(route,job)=>['full','part','study','leave'].map((mode,i)=>({
    id:job+'-'+mode,kind:'employment',mode,label:['排整班（300 元）','签半班（150 元）','停薪备考','请假照护'][i],feedback:['排班表上写进了整班。','半班留出一个余段。','这期腾出时间读书，工资停发。','请假条交进了排班室。'][i],
    time:mode==='part'?1:0,energy:0,money:0,available:r=>r.slot>=24&&r.slot<=40&&r.career===job}));
  const office=[
    desk('redundancy','并组后办理岗位撤销和交接',[36,36],Q,'人事桌 · 原部门撤岗。选择结束合同，领走离岗证明，之后可应聘新岗。',[
      method('close','核对停止发薪日期并归档','原部门岗位撤销，你留下了办过的材料，收入在这期中断。')],{route:'J01',time:0,when:r=>r.eventId==='office-pivot',resolve:()=>({newJob:null})}),
    desk('sheet','给跨组退件补一张流转单',[25,38],I,'退件夹 · 金额和小票一致，但业务组、成本中心分别由两人确认。',[
      nudge,method('owners','分别圈出经办组和核准栏','你把确认人写在两栏旁边，下一组可以按顺序接手。')],{route:'J01',when:r=>sample(r,'cost-center').length,proof:r=>sample(r,'cost-center')}),
    desk('reuse-sheet','让下一组用流转单处理第二张票',[26,40],Q,'第二张票 · 小周沿用你的表，却发现跨组票少一处签收。',[
      method('receipt','添回执联，请对方实际试填','小周用新版交完第二张票，退件夹里终于少了一叠纸。')],{route:'J01',when:r=>has(r,'J01-sheet')&&r.facts.some(f=>f.people.includes('colleague')),proof:r=>src(r,'J01-sheet')}),
    desk('trace-copy','给重复入账的同一张票核销副联',[30,40],Q,'月结桌 · 小周的两联票金额一样，回执号也一样，只有第一联已入账。',[method('check','按回执号对账，标记副联','小周按回执号撤下重复的副联，两组的月账终于对齐。'),method('return','请成本组退回副联重核','成本组在副联上写明已入账，原件留在你的交接夹。')],{route:'J01',when:r=>has(r,'J01-reuse-sheet'),proof:r=>src(r,'J01-reuse-sheet')}),
    desk('archive-copy','同小周查找当年的副联',[41,45],Q,'档案室 · 退休前，小周在找同一编号的另一联。',[method('open','循当年的处理记录开夹','你们核对了留存位置。')],{route:'J01',visitor:true,when:r=>has(r,'J01-trace-copy'),proof:r=>src(r,'J01-trace-copy'),resolve:r=>({detail:last(r,'J01-trace-copy').a.payload.method==='return'?'成本组寄回的副联还夹在交接册里，小周按你的旧批注找到了它。':'小周顺着核销标记，在月账附件里翻到了那张重复的票。'})}),
    desk('handover-sheet','把第二张回执交给接手的人',[37,45],Q,'交接桌 · 把曾经走通过的那张票放到新人的文件夹。',[method('file','按回执日期归档','后来的人顺着你的签收栏找到了责任组。')],{route:'J01',visitor:true,when:r=>has(r,'J01-reuse-sheet'),proof:r=>src(r,'J01-reuse-sheet')})];
  const factory=[
    desk('light-bench','从站线岗位转到坐式复核桌',[29,40],'employment','班组排班 · 连续站线已经很累，可以改签坐式半班，收入随工时调整。',[
      method('sit','把站线交回，签坐式半班','师傅把复核夹搬到矮桌上。这一期少站半班，也少领半班工资。')],{route:'J02',mode:'part',when:r=>has(r,'J02-training'),proof:r=>src(r,'J02-training'),resolve:()=>({healthDelta:2})}),
    desk('training','跟班读工单，核对公用工具柜',[24,35],I,'工单 B8 · 班组长指给你看领用栏。8 号套筒没有归位，柜里只有 10 号。',
      [method('ten','先领 10 号','规格不符。班组长指了指工单和柜号。',true),method('hold','挂缺件牌，跟班核对补领','你和当班师傅一起补登工具，培训记录上有了两人的签名。')],{route:'J02'}),
    desk('authorize','交回培训记录，做岗位核验',[25,37],Q,'授权栏 · 这张卡只授权查看读数、记录和复核，不授权开机检修。',[method('limit','对照工种签核权限','师傅确认你的读数与记录权限。异常设备仍由授权维护人员处理。')],{route:'J02',when:r=>has(r,'J02-training'),proof:r=>src(r,'J02-training')}),
    desk('quality','核对两次读数，给异常件挂牌',[26,39],I,'检验台 · 工单 20±0.2，第二次读数为 20.6。隔离筐在右手边。',
      [method('pass','盖合格章','第二个读数超出上限。合格章留在印盒里。',true),method('isolate','隔离这件并报给授权人员','异常件进入隔离筐，批次编号留在复检单上。')],{route:'J02',when:r=>has(r,'J02-authorize'),proof:r=>src(r,'J02-authorize')}),
    desk('release','复核返件，签交接记录',[27,40],Q,'返检单 · 授权维修已签回，复检两次为 20.0、20.1。',[method('sign','核对同一批号，签复检','这次复核合格。你把原异常单和返件单订到一起。')],{route:'J02',when:r=>has(r,'J02-quality'),proof:r=>src(r,'J02-quality')}),
    desk('lot-card','拆开错夹在一起的两张批次卡',[30,40],Q,'复核台 · 返件卡印着 B8，新到的一箱标 B9。新人把两箱的卡夹在一起。',[method('split','按箱号分卡，把新箱送回复核','B8 的签名留在返件册，B9 收到了独立复核号。'),method('hold','封存两箱，等交班人当面核对','接班人在两张卡上分开签字后才放行。')],{route:'J02',when:r=>has(r,'J02-release'),proof:r=>src(r,'J02-release')}),
    desk('recall-lot','在旧批次册里追溯 B9',[41,45],Q,'班组资料桌 · 新人需要追溯当年的新箱，手上只有箱号。',[method('locate','按原件登记找回签收人','新人找到了原签收页。')],{route:'J02',visitor:true,when:r=>has(r,'J02-lot-card'),proof:r=>src(r,'J02-lot-card'),resolve:r=>({detail:last(r,'J02-lot-card').a.payload.method==='split'?'新人查到 B9 自己的复核号，把新箱同旧返件分开。':'交班人当面的两处签名还在封存页上。新人依照箱号核对了经手人。'})}),
    desk('teach','带新人辨认那张旧异常单',[33,45],Q,'工具柜前 · 新人只看了第一次读数，你翻出当年的第二行。',[method('second','请新人自己圈出异常那一行','新人把批号和第二行读数一起念给你听。')],{route:'J02',when:r=>has(r,'J02-release'),proof:r=>src(r,'J02-training','J02-release')})];
  const delivery=[
    desk('drop','接河街订单，从取餐到签收',[24,38],Q,'HS-17 · 河街面馆 → 桥东书店。路费 3 元；送达后本单履约费 18 元。',[
      method('receipt','核对尾号，交餐并存回执','蓝签回执留下了这次交付，本单净收入 15 元。'),
      method('return','联系站点退回，记未履约','这次没能交付。路费照付，没有履约费。')],{route:'J03',money:3,
      steps:[{prompt:'商家还有一锅面没出。书店侧门午后关门。',choices:[method('eta','问出餐时间，告知书店','商家还要五分钟，书店答应在侧门等。'),method('rush','直接记作取餐','餐还没出。',true)]},
        {prompt:'取餐架有两份同姓订单：蓝签 HS-17，白签 HS-71。',choices:[method('blue','取蓝签，核对封口','单号相符，餐已取。'),method('white','取白签','尾号不符，餐留在架上。',true)]},
        {prompt:'地图上的桥口有围挡，东巷通向书店侧门。',choices:[method('east','从东巷安全绕行','你按约到达书店侧门。'),method('bridge','走封闭桥口','围挡还在，需要另选可通行的道路。',true)]}],
      resolve:(r,m)=>({order:'HS-17',delivered:m.id==='receipt',servicePay:m.id==='receipt'?18:0})}),
    desk('detour','在书店施工期间重排交付地点',[30,40],Q,'河街书店 · 上次签收的侧门正在施工。店主可到路口领取，也可以把餐退回站点。',[method('meet','约店主在开放的路口核号签收','店主当面签收第二单，站点把临时交付点写进备注。'),method('cancel','联系顾客取消，退回餐盒','顾客同意撤单，站点收回餐盒，本单没有履约费。')],{route:'J03',money:3,when:r=>last(r,'J03-drop')?.a.result.delivered,proof:r=>src(r,'J03-drop'),resolve:(r,m)=>({order:'HS-28',delivered:m.id==='meet',servicePay:m.id==='meet'?18:0})}),
    desk('street','再走一趟书店侧门',[37,45],Q,'街口 · 门牌换了颜色，侧门还朝东。柜台留着那张蓝色回执。',[method('blue','用旧回执认出那家书店','店主把午餐放回熟悉的位置，说那天你提前告诉了他等多久。')],{route:'J03',visitor:true,when:r=>last(r,'J03-drop')?.a.result.delivered,proof:r=>src(r,'J03-drop')}),
    desk('dispatch','替晚班骑手排一次绕行接力',[38,45],Q,'调度板 · 商家出餐慢，一人已经在店外，另一人还在桥西。',[method('near','把取餐留给近端，让远端接下一单','两位骑手各自收到了新的接力位置。')],{route:'J03',visitor:true,when:r=>r.career==='dispatcher',proof:r=>r.facts.filter(f=>f.careerAfter==='dispatcher'&&f.careerBefore!=='dispatcher').map(f=>ref(f))})];
  function staffing(id,job){
    return [desk('resign-'+job,'交还班表，正式离开岗位',[25,40],Q,'离岗交接 · 结束原岗位收入；后续需要重新应聘。',[method('hand','核对交接人，交还岗位','交接完成，你把下一份工作的时间留了出来。')],{route:id,when:r=>r.career===job,resolve:()=>({newJob:null})}),
      desk('hire-'+job,'应聘'+LifeContent.jobs[job][0]+'的空岗',[25,40],Q,'招聘桌 · 招聘方说明班次和当期起薪。签约才开始工作。',[method('accept','核对工时并签入职单','新的岗位和工资从这期开始。')],{route:id,visitor:true,when:r=>!r.career&&!activeStudy(r)&&r.facts.some(f=>f.careerAfter),resolve:()=>({newJob:job})})];
  }
  const jobRoute=(id,job,actions)=>({id,type:'job',job,version:1,goal:LifeContent.jobs[job][0],window:[24,45],wages:{full:300,part:150,leave:0,study:0},contact:f=>f.careerAfter===job,actions:[...actions,...shift(id,job),...staffing(id,job)]});
  const next=(globalThis.LifeDreamChapters??require("./dream-chapters.js"))({desk,exam,age,last,src,method,has,passed,shift,activeStudy});
  return {activeStudy,specialStudy,residence,records,additions:{'01':arena,'03':school,J01:[...office,...staffing('J01','office')]},
    routes:[...next,{id:'29',type:'dream',version:1,goal:'在喜欢的地方安个家',window:[16,46],contact:()=>false,actions:house},jobRoute('J02','factory',factory),jobRoute('J03','delivery',delivery)]};
})();
