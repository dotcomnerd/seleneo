import React, { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface Font {
    family: string;
    variants: string[];
    category: string;
}

interface FontPickerProps {
    apiKey: string;
    activeFontFamily: string;
    onChange: (font: { family: string }) => void;
}

export default function FontPicker({
    apiKey,
    activeFontFamily,
    onChange
}: FontPickerProps) {
    const [open, setOpen] = useState(false);
    const [fonts, setFonts] = useState<Font[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFonts = async () => {
            try {
                const response = await fetch(
                    `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`
                );
                const data = await response.json();

                // Get the most popular 100 fonts
                const popularFonts = data.items.slice(0, 100).map((font: any) => ({
                    family: font.family,
                    variants: font.variants,
                    category: font.category
                }));

                setFonts(popularFonts);

                // Preload fonts
                popularFonts.forEach((font: Font) => {
                    const link = document.createElement('link');
                    link.href = `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}:wght@400;700&display=swap`;
                    link.rel = 'stylesheet';
                    document.head.appendChild(link);
                });
            } catch (error) {
                console.error('Error fetching fonts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFonts();
    }, [apiKey]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    style={{ fontFamily: activeFontFamily }}
                >
                    {loading ? "Loading fonts..." : activeFontFamily}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search fonts..." />
                    <CommandEmpty>No font found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                        {fonts.map((font) => (
                            <CommandItem
                                key={font.family}
                                value={font.family}
                                onSelect={() => {
                                    onChange({ family: font.family });
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        activeFontFamily === font.family ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <span style={{ fontFamily: font.family }}>{font.family}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}