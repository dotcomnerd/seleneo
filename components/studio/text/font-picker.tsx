"use client";

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Category,
    Font,
    FONT_FAMILY_DEFAULT,
    FontManager,
    Options,
    OPTIONS_DEFAULTS,
    Script,
    SortOption,
    Variant,
} from "@samuelmeuli/font-manager";
import { AlertCircle, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { PureComponent } from 'react';

interface Props {
    apiKey: string
    activeFontFamily: string
    onChange: (font: Font) => void
    pickerId: string
    families: string[]
    categories: Category[]
    scripts: Script[]
    variants: Variant[]
    filter: (font: Font) => boolean
    limit: number
    sort: SortOption
}

interface State {
    isOpen: boolean
    loadingStatus: "loading" | "finished" | "error"
    fonts: Font[]
    searchQuery: string
    errorMessage: string | null
}

function getFontId(fontFamily: string): string {
    return fontFamily.replace(/\s+/g, "-").toLowerCase()
}

export default class FontPicker extends PureComponent<Props, State> {
    private fontManager: FontManager

    static defaultProps = {
        activeFontFamily: FONT_FAMILY_DEFAULT,
        onChange: () => { },
        pickerId: OPTIONS_DEFAULTS.pickerId,
        families: OPTIONS_DEFAULTS.families,
        categories: OPTIONS_DEFAULTS.categories,
        scripts: OPTIONS_DEFAULTS.scripts,
        variants: OPTIONS_DEFAULTS.variants,
        filter: OPTIONS_DEFAULTS.filter,
        limit: OPTIONS_DEFAULTS.limit,
        sort: OPTIONS_DEFAULTS.sort,
    }

    state: State = {
        isOpen: false,
        loadingStatus: "loading",
        fonts: [],
        searchQuery: "",
        errorMessage: null
    }

    constructor(props: Props) {
        super(props)

        const {
            apiKey,
            activeFontFamily,
            pickerId,
            families,
            categories,
            scripts,
            variants,
            filter,
            limit,
            sort,
            onChange,
        } = this.props

        const options: Options = {
            pickerId,
            families,
            categories,
            scripts,
            variants,
            filter,
            limit,
            sort,
        }

        this.fontManager = new FontManager(apiKey, activeFontFamily, options, onChange)
    }

    componentDidMount(): void {
        this.fontManager
            .init()
            .then(() => {
                const fonts = Array.from(this.fontManager.getFonts().values())
                if (this.props.sort === "alphabet") {
                    fonts.sort((a, b) => a.family.localeCompare(b.family))
                }
                this.setState({
                    loadingStatus: "finished",
                    fonts
                }, () => {
                    this.validateAndSetActiveFont(this.props.activeFontFamily)
                })
            })
            .catch((err: Error) => {
                this.setState({
                    loadingStatus: "error",
                    errorMessage: "Error loading fonts. Please try again later."
                })
                console.error("Error trying to fetch the list of available fonts")
                console.error(err)
            })
    }

    componentDidUpdate(prevProps: Props): void {
        const { activeFontFamily, onChange } = this.props

        if (activeFontFamily !== prevProps.activeFontFamily) {
            this.validateAndSetActiveFont(activeFontFamily)
        }

        if (onChange !== prevProps.onChange) {
            this.fontManager.setOnChange(onChange)
        }
    }

    validateAndSetActiveFont = (fontFamily: string): void => {
        const { fonts } = this.state
        const fontExists = fonts.some(font => font.family === fontFamily)

        if (!fontExists) {
            return;
        } else {
            this.setState({ errorMessage: null })
            this.fontManager.setActiveFont(fontFamily)
        }
    }

    handleSelect = (fontFamily: string): void => {
        this.validateAndSetActiveFont(fontFamily)
        this.setState({ isOpen: false })
    }

    setOpen = (isOpen: boolean): void => {
        this.setState({ isOpen })
    }

    handleSearch = (value: string): void => {
        this.setState({ searchQuery: value })
    }

    getFilteredFonts = (): Font[] => {
        const { fonts, searchQuery } = this.state
        if (!searchQuery) return fonts

        return fonts.filter(font =>
            font.family.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }

    render() {
        const { activeFontFamily } = this.props
        const { isOpen, loadingStatus, searchQuery, errorMessage } = this.state
        const filteredFonts = this.getFilteredFonts()

        return (
            <div className="space-y-2">
                <Popover open={isOpen} onOpenChange={this.setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isOpen}
                            className="w-full justify-between"
                        >
                            {loadingStatus === "loading" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span style={{ fontFamily: activeFontFamily }}>
                                    {activeFontFamily}
                                </span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        <Command shouldFilter={false}>
                            <CommandInput
                                placeholder="Search fonts..."
                                value={searchQuery}
                                onValueChange={this.handleSearch}
                                className="h-9"
                            />
                            <CommandList>
                                <CommandEmpty>No fonts found.</CommandEmpty>
                                <CommandGroup>
                                    <ScrollArea className="h-72">
                                        {filteredFonts.map((font) => (
                                            <CommandItem
                                                key={getFontId(font.family)}
                                                onSelect={() => this.handleSelect(font.family)}
                                                className="cursor-pointer"
                                            >
                                                <span
                                                    className="flex w-full items-center"
                                                    style={{ fontFamily: font.family }}
                                                >
                                                    {font.family}
                                                </span>
                                                {activeFontFamily === font.family && (
                                                    <Check className="ml-auto h-4 w-4" />
                                                )}
                                            </CommandItem>
                                        ))}
                                    </ScrollArea>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errorMessage && (
                    <div className="flex items-center text-sm text-red-500 gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>
        )
    }
}