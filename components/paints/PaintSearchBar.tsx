"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

interface Props {
  placeholder?: string;
  defaultValue?: string;
}

export function PaintSearchBar({ placeholder = "Search paints...", defaultValue = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="relative">
      <input
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-iron-800 border border-iron-600 rounded-lg px-4 py-2.5 text-iron-100 placeholder-iron-500 focus:outline-none focus:border-iron-400 text-sm"
      />
    </div>
  );
}
