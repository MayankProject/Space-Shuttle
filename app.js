let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

let speed
let AmmoArr 
let allEnemies 
let allExplosion 
let score

function init(){
    speed = 4
    AmmoArr = []
    allEnemies = []
    allExplosion = []
    score = 0
}
init()

class Protagnist{
    constructor(){
        this.position = {
            x: canvas.width/2,
            y: canvas.height/2
        }
        this.radius = 20
        this.bg = 'white'
    }
    paint(){
        c.fillStyle = this.bg
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false)
        c.fill()
    }
    shoot(x, y){
        let angle = Math.atan2(y-this.position.y, x-this.position.x)
        let newAmmo = new Ammo(speed*Math.cos(angle), speed*Math.sin(angle))
        AmmoArr.push(newAmmo)
    }
}
class Explosion{
    constructor(x, y){
        this.position = {
            x: x,
            y: y
        }
        this.originalPosition = {
            x: x,
            y: y
        }
        this.angle = Math.random()*(Math.PI*2)
        this.speed = (Math.random()*(4-1))+1
        this.velocity = {
            x: Math.cos(this.angle)*this.speed,
            y: Math.sin(this.angle)*this.speed,
        }    
        this.visible = true
        this.radius = 2
        this.bg = anyColor(0.5)
    }
    paint(){
        if (!this.visible) return
        c.fillStyle = this.bg
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false)
        c.fill()
    }
    update(){
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        if (dist(this.originalPosition, this.position)>300) this.visible = false
        this.paint()
    }
}
class Enemy{
    constructor(){
        do {
            this.position = {
                x: random(-200, canvas.width+200),
                y: random(-200, canvas.height+200)
            }
        } while(insideCanvas(this.position));
        this.radius = 30
        this.speed = 0.7
        this.angle = Math.atan2(this.position.y-player.position.y, this.position.x-player.position.x)
        this.velocity = {
            x: -Math.cos(this.angle)*this.speed,
            y: -Math.sin(this.angle)*this.speed,
        }
        this.bg = anyColor()
        this.visible = true
    }
    paint(){
        if (!this.visible) return
        c.fillStyle = this.bg
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false)
        c.fill()
    }
    update(){
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        if (dist(this.position, player.position)<this.radius+player.radius && this.radius>=0) {
            alert(`Game Over ! Your score has been : ${score}`)
            init()
        }
        if (this.radius<0) {
            this.visible = false
        }
        this.paint()
    }
}

let player = new Protagnist()

class Ammo{
    constructor(xV, yV){
        this.position = {
            x: player.position.x,
            y: player.position.y
        }
        this.velocity = {
            x: xV,
            y: yV
        }
        this.radius = 5
        this.bg = anyColor()
        this.visible = true
    }
    draw(){
        c.fillStyle = this.bg
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false)
        c.fill()
    }
    update(){
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        this.draw()
        if (this.position.x > canvas.width || this.position.x < 0 || this.position.y > canvas.height || this.position.y<0) {
            this.visible = false
        }
        allEnemies.forEach((enemy)=>{
            if (dist(enemy.position, this.position)<this.radius+enemy.radius){
                enemy.radius-=8
                score+=100
                makeAExplosion(enemy.position.x, enemy.position.y)
                this.visible=false
            }
        })
    }
}

document.addEventListener('click', (e)=>{
    player.shoot(e.clientX, e.clientY)
})
setInterval(() => {
    allEnemies.push(new Enemy())
}, 1200);

function paint(){
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
}
function insideCanvas(position){
    if (position.x > canvas.width || position.x < 0 || position.y > canvas.height || position.y<0) {
        return false
    }
    else{
        return true
    }
}
function makeAExplosion(x, y){
    for (let i = 0; i < 10; i++) {
        allExplosion.push(new Explosion(x, y))
    }
}
function random(first, last){
    return Math.round((Math.random()*(last-first))+first)
}
function dist(position1, position2){
    return Math.sqrt(Math.pow(position1.y-position2.y, 2) + Math.pow(position1.x-position2.x, 2))
}
function anyColor(a){
    let alpha
    if (!a) {
        alpha = 1
    }
    else{
        alpha = a
    }
    return `hsla(${Math.random()*360}, 50%, 50%, ${alpha})`
}

function animate(){
    requestAnimationFrame(animate)
    paint()
    AmmoArr.forEach((ammo, i)=>{
        if (ammo.visible) {
            ammo.update()
        }
        else{
            AmmoArr.splice(i, 1)
        }
    })
    allEnemies.forEach((enemy, i)=>{
        if (enemy.visible) {
            enemy.update()
        }
        else{
            allEnemies.splice(i, 1)
        }
    })
    allExplosion.forEach((exp, i)=>{
        if (exp.visible) {
            exp.update()
        }
        else{
            allExplosion.splice(i, 1)
        }
    })

    player.paint()
}

requestAnimationFrame(animate)
