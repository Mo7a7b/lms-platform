"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

export function SearchBar() {
  const [term, setTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      router.push(`/courses?query=${encodeURIComponent(term)}`);
    } else {
      router.push(`/courses`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <InputGroup className="bg-[#f9f9f9] text-black">
        <InputGroupInput
          placeholder="Search for courses..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <InputGroupAddon>
          <button type="submit">
            <SearchIcon className="text-muted-foreground w-5 h-5" />
          </button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
