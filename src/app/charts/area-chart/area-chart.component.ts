import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Tweet } from "../../models/tweet";
import * as d3 from "d3";
import chroma from "chroma-js";

@Component({
  selector: "app-area-chart",
  template: `
    <div class="container-fluid">
      <svg [attr.width]="width" [attr.height]="height">
        <g class="arcs">
          <path
            *ngFor="let arc of arcs"
            [attr.d]="arc.path"
            [attr.fill]="arc.fill"
          ></path>
        </g>
        <g #xAxis></g>
        <g #yAxis></g>
      </svg>
    </div>
  `,
  styleUrls: ["./area-chart.component.css"]
})
export class AreaChartComponent implements OnChanges {
  @Input() private data: Array<Tweet>;
  @ViewChild("xAxis", null) xAxisRef: ElementRef;
  @ViewChild("yAxis", null) yAxisRef: ElementRef;
  public width: number = 1500;
  public height: number = 750;
  //public style: string = `width: ${this.width}; height: ${this.height}`;
  private margin: any = { left: 40, top: 40, right: 40, bottom: 40 };
  private xScale: any;
  private yScale: any;
  private colorScale: any;
  private curve: any = d3.curveCatmullRom;
  public arcs: any;
  private xAxis: any;
  private yAxis: any;

  // colors
  private red: any = "#eb6a5b";
  private blue: any = "#52b6ca";
  private green: any = "#b6e86f";
  private colors: any = d3.scaleSequential(d3.interpolateCool);
  //private colors: any =  chroma.scale([this.blue, this.green])

  ngOnChanges(changes: SimpleChanges): void {
    // min max extents
    const [dateMin, dateMax] = d3.extent(this.data.map(d => d.createdAt));
    const polMinMax = d3.extent(this.data.map(d => d.polarity));
    const favMinMax = d3.extent(this.data.map(d => d.favoriteCount));

    // x-scale
    this.xScale = d3
      .scaleTime()
      .domain([d3.timeDay.offset(dateMin, -1), d3.timeDay.offset(dateMax, 1)])
      .range([this.margin.left, this.width - this.margin.right]);

    // y-scale
    this.yScale = d3
      .scaleLinear()
      .domain(polMinMax)
      .range([this.height - this.margin.bottom, this.margin.top]);

    // color-scale
    this.colorScale = d3
      .scaleLinear()
      .domain(favMinMax)
      .range([0, 1]);

    // area generator
    const areaGen = d3
      .area()
      .y0(this.yScale(0))
      .curve(this.curve);

    this.arcs = this.data
      .sort((a, b) => Math.abs(b.polarity) - Math.abs(a.polarity))
      .map(d => {
        return {
          path: areaGen([
            [this.xScale(d3.timeDay.offset(d.createdAt, -1)), this.yScale(0)],
            [this.xScale(+d.createdAt), this.yScale(d.polarity)],
            [this.xScale(d3.timeDay.offset(d.createdAt, 1)), this.yScale(0)]
          ]),
          fill: this.colors(this.colorScale(d.favoriteCount)),
          data: d
        };
      });
    console.log(this.arcs);
    this.xAxis = d3.axisBottom(this.xScale).tickSizeOuter(0);
    this.yAxis = d3.axisLeft(this.yScale).tickSizeOuter(0);

    d3.select(this.xAxisRef.nativeElement)
      .call(this.xAxis)
      .attr("transform", `translate(0, ${this.yScale(0)})`);
    d3.select(this.yAxisRef.nativeElement)
      .call(this.yAxis)
      .attr("transform", `translate(${this.margin.left}, 0)`)
      .select(".domain")
      .remove();
  }
}
