import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function FlightCycle() {
    const [formData, setFormData] = useState({
        airplane_id: "",
        total_days: "0",
        start_date: "",
        legs: [],
    });

    const [airports, setAirports] = useState([]);
    const [airplanes, setAirplanes] = useState([]);
    const [airportSearchTerms, setAirportSearchTerms] = useState({});
    const [airplaneSearchTerm, setAirplaneSearchTerm] = useState("");
    const [showAirportSuggestions, setShowAirportSuggestions] = useState({});
    const [showAirplaneSuggestions, setShowAirplaneSuggestions] =
        useState(false);

    const fetchAirports = async (searchTerm) => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const mockAirports = [
            {
                id: "22fd6d3f-cdf1-42f0-9049-9b212cd7f4f6",
                name: "John F. Kennedy International Airport",
                code: "JFK",
                city: "New York",
            },
            {
                id: "79461ea1-6b8f-46e3-9a8d-48c7870ca391",
                name: "Los Angeles International Airport",
                code: "LAX",
                city: "Los Angeles",
            },
            {
                id: "5a529a7e-d1be-498e-82bf-a4e1a2deb225",
                name: "London Heathrow Airport",
                code: "LHR",
                city: "London",
            },
            {
                id: "b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e",
                name: "Tokyo Haneda Airport",
                code: "HND",
                city: "Tokyo",
            },
            {
                id: "c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f",
                name: "Dubai International Airport",
                code: "DXB",
                city: "Dubai",
            },
        ];

        return mockAirports.filter(
            (airport) =>
                airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                airport.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const fetchAirplanes = async (searchTerm) => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const mockAirplanes = [
            {
                id: "ea29406c-2697-4c07-bb98-498b3a7e2ffe",
                name: "Boeing 737-800",
                model: "737-800",
                capacity: 189,
            },
            {
                id: "fb3a517d-3798-5d18-cc09-5a9c3b8f3aff",
                name: "Airbus A320",
                model: "A320",
                capacity: 180,
            },
            {
                id: "gc4b628e-4899-6e29-dd1a-6bad4c9g4bgg",
                name: "Boeing 777-300ER",
                model: "777-300ER",
                capacity: 396,
            },
            {
                id: "hd5c739f-599a-7f3a-ee2b-7cbe5dah5chh",
                name: "Airbus A350-900",
                model: "A350-900",
                capacity: 325,
            },
        ];

        return mockAirplanes.filter(
            (airplane) =>
                airplane.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                airplane.model.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    useEffect(() => {
        if (formData.legs.length > 0) {
            const maxOffset = Math.max(
                ...formData.legs.map((leg) => leg.arrival_day_offset)
            );
            const calculatedDays = (maxOffset + 1).toString();
            setFormData((prev) => ({ ...prev, total_days: calculatedDays }));
        } else {
            setFormData((prev) => ({ ...prev, total_days: "0" }));
        }
    }, [formData.legs]);

    // useEffect(() => {
    //     if (airplaneSearchTerm) {
    //         fetchAirplanes(airplaneSearchTerm).then(setAirplanes);
    //     }
    // }, [airplaneSearchTerm]);

    // useEffect(() => {
    //     const searchTerms = Object.values(airportSearchTerms).filter(
    //         (term) => term.length > 0
    //     );
    //     if (searchTerms.length > 0) {
    //         const uniqueTerms = [...new Set(searchTerms)];
    //         Promise.all(uniqueTerms.map((term) => fetchAirports(term))).then(
    //             (results) => {
    //                 const allAirports = results.flat();
    //                 const uniqueAirports = allAirports.filter(
    //                     (airport, index, self) =>
    //                         index === self.findIndex((a) => a.id === airport.id)
    //                 );
    //                 setAirports(uniqueAirports);
    //             }
    //         );
    //     }
    // }, [airportSearchTerms]);

    const addLeg = () => {
        const newLeg = {
            source_airport_id: "",
            destination_airport_id: "",
            departure_time: "",
            arrival_time: "",
            departure_day_offset: 0,
            arrival_day_offset: 0,
            price: "",
            class_price_factor: {
                economy: 1.2,
                premium: 2,
                business: 3.5,
            },
        };
        setFormData((prev) => ({ ...prev, legs: [...prev.legs, newLeg] }));
    };

    const removeLeg = (index) => {
        setFormData((prev) => ({
            ...prev,
            legs: prev.legs.filter((_, i) => i !== index),
        }));
    };

    const updateLeg = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            legs: prev.legs.map((leg, i) =>
                i === index ? { ...leg, [field]: value } : leg
            ),
        }));
    };

    const updateClassPriceFactor = (legIndex, className, value) => {
        setFormData((prev) => ({
            ...prev,
            legs: prev.legs.map((leg, i) =>
                i === legIndex
                    ? {
                          ...leg,
                          class_price_factor: {
                              ...leg.class_price_factor,
                              [className]: value,
                          },
                      }
                    : leg
            ),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Flight Cycle Data:", formData);
        try {
            let res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/flight/flight/cycle`,
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
            console.log(res);

            if (!res.ok) return toast(res.message);
            toast(`New flight cycle created.`);
            setFormData({
                airplane_id: "",
                total_days: "0",
                start_date: "",
                legs: [],
            });
        } catch (error) {
            toast(error.message);
        }
    };

    const handleAirplaneSearch = async (value) => {
        setAirplaneSearchTerm(value);
        setShowAirplaneSuggestions(value.length > 0);
        if (value.length > 0) {
            try {
                let res = await fetch(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/flight/airplane/airplane/search/${value}`,
                    {
                        credentials: "include",
                        headers: {
                            "content-type": "application/json",
                        },
                    }
                );
                res = await res.json();
                if (!res.ok) toast(res.message);
                setAirplanes(res.data);
            } catch (error) {
                toast(error.message);
            }
        } else {
            setAirplanes([]);
        }
    };

    const handleAirportSearch = async (key, value) => {
        setAirportSearchTerms((prev) => ({ ...prev, [key]: value }));
        setShowAirportSuggestions((prev) => ({
            ...prev,
            [key]: value.length > 0,
        }));
        if (value.length > 0) {
            try {
                let res = await fetch(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/flight/airport/airport/search/${value}`,
                    {
                        credentials: "include",
                        headers: {
                            "content-type": "application/json",
                        },
                    }
                );
                res = await res.json();
                if (!res.ok) toast(res.message);
                setAirports(res.data);
            } catch (error) {
                toast(error.message);
            }
        } else {
            setAirports([]);
        }
    };

    const selectAirplane = (airplane) => {
        setFormData((prev) => ({ ...prev, airplane_id: airplane.id }));
        setAirplaneSearchTerm(`${airplane.name} (${airplane.code})`);
        setShowAirplaneSuggestions(false);
    };

    const selectAirport = (airport, legIndex, type) => {
        const field =
            type === "source" ? "source_airport_id" : "destination_airport_id";
        updateLeg(legIndex, field, airport.id);
        const key =
            type === "source" ? `source_${legIndex}` : `dest_${legIndex}`;
        setAirportSearchTerms((prev) => ({
            ...prev,
            [key]: `${airport.code} - ${airport.name}`,
        }));
        setShowAirportSuggestions((prev) => ({ ...prev, [key]: false }));
    };

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Flight Cycle Form
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Create and manage flight cycles with auto-calculated
                        total days
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Flight Cycle Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="relative space-y-2">
                                    <Label htmlFor="airplane">Airplane</Label>
                                    <Input
                                        id="airplane"
                                        placeholder="Search airplanes..."
                                        value={airplaneSearchTerm}
                                        onChange={(e) =>
                                            handleAirplaneSearch(e.target.value)
                                        }
                                        onFocus={() =>
                                            airplaneSearchTerm.length > 0 &&
                                            setShowAirplaneSuggestions(true)
                                        }
                                    />
                                    {showAirplaneSuggestions &&
                                        airplanes.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                                                {airplanes.map((airplane) => (
                                                    <div
                                                        key={airplane.id}
                                                        className="px-3 py-2 cursor-pointer hover:bg-muted transition-colors"
                                                        onClick={() =>
                                                            selectAirplane(
                                                                airplane
                                                            )
                                                        }
                                                    >
                                                        <div className="font-medium">
                                                            {airplane.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Code:{" "}
                                                            {airplane.code}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="start_date">
                                        Start Date
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                start_date: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="total_days">
                                        Total Days (Auto-calculated)
                                    </Label>
                                    <Input
                                        id="total_days"
                                        value={formData.total_days}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-xl font-semibold">
                                Flight Legs
                            </h3>
                            <Button
                                type="button"
                                onClick={addLeg}
                                className="flex items-center gap-2 w-full sm:w-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Add Leg
                            </Button>
                        </div>

                        {formData.legs.map((leg, index) => (
                            <Card key={index}>
                                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg">
                                        Leg {index + 1}
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeLeg(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                        <div className="relative space-y-2">
                                            <Label>
                                                Source Airport {" ("}Enter city
                                                name{")"}{" "}
                                            </Label>
                                            <Input
                                                placeholder="Search source airports..."
                                                value={
                                                    airportSearchTerms[
                                                        `source_${index}`
                                                    ] || ""
                                                }
                                                onChange={(e) =>
                                                    handleAirportSearch(
                                                        `source_${index}`,
                                                        e.target.value
                                                    )
                                                }
                                                onFocus={() => {
                                                    const term =
                                                        airportSearchTerms[
                                                            `source_${index}`
                                                        ];
                                                    if (
                                                        term &&
                                                        term.length > 0
                                                    ) {
                                                        setShowAirportSuggestions(
                                                            (prev) => ({
                                                                ...prev,
                                                                [`source_${index}`]: true,
                                                            })
                                                        );
                                                    }
                                                }}
                                            />
                                            {showAirportSuggestions[
                                                `source_${index}`
                                            ] &&
                                                airports.length > 0 && (
                                                    <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                                                        {airports.map(
                                                            (airport) => (
                                                                <div
                                                                    key={
                                                                        airport.id
                                                                    }
                                                                    className="px-3 py-2 cursor-pointer hover:bg-muted transition-colors"
                                                                    onClick={() =>
                                                                        selectAirport(
                                                                            airport,
                                                                            index,
                                                                            "source"
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="font-medium">
                                                                        {
                                                                            airport.code
                                                                        }{" "}
                                                                        -{" "}
                                                                        {
                                                                            airport.name
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {
                                                                            airport
                                                                                .city
                                                                                .name
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div>

                                        <div className="relative space-y-2">
                                            <Label>
                                                Destination {" ("}Enter city
                                                name{")"}{" "}
                                            </Label>
                                            <Input
                                                placeholder="Search destination airports..."
                                                value={
                                                    airportSearchTerms[
                                                        `dest_${index}`
                                                    ] || ""
                                                }
                                                onChange={(e) =>
                                                    handleAirportSearch(
                                                        `dest_${index}`,
                                                        e.target.value
                                                    )
                                                }
                                                onFocus={() => {
                                                    const term =
                                                        airportSearchTerms[
                                                            `dest_${index}`
                                                        ];
                                                    if (
                                                        term &&
                                                        term.length > 0
                                                    ) {
                                                        setShowAirportSuggestions(
                                                            (prev) => ({
                                                                ...prev,
                                                                [`dest_${index}`]: true,
                                                            })
                                                        );
                                                    }
                                                }}
                                            />
                                            {showAirportSuggestions[
                                                `dest_${index}`
                                            ] &&
                                                airports.length > 0 && (
                                                    <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                                                        {airports.map(
                                                            (airport) => (
                                                                <div
                                                                    key={
                                                                        airport.id
                                                                    }
                                                                    className="px-3 py-2 cursor-pointer hover:bg-muted transition-colors"
                                                                    onClick={() =>
                                                                        selectAirport(
                                                                            airport,
                                                                            index,
                                                                            "destination"
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="font-medium">
                                                                        {
                                                                            airport.code
                                                                        }{" "}
                                                                        -{" "}
                                                                        {
                                                                            airport.name
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {
                                                                            airport
                                                                                .city
                                                                                .name
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        <div className="space-y-2">
                                            <Label>Departure Time</Label>
                                            <Input
                                                type="time"
                                                value={leg.departure_time}
                                                onChange={(e) =>
                                                    updateLeg(
                                                        index,
                                                        "departure_time",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Arrival Time</Label>
                                            <Input
                                                type="time"
                                                value={leg.arrival_time}
                                                onChange={(e) =>
                                                    updateLeg(
                                                        index,
                                                        "arrival_time",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Departure Day Offset</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={leg.departure_day_offset}
                                                onChange={(e) =>
                                                    updateLeg(
                                                        index,
                                                        "departure_day_offset",
                                                        Number.parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Arrival Day Offset</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={leg.arrival_day_offset}
                                                onChange={(e) =>
                                                    updateLeg(
                                                        index,
                                                        "arrival_day_offset",
                                                        Number.parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="space-y-2">
                                            <Label>Base Price</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={leg.price}
                                                onChange={(e) =>
                                                    updateLeg(
                                                        index,
                                                        "price",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Economy Factor</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={
                                                    leg.class_price_factor
                                                        .economy
                                                }
                                                onChange={(e) =>
                                                    updateClassPriceFactor(
                                                        index,
                                                        "economy",
                                                        Number.parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Premium Factor</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={
                                                    leg.class_price_factor
                                                        .premium
                                                }
                                                onChange={(e) =>
                                                    updateClassPriceFactor(
                                                        index,
                                                        "premium",
                                                        Number.parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Business Factor</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={
                                                    leg.class_price_factor
                                                        .business
                                                }
                                                onChange={(e) =>
                                                    updateClassPriceFactor(
                                                        index,
                                                        "business",
                                                        Number.parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center sm:justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            Generate Flight Cycle Data
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
