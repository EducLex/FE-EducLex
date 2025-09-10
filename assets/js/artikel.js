// Artikel hukum populer (dummy data)
const artikel = [
  { title: "Perlindungan Remaja dari Cybercrime", content: "Remaja perlu tahu bagaimana hukum melindungi mereka di dunia digital." },
  { title: "Hak dan Kewajiban Remaja di Sekolah", content: "Kenali aturan dasar yang melindungi hak belajar dan disiplin." },
  { title: "UU Perlindungan Anak", content: "Undang-undang ini hadir untuk menjaga hak anak dari segala bentuk kekerasan." }
];

const artikelContainer = document.getElementById("artikel-container");
artikel.forEach(a => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `<h3>${a.title}</h3><p>${a.content}</p>`;
  artikelContainer.appendChild(card);
});