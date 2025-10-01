export type OcrServerFrame =
  | { status: "authenticated"; message: string; connections: number; processing_status: "available" | "busy" | "error" }
  | { status: "notification"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string }

type WSHandlers = {
  onAuthenticated?: (info: OcrServerFrame) => void;
  onProcessingStatus?: (frame: OcrServerFrame) => void;
  onNotification?: (frame: OcrServerFrame) => void;
  onSuccess?: (frame: OcrServerFrame) => void;
  onError?: (err: OcrServerFrame | Event) => void;
  onMetadata?: (data: any) => void;
  onClose?: () => void;
};

export class OcrWsClient {
  private ws?: WebSocket;
  private url: string;
  private apiKey: string;
  private handlers: WSHandlers;
  private authenticated = false;

  constructor({ url, apiKey, handlers }: { url: string; apiKey: string; handlers?: WSHandlers }) {
    this.url = url;
    this.apiKey = apiKey;
    this.handlers = handlers || {};
  }

  private heartbeatInterval?: number;

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      this.ws?.send(JSON.stringify({ api_key: this.apiKey }));
      // Start heartbeat after connected
      this.startHeartbeat();
    };
    this.ws.onmessage = (event) => this.handleServerFrame(event.data);
    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.handlers.onClose?.();
    };
    this.ws.onerror = (err) => this.handlers.onError?.(err);
  }

  private startHeartbeat() {
    // Send every 20-25s
    this.stopHeartbeat();
    this.heartbeatInterval = window.setInterval(() => {
      try {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          // Send a JSON keepalive frame, adjust type/key to your server spec if needed
          this.ws.send(JSON.stringify({ type: "ping" }));
        }
      } catch {}
    }, 20000); // 20 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }

  close() {
    this.stopHeartbeat();
    this.ws?.close();
    this.ws = undefined;
    this.authenticated = false;
  }

  private handleServerFrame(payload: string) {
    try {
      const frame = JSON.parse(payload) as OcrServerFrame;
      if (frame.status === "authenticated") {
        this.authenticated = true;
        this.handlers.onAuthenticated?.(frame);
        if (frame.processing_status) this.handlers.onProcessingStatus?.(frame);
      } else if (frame.status === "notification") {
        this.handlers.onNotification?.(frame);
      } else if (frame.status === "success") {
        this.handlers.onSuccess?.(frame);
      } else if (frame.status === "error") {
        this.handlers.onError?.(frame);
      }

      if ("processing_status" in frame) {
        this.handlers.onProcessingStatus?.(frame);
      }
    } catch (e) {}
  }

  sendStart({ chapterId, images }: { chapterId: string; images: string[] }) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.authenticated) return;
    this.ws.send(JSON.stringify({
      data: images,
      chapterId,
      stage: "start"
    }));
  }
}