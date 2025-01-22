class Particle{
    constructor(x, y, dir, opp){
        this.x = x
        this.y = y
        this.size = 20
        this.turns = 0
        this.turningpoints = []
        this.dir = dir
        this.opp = opp
        this.color = 'yellow'
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.size, this.size)
    }
    update(){
        if(this.dir == 'up'){
            this.y -= 2
        }
        else if(this.dir == 'down'){
            this.y += 2
        }
        else if(this.dir == 'left'){
            this.x -= 2
        }
        else if(this.dir == 'right'){
            this.x += 2
        }
        this.draw()
    }
}

class Food{
    constructor(){
        this.x = Math.floor(Math.random() * (canvas.width - 200) + 100)
        this.y = Math.floor(Math.random() * (canvas.height - 200) + 100)
        this.size = 20
    }
    make(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.size, this.size)
    }
}