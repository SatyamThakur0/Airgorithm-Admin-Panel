import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AutocompleteInput } from "../Admin/AutoCompleteInput";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function CityForm({ formData, onFormDataChange }) {
    const [countries, setCountries] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    
    const handleInputChange = (fieldName, value, selectedId) => {
        let finalValue = value;
        if (selectedId && fieldName === "country_name") {
            finalValue = { name: value, id: selectedId };
        }
        const newData = { ...formData, [fieldName]: finalValue };
        onFormDataChange(newData);
    };

    const handleCountryChange = async (name) => {
        try {
            let res = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/flight/country/country/search/${name}`,
                {
                    credentials: "include",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
            res = await res.json();
            if (!res.ok) toast(res.message);
            setCountries(res.data);
        } catch (error) {
            toast(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const backendData = {
            name: formData.name,
            country_id: formData.country_name.id,
        };
        setIsCreating(true);
        try {
            let res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/flight/city`,
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
            toast(`New city "${res.data.name}" created.`);
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
                            City Name
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name || ""}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter city name"
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="country_name"
                            className="text-sm font-medium"
                        >
                            Country
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <AutocompleteInput
                            value={
                                typeof formData.country_name === "object"
                                    ? formData.country_name.name
                                    : formData.country_name || ""
                            }
                            onChange={(val, id) => {
                                if (val) {
                                    handleCountryChange(val);
                                } else {
                                    setCountries([]);
                                }
                                handleInputChange("country_name", val, id);
                            }}
                            options={countries}
                            placeholder="Enter country name"
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
                        <span>Creating City</span>
                    </Button>
                ) : (
                    <Button type="submit" className="w-full">
                        Create City
                    </Button>
                )}
            </form>
        </div>
    );
}
