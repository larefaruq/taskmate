const webhookUrl = process.env.N8N_WEBHOOK;
const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

export async function sendToN8N(payload: unknown) {
  if (!webhookUrl) {
    throw new Error("N8N_WEBHOOK belum dikonfigurasi");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(webhookSecret
        ? {
            Authorization: `Bearer ${webhookSecret}`,
          }
        : {}),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `n8n error ${response.status}: ${await response.text()}`
    );
  }

  return response.json().catch(() => null);
}