import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { IRule, IProgram, ITimeOfDay } from '../../../../common/interfaces';
import { v4 as uuid } from 'uuid';
import { TimeOfDay } from 'src/common/types';

class RGB {
    constructor(
    public readonly r: number,
    public readonly g: number,
    public readonly b: number){}

    public toCssColor(): string {
        return `rgb(${this.r},${this.g},${this.b})`
    }

    isSameColorAs(r: number, g: number, b: number) {
        return this.r === r && this.g === g && this.b === b;
    }
}

const slotColor: RGB = new RGB(0xBF, 0, 0);
const PI = Math.PI;
const secondsPerQuarter = 6 * 60 * 60;
const radiansPerQuarter = PI / 2;

@Component({
    selector: 'app-rule-chart',
    templateUrl: './rule-chart.component.html',
    styleUrls: ['./rule-chart.component.css']
})
export class RuleChartComponent implements OnInit {
    private canvas: PieCanvas;

    @Input("program") public program: IProgram;

    @Output() ruleClick: EventEmitter<string[]> = new EventEmitter();

    constructor() { 
        this.canvas = new PieCanvas();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        const ctx = this.canvas.getDrawingContext();
        ctx.translate(this.canvas.cx, this.canvas.cy);

        ctx.strokeStyle = "#AAAAAA";
        ctx.fillStyle = "#AAAAAA";
        ctx.beginPath();
        ctx.arc(0, 0, this.canvas.radius, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, this.canvas.radius + 20, 0, 2 * Math.PI, false);
        ctx.stroke();

        this.program.getRules().forEach((rule: IRule) => {
            this.drawSlot(ctx, rule.startTime, rule.endTime, slotColor.toCssColor());
        });

        this.drawHourLines(ctx);
    }

    private onClick(event: MouseEvent) {
        const ctx = this.canvas.getDrawingContext();

        const mousePos = {
              x: event.offsetX,
              y: event.offsetY,
            };

            // get pixel under cursor
            const pixel = ctx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
          
            // create rgb color for that pixel
            if (slotColor.isSameColorAs(pixel[0], pixel[1], pixel[2])) {

                // TO DO: work out which rule(s) have been clicked on
                const seconds = this.pointToSeconds(mousePos);

                console.log("TOD" + JSON.stringify(TimeOfDay.fromSeconds(seconds)));

                const result: string[] = [];

                this.program.getRules().forEach((rule: IRule) => {
                    if (seconds >= rule.startTime.toSeconds() && seconds <= rule.endTime.toSeconds()) {
                        result.push(rule.id);
                    }
                });
                this.ruleClick.emit(result);
            }
    }

    private drawSlot(ctx: CanvasRenderingContext2D, from: ITimeOfDay, to: ITimeOfDay, color: string): void {

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(
            0, 
            0, 
            this.canvas.radius,
            from.toSeconds() * Math.PI * 2 / (60 * 60 * 24) - PI / 2, 
            to.toSeconds() * Math.PI * 2 / (60 * 60 * 24) -PI / 2, 
            false);
        ctx.fill();

        ctx.stroke();
    }

    private drawHourLines(ctx: CanvasRenderingContext2D):void {
        for (let n = 0; n < 24; n++) {
            let radians = (n * Math.PI * 2) / 24 - Math.PI / 2;
            let tickFactor = n % 6 ? 0.9 : 0.8;
            let captionFactor = 1.1;

            let x1 = Math.cos(radians) * this.canvas.radius * tickFactor;
            let y1 = Math.sin(radians) * this.canvas.radius * tickFactor;

            let x2 = Math.cos(radians) * this.canvas.radius;
            let y2 = Math.sin(radians) * this.canvas.radius;

            let x3 = Math.cos(radians) * this.canvas.radius * captionFactor;
            let y3 = Math.sin(radians) * this.canvas.radius * captionFactor;

            ctx.strokeStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2,y2);
            ctx.stroke();

            ctx.strokeStyle = "#666666";
            ctx.font = "10px courier";
            ctx.translate(-5, 2);
            ctx.strokeText(n.toString(), x3, y3);
            ctx.translate(5, -2);
        }
    }

    // pointToSeconds calculates the angle between the line form the given point to the origin
    // and the zero-hour line.  The result is returned as the number of seconds from midnight
    // that such an angle would represent on the chart
    private pointToSeconds(pos: {x: number, y: number}): number {

        let result: number;

        //get the position iof the click relative to the centre of the chart
        let xOffset = pos.x - this.canvas.cx;
        let yOffset = -(pos.y - this.canvas.cy);

        let lengthOfArc = Math.sqrt(xOffset*xOffset + yOffset*yOffset);
        xOffset /= lengthOfArc;
        yOffset /= lengthOfArc;

        console.log("x= " + xOffset + " y= " + yOffset);

        let angle;

        if (xOffset === 0) {
            result = yOffset > 0 ? 0: 2 * secondsPerQuarter;
        } else if (yOffset === 0) {
            result = xOffset > 0 ? secondsPerQuarter : 3 * secondsPerQuarter;
        } else if (xOffset > 0 && yOffset > 0) {
            // 1st quadrant
            angle = Math.atan(xOffset / yOffset);
            result = secondsPerQuarter * angle / radiansPerQuarter;
        } else if (xOffset > 0 && yOffset < 0) {
            // 2nd quadrant
            angle = Math.atan(- yOffset / xOffset);
            result = secondsPerQuarter + secondsPerQuarter * angle / radiansPerQuarter;
        } else if (xOffset < 0 && yOffset < 0) {
            // 3nd quadrant
            angle = Math.atan(xOffset / yOffset);
            result = 2 * secondsPerQuarter + secondsPerQuarter * angle / radiansPerQuarter;
        } else {
            // 4th quadrant
            angle = Math.atan(- yOffset / xOffset);
            result = 3 * secondsPerQuarter + secondsPerQuarter * angle / radiansPerQuarter;
        }

        return result;
    }
}

class PieCanvas {
    public id: string;
    public radius: number = 100;
    public border: number = 30;
    public get height(): number { return this.radius * 2 + this.border * 2 };
    public get width(): number { return this.radius * 2 + this.border * 2 };
    public get cx(): number { return this.width / 2 };
    public get cy(): number { return this.height / 2 };

    constructor() {
        this.id = uuid();
    }

    getDrawingContext(): CanvasRenderingContext2D {
        return (<HTMLCanvasElement>document.getElementById(this.id)).getContext("2d");
    }
}
