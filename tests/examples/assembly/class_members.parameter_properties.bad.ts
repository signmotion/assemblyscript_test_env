import { BarService } from "./share/common";

// bad
class Foo {
  barService: BarService;

  constructor(barService: BarService) {
    this.barService = barService;
  }
}
