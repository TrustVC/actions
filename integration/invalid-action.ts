import { ClientFunction, Selector } from "testcafe";

const timer = 3;
const key = "2b1236683c3a842ed4a0bb032c1cf668e24bcaf8ce599aeef502c93cb628152c";

fixture("invalid redirect action");

test("should not redirect with invalid provider", async (t) => {
  const { innerText } = Selector(".text");
  const anchor = { key };
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: "https://api-vaccine.storage.staging.notarise.io/document/6cfbbcbf-85a1-4644-b61a-952c12376502",
      permittedActions: ["VIEW", "STORE"],
      redirect: "https://example.com",
    },
  };
  const encodedUri = `${encodeURI(JSON.stringify(action))}#${encodeURI(JSON.stringify(anchor))}`;
  const getLocation = ClientFunction(() => window.document.location.href);

  await t.navigateTo(`http://localhost:4173/?q=${encodedUri}`);

  await t
    .expect(innerText)
    .eql("https://example.com\nis not an authorized platform.");
  await t
    .expect(getLocation())
    .eql(`http://localhost:4173/?q=${encodedUri}`, { timeout: timer * 1000 });
});

test("should not redirect with missing provider", async (t) => {
  const { innerText } = Selector(".text");
  const anchor = { key };
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: "https://api-vaccine.storage.staging.notarise.io/document/6cfbbcbf-85a1-4644-b61a-952c12376502",
      permittedActions: ["VIEW", "STORE"],
    },
  };
  const encodedUri = `${encodeURI(JSON.stringify(action))}#${encodeURI(JSON.stringify(anchor))}`;
  const getLocation = ClientFunction(() => window.document.location.href);

  await t.navigateTo(`http://localhost:4173/?q=${encodedUri}`);

  await t.expect(innerText).eql("No platform specified");
  await t
    .expect(getLocation())
    .eql(`http://localhost:4173/?q=${encodedUri}`, { timeout: timer * 1000 });
});
