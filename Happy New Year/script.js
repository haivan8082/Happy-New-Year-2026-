/* ===== EFFECTS ===== */
for(let i=0;i<20;i++){
    let f=document.createElement("div");
    f.className="flower";
    f.style.left=Math.random()*100+"vw";
    f.style.animationDuration=(6+Math.random()*6)+"s";
    f.style.animationDelay=Math.random()*5+"s";
    document.body.appendChild(f);
}

for(let i=0;i<14;i++){
    let s=document.createElement("div");
    s.className="spark";
    s.style.left=Math.random()*100+"vw";
    s.style.animationDelay=Math.random()*6+"s";
    document.body.appendChild(s);
}

/* ===== GLOBAL ===== */
let userName="", userAge="";
let selectedQuestions=[];
let currentStep=0;
let answers=[];

/* ===== QUESTIONS ===== */
const q10_public=[
 {type:"text",question:"Năm qua bạn tự hào nhất về điều gì?"},
 {type:"choice",question:"Cảm xúc chung của bạn trong năm qua?",options:["Rất tốt","Khá ổn","Bình thường","Khó khăn"]},
 {type:"text",question:"Khoảnh khắc đáng nhớ nhất?"},
 {type:"choice",question:"Bạn đã học được nhiều điều mới chưa?",options:["Rất nhiều","Có","Ít","Chưa"]},
 {type:"text",question:"Một điều khiến bạn biết ơn?"},
 {type:"choice",question:"Mức độ hài lòng với bản thân?",options:["Rất hài lòng","Hài lòng","Chưa hài lòng","Thất vọng"]},
 {type:"text",question:"Một bài học lớn nhất năm qua?"},
 {type:"text",question:"Điều bạn muốn giữ lại cho năm mới?"},
 {type:"choice",question:"Bạn mong năm mới sẽ thế nào?",options:["Bình yên","Bứt phá","Ổn định","Thay đổi lớn"]},
 {type:"text",question:"Một từ mô tả năm vừa qua?"}
];

const q10_private=[
 {type:"text",question:"Một điều bạn chưa từng nói với ai?"},
 {type:"choice",question:"Năm qua bạn có từng cảm thấy cô đơn?",options:["Thường xuyên","Đôi lúc","Hiếm khi","Chưa từng"]},
 {type:"text",question:"Điều khiến bạn tổn thương nhất?"},
 {type:"choice",question:"Bạn hài lòng với các mối quan hệ?",options:["Rất hài lòng","Tạm ổn","Chưa ổn","Rất tệ"]},
 {type:"text",question:"Một điều bạn muốn buông bỏ?"},
 {type:"choice",question:"Bạn có tin bản thân sẽ tốt hơn?",options:["Rất tin","Có","Chưa chắc","Không"]},
 {type:"text",question:"Một nỗi sợ bạn đang đối diện?"},
 {type:"text",question:"Điều bạn muốn thay đổi nhất?"},
 {type:"choice",question:"Bạn có sẵn sàng bước tiếp?",options:["Có","Đang cố","Chưa","Không"]},
 {type:"text",question:"Một lời nhắn cho chính mình?"}
];

/* ===== STEP 1 ===== */
function next(){
    const n=document.getElementById("name").value.trim();
    const a=document.getElementById("age").value.trim();
    const err=document.getElementById("err");
    if(!n||!a||a<=0||a>100){
        err.innerText="Thông tin không hợp lệ";
        return;
    }
    userName=n; userAge=a;
    screen1.innerHTML=`
        <h1>Chọn khảo sát</h1>
        <button onclick="start('public')">10 câu – Tổng kết</button>
        <button onclick="start('private')" style="margin-top:10px">10 câu – Riêng tư</button>
    `;
}

/* ===== START ===== */
function start(type){
    selectedQuestions=(type==="public")?q10_public:q10_private;
    currentStep=0; answers=[];
    render();
}

/* ===== RENDER ===== */
function render(){
    const screen=document.getElementById("screen1");
    let q=selectedQuestions[currentStep];
    let percent=Math.round(currentStep/selectedQuestions.length*100);

    let body=q.type==="text"
        ? `<input id="answer" value="${answers[currentStep]||""}" placeholder="Nhập câu trả lời">`
        : q.options.map(o=>`
            <label onclick="pick(this)">
                <input type="radio" name="a" value="${o}">${o}
            </label>`).join("");

    const barLen=28;
    let filled=Math.floor(barLen*percent/100);

    screen.innerHTML=`
        <div class="progress-text-terminal"></div>
        <div class="form-step step-anim">
            <h1>Câu ${currentStep+1}/${selectedQuestions.length}</h1>
            <p>${q.question}</p>
            ${body}
        </div>
        <div class="form-footer">
            <button onclick="back()" ${currentStep===0?"disabled":""}>Back</button>
            <button onclick="nextQ()">Next</button>
        </div>
        <div class="horse">🐎</div>
    `;

    let p=0;
    const term=screen.querySelector(".progress-text-terminal");
    (function anim(){
        let bar="_".repeat(p)+" ".repeat(barLen-p);
        term.innerText=`[${bar}] ${Math.floor(p/barLen*100)}%`;
        if(p++<filled) setTimeout(anim,18);
    })();
}

/* ===== PICK ===== */
function pick(lb){
    document.querySelectorAll("label").forEach(l=>l.classList.remove("selected"));
    lb.classList.add("selected");
    lb.querySelector("input").checked=true;
}

