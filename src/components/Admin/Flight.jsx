import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, MapPin, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function FlightCreationForm() {
    const [formData, setFormData] = useState({
        airplane_id: "",
        source_airport_id: "",
        destination_airport_id: "",
        price: 0,
        departure_time: "",
        arrival_time: "",
        flight_number: "",
        class_price_factor: {
            economy: 1.2,
            premium: 2.2,
            business: 3.5,
        },
    });

    const [airplanes, setAirplanes] = useState([]);
    const [sourceAirports, setSourceAirports] = useState([]);
    const [destinationAirports, setDestinationAirports] = useState([]);

    const [showAirplaneDropdown, setShowAirplaneDropdown] = useState(false);
    const [showSourceDropdown, setShowSourceDropdown] = useState(false);
    const [showDestinationDropdown, setShowDestinationDropdown] =
        useState(false);

    const [airplaneQuery, setAirplaneQuery] = useState("");
    const [sourceQuery, setSourceQuery] = useState("");
    const [destinationQuery, setDestinationQuery] = useState("");

    const airplaneRef = useRef(null);
    const sourceRef = useRef(null);
    const destinationRef = useRef(null);

    // Mock API functions - replace with actual API calls
    const fetchAirplanes = async (query) => {
        let result;
        try {
            let res = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/flight/airplane/airplane/search/${query}`,
                {
                    credentials: "include",
                }
            );
            res = await res.json();
            if (!res.ok) toast.error(res.message);
            result = res.data;
        } catch (error) {
            toast.error(error.message);
        }
        return result;
    };

    const fetchAirports = async (query) => {
        // Simulate API delay
        let result;
        try {
            let res = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/flight/airport/airport/search/${query}`
            );
            res = await res.json();
            if (!res.ok) toast.error(res.message);
            result = res.data;
        } catch (error) {
            toast.error(error.message);
        }
        console.log(result);

        return result;
    };

    // Handle airplane search
    useEffect(() => {
        if (airplaneQuery.length > 0) {
            const searchAirplanes = async () => {
                const results = await fetchAirplanes(airplaneQuery);
                setAirplanes(results);
            };
            searchAirplanes();
        } else {
            setAirplanes([]);
        }
    }, [airplaneQuery]);

    // Handle source airport search
    useEffect(() => {
        if (sourceQuery.length > 0) {
            const searchAirports = async () => {
                const results = await fetchAirports(sourceQuery);
                setSourceAirports(results);
            };
            searchAirports();
        } else {
            setSourceAirports([]);
        }
    }, [sourceQuery]);

    // Handle destination airport search
    useEffect(() => {
        if (destinationQuery.length > 0) {
            const searchAirports = async () => {
                const results = await fetchAirports(destinationQuery);
                setDestinationAirports(results);
            };
            searchAirports();
        } else {
            setDestinationAirports([]);
        }
    }, [destinationQuery]);

    // Handle clicks outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                airplaneRef.current &&
                !airplaneRef.current.contains(event.target)
            ) {
                setShowAirplaneDropdown(false);
            }
            if (
                sourceRef.current &&
                !sourceRef.current.contains(event.target)
            ) {
                setShowSourceDropdown(false);
            }
            if (
                destinationRef.current &&
                !destinationRef.current.contains(event.target)
            ) {
                setShowDestinationDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAirplaneSelect = (airplane) => {
        setAirplaneQuery(airplane.name);
        setFormData((prev) => ({ ...prev, airplane_id: airplane.id }));
        setShowAirplaneDropdown(false);
    };

    const handleSourceAirportSelect = (airport) => {
        setSourceQuery(`${airport.name} (${airport.code})`);
        setFormData((prev) => ({ ...prev, source_airport_id: airport.id }));
        setShowSourceDropdown(false);
    };

    const handleDestinationAirportSelect = (airport) => {
        setDestinationQuery(`${airport.name} (${airport.code})`);
        setFormData((prev) => ({
            ...prev,
            destination_airport_id: airport.id,
        }));
        setShowDestinationDropdown(false);
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "";
        const date = new Date(dateTimeString);
        return date.toISOString().slice(0, 16).replace("T", " ") + ":00";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submissionData = {
            ...formData,
            departure_time: formatDateTime(formData.departure_time),
            arrival_time: formatDateTime(formData.arrival_time),
        };

        console.log("Flight Creation Data:", submissionData);
        try {
            let res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/flight/flight`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(submissionData),
                }
            );
            res = await res.json();
            if (!res.ok) return toast.error(res.message);
            toast.success(res.message);
            setFormData({
                airplane_id: "",
                source_airport_id: "",
                destination_airport_id: "",
                price: 0,
                departure_time: "",
                arrival_time: "",
                flight_number: "",
                class_price_factor: {
                    economy: 1.2,
                    premium: 2.2,
                    business: 3.5,
                },
            });
            setSourceQuery("");
            setDestinationQuery("");
            setAirplaneQuery("");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <main className="min-h-screen bg-background p-4">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Create New Flight
                    </h1>
                    <p className="text-muted-foreground">
                        Fill in the details to create a new flight
                    </p>
                </div>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plane className="h-5 w-5" />
                            Flight Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Flight Number */}
                            <div className="space-y-2">
                                <Label htmlFor="flight-number">
                                    Flight Number
                                </Label>
                                <Input
                                    id="flight-number"
                                    type="text"
                                    placeholder="Enter flight number"
                                    value={formData.flight_number}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            flight_number: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </div>

                            {/* Airplane Selection */}
                            <div className="space-y-2" ref={airplaneRef}>
                                <Label htmlFor="airplane">Airplane</Label>
                                <div className="relative">
                                    <Input
                                        id="airplane"
                                        type="text"
                                        placeholder="Search for airplane..."
                                        value={airplaneQuery}
                                        onChange={(e) => {
                                            setAirplaneQuery(e.target.value);
                                            setShowAirplaneDropdown(true);
                                        }}
                                        onFocus={() =>
                                            setShowAirplaneDropdown(true)
                                        }
                                        required
                                    />
                                    {showAirplaneDropdown &&
                                        airplanes?.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                                                {airplanes.map((airplane) => (
                                                    <div
                                                        key={airplane.id}
                                                        className="px-4 py-2 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                                                        onClick={() =>
                                                            handleAirplaneSelect(
                                                                airplane
                                                            )
                                                        }
                                                    >
                                                        <div className="font-medium">
                                                            {airplane.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {/* Model:{" "} */}
                                                            {airplane.code}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Source and Destination Airports */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Source Airport */}
                                <div className="space-y-2" ref={sourceRef}>
                                    <Label
                                        htmlFor="source-airport"
                                        className="flex items-center gap-2"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        Source Airport {" ("}Enter city name
                                        {")"}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="source-airport"
                                            type="text"
                                            placeholder="Search source airport..."
                                            value={sourceQuery}
                                            onChange={(e) => {
                                                setSourceQuery(e.target.value);
                                                setShowSourceDropdown(true);
                                            }}
                                            onFocus={() =>
                                                setShowSourceDropdown(true)
                                            }
                                            required
                                        />
                                        {showSourceDropdown &&
                                            sourceAirports.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                                                    {sourceAirports.map(
                                                        (airport) => (
                                                            <div
                                                                key={airport.id}
                                                                className="px-4 py-2 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                                                                onClick={() =>
                                                                    handleSourceAirportSelect(
                                                                        airport
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

                                {/* Destination Airport */}
                                <div className="space-y-2" ref={destinationRef}>
                                    <Label
                                        htmlFor="destination-airport"
                                        className="flex items-center gap-2"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        Destination Airport {" ("}Enter city
                                        name{")"}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="destination-airport"
                                            type="text"
                                            placeholder="Search destination airport..."
                                            value={destinationQuery}
                                            onChange={(e) => {
                                                setDestinationQuery(
                                                    e.target.value
                                                );
                                                setShowDestinationDropdown(
                                                    true
                                                );
                                            }}
                                            onFocus={() =>
                                                setShowDestinationDropdown(true)
                                            }
                                            required
                                        />
                                        {showDestinationDropdown &&
                                            destinationAirports.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                                                    {destinationAirports.map(
                                                        (airport) => (
                                                            <div
                                                                key={airport.id}
                                                                className="px-4 py-2 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                                                                onClick={() =>
                                                                    handleDestinationAirportSelect(
                                                                        airport
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
                            </div>

                            {/* Departure and Arrival Times */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="departure-time"
                                        className="flex items-center gap-2"
                                    >
                                        <Clock className="h-4 w-4" />
                                        Departure Date & Time
                                    </Label>
                                    <Input
                                        id="departure-time"
                                        type="datetime-local"
                                        value={formData.departure_time}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                departure_time: e.target.value,
                                            }))
                                        }
                                        required
                                        className="text-black dark:text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="arrival-time"
                                        className="flex items-center gap-2"
                                    >
                                        <Clock className="h-4 w-4" />
                                        Arrival Date & Time
                                    </Label>
                                    <Input
                                        id="arrival-time"
                                        type="datetime-local"
                                        value={formData.arrival_time}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                arrival_time: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            {/* Base Price */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="base-price"
                                    className="flex items-center gap-2"
                                >
                                    <DollarSign className="h-4 w-4" />
                                    Base Price
                                </Label>
                                <Input
                                    id="base-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter base price"
                                    value={formData.price || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            price:
                                                Number.parseFloat(
                                                    e.target.value
                                                ) || 0,
                                        }))
                                    }
                                    required
                                />
                            </div>

                            {/* Class Price Factors */}
                            <div className="space-y-4">
                                <Label className="text-base font-medium">
                                    Class Price Factors
                                </Label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="economy-factor">
                                            Economy
                                        </Label>
                                        <Input
                                            id="economy-factor"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={
                                                formData.class_price_factor
                                                    .economy
                                            }
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    class_price_factor: {
                                                        ...prev.class_price_factor,
                                                        economy:
                                                            Number.parseFloat(
                                                                e.target.value
                                                            ) || 0,
                                                    },
                                                }))
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="premium-factor">
                                            Premium
                                        </Label>
                                        <Input
                                            id="premium-factor"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={
                                                formData.class_price_factor
                                                    .premium
                                            }
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    class_price_factor: {
                                                        ...prev.class_price_factor,
                                                        premium:
                                                            Number.parseFloat(
                                                                e.target.value
                                                            ) || 0,
                                                    },
                                                }))
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="business-factor">
                                            Business
                                        </Label>
                                        <Input
                                            id="business-factor"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={
                                                formData.class_price_factor
                                                    .business
                                            }
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    class_price_factor: {
                                                        ...prev.class_price_factor,
                                                        business:
                                                            Number.parseFloat(
                                                                e.target.value
                                                            ) || 0,
                                                    },
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" className="w-full">
                                Create Flight
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
