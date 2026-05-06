(function () {
  const WHITELISTS = ["tradetrust.io", "trustvc.io", "opencerts.io"];
  const app = document.getElementById("app");

  function getDomain(hostname) {
    const parts = hostname.split(".").reverse();
    return `${parts[1]}.${parts[0]}`;
  }

  const params = new URLSearchParams(location.search);
  const q = params.get("q");

  let action;
  try {
    action = JSON.parse(decodeURI(q));
  } catch {
    const container = document.createElement("div");
    container.className = "container";
    const textDiv = document.createElement("div");
    textDiv.className = "text";
    const span = document.createElement("span");
    span.className = "error";
    span.textContent = "Invalid action";
    textDiv.appendChild(span);
    container.appendChild(textDiv);
    app.appendChild(container);
    return;
  }

  const redirect = action?.payload?.redirect;
  let valid = false;
  try {
    valid =
      !!redirect && WHITELISTS.includes(getDomain(new URL(redirect).hostname));
  } catch {
    // invalid URL in redirect
  }

  if (!valid) {
    const container = document.createElement("div");
    container.className = "container";
    const textDiv = document.createElement("div");
    textDiv.className = "text";

    if (redirect) {
      const span = document.createElement("span");
      span.className = "error";
      span.textContent = redirect;
      textDiv.appendChild(span);
      textDiv.appendChild(document.createElement("br"));
      textDiv.appendChild(
        document.createTextNode("is not an authorized platform.")
      );
    } else {
      const span = document.createElement("span");
      span.className = "error";
      span.textContent = "No platform specified";
      textDiv.appendChild(span);
    }

    const imgContainer = document.createElement("div");
    imgContainer.className = "img-container";
    const img = document.createElement("img");
    img.src = "./undraw_cancel_u1it.png";
    img.className = "icon";
    img.alt = "redirect";
    imgContainer.appendChild(img);

    container.appendChild(textDiv);
    container.appendChild(imgContainer);
    app.appendChild(container);
    return;
  }

  let timer = 3;
  const container = document.createElement("div");
  container.className = "container";
  const textDiv = document.createElement("div");
  textDiv.className = "text";
  const imgContainer = document.createElement("div");
  imgContainer.className = "img-container";
  const img = document.createElement("img");
  img.src = "./undraw_online_transactions_02ka.png";
  img.className = "icon";
  img.alt = "redirect";
  imgContainer.appendChild(img);
  container.appendChild(textDiv);
  container.appendChild(imgContainer);
  app.appendChild(container);

  function updateText() {
    textDiv.textContent = "";
    textDiv.appendChild(document.createTextNode("Redirecting to "));
    const span = document.createElement("span");
    span.className = "success";
    span.textContent = redirect;
    textDiv.appendChild(span);
    textDiv.appendChild(document.createTextNode(` in ${timer}`));
  }

  updateText();

  const interval = setInterval(() => {
    timer--;
    if (timer === 0) {
      clearInterval(interval);
      window.location.href = `${redirect}${location.search}${window.location.hash}`;
    } else {
      updateText();
    }
  }, 1000);
})();
