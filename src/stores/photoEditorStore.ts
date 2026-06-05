import { create } from 'zustand';

// Imperative photo-editor bridge, mirroring alertStore's pattern. A call site
// (pickAndValidate) awaits `openPhotoEditor(uri)`; the root-mounted
// PhotoEditorHost renders the editor and resolves the promise with the edited
// image URI (or null when the user cancels). This keeps the crop/rotate/flip
// flow out of every call site — they just await a URI in, URI out.

interface EditorRequest {
  uri: string;
  resolve: (result: string | null) => void;
}

interface PhotoEditorState {
  request: EditorRequest | null;
  open: (uri: string) => Promise<string | null>;
  /** Resolve the in-flight request and clear it. Called by the host on done/cancel. */
  finish: (result: string | null) => void;
}

export const usePhotoEditorStore = create<PhotoEditorState>((set, get) => ({
  request: null,
  open: (uri) =>
    new Promise<string | null>((resolve) => {
      // If an editor is somehow already open, resolve it as cancelled first so
      // its awaiter doesn't hang.
      const prev = get().request;
      if (prev) prev.resolve(null);
      set({ request: { uri, resolve } });
    }),
  finish: (result) => {
    const req = get().request;
    set({ request: null });
    req?.resolve(result);
  },
}));

// Imperative helper for non-component contexts (pickAndValidate in screens).
export const openPhotoEditor = (uri: string): Promise<string | null> =>
  usePhotoEditorStore.getState().open(uri);
