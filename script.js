const brainrots = [
  { name: "Unclito Samito", base_cash_per_sec: 65000, img: "img/unclito.png" },
  { name: "Tralalero Tralala", base_cash_per_sec: 50000, img: "img/tralalero.png" },
  { name: "Cavallo Virtuoso", base_cash_per_sec: 7500, img: "img/cavallo.png" },
  { name: "Odin din din dun", base_cash_per_sec: 75000, img: "img/odin.jpg" },
  { name: "Gattatino Nyanino", base_cash_per_sec: 25000, img: "img/nyan.png" },
  { name: "Girafa Celestre", base_cash_per_sec: 20000, img: "img/girafa.png" },
  { name: "Matteo", base_cash_per_sec: 50000, img: "img/matteo.png" },
  { name: "Graipuss Medussi", base_cash_per_sec: 1000000, img: "img/medussi.jpg" },
  { name: "La Grande Combinasion", base_cash_per_sec: 10000000, img: "img/combinasion.jpg" },
  { name: "Garama and Madundung", base_cash_per_sec: 50000000, img: "img/garama.png" },
  { name: "Los Tralaleritos", base_cash_per_sec: 500000, img: "img/tralaleritos.jpg" },
  { name: "Sammyini Spyderini", base_cash_per_sec: 300000, img: "img/spider.png" },
  { name: "Trenostruzzo Turbo 3000", base_cash_per_sec: 150000, img: "img/turbo.png" },
  { name: "La Vacca Saturno Saturnita", base_cash_per_sec: 250000, img: "img/vacca.jpg" },
  { name: "Cocofanto Elefanto", base_cash_per_sec: 10000, img: "img/cocofanto.jpg" }
];

const mutations = {
  gold: 1.25,
  diamond: 1.5,
  candy: 4.0,
  rainbow: 10.0
};

const traits = {
  nyan_cat: { multiplier: 6.0, icon: "img/icon/nyan.png" },
  meteor: { multiplier: 4.0, icon: "img/icon/meteor.png" },
  fireworks: { multiplier: 6.0, icon: "img/icon/firework.png" },
  taco: { multiplier: 3.0, icon: "img/icon/taco.png" },
  zombie: { multiplier: 4.0, icon: "img/icon/zombi.png" }
};


let currentMode = 'calculator';
let tradingList = [];
let selectedBrainrot = null;
let selectedMutation = 1;
let selectedTraits = new Set();

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("brainrotTradingList");
  if (saved) {
    tradingList = JSON.parse(saved);
    renderTradingList();
  }

  const savedMode = localStorage.getItem("brainrotMode");
  if (savedMode) {
    switchMode(savedMode);
  } else {
    switchMode("calculator");
  }
});

function saveCurrentMode() {
  localStorage.setItem("brainrotMode", currentMode);
}


function formatNumberShort(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n.toString();
}

document.getElementById("calculator-mode-btn").onclick = () => {
  switchMode('calculator');
};

document.getElementById("trading-mode-btn").onclick = () => {
  switchMode('trading');
};

function switchMode(mode) {
  currentMode = mode;

  document.getElementById("calculator-mode-btn").classList.toggle("active", mode === 'calculator');
  document.getElementById("trading-mode-btn").classList.toggle("active", mode === 'trading');
  document.getElementById("export-container").style.display = mode === 'trading' ? 'block' : 'none';
  document.getElementById("calculate-btn").style.display = mode === 'calculator' ? 'block' : 'none';
  document.getElementById("trading-add-btn").style.display = mode === 'trading' ? 'block' : 'none';
  document.getElementById("trading-list").style.display = mode === 'trading' ? 'grid' : 'none';
  document.getElementById("result").style.display = mode === 'calculator' ? 'block' : 'none';
  document.getElementById("details").style.display = mode === 'calculator' ? 'block' : 'none';

  const pageTitle = document.getElementById("page-title");
  if (pageTitle) {
    pageTitle.textContent =
      mode === 'calculator'
        ? "Brainrot Cash/s Calculator"
        : "Brainrot Trading List";
  }
  saveCurrentMode();
}

const brainrotGrid = document.getElementById("brainrot-grid");


brainrots
.sort((a, b) => a.base_cash_per_sec - b.base_cash_per_sec)
.forEach(br => {
  const div = document.createElement("div");
  div.className = "brainrot-card";
  div.innerHTML = `
    <img src="${br.img}" alt="${br.name}">
    <div class="brainrot-name">${br.name}</div>
    <div style="font-size:0.8em; color:#aaa">${br.base_cash_per_sec.toLocaleString()} cash/s</div>
  `;
  div.onclick = () => {
    document.querySelectorAll(".brainrot-card").forEach(el => el.classList.remove("selected"));
    div.classList.add("selected");
    selectedBrainrot = br;
  };
  brainrotGrid.appendChild(div);
});

