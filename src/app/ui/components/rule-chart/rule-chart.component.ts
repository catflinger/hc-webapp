import { Component, OnInit, Input } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { IRule, IProgram, ITimeOfDay } from '../../../../common/interfaces';

@Component({
    selector: 'app-rule-chart',
    templateUrl: './rule-chart.component.html',
    styleUrls: ['./rule-chart.component.css']
})
export class RuleChartComponent implements OnInit {
    private canvas: PieCanvas;

    @Input() public program: IProgram;

    constructor() { 
        this.canvas = new PieCanvas();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        const el: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(this.canvas.id);
        const ctx: CanvasRenderingContext2D = el.getContext("2d");
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
            this.drawSlot(ctx, rule.startTime, rule.endTime, "#BF0000");
        });

        this.drawHourLines(ctx);
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
            from.toSeconds() * Math.PI * 2 / (60 * 60 * 24), 
            to.toSeconds() * Math.PI * 2 / (60 * 60 * 24), 
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
        this.id = "abcde";
    }
}
