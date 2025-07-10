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
  nyan_cat: { multiplier: 6.0, icon: "🐱" },
  meteor: { multiplier: 4.0, icon: "☄️" },
  fireworks: { multiplier: 6.0, icon: "🎆" },
  taco: { multiplier: 3.0, icon: "🌮" },
  zombie: { multiplier: 4.0, icon: "🪵" }
};

let selectedBrainrot = null;
let selectedMutation = 1;
let selectedTraits = new Set();


function formatNumberShort(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n.toString();
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
    document.querySelectorAll(".mutations button").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedMutation = val;
  };
  mutationDiv.appendChild(btn);
}

const traitsDiv = document.getElementById("traits");
for (let [key, data] of Object.entries(traits)) {
  const div = document.createElement("div");
  div.className = "trait-card";
  div.innerHTML = `
    <div class="trait-icon">${data.icon}</div>
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
