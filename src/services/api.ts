import { Incident, SwitchStatus, SwitchRoom, SwitchMessage, MilestoneEvidence } from '../types';

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getSwitchStatus(): Promise<SwitchStatus> {
    const res = await fetch('/api/switch/status');
    return res.json();
  },

  async toggleSwitchConnection(connected: boolean): Promise<{ status: string; switch_connected: boolean }> {
    const res = await fetch('/api/switch/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connected }),
    });
    return res.json();
  },

  async getSwitchRooms(): Promise<SwitchRoom[]> {
    const res = await fetch('/api/switch/rooms');
    return res.json();
  },

  async postSwitchMessage(text: string, sender?: string): Promise<SwitchMessage> {
    const res = await fetch('/api/switch/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sender }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to post message');
    }
    return res.json();
  },

  async getMilestoneEvidence(): Promise<MilestoneEvidence> {
    const res = await fetch('/api/switch/evidence');
    return res.json();
  },

  async getIncidents(): Promise<Incident[]> {
    const res = await fetch('/api/incidents');
    return res.json();
  },

  async getIncident(id: string): Promise<Incident> {
    const res = await fetch(`/api/incidents/${id}`);
    if (!res.ok) throw new Error('Incident not found');
    return res.json();
  },

  async createIncident(data: {
    title: string;
    severity?: string;
    service?: string;
    cluster?: string;
    description: string;
    logs?: string;
    manifest?: string;
  }): Promise<Incident> {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return res.json();
  },

  async triageIncident(id: string): Promise<Incident> {
    const res = await fetch(`/api/incidents/${id}/triage`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to run triage');
    }
    return res.json();
  },

  async sendMattermostAlert(text: string, userName = 'alex.developer', channelName = 'devops-alerts') {
    const res = await fetch('/api/mattermost/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, user_name: userName, channel_name: channelName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send alert');
    }
    return res.json();
  },

  async getSettings() {
    const res = await fetch('/api/settings');
    return res.json();
  },

  async updateSettings(settings: Record<string, any>) {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },
};
