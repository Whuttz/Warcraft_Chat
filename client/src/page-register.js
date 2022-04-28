import {register} from './chat-api';
import {TiledImage} from './TiledImage';

let ctx = null;
let spriteList = [];
let background = new Image();
background.src = './img/Background.png';
let rez = new Image();
rez.src = './img/Light.gif';
let workWork = new Audio('./sounds/WorkWork.wav');
let stormEarthFire = new Audio('./sounds/StormEarthFire.wav');
let ded = new Audio('./sounds/PeonDeath.wav');
let reincarnSound = new Audio('./sounds/Reincarnation.wav');
let base = new Audio('./sounds/GreatHall.wav');
let moreGold = new Audio('./sounds/MoreGold.wav');
let moreLumber = new Audio('./sounds/MoreLumber.wav');
let underAttack = new Audio('./sounds/UnderAttack.wav');
let cantBuildThere = new Audio('./sounds/CantBuildThere.wav');
let buildSound = new Audio('./sounds/BuildSound.mp3');
let dragonSpawn = new Audio('./sounds/DragonSpawn.wav');
let dragonFire = new Audio('./sounds/DragonFire.mp3'); 
let bloodlust = new Audio('./sounds/Bloodlust.wav');
let gnollDeath = new Audio('./sounds/GnollDeath.wav');
let zerker = new Audio('./sounds/Zerker.wav');
let notThatKind = new Audio('./sounds/NotThatKind.wav');
let orcMusic = new Audio('./sounds/OrcMusic.mp3');

let leftArrowOn = false;
let rightArrowOn = false;
let upArrowOn = false;
let downArrowOn = false;
let animate = false;
let hasGold = false;
let hasWood = false;
let introPlayed = false;
let zerkerPlayed = false;
let dragonSpawned = false;
let rezTimer = 0;
let spawnTimer = 200;
let gold = 0;
let wood = 0;
let peon;

window.addEventListener("load", () => 
{
    orcMusic.volume = 0.5;

    document.querySelector("form").onsubmit = function () {
        return register(this);
    }

	ctx = document.getElementById("canvas").getContext("2d");

    spriteList.push(new Peon());



	tick();
});

document.onkeydown = e => 
{
    orcMusic.play()
	if (!introPlayed) {
		stormEarthFire.play();
		introPlayed = true;
	}
	if (e.key == "ArrowLeft") leftArrowOn = true;
	else if (e.key == "ArrowRight") rightArrowOn = true;
	else if (e.key == "ArrowUp") upArrowOn = true;
	else if (e.key == "ArrowDown") downArrowOn = true;
	else if (e.key == " ") animate = true;
    else if (e.key == "b") build();
    else if (e.key == "g") {
        wood += 50;
        gold += 50;
    }
}

document.onkeyup = e => 
{
	if (e.key == "ArrowLeft") leftArrowOn = false;
	else if (e.key == "ArrowRight") rightArrowOn = false;
	else if (e.key == "ArrowUp") upArrowOn = false;
	else if (e.key == "ArrowDown") downArrowOn = false;
	else if (e.key == " ") animate = false;
}

const tick = () => 
{
    peon = spriteList[0];

    if (!zerkerPlayed && wood >= 50 && gold >= 50) {
        zerker.play();
        zerkerPlayed = true;
    }

    if (spawnTimer <= 0 && !dragonSpawned) {
        spriteList.push(new Dragon());
        spriteList.push(new Fire());
        gnollDeath.play();
        bloodlust.play();
        dragonSpawned = true;
    }

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (background.complete) {
        ctx.drawImage(background, 0, 0);
    }

    ctx.font = "17px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(wood, 1309, 23);
    ctx.fillText(gold, 1155, 23);

    if (rezTimer > 0) {
        ctx.globalAlpha = 0.6;
        ctx.drawImage(rez, 1203, 333);
        ctx.globalAlpha = 1.0;
        rezTimer--;
    }

	for (let i = 0; i < spriteList.length; i++) {
		let alive = spriteList[i].tick();

		if (!alive) {
			spriteList.splice(i, 1);
			i--;
		}
	}
	window.requestAnimationFrame(tick);
}

const reincarnation = () => 
{
    rezTimer = 70;
	spriteList.push(new Peon());
	reincarnSound.play();
    notThatKind.play();
}

const build = () => 
{
    if (gold < 50 && wood < 50) {
        moreGold.play();
    }
    else if (gold < 50) {
        moreGold.play();
    }
    else if (wood < 50) {
        moreLumber.play();
    }
    if (gold >= 50 && wood >= 50) {
        if (peon.x > 250 && peon.x < 500 && peon.y > 500) {
            spriteList.push(new Building())
            buildSound.play()
            peon.alive = false;
            wood -= 50;
            gold -= 50;
        }
        else {
            cantBuildThere.play();
        }
    }
}

