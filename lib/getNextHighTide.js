import fs from "fs";
import {Observable} from "rx";
import downloadTideData from "./downloadTideData";
const cacheFileName = "high-tide-cache";
const oneWeek = (1000 * 60 * 60 * 24 * 7);
let cache = require(`./${cacheFileName}`);

function setCache(timestamps) {
  if(timestamps && timestamps.length) {
    cache = [...timestamps];
    fs.writeFileSync(`${cacheFileName}.json`, JSON.stringify(timestamps, null, 2));
  }
}

function getNextTime(timestamps) {
  const now = Date.now();
  const futureTimes = timestamps.filter((timestamp) => timestamp > now);
  if(!futureTimes.length) {
    throw new Error("No valid times");
  } else {
    return futureTimes.reduce((a, b) => a < b ? a : b);
  }
}

export default function getNextHighTide({noCache}) {
  return Observable.create((observer) => {
    const now = Date.now();
    const requestSub = downloadTideData({
      startTime: now,
      endTime: now + oneWeek
    })
    .subscribe(
      (timestamps) => { // attempt to request from NOAA
        const nextTimestamp = getNextTime(timestamps);
        if(!noCache) {
          setCache(timestamps);
        }
        observer.onNext(nextTimestamp);
        observer.onCompleted();
      }, 
      (error) => { // if an error occurs during the request, use local cache instead
        if(!noCache && cache && cache.length) {
          observer.onNext(getNextTime(cache));
          observer.onCompleted();
        } else {
          observer.onError(error);
        }
      }
    );

    return () => {
      requestSub.dispose();
    };
  });
}
