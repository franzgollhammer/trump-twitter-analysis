import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { Tweet } from "../models/tweet";

@Component({
  selector: "app-charts",
  templateUrl: "./charts.component.html",
  styleUrls: ["./charts.component.css"]
})
export class ChartsComponent implements OnInit {
  chartData: Array<Tweet>;
  constructor(private _dataService: DataService) {}

  ngOnInit() {
    // fetch and prepare data
    this._dataService.getTweetData().then(data => {
      this.chartData = [];
      data = data.slice(0, 250);
      data.map(d => {
        return this.chartData.push({
          source: d.source,
          text: d.text,
          createdAt: new Date(d.created_at),
          retweetCount: +d.retweet_count,
          favoriteCount: +d.favorite_count,
          polarity: +d.sentiment_polarity
        });
      });
      console.log(this.chartData)
    });
  }
}
