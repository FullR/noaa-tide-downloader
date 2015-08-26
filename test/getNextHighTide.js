import getNextHighTide from "../lib/getNextHighTide";

describe("getNextHighTide", () => {
  it("should emit a timestamp that is after the current date", (done) => {
    getNextHighTide({noCache: true})
      .subscribe((timestamp) => {
        if(typeof timestamp !== "number") {
          done(new Error("Timestamp isn't a number"));
        } else if(timestamp < Date.now()) {
          done(new Error("Timestamp is before the current date"));
        } else {
          done();
        }
      }, done);
  });
});
