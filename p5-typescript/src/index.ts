import * as p5 from 'p5';
import * as datgui from 'dat.gui';

export const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(400, 400);
        const gui = new datgui.GUI();
    }

    p.draw = () => {
        p.background(220);
        p.ellipse(50,50,80,80);
    }
}

export const myp5 = new p5(sketch, document.body);
