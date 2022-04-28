import {signin} from './chat-api';

let spriteList = [];
let music = new Audio('./sounds/WoTLK_login.mp3');
let wyrmSound = new Audio('./sounds/FrostWyrm.mp3');

window.addEventListener("load", () => {
    document.querySelector("form").onsubmit = function () {
        return signin(this);
    }
    tick();

    music.volume = 0.7;
    wyrmSound.volume = 0.7;
    
    document.body.onclick = event => {
        music.play();
        if (event.target == document.body) {
            spriteList.push(new Nova(event.x - 100, event.y - 100));
            if (Math.random() < 0.2) {
                wyrmSound.play();
            }
        }
    }

});

const tick = () => {
    let posX;
    let posY;

    if (Math.random() < 0.1) {
        posX = Math.random() * window.innerWidth;
        posY = (Math.random() * 200) - 200;
        spriteList.push(new Snow(posX, posY));
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

class Nova {
    constructor(x, y) {
        this.div = document.createElement("div");
        this.div.className = "nova";
        this.div.style.left = x + "px";
        this.div.style.top = y + "px";
        this.opacity = 0.3;
        this.fadeout = false;
        this.speed = 0.03;

        document.body.append(this.div);
    }

    tick() {
        let alive = true;
        this.duration--;

        if (!this.fadeout) {
            this.opacity += this.speed;
        }
        else {
            this.opacity -= this.speed;
        }

        this.div.style.opacity = this.opacity;

        if (this.opacity >= 0.8) {
            this.fadeout = true;
        }

        if (this.opacity <= 0) {
            this.div.remove();
            alive = false;
        }
        return alive;
    }
}

class Snow {

    constructor(x, y) {
        this.div = document.createElement("div");
        this.div.className = "snow";
        this.div.style.left = x + "px";
        this.div.style.top = y + "px";
        this.speedY = 1;

        document.body.append(this.div);
    }

    tick() {
        let alive = true;
        let y = this.div.offsetTop;

        this.div.style.top = y + this.speedY + "px";

        if (this.div.style.top > window.innerHeight) {
            this.div.remove();
            alive = false;
        }
        return alive;
    }
}