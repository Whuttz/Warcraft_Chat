import {registerCallbacks, sendMessage, signout, chatMessageLoop} from './chat-api';
import Vue from 'vue';
import Messages from './Messages.vue';
import Members from './Members.vue';

export let messageList = [];
export let membersList = [];
let id = 0;
let ctx = null;
let spriteList = [];
let music = new Audio('./sounds/HowlingFjordMusic.mp3');
let background = new Image();
background.src = './img/HowlingFjord.png';
let sky = new Image();
sky.src = './img/Sky.png';
let eatHeart = new Audio('./sounds/EatHeart.mp3');
let bloodlust = new Audio('./sounds/Bloodlust.wav');
let firstSky = true;
let skySpeed = 0.05;

window.addEventListener("load", () => 
{
    spriteList.push(new Sky());
    firstSky = false
    spriteList.push(new Sky());

    music.volume = 0.6;

    new Vue({
        el : "#chat-members",
        components:{Members},
        template: '<Members />'
    })

    new Vue({
        el : "#chat-messages",
        components:{Messages},
        template: '<Messages />'
    })

    ctx = document.getElementById("canvas").getContext("2d");

    document.querySelector("textarea").onkeyup = function (evt) {
        sendMessage(evt, this);
    };
    document.querySelector("#sign-out-btn").onclick = signout;
    registerCallbacks(newMessage, memberListUpdate);
    chatMessageLoop();

    tick();
})

document.onmousedown = () => {
    music.play();
    if (Math.random() < 0.05) {
        eatHeart.play();
    }
}

document.onkeydown = () => {
    skySpeed += 0.05;
}

const newMessage = (fromUser, message, isPrivate) => {
    console.log(fromUser, message, isPrivate);
    messageList.push({content : fromUser + ": " + message, id : id++});

    if (message == "greedisgood") {
        bloodlust.play();
    }
}

const memberListUpdate = members => {
    console.log(members);

    members.forEach(members => {
        membersList.pop(members);
    });

    members.forEach(members => {
        membersList.push(members);
    });
}

const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (background.complete) {
        ctx.drawImage(background, 0, -70);
    }

    if (skySpeed > 0.05) {
        skySpeed -= 0.001;
    }

    for (let i = 0; i < spriteList.length; i++) {
        const element = spriteList[i];
        let alive = element.tick();

        if (!alive) {
            spriteList.splice(i, 1);     
            i--;                       
        }
    }
    window.requestAnimationFrame(tick);
}


class Sky {
    constructor() {
        if (firstSky) {
            this.x = 0;
        }
        else {
            this.x = -1980;
        }
        this.y = 108;
        this.opacity = 1;
        this.spawnedNext = false;
    }

    tick() {
        let alive = true;

        if (sky.complete) {
            ctx.drawImage(sky, this.x, this.y);
        }
        if (background.complete) {
            ctx.drawImage(background, 0, -70);
        }

        if (this.x >= 1980 && !this.spawnedNext) {
            spriteList.push(new Sky());
            this.spawnedNext = true;
        }

        this.x += skySpeed;

        if (this.x > 2000) {
            alive = false;
        }

        return alive;
    }
}