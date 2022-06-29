import { BarService } from "../../_/common";

// bad
class Foo {
  barService: BarService;

  constructor(barService: BarService) {
    this.barService = barService;
  }
}
