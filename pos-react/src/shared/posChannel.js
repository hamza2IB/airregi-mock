// Real-time transport between the cashier (/register) and customer (/display)
// views. Uses BroadcastChannel, which syncs instantly across windows/tabs on
// the same machine + origin — matching the "one PC, two monitors" POS setup.
//
// The transport is isolated here on purpose: to sync across separate devices
// later, swap the BroadcastChannel internals for a WebSocket without touching
// any view code.
import { useEffect, useRef } from 'react'

const CHANNEL_NAME = 'air-register-pos'

export function createPosChannel() {
  const channel = new BroadcastChannel(CHANNEL_NAME)
  return {
    send(type, payload) {
      channel.postMessage({ type, payload, ts: Date.now() })
    },
    listen(handler) {
      channel.onmessage = (event) => {
        const { type, payload } = event.data
        handler(type, payload)
      }
    },
    close() {
      channel.close()
    },
  }
}

/**
 * React hook giving a stable `send(type, payload)` and wiring up an `onMessage`
 * listener for the component's lifetime.
 * @param {(type: string, payload: any) => void} onMessage
 * @returns {{ send: (type: string, payload: any) => void }}
 */
export function usePosChannel(onMessage) {
  const channelRef = useRef(null)
  const handlerRef = useRef(onMessage)
  handlerRef.current = onMessage

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channel.onmessage = (event) => {
      const { type, payload } = event.data
      if (handlerRef.current) handlerRef.current(type, payload)
    }
    channelRef.current = channel
    return () => channel.close()
  }, [])

  const send = useRef((type, payload) => {
    channelRef.current?.postMessage({ type, payload, ts: Date.now() })
  }).current

  return { send }
}
