import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Incident, SwitchStatus, SwitchRoom } from './types';
import { Navbar } from './components/Navbar';
import { GracefulDegradationBanner } from './components/GracefulDegradationBanner';
import { OverviewView } from './components/OverviewView';
import { AgentControlView } from './components/AgentControlView';
import { SwitchRoomView } from './components/SwitchRoomView';
import { CicdMonitoringView } from './components/CicdMonitoringView';
import { InfraIntelView } from './components/InfraIntelView';
import { IncidentManagementView } from './components/IncidentManagementView';
import { SettingsView } from './components/SettingsView';
import { HackathonHubView } from './components/HackathonHubView';
import { CreateIncidentModal } from './components/CreateIncidentModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [switchStatus, setSwitchStatus] = useState<SwitchStatus | null>(null);
  const [rooms, setRooms] = useState<SwitchRoom[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [isTriaging, setIsTriaging] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const [statusData, roomsData, incidentsData] = await Promise.all([
        api.getSwitchStatus(),
        api.getSwitchRooms(),
        api.getIncidents(),
      ]);
      setSwitchStatus(statusData);
      setRooms(roomsData);
      setIncidents(incidentsData);
      if (!selectedIncidentId && incidentsData.length > 0) {
        setSelectedIncidentId(incidentsData[0].id);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleConnection = async (connected: boolean) => {
    try {
      await api.toggleSwitchConnection(connected);
      await loadData();
    } catch (err) {
      console.error('Failed to toggle connection:', err);
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
      await api.postSwitchMessage(text, '@alex.developer (Mattermost #devops-alerts)');
      await loadData();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleTriggerSampleAlert = async () => {
    if (isTriggering) return;
    setIsTriggering(true);
    try {
      const result = await api.sendMattermostAlert(
        'My Kubernetes application deployment is failing after the latest CI/CD build.',
        'alex.developer',
        'devops-alerts'
      );
      await loadData();
      if (result.incident_id) {
        setSelectedIncidentId(result.incident_id);
        // Automatically run triage
        await api.triageIncident(result.incident_id);
        await loadData();
      }
      setCurrentTab('room');
    } catch (err) {
      console.error('Failed to trigger sample alert:', err);
    } finally {
      setIsTriggering(false);
    }
  };

  const handleTriageIncident = async (id: string) => {
    if (isTriaging) return;
    setIsTriaging(true);
    try {
      await api.triageIncident(id);
      await loadData();
    } catch (err) {
      console.error('Failed to triage incident:', err);
    } finally {
      setIsTriaging(false);
    }
  };

  const handleCreateIncident = async (data: {
    title: string;
    severity: string;
    service: string;
    cluster: string;
    description: string;
    logs?: string;
    manifest?: string;
  }) => {
    try {
      const newInc = await api.createIncident(data);
      await loadData();
      setSelectedIncidentId(newInc.id);
      setCurrentTab('incidents');
    } catch (err) {
      console.error('Failed to create incident:', err);
    }
  };

  const handleUpdateSettings = async (settings: Record<string, any>) => {
    try {
      await api.updateSettings(settings);
      await loadData();
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  const activeRoom = rooms.length > 0 ? rooms[0] : null;
  const isConnected = switchStatus?.connected ?? false;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar Contract Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        switchConnected={isConnected}
        onOpenNewIncident={() => setIsModalOpen(true)}
      />

      {/* Degradation Banner when Disconnected */}
      {!isConnected && (
        <GracefulDegradationBanner
          onGoToSettings={() => setCurrentTab('settings')}
          onReconnect={() => handleToggleConnection(true)}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'overview' && (
          <OverviewView
            incidents={incidents}
            switchStatus={switchStatus}
            onSelectTab={setCurrentTab}
            onSelectIncident={(id) => {
              setSelectedIncidentId(id);
              setCurrentTab('incidents');
            }}
            onTriggerSampleAlert={handleTriggerSampleAlert}
            isTriggering={isTriggering}
          />
        )}

        {currentTab === 'agents' && (
          <AgentControlView
            switchStatus={switchStatus}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'room' && (
          <SwitchRoomView
            room={activeRoom}
            switchStatus={switchStatus}
            onSendMessage={handleSendMessage}
            onTriggerSampleAlert={handleTriggerSampleAlert}
            isTriggering={isTriggering}
          />
        )}

        {currentTab === 'cicd' && <CicdMonitoringView />}

        {currentTab === 'infra' && <InfraIntelView />}

        {currentTab === 'incidents' && (
          <IncidentManagementView
            incidents={incidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={setSelectedIncidentId}
            onTriageIncident={handleTriageIncident}
            isTriaging={isTriaging}
            switchConnected={isConnected}
            onOpenNewIncident={() => setIsModalOpen(true)}
          />
        )}

        {currentTab === 'hackathon' && <HackathonHubView />}

        {currentTab === 'settings' && (
          <SettingsView
            switchStatus={switchStatus}
            onToggleConnection={handleToggleConnection}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">CloudOps Switch</span>
          <span>·</span>
          <span>Powered by Switch Protocol v1.0 (`sandbox-quantum/switch`)</span>
          <span>·</span>
          <span>Mattermost Channel Bridge</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-mono">
          <span>Active Agents: 3</span>
          <span>·</span>
          <span>OpenAI Codex Verified</span>
          <span>·</span>
          <span>Room: #incident-triage</span>
        </div>
      </footer>

      {/* Create Incident Modal */}
      <CreateIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateIncident={handleCreateIncident}
      />
    </div>
  );
}
