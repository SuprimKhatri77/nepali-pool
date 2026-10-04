"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Search box that writes to the URL 300ms after the last keystroke.
export function TableSearch({
  value,
  onSearch,
  placeholder,
}: {
  value: string;
  onSearch: (q: string) => void;
  placeholder: string;
}) {
  const [text, setText] = useState(value);
  // The last query this box sent. When the URL catches up with it, the
  // input is left alone (keeping a trailing space or keys typed meanwhile);
  // any other change came from outside (Back, a link) and is shown.
  const [sent, setSent] = useState(value);
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (value !== sent) {
      setSent(value);
      setText(value);
    }
  }

  const search = useEffectEvent((query: string) => {
    setSent(query);
    onSearch(query);
  });

  useEffect(() => {
    const query = text.trim();
    if (query === sent) return;
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [text, sent]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={100}
        className="pl-9"
      />
    </div>
  );
}