class Dragon 
{
	constructor() {
		let columnCount = 5;
		let rowCount = 1;
		let delay = 80;
		let loop = true;
		let scale = 2;

        this.tiledImageDragon = new TiledImage("./img/Dragon.png", columnCount, rowCount, delay, loop, scale);
		this.tiledImageDragon.changeRow(0);
		this.tiledImageDragon.changeMinMaxInterval(0, 4);

        this.x = 375;
		this.y = 410;
    }

    tick () {
        this.tiledImageDragon.tick(this.x, this.y, ctx);
        return true;
    }
}

class Fire 
{
	constructor() {
		let columnCount = 8;
		let rowCount = 1;
		let delay = 50;
		let loop = true;
		let scale = 3;

        this.tiledImageFire = new TiledImage("./img/Fire.png", columnCount, rowCount, delay, loop, scale);
		this.tiledImageFire.changeRow(0);
		this.tiledImageFire.changeMinMaxInterval(0, 7);

        this.x = 375;
		this.y = 275;
    }

    tick () {
        this.tiledImageFire.tick(this.x, this.y, ctx);
        dragonFire.play();
        return true;
    }
}

class Building 
{
	constructor() {
		let columnCount = 4;
		let rowCount = 1;
		let delay = 2500;
		let loop = true;
		let scale = 2;

        this.tiledImageBuilding = new TiledImage("./img/Building.png", columnCount, rowCount, delay, loop, scale);
		this.tiledImageBuilding.changeRow(0);
        this.tiledImageBuilding.changeCol(0);
		this.tiledImageBuilding.changeMinMaxInterval(-1, 4);
        
        this.x = 375;
		this.y = 600;
        this.spawned = false;
    }

    tick () {
        this.tiledImageBuilding.tick(this.x, this.y, ctx);
        if (this.tiledImageBuilding.imageCurrentCol == 3) {
            this.tiledImageBuilding.setLooped(false)
            if (!this.spawned) {
                dragonSpawn.play();
                this.spawned = true;
            }
            if (spawnTimer > 0) {
                spawnTimer--;
            }
        }
        return true;
    }
}

class Peon 
{
	constructor() {
		let columnCount = 5;
		let rowCountWalk = 8;
		let rowCountAnimate = 9;
		let delay = 50;
        let deadDelay = 200;
		let loop = true;
		let scale = 1;
		
		this.tiledImageWalk = new TiledImage("./img/PeonWalk.png", columnCount, rowCountWalk, delay, loop, scale);
		this.tiledImageWalk.changeRow(6);
		this.tiledImageWalk.changeMinMaxInterval(0, 4);

		this.tiledImageAnimate = new TiledImage("./img/PeonAnimations.png", columnCount, rowCountAnimate, delay, loop, scale);
		this.tiledImageAnimate.changeRow(6);
		this.tiledImageAnimate.changeMinMaxInterval(0, 4);

		this.tiledImageWalkGold = new TiledImage("./img/PeonGold.png", columnCount, rowCountWalk, delay, loop, scale);
		this.tiledImageWalkGold.changeRow(6);
		this.tiledImageWalkGold.changeMinMaxInterval(0, 4);

		this.tiledImageWalkWood = new TiledImage("./img/PeonWood.png", columnCount, rowCountWalk, delay, loop, scale);
		this.tiledImageWalkWood.changeRow(6);
		this.tiledImageWalkWood.changeMinMaxInterval(0, 4);

		this.tiledImageDead = new TiledImage("./img/PeonAnimations.png", columnCount, rowCountAnimate, deadDelay, loop, scale);
		this.tiledImageDead.changeRow(8);
		this.tiledImageDead.changeMinMaxInterval(-1, 4);

		this.x = 1300;
		this.y = 425;
		this.speed = 2;
		this.voiceCD = 0;
        this.dead = false;
        this.bodyCD = 200;
        this.minY = 250;
        this.maxY = 700;
        this.maxX = 1575;
        this.minX = 20;
        this.alive = true
	}

