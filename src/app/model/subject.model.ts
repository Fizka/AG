export class Subject {
	x: string;
	y: string;
	_x: number;
	_y: number;

  setX(x: string, _x: number): void {
    this.x = x;
    this._x = _x;
  }

  setY(y: string, _y: number): void {
    this.y = y;
    this._y = _y;
  }

  get fitnessValue(): number {
    return Math.pow((this._x + 2 * this._y - 7), 2) + Math.pow((2 * this._x + this._y - 5), 2);
  }
}
