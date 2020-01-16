import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { Tweet } from "../models/tweet";

import * as moment from "moment";

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
      console.log(data)
      data.map(d => {
        return this.chartData.push({
          source: d.source,
          text: d.text,
          createdAt: moment(d.created_at, "MM-DD-YYYY HH:mm:ss"),
          retweetCount: +d.retweet_count,
          favoriteCount: +d.favorite_count,
          polarity: +d.sentiment_polarity
        });
      });
      console.log(this.chartData)
    });
  }
}
