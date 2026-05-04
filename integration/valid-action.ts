import { ClientFunction, Selector } from "testcafe";

const timer = 3;
const preText = "Redirecting to https://ref.tradetrust.io in ";
const key = "2b1236683c3a842ed4a0bb032c1cf668e24bcaf8ce599aeef502c93cb628152c";

fixture("valid redirect action");

test("should redirect when key is part of anchor", async (t) => {
  const { innerText } = Selector(".text");
  const anchor = { key };
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: "https://gallery.openattestation.com/static/documents/tradetrust/v2/ebl-stability.json",
      permittedActions: ["VIEW", "STORE"],
      redirect: "https://ref.tradetrust.io",
      chainId: 101010,
    },
  };

  const encodedUri = `${encodeURI(JSON.stringify(action))}#${encodeURI(JSON.stringify(anchor))}`;
  console.log({ url: `http://localhost:4173/?q=${encodedUri}` });
  await t.navigateTo(`http://localhost:4173/?q=${encodedUri}`);

  // 1. show redirect message
  await t.expect(innerText).contains(preText);

  // 2. countdown from ${timer} seconds
  for (let sec = 0; sec >= timer; sec++) {
    await t
      .expect(innerText)
      .eql(`${preText}${Math.abs(sec - timer)}`, { timeout: sec * 1000 });
  }

  // 3. redirect after ${timer} seconds
  const getLocation = ClientFunction(() => window.document.location.href);
  await t.expect(getLocation()).contains(`${action.payload.redirect}`);
});

test("should redirect when key is part of action", async (t) => {
  const { innerText } = Selector(".text");
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: "https://gallery.openattestation.com/static/documents/tradetrust/v2/ebl-stability.json",
      key,
      permittedActions: ["VIEW", "STORE"],
      redirect: "https://ref.tradetrust.io",
      chainId: 101010,
    },
  };
  const encodedUri = `${encodeURI(JSON.stringify(action))}`;

  await t.navigateTo(`http://localhost:4173/?q=${encodedUri}`);

  // 1. show redirect message
  await t.expect(innerText).contains(preText);

  // 2. countdown from ${timer} seconds
  for (let sec = 0; sec >= timer; sec++) {
    await t
      .expect(innerText)
      .eql(`${preText}${Math.abs(sec - timer)}`, { timeout: sec * 1000 });
  }

  // 3. redirect after ${timer} seconds
  const getLocation = ClientFunction(() => window.document.location.href);
  await t.expect(getLocation()).contains(`${action.payload.redirect}`);
});
