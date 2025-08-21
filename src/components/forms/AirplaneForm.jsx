import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { toast } from "sonner";

export function AirplaneForm({ formData, onFormDataChange }) {
    const handleInputChange = (fieldName, value) => {
        const newData = { ...formData, [fieldName]: value };
        onFormDataChange(newData);
    };

    const handleSeatDistributionChange = (classType, value) => {
        const currentSeatDistribution = formData.seat_distribution || {};
        const newSeatDistribution = {
            ...currentSeatDistribution,
            [classType]: value,
        };
        handleInputChange("seat_distribution", newSeatDistribution);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedData = {
            name: formData.name,
            code: formData.code,
            seat_distribution: formData.seat_distribution || {},
        };

        console.log("Creating airplane:", formattedData);
        let res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/flight/airplane`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(formattedData),
            }
        );
        res = await res.json();
        if (!res.ok) return toast(res.message);
        toast(`Airplane ${res.data.name} created.`);
        onFormDataChange({});
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Airplane Name
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name || ""}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter airplane name"
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-sm font-medium">
                            Code
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="code"
                            value={formData.code || ""}
                            onChange={(e) =>
                                handleInputChange("code", e.target.value)
                            }
                            placeholder="Enter airplane code"
                            required
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Seat Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="economy_seats"
                                className="text-sm font-medium"
                            >
                                Economy Seats
                                <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Input
                                id="economy_seats"
                                type="number"
                                min="0"
                                value={
                                    formData.seat_distribution?.economy || ""
                                }
                                onChange={(e) =>
                                    handleSeatDistributionChange(
                                        "economy",
                                        Number.parseInt(e.target.value) || 0
                                    )
                                }
                                placeholder="Enter economy seats"
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="premium_seats"
                                className="text-sm font-medium"
                            >
                                Premium Seats
                                <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Input
                                id="premium_seats"
                                type="number"
                                min="0"
                                value={
                                    formData.seat_distribution?.premium || ""
                                }
                                onChange={(e) =>
                                    handleSeatDistributionChange(
                                        "premium",
                                        Number.parseInt(e.target.value) || 0
                                    )
                                }
                                placeholder="Enter premium seats"
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="business_seats"
                                className="text-sm font-medium"
                            >
                                Business Seats
                                <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Input
                                id="business_seats"
                                type="number"
                                min="0"
                                value={
                                    formData.seat_distribution?.business || ""
                                }
                                onChange={(e) =>
                                    handleSeatDistributionChange(
                                        "business",
                                        Number.parseInt(e.target.value) || 0
                                    )
                                }
                                placeholder="Enter business seats"
                                required
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    Create Airplane
                </Button>
            </form>
        </div>
    );
}