const mutationDiv = document.getElementById("mutations");
for (let [key, val] of Object.entries(mutations)) {
  const btn = document.createElement("button");
  btn.className = key;
  btn.innerText = `${key.toUpperCase()} (x${val})`;
  btn.onclick = () => {
    if (btn.classList.contains("selected")) {
      btn.classList.remove("selected");
      selectedMutation = 1;
    } else {
      document.querySelectorAll(".mutations button").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedMutation = val;
    }
  };
  mutationDiv.appendChild(btn);
}


const traitsDiv = document.getElementById("traits");
for (let [key, data] of Object.entries(traits)) {
  const div = document.createElement("div");
  div.className = "trait-card";
  div.innerHTML = `
    <img src="${data.icon}" alt="${key}" class="trait-icon-img">
    <small>${key.replace("_", " ")}</small>
  `;

  div.onclick = () => {
    div.classList.toggle("selected");
    if (div.classList.contains("selected")) {
      selectedTraits.add(key);
    } else {
      selectedTraits.delete(key);
    }
  };
  traitsDiv.appendChild(div);
}

document.getElementById("calculate-btn").onclick = () => {
  if (!selectedBrainrot) {
    alert("Please select a Brainrot!");
    return;
  }

  const base = selectedBrainrot.base_cash_per_sec;
  const mutationBonus = selectedMutation - 1;

  let traitsBonus = 0;
  for (let t of selectedTraits) {
    traitsBonus += (traits[t].multiplier - 1);
  }

  const totalMultiplier = 1 + mutationBonus + traitsBonus;
  const total = base * totalMultiplier;

  const formatted = formatNumberShort(total);

  document.getElementById("result").innerHTML =
    `${formatted} cash/s <span class="small">(${total.toLocaleString()} cash/s)</span>`;

  let details = `Base: ${base.toLocaleString()}\n`;
  details += `Mutation Bonus: +${mutationBonus.toFixed(2)}x\n`;
  details += `Traits Bonus: +${traitsBonus.toFixed(2)}x\n`;
  details += `Total Multiplier: ${totalMultiplier.toFixed(2)}x\n`;
  details += `Total Cash/s: ${total.toLocaleString()}`;
  document.getElementById("details").innerText = details;
};


document.getElementById("trading-add-btn").onclick = () => {
  if (!selectedBrainrot) {
    alert("Please select a Brainrot!");
    return;
  }

  const brainrotName = selectedBrainrot.name;
  const mutation = selectedMutation;
  const selectedTraitsArray = Array.from(selectedTraits);

  addToTradingList(brainrotName, mutation, selectedTraitsArray);
};

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function saveTradingList() {
  localStorage.setItem("brainrotTradingList", JSON.stringify(tradingList));
}


function addToTradingList(brainrotName, mutation, traits) {
  const existing = tradingList.find(item =>
    item.brainrot === brainrotName &&
    item.mutation === mutation &&
    JSON.stringify(item.traits.sort()) === JSON.stringify(traits.sort())
  );

  if (existing) {
    existing.amount += 1;
  } else {
    tradingList.push({
      brainrot: brainrotName,
      mutation,
      traits,
      amount: 1
    });
  }
  renderTradingList();
  showToast(`✅ Added ${brainrotName} to list`);
}

