const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var moved = false
var gameover = false
var particles = []
var foods = []
var turningpoints = []
var lastturn = 0
var score = 10



document.body.addEventListener('keydown',(e)=>{
    var dir = ''
    var opp = ''
    var head = particles[0]
    switch(e.keyCode){
        case 37:
            dir = 'left'
            opp = 'right'
            moved = true
            break
        case 38:
            dir = 'up'
            opp = 'down'
            moved = true
            break
        case 39:
            dir = 'right'
            opp = 'left'
            moved = true
            break
        case 40:
            dir = 'down'
            opp = 'up'
            moved = true
            break
    }
    if(dir != ''){
        for(let i = 0; i < particles.length; i++){
            particles[i].turningpoints.push([head.x, head.y, dir, opp])
        }
        turningpoints.push([head.x, head.y, dir, opp])
    }
})

function movementhandle(par,turn){
    if(par.turns < par.turningpoints.length){
        if(par.x - turn[0] == 0 && par.y - turn[1] == 0){
            if(par.dir != turn[2] && par.opp != turn[2]){
                par.dir = turn[2]
                par.opp = turn[3]
            }
            par.turns++
        }
    }
}

function addsegment(x, y, dir, opp){
    const part = new Particle(x, y, dir, opp)
    part.turns = particles[particles.length - 1].turns
    for(let i = 0; i < turningpoints.length; i++){
        part.turningpoints.push(turningpoints[i])
    }
    particles.push(part)
}

for(let i = 10; i < 20; i++){
    const part = new Particle(22*i, 100,'right','left')
    particles.splice(0, 0, part)
}

document.body.addEventListener('keydown',(e)=>{
    if(e.keyCode == 65){
        eatfruit()
    }
})

function eatfruit(){
    if(particles[particles.length - 1].dir == 'right'){
        addsegment(particles[particles.length - 1].x - 22, particles[particles.length - 1].y, particles[particles.length - 1].dir, particles[particles.length - 1].opp)
    }
    else if(particles[particles.length - 1].dir == 'left'){
        addsegment(particles[particles.length - 1].x + 22, particles[particles.length - 1].y, particles[particles.length - 1].dir, particles[particles.length - 1].opp)
    }
    else if(particles[particles.length - 1].dir == 'up'){
        addsegment(particles[particles.length - 1].x, particles[particles.length - 1].y  + 22, particles[particles.length - 1].dir, particles[particles.length - 1].opp)
    }
    else{
        addsegment(particles[particles.length - 1].x, particles[particles.length - 1].y  - 22, particles[particles.length - 1].dir, particles[particles.length - 1].opp)
    }
}

function collisiondetection(he, oth){
    var dx = Math.sqrt((he.x - oth.x)*(he.x - oth.x))
    var dy = Math.sqrt((he.y - oth.y)*(he.y - oth.y))
    if(dx < particles[0].size && dy < particles[0].size){
        return 'collided'
    }
    else{
        return 'no collision'
    }
}

const food  = new Food()
foods.push(food)

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if(!gameover){
        particles[0].color = 'green'
        if(foods.length > 0){
            foods.forEach(f => {f.make()})
            if(collisiondetection(particles[0], foods[0]) == 'collided'){
                score += 3
                foods.shift()
                const food = new Food()
                foods.push(food)
                for(let i = 0; i < 3; i++){eatfruit()}
            }
        }
        for(let i = 0; i < particles.length; i++){
            if(moved){movementhandle(particles[i],particles[i].turningpoints[particles[i].turns])}
            particles[i].update()
        }
        for(let i = 3; i < particles.length; i++){
            if(collisiondetection(particles[0],particles[i]) == 'collided'){
                gameover = true
            }
        }
        if(particles[0].x == 0 || particles[0].x == canvas.width || particles[0].y == 0 || particles[0].y >= canvas.height){
            gameover = true
        }
        ctx.fillStyle = 'white'
        ctx.font = `20px Verdana`
        ctx.fillText(`Score: ${score}`, canvas.width - 150, 30)       
    }
    else{
        ctx.font = `40px Verdana`
        ctx.fillText(`Score: ${score}`, 550, 300)
    }
    requestAnimationFrame(animate)
}
animate()