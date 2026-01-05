async function shorten() {
  const url = document.getElementById("url").value;
  const custom = document.getElementById("custom").value;

  const res = await fetch("/api/shorten", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ url, customCode: custom })
  });

  const data = await res.json();

  if(data.message){
    document.getElementById("result").innerHTML = `<p>${data.message}</p>`;
    return;
  }

  document.getElementById("result").innerHTML = `
    <p>Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>
    <img src="${data.qrCode}" width="150"/>
  `;
}
