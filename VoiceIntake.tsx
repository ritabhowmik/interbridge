"use client";

import { useEffect, useState } from "react";

/**
 * Embeds the ElevenLabs Conversational AI widget for the "talk to wren instead"
 * flow. Requires NEXT_PUBLIC_ELEVENLABS_AGENT_ID to be set, an agent configured
 * with the Wren system prompt (see README), and the agent's tool/webhook set up
 * to POST the extracted {business_description, origin_province, target_province}
 * to this app's own backend or directly to /analyze.
 *
 * If no agent id is configured, renders a disabled state instead of a broken widget.
 */
export default function VoiceIntake() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!agentId) return;
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [agentId]);

  if (!agentId) {
    return (
      <div className="glass-card p-6 text-center text-white/40 text-sm">
        talk-to-wren voice intake isn't configured yet, set
        NEXT_PUBLIC_ELEVENLABS_AGENT_ID to enable it
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <p className="text-white/70 text-sm mb-4 text-center">
        or just tell wren about your business
      </p>
      {scriptLoaded && (
        // @ts-ignore - custom element from the ElevenLabs embed script
        <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
      )}
    </div>
  );
}
