export type Listener<T> = (data: T) => void;

export interface Emitter<Events extends Record<string, any>> {
  on<E extends keyof Events>(event: E, listener: Listener<Events[E]>): () => void;
  emit<E extends keyof Events>(event: E, data: Events[E]): void;
  clear(): void;
}

export function createEmitter<Events extends Record<string, any>>(): Emitter<Events> {
  const listeners = new Map<keyof Events, Set<Listener<any>>>();

  return {
    on(event, listener) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(listener);
      
      return () => {
        listeners.get(event)?.delete(listener);
      };
    },

    emit(event, data) {
      listeners.get(event)?.forEach((listener) => listener(data));
    },

    clear() {
      listeners.clear();
    },
  };
}