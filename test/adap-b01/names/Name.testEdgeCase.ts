import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b01/names/Name";

describe("Basic initialization tests", () => {
  it("test construction 1", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test construction with custom delimiter", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"], "/");
    expect(n.asString()).toBe("oss/cs/fau/de");
  });
});

describe("Basic function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test append", () => {
    let n = new Name(["oss", "cs"]);
    n.append("fau");
    expect(n.asString()).toBe("oss.cs.fau");
  });

  it("test remove", () => {
    let n = new Name(["oss", "cs", "fau", "de"]);
    n.remove(1);
    expect(n.asString()).toBe("oss.fau.de");
  });

  it("test setComponent", () => {
    let n = new Name(["oss", "cs", "fau", "de"]);
    n.setComponent(2, "tuda");
    expect(n.asString()).toBe("oss.cs.tuda.de");
  });

  it("test getComponent out of range throws", () => {
    let n = new Name(["oss", "cs"]);
    expect(() => n.getComponent(5)).toThrow();
  });

  it("test insert out of bounds throws", () => {
    let n = new Name(["oss", "cs"]);
    expect(() => n.insert(10, "fail")).toThrow();
  });
});

describe("Delimiter function tests", () => {
  it("test insert with custom delimiter", () => {
    let n: Name = new Name(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });

  it("test append with custom delimiter", () => {
    let n = new Name(["oss", "fau"], "#");
    n.append("de");
    expect(n.asString()).toBe("oss#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new Name(["oss.cs.fau.de"], '#');
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });

  it("test escaping of delimiter and backslash in asDataString", () => {
    let n = new Name(["Oh.dear\\Lord", "wow"]);
    const escaped = n.asDataString();
    expect(escaped).toBe("Oh\\.dear\\\\Lord.wow");
  });
});

describe("Edge cases", () => {
  it("test empty components", () => {
    let n = new Name(["", "", ""]);
    expect(n.asString()).toBe("..");
    expect(n.getNoComponents()).toBe(3);
  });
  it("test insert at beginning", () => {
    let n = new Name(["fau", "de"]);
    n.insert(0, "oss");
    expect(n.asString()).toBe("oss.fau.de");
  });

  it("test insert at end", () => {
    let n = new Name(["oss", "fau"]);
    n.insert(2, "de");
    expect(n.asString()).toBe("oss.fau.de");
  });

  it("test chaining multiple operations", () => {
    let n = new Name(["a"]);
    n.append("b");
    n.insert(1, "X");
    n.setComponent(0, "z");
    expect(n.asString()).toBe("z.X.b");
  });
});
