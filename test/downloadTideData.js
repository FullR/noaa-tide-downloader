import downloadTideData from "../lib/downloadTideData";

describe("downloadTideData", () => {
  it("should download a array of timestamps", (done) => {
    downloadTideData({
      startTime: Date.now(),
      endTime: Date.now() + (1000 * 60 * 60 * 24 * 7)
    })
    .subscribe((data) => {
      if(!Array.isArray(data)) {
        done(new Error("Data is not an array"));
      } else if(!data.length) {
        done(new Error("No results in data"));
      } else {
        done();
      }
    }, done);
  });
});
