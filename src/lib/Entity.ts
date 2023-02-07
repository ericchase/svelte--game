export class Entity {
    public el: HTMLDivElement;

    private _index: number = 0;
    public get index(): number {
        return this._index;
    }
    public set index(value: number) {
        this._index = value;
        this.el.style.setProperty("z-index", `${value}`);
    }

    private _x: number = 0;
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
        this.el.style.setProperty("left", `${this.w * value}px`);
    }

    private _y: number = 0;
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
        this.el.style.setProperty("top", `${this.h * value}px`);
    }

    private _w: number = 0;
    public get w(): number {
        return this._w;
    }
    public set w(value: number) {
        this._w = value;
        this.el.style.setProperty("width", `${value}px`);
    }

    private _h: number = 0;
    public get h(): number {
        return this._h;
    }
    public set h(value: number) {
        this._h = value;
        this.el.style.setProperty("height", `${value}px`);
    }

    constructor() {
        this.el = document.createElement('div') as HTMLDivElement;
        this.el.style.setProperty("box-sizing", "border-box");
        this.el.style.setProperty("position", "absolute");
        this.index = 0;
        this.x = 0;
        this.y = 0;
        this.w = 40;
        this.h = 40;
    }
}