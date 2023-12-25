console.clear();

// 本地:
const sound = new Howl({src: ['./assets/sound.mp3']});
const bgm = new Howl({src: ['./assets/bgm.mp3'], html5:true, loop: true, volume: 0.2});

// 网络:
// const sound = new Howl({
//     src: [
//         "https://github.com/liuxiyuan-2022/EWoodenFish/blob/main/src/assets/sound.mp3?raw=true",
//     ],
// });
// const bgm = new Howl({
//     src: [
//         "https://github.com/liuxiyuan-2022/EWoodenFish/blob/main/src/assets/bgm.mp3?raw=true",
//     ],
//     html5: true,
//     loop: true,
//     volume: 0.2,
// });

var ringId = 0;
var bgmId = 0;
let count = 0;
let countFlag = false;
let autocountFlag = false;
var autocountId = 0;

function startAnimate() {
    $(".count").css("transform", "scale(1.3)");
    $(".woodenfish").css('transform', 'scale(.9)');

    $("#center").append("<div class='subtitleCountTip'>功德 + 1</div>");
    setTimeout(function(){
        $(".subtitleCountTip").last().remove();
    },1000)
}

function initAnimate() {
    $(".count").css("transform", "scale(1)");
    $(".woodenfish").css('transform', 'scale(1)');
}

function counter() {
    countFlag = true;
    count++;
    $(".count").html(count);
    startAnimate();
    if (ringId != 0) {
        if (sound.playing()) {
            sound.stop(ringId);
        }
        sound.play(ringId);
    } else {
        ringId = sound.play();
    }
}

function autocount(){
    if (!autocountFlag){
        autocountId = setInterval(function(){
            counter();
            setTimeout(initAnimate(),500)
        },500)
        $(".autocount").html("点击<key>关闭</key>自动敲");
        autocountFlag = true;
    }else{
        clearInterval(autocountId);
        $(".autocount").html("点击<key>开启</key>自动敲");
        autocountFlag = false;
    }
}

$(document).keydown(function (e) {
    if (e.key == " " && e) {
        if (!countFlag) {
            counter();
        }
    }
});

$(document).keyup(function (e) {
    if (e.key == " " && e) {
        countFlag = false;
        initAnimate();
    }
});

if (typeof window.orientation !== 'undefined') {
    $(".woodenfish").on('touchstart',function(e) {
        counter();
    })
    
    $(".woodenfish").on('touchmove',function(e) {
        initAnimate();
    });
    
    $(".woodenfish").on('touchend',function(e) {
        initAnimate();
    });
}else{
    $(".woodenfish").mouseup(function () {
        initAnimate();
    });
    
    $(".woodenfish").mousedown(function () {
        counter();
    });
}

$(".logo").click(function (e) {
    if (bgm.playing() && bgm.state().toString() == "loaded") {
        bgm.pause(bgmId);
    } else {
        if (bgmId != 0) {
            bgm.play(bgmId);
        } else {
            bgmId = bgm.play();
        }
    }
});

$(".autocount").click(function(){
    autocount();
});