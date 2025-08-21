import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { toast } from "sonner";

export function CountryForm({ formData, onFormDataChange }) {
    const handleInputChange = (fieldName, value) => {
        const newData = { ...formData, [fieldName]: value };
        onFormDataChange(newData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Creating country:", formData);
        try {
            let res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/flight/country`,
                {
                    method: "post",
                    credentials: "include",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );
            res = await res.json();
            if (!res.ok) toast(res.message);
            toast(`New country ${res.data.name} created.`);
            onFormDataChange({});
        } catch (error) {
            toast(error.message);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Country Name
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name || ""}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter country name"
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-sm font-medium">
                            Country Code
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="code"
                            value={formData.code || ""}
                            onChange={(e) =>
                                handleInputChange("code", e.target.value)
                            }
                            placeholder="Enter country code (e.g., US, UK)"
                            required
                            className="w-full"
                        />
                    </div>
                </div>

                {Object.keys(formData).length > 0 && (
                    <Card className="mt-6">
                        <CardContent className="pt-6">
                            <h3 className="text-sm font-medium mb-2">
                                Current Form Data:
                            </h3>
                            <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-60">
                                {JSON.stringify(formData, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                )}

                <Button type="submit" className="w-full">
                    Create Country
                </Button>
            </form>
        </div>
    );
}