/* ===== NAV ===== */
function nextQ(){
    let q=selectedQuestions[currentStep],v="";
    if(q.type==="text"){
        let i=document.getElementById("answer");
        if(!i.value.trim())return;
        v=i.value.trim();
    }else{
        let c=document.querySelector("input[name=a]:checked");
        if(!c)return;
        v=c.value;
    }
    answers[currentStep]=v;
    currentStep++;
    currentStep<selectedQuestions.length?render():done();
}
function back(){currentStep--;render();}

/* ===== DONE ===== */
function done(){
    screen1.innerHTML=`
        <h1>🎉 Hoàn thành 🎉</h1>
        <p>Cảm ơn <b>${userName}</b></p>
        <button onclick="showTerminalSummary()">Xem tổng kết</button>
        <div class="horse">🐎</div>
    `;
}

/* ===== SUMMARY ===== */
function showTerminalSummary(){
    screen1.innerHTML=`
        <h1>📊 Tổng kết</h1>
        <button onclick="loadTerminalProgress()">▶ Hiển thị</button>
        <pre id="summary" class="terminal"></pre>
    `;
}

function loadTerminalProgress(){
    const s=document.getElementById("summary");
    s.innerText="";
    let i=0,barLen=30;

    function line(){
        if(i<selectedQuestions.length){
            let bar="_".repeat(barLen);
            s.innerText+=`Câu ${i+1} [${bar}] 100%\n`;
            i++; setTimeout(line,120);
        }else{
            let done=answers.filter(a=>a).length;
            let percent=Math.round(done/selectedQuestions.length*100);
            let p=0;
            s.innerText+=`\n`;
            (function anim(){
                let bar="_".repeat(Math.floor(barLen*p/100));
                s.innerText=s.innerText.replace(/\[.*\]\s\d+%/,
                    `[${bar.padEnd(barLen," ")}] ${p}%`);
                if(p++<percent)setTimeout(anim,25);
                else s.innerText+=`\n🎉 Chúc bạn có một năm mới an lành, đủ có điều gì của năm cũ`;
            })();
            s.innerText+=`[${" ".repeat(barLen)}] 0%`;
        }
    }
    line();
}

/* ===== MUSIC ===== */
const musicBtn=document.getElementById("musicToggle");
const music=document.getElementById("bgMusic");
musicBtn.onclick=()=>{
    music.paused?(music.play(),musicBtn.innerText="🔊 Nhạc")
                 :(music.pause(),musicBtn.innerText="🔇 Nhạc");
};

/* ===== EXTRA PROGRESS BAR (UI ONLY) ===== */
function showExtraProgress(percent, text){
    let old = document.getElementById("extraProgressWrap");
    if(old) old.remove();

    const wrap = document.createElement("div");
    wrap.id = "extraProgressWrap";
    wrap.style.cssText = `
        position:fixed;
        top:20px;
        left:50%;
        transform:translateX(-50%);
        width:80%;
        max-width:520px;
        background:#111;
        padding:10px;
        border-radius:14px;
        box-shadow:0 0 20px rgba(255,140,0,.4);
        z-index:9999;
        font-family:monospace;
    `;

    wrap.innerHTML = `
        <div style="
            width:100%;
            height:18px;
            background:#222;
            border-radius:999px;
            overflow:hidden;
        ">
            <div id="extraProgressBar" style="
                height:100%;
                width:0%;
                background:linear-gradient(90deg,#ff9800,#ff5722);
                border-radius:999px;
                transition:width .2s linear;
            "></div>
        </div>
        <div id="extraProgressText" style="
            margin-top:6px;
            color:#ffcc80;
            font-size:13px;
            text-align:center;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        ">0%</div>
    `;

    document.body.appendChild(wrap);

    let p = 0;
    const bar = document.getElementById("extraProgressBar");
    const txt = document.getElementById("extraProgressText");

    const timer = setInterval(()=>{
        p++;
        bar.style.width = p + "%";
        txt.innerText = `[${"▮".repeat(Math.floor(p/5)).padEnd(20," ")}] ${p}%  ${text||""}`;
        if(p >= percent){
            clearInterval(timer);
        }
    }, 18);
}
/* ===== REAL BAR LIKE IMAGE (NO ASCII, NO _____) ===== */
function showRealProgress(percent){
    let old = document.getElementById("realProgressWrap");
    if(old) old.remove();

    const wrap = document.createElement("div");
    wrap.id = "realProgressWrap";
    wrap.style.cssText = `
        position:fixed;
        top:20px;
        left:50%;
        transform:translateX(-50%);
        width:80%;
        max-width:560px;
        padding:12px;
        background:#0b0b0b;
        border-radius:16px;
        box-shadow:0 0 25px rgba(255,120,0,.45);
        z-index:9999;
    `;

    wrap.innerHTML = `
        <div style="
            width:100%;
            height:20px;
            background:#1a1a1a;
            border-radius:999px;
            overflow:hidden;
        ">
            <div id="realProgressBar" style="
                width:0%;
                height:100%;
                border-radius:999px;
                background:linear-gradient(90deg,#ffb000,#ff6a00);
                box-shadow:inset 0 0 8px rgba(255,255,255,.25);
                transition:width .25s ease;
            "></div>
        </div>
    `;

    document.body.appendChild(wrap);

    let p = 0;
    const bar = document.getElementById("realProgressBar");

    const timer = setInterval(()=>{
        p++;
        bar.style.width = p + "%";
        if(p >= percent){
            clearInterval(timer);
        }
    }, 18);
}