	tick () {
        if (!this.dead) {
            if (this.x > 250 && this.x < 500 && this.y < 350) {
                underAttack.play();
                ded.play();
                setTimeout(reincarnation, 5000)
                this.dead = true;
                hasGold = false;
                hasWood = false;
            }
            else {
                if (this.voiceCD != 0) {
                    this.voiceCD--;
                }
                
                if (downArrowOn && !leftArrowOn && !rightArrowOn && !upArrowOn) {
                    this.tiledImageWalk.changeRow(0)
                    if (this.y < this.maxY) {
                        this.y += this.speed;
                    }
                    this.facingDirection = 0;
                }

                if (downArrowOn && leftArrowOn && !upArrowOn && !rightArrowOn) {
                    this.tiledImageWalk.changeRow(1)
                    if (this.y < this.maxY) {
                        this.y += this.speed;
                    }
                    if (this.x > this.minX) {
                        this.x -= this.speed;
                    }
                    this.facingDirection = 1;
                }

                if (leftArrowOn && !upArrowOn && !downArrowOn && !rightArrowOn) {
                    this.tiledImageWalk.changeRow(2)
                    if (this.x > this.minX) {
                        this.x -= this.speed;
                    }
                    this.facingDirection = 2;
                }

                if (leftArrowOn && upArrowOn) {
                    this.tiledImageWalk.changeRow(3)
                    if (this.x > this.minX) {
                        this.x -= this.speed;
                    }
                    if (this.y > this.minY) {
                        this.y -= this.speed;
                    }
                    this.facingDirection = 3;
                }

                if (upArrowOn && !rightArrowOn && !leftArrowOn && !downArrowOn) {
                    this.tiledImageWalk.changeRow(4)
                    if (this.y > this.minY) {
                        this.y -= this.speed;
                    }
                    this.facingDirection = 4;
                }

                if (upArrowOn && rightArrowOn && !downArrowOn && !leftArrowOn) {
                    this.tiledImageWalk.changeRow(5)
                    if (this.y > this.minY) {
                        this.y -= this.speed;
                    }
                    if (this.x < this.maxX) {
                        this.x += this.speed;
                    }
                    this.facingDirection = 5;
                }

                if (rightArrowOn && !upArrowOn && !downArrowOn && !leftArrowOn) {
                    this.tiledImageWalk.changeRow(6)
                    if (this.x < this.maxX) {
                        this.x += this.speed;
                    }
                    this.facingDirection = 6;
                }

                if (rightArrowOn && downArrowOn && !upArrowOn && !leftArrowOn) {
                    this.tiledImageWalk.changeRow(7)
                    if (this.x < this.maxX) {
                        this.x += this.speed;
                    }
                    if (this.y < this.maxY) {
                        this.y += this.speed;
                    }
                    this.facingDirection = 7;
                }

                if (animate) {
                    this.tiledImageAnimate.changeRow(this.facingDirection);
                    if (this.voiceCD == 0) {
                        workWork.play();
                        this.voiceCD = 500;
                    }
                    if (this.x > 1000 && this.x < 1200 && this.y > 460) {
                        if (hasWood) {
                            wood += 10;
                            base.play();
                        }
                        if (hasGold) {
                            gold += 10;
                            base.play();
                        }
                    }
                    hasGold = false;
                    hasWood = false;
                    if (this.x > 1425 && this.y < 400) {
                        hasGold = true;
                    }
                    if (this.y <= 255 && this.x < 1425 || this.x >= 1570 && this.y > 400) {
                        hasWood = true;
                    }
                }

                if (hasGold) {
                    this.tiledImageWalkGold.changeRow(this.facingDirection);
                    hasWood = false;
                }

                if (hasWood) {
                    this.tiledImageWalkWood.changeRow(this.facingDirection);
                    hasGold = false;
                }

                if (!rightArrowOn && !leftArrowOn && !upArrowOn && !downArrowOn && !animate) {
                    this.tiledImageWalk.imageCurrentCol = 0;
                    this.tiledImageWalkGold.imageCurrentCol = 0;
                    this.tiledImageWalkWood.imageCurrentCol = 0;
                    this.tiledImageWalk.setPaused(true);
                    this.tiledImageWalkGold.setPaused(true);
                    this.tiledImageWalkWood.setPaused(true);
                }
                else {
                    this.tiledImageWalk.setPaused(false);
                    this.tiledImageWalkGold.setPaused(false);
                    this.tiledImageWalkWood.setPaused(false);
                }
                if (!hasGold && !hasWood && !animate) {
                    this.tiledImageWalk.tick(this.x, this.y, ctx);
                }
                if (hasWood && !animate) {
                    this.tiledImageWalkWood.tick(this.x, this.y, ctx);
                }
                if (hasGold && !animate) {
                    this.tiledImageWalkGold.tick(this.x, this.y, ctx);
                }
                if (animate) {
                    this.tiledImageAnimate.tick(this.x, this.y, ctx);
                }
            }
        }
        else 
        {
            this.bodyCD--;
            this.tiledImageDead.changeRow(8);
            this.tiledImageDead.tick(this.x, this.y, ctx)
            if (this.tiledImageDead.imageCurrentCol == 4) {
                this.tiledImageDead.setLooped(false)
            }
            if (this.bodyCD <= 0) {
                this.alive = false;
            }
        }
        return this.alive;
	}
}