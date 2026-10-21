// Node 18+ (fetch intégré), aucune dépendance.
// Lancer le test : DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..." node discord.mjs

const WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

export async function notify({ title, url, price, resale, city = "?" }) {
  if (!WEBHOOK) throw new Error("DISCORD_WEBHOOK_URL manquante");

  const res = await fetch(WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title,
        url,
        fields: [
          { name: "Prix", value: `${price} €`, inline: true },
          { name: "Revente estimée", value: `${resale} €`, inline: true },
          { name: "Marge brute", value: `${resale - price} €`, inline: true },
          { name: "Ville", value: city, inline: true },
        ],
      }],
    }),
  });

  if (!res.ok) throw new Error(`Discord ${res.status}: ${await res.text()}`);
}

// Auto-test quand le fichier est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  await notify({
    title: "Test : clavier mécanique",
    url: "https://example.com",
    price: 45,
    resale: 85,
    city: "Rodez",
  });
  console.log("Message envoyé.");
}
