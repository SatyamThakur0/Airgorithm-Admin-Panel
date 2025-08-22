import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AutocompleteInput } from "../Admin/AutoCompleteInput";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AirportForm({ formData, onFormDataChange }) {
    const [cities, setCities] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    const handleCityChange = async (name) => {
        try {
            let res = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/flight/city/city/search/${name}`,
                {
                    method: "get",
                    credentials: "include",
                }
            );
            res = await res.json();
            if (!res.ok) toast(res.message);
            setCities(res.data);
        } catch (error) {
            toast(error.message);
        }
    };

    const handleInputChange = (fieldName, value, selectedId) => {
        let finalValue = value;

        if (selectedId && fieldName === "city_name") {
            finalValue = { name: value, id: selectedId };
        }

        const newData = { ...formData, [fieldName]: finalValue };
        onFormDataChange(newData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const backendData = {
            name: formData.name,
            code: formData.code,
            city_id: formData.city_name.id,
        };
        setIsCreating(true);
        try {
            let res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/flight/airport`,
                {
                    method: "post",
                    credentials: "include",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(backendData),
                }
            );

            res = await res.json();
            if (!res.ok) return toast(res.message);
            toast(`New airport "${res.data.name}" created.`);
            setCities([]);
            onFormDataChange({});
            setIsCreating(false);
        } catch (error) {
            toast(error.message);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Airport Name
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name || ""}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter airport name"
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-sm font-medium">
                            Airport Code
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="code"
                            value={formData.code || ""}
                            onChange={(e) =>
                                handleInputChange("code", e.target.value)
                            }
                            placeholder="Enter airport code (e.g., JFK, LHR)"
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="city_name"
                            className="text-sm font-medium"
                        >
                            City
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <AutocompleteInput
                            value={
                                typeof formData.city_name === "object"
                                    ? formData.city_name.name
                                    : formData.city_name || ""
                            }
                            onChange={(val, id) => {
                                if (val) {
                                    handleCityChange(val);
                                } else {
                                    setCities([]);
                                }
                                handleInputChange("city_name", val, id);
                            }}
                            options={cities}
                            placeholder="Enter city name"
                            required={true}
                        />
                    </div>
                </div>

                {isCreating ? (
                    <Button
                        type="submit"
                        className="w-full flex justify-center items-center"
                    >
                        <Loader2 className="animate-spin" />{" "}
                        <span>Creating Airport</span>
                    </Button>
                ) : (
                    <Button type="submit" className="w-full">
                        Create Airport
                    </Button>
                )}
            </form>
        </div>
    );
}
