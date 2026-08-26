import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type State = { toasts: ToasterToast[] };
type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

let count = 0;
let memoryState: State = { toasts: [] };
const listeners: Array<(state: State) => void> = [];
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((item) =>
          item.id === action.toast.id ? { ...item, ...action.toast } : item,
        ),
      };
    case "DISMISS_TOAST":
      if (action.toastId) addToRemoveQueue(action.toastId);
      else state.toasts.forEach((item) => addToRemoveQueue(item.id));

      return {
        ...state,
        toasts: state.toasts.map((item) =>
          item.id === action.toastId || action.toastId === undefined
            ? { ...item, open: false }
            : item,
        ),
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts:
          action.toastId === undefined
            ? []
            : state.toasts.filter((item) => item.id !== action.toastId),
      };
  }
}

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

type Toast = Omit<ToasterToast, "id">;

function toast(props: Toast) {
  const id = genId();
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update: (nextToast: ToasterToast) =>
      dispatch({ type: "UPDATE_TOAST", toast: { ...nextToast, id } }),
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index >= 0) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { toast, useToast };
