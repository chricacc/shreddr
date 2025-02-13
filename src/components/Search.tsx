"use client"
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';
import { Input } from "./ui/input";

export default function Search(params: { className: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term)
            params.set("query", term);
        else
            params.delete("query");

        replace(`${pathname}?${params.toString()}`);
    }, 300);
    return (
        <Input type="text" placeholder="Search exercises here" onChange={(e) => handleSearch(e.target.value)} defaultValue={searchParams.get('query')?.toString()} className={params.className} />
    );
}