import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CityForm } from "../forms/CityForm";

export default function CitiesPage() {
    const [formData, setFormData] = useState({});

    return (
        <Card className="w-full h-screen">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl font-bold">
                    Create City
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
                <CityForm formData={formData} onFormDataChange={setFormData} />
            </CardContent>
        </Card>
    );
}
