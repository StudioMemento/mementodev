import {
  createContext,
  useCallback,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
export type ModalState =
  | { kind: "allergens"; name: string; description: string; codes: string }
  | { kind: "legal"; slug: "privacy" | "cookie" | "note-legali" };
const DialogContext = createContext<{
  modal: ModalState | null;
  open: (value: ModalState, trigger?: HTMLElement) => void;
  close: () => void;
  update: (value: ModalState) => void;
}>({ modal: null, open: () => {}, close: () => {}, update: () => {} });
export function DialogProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  const open = useCallback((value: ModalState, trigger?: HTMLElement) => {
    closing.current = false;
    opener.current = trigger ?? document.activeElement as HTMLElement;
    history.pushState({ ...history.state, viaRomaDialog: value }, "");
    setModal(value);
  }, []);
  const close = useCallback(() => {
    if (closing.current) return;
    if (history.state?.viaRomaDialog) { closing.current = true; history.back(); }
    else setModal(null);
  }, []);
  useEffect(() => {
    const sync = () => { closing.current = false; setModal(history.state?.viaRomaDialog ?? null); };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const update = useCallback((value: ModalState) => {
    history.replaceState({ ...history.state, viaRomaDialog: value }, "");
    setModal(value);
  }, []);
  useLayoutEffect(() => {
    if (modal !== null) return;
    // Restore focus in the close commit, after the modal has left the DOM.
    // A queued animation frame can run before unmount or after another dialog opens.
    const target = opener.current;
    opener.current = null;
    if (target?.isConnected) target.focus({ preventScroll: true });
  }, [modal]);
  return (
    <DialogContext.Provider value={{ modal, open, close, update }}>
      {children}
    </DialogContext.Provider>
  );
}
export const useDialog = () => useContext(DialogContext);
