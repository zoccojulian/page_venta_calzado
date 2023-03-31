export class Bodimovin {
    _anim;
    _direccion = 1;

    constructor (container, loop, autoplay, url){
        this._anim = lottie.loadAnimation({
                container: container,
                renderer: "svg",
                loop: loop,
                autoplay: autoplay,
                path: url
            });
    }

    toggle() {
        this._dir();
        this._anim.play();
        this._direccion = this._direccion * (-1);
    }

    _dir(){
        if(this._direccion == 1){
            this._anim.setDirection(1);
        }else{
            this._anim.setDirection(-1);
        }
    }

    play() {
        this._anim.play();
    };

    stop() {
        this._anim.stop();
    }

    destroy(){
        this._anim.destroy();
    }
}