import { Injectable } from '@angular/core';
import * as d3 from "d3"

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  async getTweetData (): Promise<Array<any>> {
    try {
      return await d3.csv("../../assets/trump_tweets.csv")
    } catch {
      throw (new Error("Unable to get csv data"))
    }
  }

}
