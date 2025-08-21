import { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, ChevronDown } from "lucide-react";

export function AutocompleteInput({
    value,
    onChange,
    options = [],
    placeholder,
    required,
}) {
    const [isOpen, setIsOpen] = useState(false);

    const filteredOptions = useMemo(() => {
        if (!options || !Array.isArray(options)) {
            return [];
        }

        if (value) {
            return options.filter((option) =>
                option?.name?.toLowerCase().includes(value.toLowerCase())
            );
        }
        return options;
    }, [value, options]);

    const handleInputChange = (inputValue) => {
        onChange(inputValue);
        setIsOpen(true);
    };

    const handleOptionSelect = (option) => {
        onChange(option.name, option.id);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div className="relative">
                <Input
                    value={value}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    required={required}
                    className="pr-8"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>

            {isOpen && filteredOptions && filteredOptions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
                            onClick={() => handleOptionSelect(option)}
                        >
                            <span>
                                {option.name}
                                {option.code && ` (${option.code})`}
                                {/* {" ("}
                                {option.code || ""}
                                {")"} */}
                            </span>
                            {value === option.name && (
                                <Check className="h-4 w-4" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
