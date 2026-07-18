'use client';

import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { MediaDeviceFailure, TokenSource } from 'livekit-client';
import {
  BarVisualizer,
  RoomAudioRenderer,
  SessionProvider,
  useAgent,
  useEvents,
  useSession,
  SessionEvent,
  VoiceAssistantControlBar,
} from '@livekit/components-react';
import { generateRandomUserId } from '../lib/helper';
import styles from '../styles/Mia.module.css';

const tokenSource = TokenSource.endpoint(process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT!);

function MiaStage() {
  const agent = useAgent();

  useEffect(() => {
    if (agent.state === 'failed') {
      alert(`Mia connection failed: ${(agent.failureReasons ?? []).join(', ')}`);
    }
  }, [agent.state, agent.failureReasons]);

  const label: Record<string, string> = {
    disconnected: 'Offline',
    connecting: 'Connecting…',
    'pre-connect-buffering': 'Warming up…',
    initializing: 'Booting…',
    idle: 'Ready',
    listening: 'Listening',
    thinking: 'Thinking',
    speaking: 'Speaking',
    failed: 'Failed',
  };

  return (
    <div className={styles.stage}>
      <div className={styles.orb} data-state={agent.state} />
      <div className={styles.bars}>
        <BarVisualizer
          state={agent.state}
          barCount={9}
          track={agent.microphoneTrack}
          style={{ width: 'min(80vw, 520px)', height: '180px' }}
        />
      </div>
      <div className={styles.status} data-state={agent.state}>
        {label[agent.state] ?? agent.state}
      </div>
    </div>
  );
}

const AgentPage: NextPage = () => {
  const params = useMemo(
    () => (typeof window !== 'undefined' ? new URLSearchParams(location.search) : null),
    [],
  );
  const [roomName, setRoomName] = useState(() => params?.get('room') ?? 'mia-room');
  const [userIdentity] = useState(() => params?.get('user') ?? generateRandomUserId());

  const session = useSession(tokenSource, {
    roomName,
    participantIdentity: userIdentity,
  });

  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) {
      session.start().catch((err) => console.error('Failed to start session:', err));
    } else {
      session.end().catch((err) => console.error('Failed to end session:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, session.start, session.end]);

  useEffect(() => {
    if (session.connectionState === 'disconnected') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStarted(false);
    }
  }, [session.connectionState]);

  useEvents(session, SessionEvent.MediaDevicesError, (error) => {
    const failure = MediaDeviceFailure.getFailure(error);
    console.error(failure);
    alert(
      'Microphone/Camera permission denied. Grant access in your browser and reload.',
    );
  }, []);

  return (
    <main data-lk-theme="default" className={styles.main}>
      <SessionProvider session={session}>
        <header className={styles.header}>
          <h1 className={styles.title}>MIA</h1>
          <p className={styles.subtitle}>Your JARVIS-level AI assistant</p>
          <a href="/chat.html" className={styles.chatLink}>Text Chat &rarr;</a>
        </header>

        <div className={styles.room}>
          {!started ? (
            <div className={styles.startWrap}>
              <button
                className={styles.connectBtn}
                onClick={() => setStarted(true)}
              >
                Connect to Mia
              </button>
              <span className={styles.roomHint}>Room: {roomName}</span>
            </div>
          ) : (
            <MiaStage />
          )}

          {started && (
            <div className={styles.controls}>
              <VoiceAssistantControlBar />
            </div>
          )}
        </div>

        <RoomAudioRenderer />
      </SessionProvider>
    </main>
  );
};

export default AgentPage;
