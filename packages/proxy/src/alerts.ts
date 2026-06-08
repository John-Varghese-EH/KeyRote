import { config } from './config';

export interface AlertPayload {
  healthyKeys: number;
  totalKeys: number;
  instanceId: string;
  ts: string;
}

let lastAlertTime = 0;

export const alerts = {
  async fireAlert(event: string, payload: AlertPayload, bypassDebounce = false): Promise<void> {
    const now = Date.now();
    if (!bypassDebounce && now - lastAlertTime < config.ALERT_DEBOUNCE_MS) {
      return; // debounced
    }
    
    lastAlertTime = now;
    const body = JSON.stringify({ event, ...payload });

    const promises: Promise<any>[] = [];

    if (config.DISCORD_WEBHOOK_URL) {
      promises.push(
        fetch(config.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: `**KeyRote Alert:** ${event}\n\`\`\`json\n${body}\n\`\`\`` })
        }).catch(err => console.error('[Alert Failed Discord]', err))
      );
    }

    if (config.SLACK_WEBHOOK_URL) {
      promises.push(
        fetch(config.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: `*KeyRote Alert:* ${event}\n\`\`\`${body}\`\`\`` })
        }).catch(err => console.error('[Alert Failed Slack]', err))
      );
    }

    await Promise.all(promises);
  }
};
