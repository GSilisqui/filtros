import { useEffect, useState } from 'react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

export default function UndoToast({ message, onUndo, onDismiss, durationMs = 6000 }: UndoToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 bottom-[24px] -translate-x-1/2 z-[100] flex gap-[12px] items-center px-[16px] py-[10px] rounded-[12px] bg-[var(--color-gray-1000)] text-white shadow-[0px_8px_24px_rgba(0,0,0,0.18)] animate-in fade-in-0 slide-in-from-bottom-2">
      <span className="font-normal text-[14px] leading-[20px]">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onUndo();
        }}
        className="font-medium text-[14px] leading-[20px] text-[var(--color-blue-400,#80d4ff)] hover:underline"
      >
        Desfazer
      </button>
    </div>
  );
}