function renderTradingList() {
  const listDiv = document.getElementById("trading-list");
  listDiv.innerHTML = "";

  tradingList.forEach(item => {
    const brainrot = brainrots.find(b => b.name === item.brainrot);
    const mutation = item.mutation;

    const card = document.createElement("div");
    card.className = "trading-card";

    if (mutation === mutations.gold) card.classList.add("gold");
    if (mutation === mutations.diamond) card.classList.add("diamond");
    if (mutation === mutations.candy) card.classList.add("candy");
    if (mutation === mutations.rainbow) card.classList.add("rainbow");

    const base = brainrot.base_cash_per_sec;
    const mutationBonus = item.mutation - 1;

    let traitsBonus = 0;
    for (let t of item.traits) {
      traitsBonus += (traits[t].multiplier - 1);
    }

    const totalMultiplier = 1 + mutationBonus + traitsBonus;
    const totalCashPerSec = base * totalMultiplier;
    const formattedCashPerSec = formatNumberShort(totalCashPerSec) + "/s";

    const innerContent = `
      <div class="controls">
        <button class="plus-btn">+</button>
        <button class="minus-btn">−</button>
      </div>
      <img src="${brainrot.img}" alt="${brainrot.name}">
      <div class="brainrot-name">${brainrot.name}</div>
      <div class="brainrot-cash">${formattedCashPerSec}</div>
      <div class="traits">
        ${item.traits.map(t => `
          <img src="${traits[t].icon}" alt="${t}" class="trait-icon-img">
        `).join('')}
      </div>
      <div class="quantity">x${item.amount}</div>
    `;


    card.innerHTML = `<div class="inner">${innerContent}</div>`;

    const plusBtn = card.querySelector(".plus-btn");
    const minusBtn = card.querySelector(".minus-btn");

    plusBtn.addEventListener("click", e => {
      e.stopPropagation();
      item.amount += 1;
      renderTradingList();
    });

    minusBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (item.amount > 1) {
        item.amount -= 1;
      } else {
        tradingList.splice(tradingList.indexOf(item), 1);
      }
      renderTradingList();
    });

    listDiv.appendChild(card);
  });
  saveTradingList()
}

function exportTradingList() {
  const list = document.getElementById("trading-list");

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.style.background = "#333";
  wrapper.style.padding = "20px";
  wrapper.style.boxSizing = "border-box";
  wrapper.style.width = list.offsetWidth + "px";

  const header = document.createElement("h2");
  header.textContent = "TRADE LIST";
  header.style.color = "#ffde59";
  header.style.textAlign = "center";
  header.style.marginBottom = "20px";
  header.style.fontFamily = "'Segoe UI', sans-serif";
  header.style.fontWeight = "bold";
  header.style.fontSize = "28px";
  header.style.letterSpacing = "2px";
  header.style.textShadow = "2px 2px #000";
  header.style.borderBottom = "3px solid #ffde59";
  header.style.paddingBottom = "10px";
  header.style.width = "100%";

  wrapper.appendChild(header);

  const clone = list.cloneNode(true);
  clone.querySelectorAll(".controls").forEach(ctrl => {
    ctrl.style.display = "none";
  });

  // Force grid styles to match original
  clone.style.width = "100%";
  clone.style.display = "grid";
  clone.style.gridTemplateColumns = window.getComputedStyle(list).gridTemplateColumns;
  clone.style.gap = window.getComputedStyle(list).gap;

  wrapper.appendChild(clone);

  const tempContainer = document.createElement("div");
  tempContainer.style.position = "fixed";
  tempContainer.style.top = "-10000px";
  tempContainer.style.left = "0";
  tempContainer.style.width = "100%";
  tempContainer.appendChild(wrapper);
  document.body.appendChild(tempContainer);

  htmlToImage.toPng(wrapper, { backgroundColor: "#333" })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'trading-list.png';
      link.href = dataUrl;
      link.click();
      document.body.removeChild(tempContainer);
    })
    .catch((err) => {
      console.error(err);
    });
}



document.getElementById("export-btn").addEventListener("click", () => {
  exportTradingList();
});

document.getElementById("export-text-btn").addEventListener("click", () => {
  exportTradingListAsText();
});


document.getElementById("clear-btn").onclick = () => {
  if (confirm("Are you sure you want to clear your trading list?")) {
    tradingList = [];
    localStorage.removeItem('brainrot_trading_list');
    renderTradingList();
    showToast("🗑️ Trading list cleared!");
  }
};

function exportTradingListAsText() {
  if (tradingList.length === 0) {
    showToast("⚠️ Trading list is empty.");
    return;
  }

  // Group trading list by brainrot name
  const grouped = {};

  tradingList.forEach(item => {
    if (!grouped[item.brainrot]) {
      grouped[item.brainrot] = [];
    }
    grouped[item.brainrot].push(item);
  });

  let output = "";

  for (const [brainrotName, entries] of Object.entries(grouped)) {
    output += `${brainrotName}:\n`;

    entries.forEach(item => {
      const mutationName = (item.mutation !== 1)
        ? Object.keys(mutations).find(k => mutations[k] === item.mutation)
        : "common";

      let line = `   [${mutationName}]`;

      if (item.traits.length) {
        line += ` {${item.traits.join(",")}}`;
      }

      if (item.amount > 0) {
        line += ` x${item.amount}`;
      }

      output += line + "\n";
    });
  }

  navigator.clipboard.writeText(output.trim())
    .then(() => {
      showToast("✅ Trading list copied to clipboard!");
    })
    .catch(err => {
      console.error(err);
      showToast("⚠️ Failed to copy trading list.");
    });
}



